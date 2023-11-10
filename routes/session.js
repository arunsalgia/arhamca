router = express.Router();


const { 
	encrypt, decrypt, dbencrypt, dbdecrypt, dbToSvrText, 
  svrToDbText, getLoginName, getDisplayName, 
  getMaster, setMaster,
} = require('./cricspecial'); 

const { 
	addNewUser, updateUser,
	getNewSudentCode, getNewBatchCode,
	timeToBlock, blockToTime, getWeeklyBlock
} = require('./functions'); 


router.get('/list/all', async function (req, res, next) {
  setHeader(res);

	// First get list of students
	var allStudents = await Student.find({},{_id: 0, sid: 1, name: 1, enabled: 1, bid: 1}).sort({name: 1});
	
	var sessionCount = [];
	var xxx = [];
	for(var i=0; i<allStudents.length; ++i) {
		var myStud = allStudents[i];
		// for for each student get the total sessions
		/*
		db.inventory.updateMany(
   { tags: { $in: [ "home", "school" ] } },
   { $set: { exclude: false } }
	*/
		var sessCount = await Session.countDocuments(
			{ sidList: myStud.sid }
		);
		sessionCount.push({sid: myStud.sid, name: myStud.name, enabled: myStud.enabled, bid: myStud.bid,  count: sessCount});
	}
	
  sendok(res, sessionCount ); 
})


router.get('/list/disabled', async function (req, res, next) {
  setHeader(res);
 
	var allRecs = await Batch.find({enabled: false}).sort({creationDate: -1});
  sendok(res, allRecs ); 
})

router.get('/list/enabled', async function (req, res, next) {
  setHeader(res);
 
	var allRecs = await Batch.find({enabled: true}).sort({creationDate: -1});
  sendok(res, allRecs ); 
})


router.get('/add/:sessionData', async function (req, res, next) {
  setHeader(res);
  var { sessionData } = req.params;

	sessionData = JSON.parse(sessionData);
	
	// first get the 
	console.log(sessionData);
	/*
	sequence: Number,
	sessionNumber: Number,
  bid: String,		// Batch code
	fees: Number,		// Batch fees per session per student
	sessionDate: Date,
	fid: String,		// Faculty of this batch
	facultyName: String, // Faculty name
	sidList: [String],		// list of Id of students in batch
	studentNameList: [String],		// list of names of students in batch
	attendedSidList: [String],		// list of Id of students who attended the session
	attendedStudentNameList: [String],		// list of name of students who attended the session
	creationDate: Date,
  enabled: Boolean	// Batch open (true) / closed false	
	*/
	var newSession = new Session();
	newSession.sequence = SEQUENCE_CURRENT;
	newSession.sessionNumber = 0;				// Will be updated later on
	newSession.bid = sessionData.batchData.bid;
	newSession.fees = sessionData.batchData.fees;
	newSession.sessionDate = sessionData.sessionDate;

	newSession.fid = sessionData.batchData.fid;
	newSession.facultyName = sessionData.batchData.facultyName;
	
	newSession.sidList = sessionData.batchData.sid;
	newSession.studentNameList = sessionData.batchData.studentNameList;
	
	newSession.attendedSidList = sessionData.attendanceList;
	var tmp  = [];
	for(var i=0; i < sessionData.attendanceList.length; ++i) {
		var sid_idx = sessionData.batchData.sid.indexOf(sessionData.attendanceList[i]);
		tmp.push(sessionData.batchData.studentNameList[sid_idx]);
	}	
	newSession.attendedStudentNameList = tmp;
	newSession.creationDate = new Date();
	newSession.enabled = true;
	
	// Now get the sequnce number
	var tmpRecs = await Session.find({bid: newSession.bid });
	newSession.sessionNumber = (tmpRecs.length > 0) ? tmpRecs[0].sessionNumber + 1 : 1;
	await newSession.save();
	
	// not update the session count in batch
	tmpRecs = await Batch.findOne({bid: newSession.bid });
	tmpRecs.sessionCount = tmpRecs.sessionCount + 1;
	await tmpRecs.save();
	
	sendok(res, newSession);
	
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
	
	// user added. Now update 
	studentRec.name = myStatus.userRec.displayName;
	studentRec.parentName = getDisplayName(parName);
	studentRec.parentMobile = parMobile;
  await studentRec.save();
  sendok(res, studentRec ); 
})

router.get('/delete/:bid', async function (req, res, next) {
  setHeader(res);
  var {bid } = req.params;

	batchRec = await Batch.findOne({bid: bid});
	if (!batchRec) return senderr(res, 601, "Invalid BID");

	await Batch.deleteOne({bid: bid});

	studentArray = await Student.find({bid: batchRec.bid});
	for(var i=0; i<studentArray.length; ++i) {
		studentArray[i].bid = "";
		await studentArray[i].save();
	}
	
  sendok(res, "Deleted" ); 
})

router.get('/disabled/:bid', async function (req, res, next) {
  setHeader(res);
  var {bid } = req.params;

	batchRec = await Batch.findOne({bid: bid});
	if (!batchRec) return senderr(res, 601, "Invalid BID");

	batchRec.enabled = false;
	await batchRec.save();
	
	studentArray = await Student.find({bid: bid});
	for(var i=0; i<studentArray.length; ++i) {
		studentArray[i].bid = "";
		await studentArray[i].save();
	}
	
  sendok(res, batchRec ); 
})

router.get('/enabled/:bid', async function (req, res, next) {
  setHeader(res);
  var { bid } = req.params;

	batchRec = await Batch.findOne({bid: bid});
	console.log(batchRec);
	if (!batchRec) return senderr(res, 601, "Invalid BID");
	
	// Now verify studnets still available
	studentArray = await Student.find({sid: {$in: batchRec.sid } });
	for(var i=0; i<studentArray.length; ++i) {
		if (studentArray[i].bid != "") return senderr(res, 602, "Invalid BID");
	}
	
	// Now okay. Now assign batch to students
	for(var i=0; i<studentArray.length; ++i) {
		studentArray[i].bid = batchRec.bid;
		await studentArray[i].save();
	}

	batchRec.enabled = true;
	await batchRec.save();
	
  sendok(res, batchRec ); 
})


router.get('/getfacultyblock/:fid', async function (req, res, next) {
  setHeader(res);
  
	var { fid } = req.params;
	
	var allBatches = await Batch.find({fid: fid});
	//console.log(allBatches);
	
	var facultyBlockList = getWeeklyBlock(allBatches);
	
  sendok(res, facultyBlockList ); 
})



router.get('/testarea/:aid', async function (req, res, next) {
  setHeader(res);
  var {aid } = req.params;


	var newBid = await getNewBatchCode(aid);
  sendok(res, newBid ); 
})



function sendok(res, usrmgs) { res.send(usrmgs); }
function senderr(res, errcode, errmsg) { res.status(errcode).send({error: errmsg}); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
module.exports = router;
