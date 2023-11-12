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


function sendok(res, usrmgs) { res.send(usrmgs); }
function senderr(res, errcode, errmsg) { res.status(errcode).send({error: errmsg}); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
module.exports = router;
