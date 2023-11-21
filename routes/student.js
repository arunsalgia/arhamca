router = express.Router();


const { 
	encrypt, decrypt, dbencrypt, dbdecrypt, dbToSvrText, 
  svrToDbText, getLoginName, getDisplayName, 
  getMaster, setMaster,
} = require('./cricspecial'); 

const { 
	addNewUser, updateUser,
	getNewSudentCode,
} = require('./functions'); 


router.get('/list/all', async function (req, res, next) {
  setHeader(res);
 
	var allRecs = await Student.find({}).sort({name: 1});
  sendok(res, allRecs ); 
})

router.get('/list/disabled', async function (req, res, next) {
  setHeader(res);
 
	var allRecs = await Student.find({enabled: false}).sort({name: 1});
  sendok(res, allRecs ); 
})

// get students of faculty whose uid is provided
router.get('/byfacultyuid/:uid', async function (req, res, next) {
  setHeader(res);
	
	var { uid } = req.params;
	
	// first get faculty id using uid
	var tmp = await Faculty.findOne({uid: uid });
	var fid = tmp.fid;
	
	// not get all batches taken by faculty
	var allBatches = await Batch.find({fid: fid, enabled: true});
	
	// from batches get all studnets
	var allStudents = [];
	for (var i=0; i < allBatches.length; ++i) {
		allStudents = allStudents.concat(allBatches[i].sid);
	}
	allStudents = _.uniqBy(allStudents);
	console.log(allStudents);
	
	var allStudentsRec = [];
	if (allStudents.length > 0) {
		allStudentsRec = await Student.find({ sid: {$in: allStudents } });
	}
	
  sendok(res, allStudentsRec ); 
})


router.get('/list/enabled', async function (req, res, next) {
  setHeader(res);
 
	var allRecs = await Student.find({enabled: true}).sort({name: 1});
  sendok(res, allRecs ); 
})

// Students who have not yet been assigned batch
router.get('/list/free', async function (req, res, next) {
  setHeader(res);
 
	var allRecs = await Student.find({bid: "", enabled: true}).sort({name: 1});
  sendok(res, allRecs ); 
})

router.get('/get/:sid', async function (req, res, next) {
  setHeader(res);
	
	var { sid } = req.params;
 
	var studRec = await Student.findOne({sid: sid});
  sendok(res, studRec ); 
})


router.get('/list/freeorbatch/:bid', async function (req, res, next) {
  setHeader(res);
  var {bid} = req.params;
	
	var allRecs = await Student.find({ 
		bid: {$in: [bid, ""]}, 
		enabled: true})
	.sort({name: 1});
  sendok(res, allRecs ); 
})

router.get('/list/selected/:studentList', async function (req, res, next) {
  setHeader(res);
	
	var {studentList} = req.params;
	//console.log(studentList);
	var studentArray = studentList.split(",");
	//console.log(studentArray);
	var allRecs = await Student.find({sid: {$in: studentArray}, enabled: true }).sort({name: 1});
	//console.log(allRecs);
  sendok(res, allRecs ); 
})


router.get('/add/:uName/:uPassword/:uEmail/:mobileNumber/:addr1/:addr2/:addr3/:addr4/:parName/:parMobile', async function (req, res, next) {
  setHeader(res);
  var {uName, uPassword, uEmail, mobileNumber, addr1, addr2, addr3, addr4, parName, parMobile } = req.params;

	// first it as a user
	var myStatus = await addNewUser(uName, uPassword, ROLE_STUDENT, uEmail, mobileNumber, addr1, addr2, addr3, addr4);
	//console.log(myStatus);
	if (myStatus.status != 0)
		return senderr(res, myStatus.status, "Error");
	
	// user added. Now get Facilty id and add new fac
	var sid = await getNewSudentCode();

	var studentRec = new Student({
		sequence: SEQUENCE_CURRENT,
		sid: sid,
		name: myStatus.userRec.displayName,
		uid: myStatus.userRec.uid,
		bid: "",				// Batch id is blank for unassigned
		parentName: getDisplayName(parName),
		parentMobile: parMobile,
		enabled: true,   
	});
	//console.log(studentRec);
  await studentRec.save();

  sendok(res, studentRec ); 
})

