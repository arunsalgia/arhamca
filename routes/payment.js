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

router.get('/list/:sid', async function (req, res, next) {
  setHeader(res);

	var { sid } = req.params;
	
	var allPayments = await Payment.find({ sid: sid }).sort({date: -1});
	console.log(allPayments);
	
  sendok(res, allPayments ); 
})



router.get('/add/:paymentData', async function (req, res, next) {
  setHeader(res);
  var { paymentData } = req.params;

	paymentData = JSON.parse(paymentData);
	
	// first get the 
	console.log(paymentData);
	
	var newPayment = new Payment();
	newPayment.sequence = SEQUENCE_CURRENT;
	newPayment.sessionNumber = 0;				// Will be updated later on
	
	newPayment.sid = paymentData.studentRec.sid;
	newPayment.studentName = paymentData.studentRec.name;
	
	newPayment.date = paymentData.paymentDate;
	newPayment.amount = paymentData.amount;
	newPayment.mode = paymentData.paymentMode;
	newPayment.reference = paymentData.paymentRef;
	newPayment.status = paymentData.paymentStatus;
	newPayment.remarks = paymentData.remarks;
	
	newPayment.creationDate = new Date();
	newPayment.enabled = true;
	
	// Now get the sequnce number
	var tmpRecs = await Payment.find({}, {sessionNumber: 1, _id: 0}).limit(1).sort({ sessionNumber: -1 });
	newPayment.sessionNumber = (tmpRecs.length > 0) ? tmpRecs[0].sessionNumber + 1 : 1;

	await newPayment.save();
	
	sendok(res, newPayment);
	
})


router.get('/update/:paymentData', async function (req, res, next) {
  setHeader(res);
  var { paymentData } = req.params;

	paymentData = JSON.parse(paymentData);
	console.log(paymentData);

	// first get the payment record
	paymentRec = await Payment.findOne({_id: paymentData.paymentRec._id});
	
	paymentRec.amount = paymentData.amount;
	paymentRec.mode = paymentData.paymentMode;
	paymentRec.reference = paymentData.paymentRef;
	paymentRec.status = paymentData.paymentStatus;
	paymentRec.remarks = paymentData.remarks;
	
	await paymentRec.save();
	
	sendok(res, paymentRec);
	
})

router.get('/delete/:myid', async function (req, res, next) {
  setHeader(res);
  var {myid } = req.params;

	await Payment.deleteOne({_id: myid});

  sendok(res, "Deleted" ); 
})



router.get('/total/all', async function (req, res, next) {
  setHeader(res);

	var paymentInfo = await Payment.aggregate(
		[{
			"$group" : { 
				"_id"   : {
					sid: "$sid", 
					studentName: "$studentName"
				},
				"amount"  : { 
						"$sum" : { 
								"$multiply" : ["$amount", 1]
						}
				}
			}
		}]
	).sort({"_id.studentName": 1});
	

  sendok(res, paymentInfo ); 
})




router.get('/summary/all', async function (req, res, next) {
  setHeader(res);

	var allSummary = [];
	var i, j;
	
	// first fetch all the payment
	var paymentInfo = await Payment.aggregate(
		[{
			"$group" : { 
				"_id"   : {sid: "$sid", studentName: "$studentName" },
				"amount"  : { "$sum" : "$amount"}
			}
		}]
	).sort({"_id.studentName": 1});
	for(i=0; i<paymentInfo.length; ++i) {
		allSummary.push({sid: paymentInfo[i]._id.sid, studentName:  paymentInfo[i]._id.studentName, credit: paymentInfo[i].amount, debit: 0});
	}
	
	// now fetch all batch sessions
	var feesInfo = await Session.aggregate(
		[{
			"$group" : { 
				"_id"   : { sidList: "$sidList", studentNameList: "$studentNameList" },
				"fees"  : { "$sum" : "$fees" }
			}
		}]
	);
	
	// Now add it in allSummary
	for(i=0; i<feesInfo.length; ++i) {
		for(j=0; j < feesInfo[i]._id.sidList.length; ++j) {
			var tmp = allSummary.find( x => x.sid === feesInfo[i]._id.sidList[j]);
			if (tmp) {
				tmp.debit += feesInfo[i].fees;
			}
			else {
				// new entry
				allSummary.push({sid: feesInfo[i]._id.sidList[j], studentName:  feesInfo[i]._id.studentNameList[j], credit: 0, debit: feesInfo[i].fees});
			}
		}
	}
	
	console.log(feesInfo);
	//console.log(allSummary);
  sendok(res, _.sortBy(allSummary, 'studentName') ); 
})


router.get('/summary/detail/:sid', async function (req, res, next) {
  setHeader(res);

	var { sid } = req.params;
	
	var allSummary = [];
	var i, j;
	
	// first fetch all the payment
	var paymentInfo = await Payment.find({sid: sid}, {date: 1, mode: 1, amount: 1} );
	
	for(i=0; i<paymentInfo.length; ++i) {
		allSummary.push(
		{
			date: paymentInfo[i].date,
			desc: `${paymentInfo[i].mode} payment`,
			credit: paymentInfo[i].amount,
			debit: 0
		});
	}
	
	var sessionInfo = await Session.find({sidList: [sid] }, {sessionDate: 1, bid: 1, fees: 1, sessionNumber: 1} );
	for(i=0; i<sessionInfo.length; ++i) {
		allSummary.push(
		{
			date: sessionInfo[i].sessionDate,
			desc: `Session No. ${sessionInfo[i].sessionNumber} (batch: ${sessionInfo[i].bid})`,
			credit: 0,
			debit: sessionInfo[i].fees
		});
	}


  sendok(res, _.sortBy(allSummary, 'date').reverse() ); 
})


function sendok(res, usrmgs) { res.send(usrmgs); }
function senderr(res, errcode, errmsg) { res.status(errcode).send({error: errmsg}); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
module.exports = router;