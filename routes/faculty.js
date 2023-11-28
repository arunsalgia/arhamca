router = express.Router();


const { 
	encrypt, decrypt, dbencrypt, dbdecrypt, dbToSvrText, 
  svrToDbText, getLoginName, getDisplayName, 
  getMaster, setMaster,
} = require('./cricspecial'); 

const { 
	addNewUser, updateUser,
	getNewFacultyCode, getFacultyHours,
	timeToBlock, blockToTime, getWeeklyBlock,
} = require('./functions'); 



router.get('/list/all', async function (req, res, next) {
  setHeader(res);
 
	var allFaculty = await Faculty.find({}).sort({name: 1});
	for (var i=0; i<allFaculty.length; ++i) {
		var tmp = await getFacultyHours(allFaculty[i].fid);
		allFaculty[0].hours = tmp;
	}
	sendok(res, allFaculty ); 
})


router.get('/list/disabled', async function (req, res, next) {
  setHeader(res);
 
	var allFaculty = await Faculty.find({enabled: false}).sort({name: 1});
	for (var i=0; i<allFaculty.length; ++i) {
		var tmp = await getFacultyHours(allFaculty[i].fid);
		allFaculty[0].hours = tmp;
	}
  sendok(res, allFaculty ); 
})

router.get('/list/enabled', async function (req, res, next) {
  setHeader(res);
 
	var allFaculty = await Faculty.find({enabled: true}).sort({name: 1});
	for (var i=0; i<allFaculty.length; ++i) {
		var tmp = await getFacultyHours(allFaculty[i].fid);
		allFaculty[0].hours = tmp;
	}
  sendok(res, allFaculty ); 
})

router.get('/enabledfaculty/:fid', async function (req, res, next) {
  setHeader(res);
	var {fid} = req.params;
	
	var myFaculty = await Faculty.findOne({fid: fid, enabled: true});
	if (myFaculty)
		sendok(res, myFaculty ); 
	else
		senderr(res, 601, "No fac");
})

router.get('/get/:fid', async function (req, res, next) {
  setHeader(res);
	var {fid} = req.params;
	
	var myFaculty = await Faculty.findOne({fid: fid.toUpperCase()});
	if (myFaculty) {
		var tmp = await getFacultyHours(myFaculty.fid);
		myFaculty.hours = tmp;
		sendok(res, myFaculty ); 
	} 
	else
		senderr(res, 601, "No fac");
})

router.get('/test/:fid', async function (req, res, next) {
  setHeader(res);
	var {fid} = req.params;
	
	var hours = getFacultyHours(fid.toUpperCase());
	sendok(res, {hours: hours});
})


router.get('/enabledfacultybyuid/:uid', async function (req, res, next) {
  setHeader(res);
	var {uid} = req.params;
	
	var myFaculty = await Faculty.findOne({uid: uid, enabled: true});
	if (myFaculty)
		sendok(res, myFaculty ); 
	else
		senderr(res, 601, "No fac");
})


router.get('/add/:uName/:uPassword/:uEmail/:mobileNumber/:addr1/:addr2/:addr3/:addr4', async function (req, res, next) {
  setHeader(res);
  var {uName, uPassword, uEmail, mobileNumber, addr1, addr2, addr3, addr4 } = req.params;

	// first it as a user
	var myStatus = await addNewUser(uName, uPassword, ROLE_FACULTY, uEmail, mobileNumber, addr1, addr2, addr3, addr4);
	//console.log(myStatus);
	if (myStatus.status != 0)
		return senderr(res, myStatus.status, "Error");
	
	// user added. Now get Facilty id and add new fac
	var fid = await getNewFacultyCode();

	//console.log(myStatus.userRec);
	//console.log(myStatus.userRec.displayName);
	var facRec = new Faculty({
		sequence: SEQUENCE_CURRENT,
		fid: fid,
		name: myStatus.userRec.displayName,
		uid: myStatus.userRec.uid,
		batchCount: 0,
		hours: 0,
		enabled: true,
		
    });
	console.log(facRec);
  await facRec.save();

  sendok(res, facRec ); 
})

router.get('/update/:ufid/:uName/:uPassword/:uEmail/:mobileNumber/:addr1/:addr2/:addr3/:addr4', async function (req, res, next) {
  setHeader(res);
  var { ufid, uName, uPassword, uEmail, mobileNumber, addr1, addr2, addr3, addr4 } = req.params;

	var facRec = await Faculty.findOne({fid: ufid});
	
	// first it as a user
	var myStatus = await updateUser(facRec.uid, uName, uPassword, ROLE_FACULTY, uEmail, mobileNumber, addr1, addr2, addr3, addr4);
	//console.log(myStatus);
	if (myStatus.status != 0)
		return senderr(res, myStatus.status, "Error");
	
	// user update. Now check if user name changed
	if (facRec.name !== myStatus.userRec.displayName) {
		// first update name in Faculty record and save
		facRec.name = myStatus.userRec.displayName;
		await facRec.save();
		
		// Now update name in all the Batch records
		var allFacRecs = await Batch.find({fid: facRec.fid});
		for (var i=0; i<allFacRecs.length; ++i) {
			allFacRecs[i].facultyName = myStatus.userRec.displayName;
			allFacRecs[i].save();
		}
		
		// Now update name in all the Session records
		var allSessRecs = await Session.find({fid: facRec.fid});
		for (var i=0; i<allSessRecs.length; ++i) {
			allSessRecs[i].facultyName = myStatus.userRec.displayName;
			allSessRecs[i].save();
		}	
		// All done for name change of faculty
	}
	
  sendok(res, facRec ); 
})


router.get('/disabled/:fid', async function (req, res, next) {
  setHeader(res);
  var {fid } = req.params;

	facRec = await Faculty.findOne({fid: fid});
	if (!facRec) return senderr(res, 601, "Invalid FID");
	
	if (facRec.batchCount != 0) return senderr(res, 602, "Faculty batch in progress");
	
	facRec.enabled = false;
	facRec.save();
	
	userRec = await User.findOne({uid: facRec.uid});
	userRec.enabled = false;
	userRec.save();
	
  sendok(res, "Done" ); 
})

router.get('/enabled/:fid', async function (req, res, next) {
  setHeader(res);
  var {fid } = req.params;

	facRec = await Faculty.findOne({fid: fid});
	if (!facRec) return senderr(res, 601, "Invalid FID");
	
	facRec.enabled = true;
	facRec,batchCount = 0;
	
	facRec.save();
	
	userRec = await User.findOne({uid: facRec.uid});
	userRec.enabled = true;
	userRec.save();
	
  sendok(res, "Done" ); 
})


router.get('/getfacultyblock/:fid', async function (req, res, next) {
  setHeader(res);
  
	var { fid } = req.params;
	
	var allBatches = await Batch.find({fid: fid, enabled: true});
	//console.log(allBatches);
	
	var facultyBlockList = await getWeeklyBlock(allBatches);
	//console.log(facultyBlockList);
	
  sendok(res, facultyBlockList ); 
})


function sendok(res, usrmgs) { res.send(usrmgs); }
function senderr(res, errcode, errmsg) { res.status(errcode).send({error: errmsg}); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
module.exports = router;