router.get('/update/:usid/:uName/:uPassword/:uEmail/:mobileNumber/:addr1/:addr2/:addr3/:addr4/:parName/:parMobile', async function (req, res, next) {
  setHeader(res);
  var { usid, uName, uPassword, uEmail, mobileNumber, addr1, addr2, addr3, addr4, parName, parMobile } = req.params;

	var studentRec = await Student.findOne({sid: usid});
	
	// first it as a user
	var myStatus = await updateUser(studentRec.uid, uName, uPassword, ROLE_STUDENT, uEmail, mobileNumber, addr1, addr2, addr3, addr4);
	//console.log(myStatus);
	if (myStatus.status != 0)
		return senderr(res, myStatus.status, "Error");
	
	// user added. Check if name chnaged. If yes then make changes in other documents
	if (studentRec.name !== myStatus.userRec.displayName) {
		console.log("in name change");
		// Change name in Student record. Do not save it now. Other changes pending
		studentRec.name = myStatus.userRec.displayName;
		
		// Now make changes in all Batch record
		var allRecs = await Batch.find({sid: studentRec.sid });
		console.log("Batch count: ",allRecs.length);
		for (var i=0; i<allRecs.length; ++i) {
			var myNameList = allRecs[i].studentNameList;
			for (var sidx=0; sidx < allRecs[i].sid.length; ++sidx) {
				if (allRecs[i].sid[sidx] === studentRec.sid) {
					myNameList[sidx] = myStatus.userRec.displayName;
				}
			}
			console.log(myNameList);
			//allRecs[i].studentNameList = myNameList;
			//await allRecs[i].save();
			await Batch.updateOne({_id: allRecs[i]._id},{$set:{ studentNameList: myNameList}})
		}

	
		// Now make changes in all Session records
		// Note changes in 2 places (studentNameList and attendedStudentNameList)
		var allRecs = await Session.find({sidList: studentRec.sid });
		console.log("Seesion coint:", allRecs.length);
		for (var i=0; i<allRecs.length; ++i) {
			var myList1 = allRecs[i].studentNameList;
			var myList2 = allRecs[i].attendedStudentNameList;
			
			for (var sidx=0; sidx < allRecs[i].sidList.length; ++sidx) {
				console.log(allRecs[i].sidList[sidx], allRecs[i].studentNameList[sidx],studentRec.sid, myStatus.userRec.displayName);
				if (allRecs[i].sidList[sidx] === studentRec.sid) {
					myList1[sidx] = myStatus.userRec.displayName;
					console.log(allRecs[i].studentNameList[sidx]);
				}
				if (allRecs[i].attendedSidList[sidx] === studentRec.sid) {
					myList2[sidx] = myStatus.userRec.displayName;
					console.log(allRecs[i].attendedStudentNameList[sidx]);
				}
			}
			//await allRecs[i].save();
			await Session.updateOne({_id: allRecs[i]._id},{$set:{ studentNameList: myList1}})
			await Session.updateOne({_id: allRecs[i]._id},{$set:{ attendedStudentNameList: myList2}})
		}

		
		// Now make changes in all Payment records
		var allRecs = await Payment.find({sid: studentRec.sid });
		console.log("Payment count: ",allRecs.length);
		for (var i=0; i<allRecs.length; ++i) {
			allRecs[i].studentName = myStatus.userRec.displayName;
			await allRecs[i].save();
		}
		// All done for name changes
	}
	
	// Now update pending data in Student record and save
	studentRec.parentName = getDisplayName(parName);
	studentRec.parentMobile = parMobile;
  await studentRec.save();
	
  sendok(res, studentRec ); 
})


router.get('/disabled/:sid', async function (req, res, next) {
  setHeader(res);
  var {sid } = req.params;

	studentRec = await Student.findOne({sid: sid});
	if (!studentRec) return senderr(res, 601, "Invalid SID");
	
	// if student assign a batch then error
	if (studentRec.bid != "") return senderr(res, 602, "Student batch in progress");
	
	studentRec.enabled = false;
	studentRec.save();
	
	userRec = await User.findOne({uid: studentRec.uid});
	userRec.enabled = false;
	userRec.save();
	
  sendok(res, "Done" ); 
})

router.get('/enabled/:sid', async function (req, res, next) {
  setHeader(res);
  var {sid } = req.params;

	studentRec = await Student.findOne({sid: sid});
	if (!studentRec) return senderr(res, 601, "Invalid SID");
	
	studentRec.enabled = true;
	studentRec.bid = "";
	
	studentRec.save();
	
	userRec = await User.findOne({uid: studentRec.uid});
	userRec.enabled = true;
	userRec.save();
	
  sendok(res, "Done" ); 
})


function sendok(res, usrmgs) { res.send(usrmgs); }
function senderr(res, errcode, errmsg) { res.status(errcode).send({error: errmsg}); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

}
module.exports = router;
