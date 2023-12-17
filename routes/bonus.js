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
	var allBonus = await Bonus.find({}).sort({date: -1});
  sendok(res, allBonus ); 
})

router.get('/list/user/:uid', async function (req, res, next) {
  setHeader(res);

	var { uid } = req.params;

	var allBonus = await Bonus.find({uid: uid}).sort({date: -1});
  sendok(res, allBonus ); 
})

router.get('/list/bonus/all', async function (req, res, next) {
  setHeader(res);

	
	var allBonus = await Bonus.find({isBonus: true }).sort({date: -1});
	//console.log(allBonus);
	
  sendok(res, allBonus ); 
})


router.get('/list/bonus/:uid', async function (req, res, next) {
  setHeader(res);

	var { uid } = req.params;
	
	var allBonus = await Bonus.find({ uid: uid, isBonus: true }).sort({date: -1});
	//console.log(allBonus);
	
  sendok(res, allBonus ); 
})

router.get('/list/payment/all', async function (req, res, next) {
  setHeader(res);

	var allBonus = await Bonus.find({isBonus: false }).sort({date: -1});
	//console.log(allBonus);
	
  sendok(res, allBonus ); 
})


router.get('/list/payment/:uid', async function (req, res, next) {
  setHeader(res);

	var { uid } = req.params;
	
	var allBonus = await Bonus.find({ uid: uid, isBonus: false }).sort({date: -1});
	//console.log(allBonus);
	
  sendok(res, allBonus ); 
})



router.get('/add/bonus/:bonusData', async function (req, res, next) {
  setHeader(res);
  var { bonusData } = req.params;

	bonusData = JSON.parse(bonusData);
	
	// first get the 
	console.log(bonusData);
	
	var newBonus = new Bonus();
	
	newBonus.date = bonusData.date;
	newBonus.uid = bonusData.uid;
	newBonus.name = bonusData.name;
	newBonus.bid = bonusData.bid;
	newBonus.bonusAmount = bonusData.amount;
	newBonus.bonusPayment = 0;
	newBonus.isBonus = true;
	newBonus.mode = "";
	newBonus.remarks = `Bonus for batch ref. ${bonusData.bid}`;
	newBonus.enabled = true;
	await newBonus.save();
	
	sendok(res, newBonus);
	
})


router.get('/add/payment/:bonusData', async function (req, res, next) {
  setHeader(res);
  var { bonusData } = req.params;

	bonusData = JSON.parse(bonusData);
	
	// first get the 
	console.log(bonusData);
	
	var newBonus = new Bonus();
	
	newBonus.date = bonusData.date;
	newBonus.uid = bonusData.uid;
	newBonus.name = bonusData.name;
	newBonus.bid = "";
	newBonus.bonusAmount = 0;
	newBonus.bonusPayment = bonusData.amount;
	newBonus.isBonus = false;
	newBonus.mode = bonusData.mode;
	newBonus.remarks = bonusData.remarks;
	newBonus.enabled = true;
	await newBonus.save();
	
	sendok(res, newBonus);
	
})


router.get('/update/:bonusData', async function (req, res, next) {
  setHeader(res);
  var { bonusData } = req.params;

	bonusData = JSON.parse(bonusData);
	console.log(bonusData);

	// first get the payment record
	bonusRec = await Bonus.findOne({_id: bonusData._id});
	bonusRec.date = bonusData.date;
	if (bonusRec.isBonus) {
		bonusRec.bid = bonusData.bid;
		bonusRec.bonusAmount = bonusData.amount;
		bonusRec.remarks = `Bonus for batch ref. ${bonusData.bid}`;
	}
	else {
		bonusRec.bonusPayment = bonusData.amount;
		bonusRec.remarks = bonusData.remarks;
		bonusRec.mode = bonusData.paymentMode;
	}
	await bonusRec.save();
	
	sendok(res, bonusRec);
	
})

router.get('/delete/:myid', async function (req, res, next) {
  setHeader(res);
  var {myid } = req.params;

	await Bonus.deleteOne({_id: myid});

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
	var bonusSummary = await Bonus.aggregate(
		[{
			"$group" : { 
				"_id"   : {uid: "$uid", name: "$name" },
				"bonusAmount"  : { "$sum" : "$bonusAmount"},
				"bonusPayment"  : { "$sum" : "$bonusPayment"}
			}
		}]
	).sort({"_id.name": 1});


  sendok(res, bonusSummary); 
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
			_id:  paymentInfo[i]._id,
			date: paymentInfo[i].date,
			desc: `Payment mode: ${paymentInfo[i].mode}`,
			credit: paymentInfo[i].amount,
			debit: 0
		});
	}
	
	var sessionInfo = await Session.find({sidList: sid }, {sessionDate: 1, bid: 1, fees: 1, sessionNumber: 1} );
	for(i=0; i<sessionInfo.length; ++i) {
		allSummary.push(
		{
			_id:  sessionInfo[i]._id,
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
