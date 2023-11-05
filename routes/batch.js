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
 
	var allRecs = await Batch.find({}).sort({creationDate: -1});
  sendok(res, allRecs ); 
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


router.get('/add/:batchData', async function (req, res, next) {
  setHeader(res);
  var { batchData } = req.params;

	batchData = JSON.parse(batchData);
	
	console.log(batchData);
	
	// Now start basic validation
	if (batchData.students.length == 0) {
		return senderr(res, 601, "no studnets");
	}

	if (batchData.sessions.length == 0) {
		return senderr(res, 602, "no sessions");
	}
	
	// cgeck all the students have not been assigned Batch
	var sidList = [];
	batchData.students.forEach( (studRec) => {
		sidList.push(studRec.sid);
	});
	var studentArray = await Student.find({sid: {$in: sidList} });
	
	studentArray.forEach( (studRec) => {
		if (studRec.bid != "")  return senderr(res, 603, "students already assigned batch");
	});
	
	// Now check for faculty if session is available
	var allBatches = await Batch.find({fid: batchData.faculty.fid, enabled: true});
	//console.log(allBatches);	
	var facultyBlockList = getWeeklyBlock(allBatches);
	
	//console.log(facultyBlockList);
	
	// Now check for each session if the block is available
	console.log("Checking blocks");
	var totalBlocks = ( batchData.duration * MINUTES_IN_HOUR ) / BLOCK_IN_MINUTES;
	console.log("Blocks", totalBlocks);
	var sessionList = [];
	console.log(batchData.sessions.length, batchData.sessions);
	for(var sIdx=0; sIdx < batchData.sessions.length; ++sIdx) {
		var sessRec = batchData.sessions[sIdx];
		var hr = Number(sessRec.hour);
		var mn = Number(sessRec.min) ;
		sessionList.push({day: sessRec.day, hour: hr, minute: mn });			// will be put in batchrecord if all okay
		var startBlock = timeToBlock(hr , mn);
		var dayIdx = SHORTWEEKSTR.indexOf(sessRec.day);
		console.log(dayIdx, startBlock);
		for(var i=startBlock; i<(startBlock+totalBlocks); ++i) {
			console.log(dayIdx, i, facultyBlockList[dayIdx][i]);
			if (facultyBlockList[dayIdx][i] != "") return senderr(res, 604, "faculty block clash");			// faculty slot busy with another batch
		}
	};
	
	console.log("Now create new batch record");
	
	var newBatch = new Batch();
	newBatch.sequence = SEQUENCE_CURRENT;
	newBatch.bid = await getNewBatchCode(batchData.area);
	newBatch.fid = batchData.faculty.fid;
	newBatch.sessionCount = 0;
	newBatch.fees = batchData.fees;
	newBatch.sessionTime = totalBlocks;				// session of # number blocks
	newBatch.batchStatus = "";  // future
	newBatch.enabled = true;
	newBatch.creationDate = new Date();	
	newBatch.sid = sidList;
	newBatch.timings = sessionList
	
	await newBatch.save();
	
	// Assign batch to studntes
	for(var i=0; i<studentArray.length; ++i) {
		studentArray[i].bid = newBatch.bid;
		await studentArray[i].save();
	};
	
	console.log(newBatch);
	
	sendok(res, newBatch ); 
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
