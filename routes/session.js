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


router.get('/oldlist/all', async function (req, res, next) {
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


router.get('/list/all', async function (req, res, next) {
  setHeader(res);
	
	// first fetch all batch sessions
	var sessionInfo = await Session.aggregate(
		[ 
			{
			"$group" : { 
				"_id"   : { bid: "$bid", sidList: "$sidList", studentNameList: "$studentNameList" },
				sessionCount: { $sum: 1 }, 
				amount: { $sum: "$fees" }
				},

			}
		]
	);
	

	// now segrate it by student wise
	sessionCountArray = [];
	for(var i=0; i < sessionInfo.length; ++i) {
		console.log(sessionInfo[i]);
		for(var j=0; j < sessionInfo[i]._id.sidList.length; ++j) {
			var tmp = sessionCountArray.find(x => x.sid === sessionInfo[i]._id.sidList[j]);
			if (tmp) {
				tmp.count += sessionInfo[i].sessionCount;
				tmp.amount += sessionInfo[i].amount;
			}
			else {
				sessionCountArray.push({
					sid: sessionInfo[i]._id.sidList[j], 
					name: sessionInfo[i]._id.studentNameList[j], 
					//not required bid: sessionInfo[i]._id.bid, 
					amount: sessionInfo[i].amount,
					count: sessionInfo[i].sessionCount});
			}
		}
	}
	
	
  sendok(res, _.sortBy(sessionCountArray, 'name') ); 
})


router.get('/list/:month/:year', async function (req, res, next) {
  setHeader(res);
	var { month, year } = req.params;
	month = Number(month);
	year = Number(year);
	
	console.log(month, year);
	
	var startDate = new Date(year, month, 1);
	var endDate = new Date(year, month, 1);
	endDate.setMonth(endDate.getMonth()+1);
	console.log(startDate, endDate);
	
	
	// first fetch all batch sessions
	var sessionInfo = await Session.aggregate(
		[ 
			{ $match: {
					'sessionDate': {
							$gte: startDate, 
							$lte: endDate 
					}
				}
			},
			{
			"$group" : { 
				"_id"   : { bid: "$bid", sidList: "$sidList", studentNameList: "$studentNameList" },
				sessionCount: { $sum: 1 }, 
				amount: { $sum: "$fees" }
				},

			}
		]
	);
	

	// now segregate it by student wise
	sessionCountArray = [];
	for(var i=0; i < sessionInfo.length; ++i) {
		console.log(sessionInfo[i]);
		for(var j=0; j < sessionInfo[i]._id.sidList.length; ++j) {
			var tmp = sessionCountArray.find(x => x.sid === sessionInfo[i]._id.sidList[j]);
			if (tmp) {
				tmp.count += sessionInfo[i].sessionCount;
				tmp.amount += sessionInfo[i].amount;
			}
			else {
				sessionCountArray.push({
					sid: sessionInfo[i]._id.sidList[j], 
					name: sessionInfo[i]._id.studentNameList[j], 
					//not required bid: sessionInfo[i]._id.bid, 
					amount: sessionInfo[i].amount,
					count: sessionInfo[i].sessionCount});
			}
		}
	}
	
	
  sendok(res, _.sortBy(sessionCountArray, 'name') ); 
})


router.get('/list/byFaculty/:fid', async function (req, res, next) {
  setHeader(res);
	
	var { fid } = req.params;
	
	// first fetch all batch sessions
	var sessionInfo = await Session.aggregate(
		[ 
			{ $match: { fid: fid } },
			{
			"$group" : { 
				"_id"   : { bid: "$bid", sidList: "$sidList", studentNameList: "$studentNameList" },
				sessionCount: { $sum: 1 } }
			}
		]
	);
	
	// now segrate it by student wise
	sessionCountArray = [];
	for(var i=0; i < sessionInfo.length; ++i) {
		console.log(sessionInfo[i]);
		for(var j=0; j < sessionInfo[i]._id.sidList.length; ++j) {
			var tmp = sessionCountArray.find(x => x.sid === sessionInfo[i]._id.sidList[j]);
			if (tmp) {
				tmp.count += sessionInfo[i].sessionCount;
			}
			else {
				sessionCountArray.push({
					sid: sessionInfo[i]._id.sidList[j], 
					name: sessionInfo[i]._id.studentNameList[j], 
					//not required bid: sessionInfo[i]._id.bid,  
					count: sessionInfo[i].sessionCount});
			}
		}
	}
	
	
  sendok(res, _.sortBy(sessionCountArray, 'name') ); 
})


router.get('/listbybid/:bid', async function (req, res, next) {
  setHeader(res);

	var { bid } = req.params;
	
	// First get list of students
	var allSessions = await Sessions.find({bid: bid}).sort({sessionNumber: -1});
	
  sendok(res, allSessions ); 
})


router.get('/listbysid/:sid', async function (req, res, next) {
  setHeader(res);

	var { sid } = req.params;
	
	// First get list of students
	var allSessions = await Session.find({sidList: sid} ).sort({sessionNumber: -1});
	console.log(allSessions);
	
  sendok(res, allSessions ); 
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
	
	newSession.remarks = sessionData.remarks;
	
	var tmp  = [];
	for(var i=0; i < sessionData.attendanceList.length; ++i) {
		var sid_idx = sessionData.batchData.sid.indexOf(sessionData.attendanceList[i]);
		tmp.push(sessionData.batchData.studentNameList[sid_idx]);
	}	
	newSession.attendedStudentNameList = tmp;
	newSession.creationDate = new Date();
	newSession.enabled = true;
	
	// Now get the sequence number
	var tmpRecs = await Session.find({bid: newSession.bid }).limit(1).sort({sessionNumber: -1});
	newSession.sessionNumber = (tmpRecs.length > 0) ? tmpRecs[0].sessionNumber + 1 : 1;
	await newSession.save();
	
	// not update the session count in batch
	tmpRecs = await Batch.findOne({bid: newSession.bid });
	tmpRecs.sessionCount = tmpRecs.sessionCount + 1;
	await tmpRecs.save();
	
	sendok(res, newSession);
	
})

router.get('/update/:sessionData', async function (req, res, next) {
  setHeader(res);
  var { sessionData } = req.params;

	sessionData = JSON.parse(sessionData);
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
	var sessioRec = await Session.findOne({_id: sessionData.sessionId});
	sessioRec.sessionDate = sessionData.sessionDate;
	sessioRec.attendedSidList = sessionData.attendanceList;
	sessioRec.remarks = sessionData.remarks;

	var tmp  = [];
	for(var i=0; i < sessionData.attendanceList.length; ++i) {
		var sid_idx = sessionData.batchData.sid.indexOf(sessionData.attendanceList[i]);
		tmp.push(sessionData.batchData.studentNameList[sid_idx]);
	}	
	sessioRec.attendedStudentNameList = tmp;
	await sessioRec.save();
	
	sendok(res, sessioRec);
	
})


router.get('/get/:sessionId', async function (req, res, next) {
  setHeader(res);
	
  var { sessionId } = req.params;
	
	var sessRec = await Session.findOne({_id: sessionId});  // fetch to get the batch Id
	
  sendok(res, sessRec ); 
})

router.get('/delete/:sessionId/:bid', async function (req, res, next) {
  setHeader(res);
  var { sessionId, bid } = req.params;

	await Session.deleteOne({_id: sessionId});
	
	// reduce session count in batch record
	batchRec = await Batch.findOne({bid: bid});
	if (!batchRec) return senderr(res, 601, "Invalid BID");
	batchRec.sessionCount -= 1;
	await batchRec.save();
	
  sendok(res, "Deleted" ); 
})

router.get('/delete/:sessionId', async function (req, res, next) {
  setHeader(res);
  var { sessionId } = req.params;

	var sessRec = await Session.findOne({_id: sessionId});  // fetch to get the batch Id
	
	// delete the session
	await Session.deleteOne({_id: sessionId});
	
	// reduce session count in batch record
	batchRec = await Batch.findOne({bid: sessRec.bid});
	if (!batchRec) return senderr(res, 601, "Invalid BID");
	batchRec.sessionCount -= 1;
	await batchRec.save();
	
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

router.get('/fees/all', async function (req, res, next) {
  setHeader(res);

	//*/ First get list of students
	//var allStudents = await Student.find({},{_id: 0, sid: 1, name: 1, enabled: 1, bid: 1}).sort({name: 1});
	
	var studentsList = await Session.find({}, {_id: 0, sidList: 1, studentNameList: 1 });;	
	var allStudInfos = [];
	for(var i=0; i<studentsList.length; ++i) {
		var myRec = studentsList[i];
		for(var j=0; j < myRec.sidList.length; ++j) {
			if (!allStudInfos.find(x => x.sid == myRec.sidList[j])) 
				allStudInfos.push({sid: myRec.sidList[j], name: myRec.studentNameList[j], fees: 0, payment: 0 });
		}
	}
	
	
	var feesInfo = await Session.aggregate(
		[{
			"$group" : { 
				"_id"   : "$sidList", 
				"fees"  : { 
						"$sum" : { 
								"$multiply" : ["$fees", 1]
						}
				}
			}
		}]
	);
	
	for(var i=0; i<allStudInfos.length; ++i) {
		var tmp = feesInfo.filter( x => x._id.includes(allStudInfos[i].sid));
		console.log(tmp);
		allStudInfos[i].fees = _.sumBy(tmp, 'fees');
	}
	
  sendok(res, allStudInfos ); 
})



function sendok(res, usrmgs) { res.send(usrmgs); }
function senderr(res, errcode, errmsg) { res.status(errcode).send({error: errmsg}); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
module.exports = router;
