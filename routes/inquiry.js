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
 
	var allRecs = await Inquiry.find({}).sort({date: -1});
  sendok(res, allRecs ); 
})


router.get('/list/disabled', async function (req, res, next) {
  setHeader(res);
 
	var allRecs = await Inquiry.find({enabled: false}).sort({date: -1});
  sendok(res, allRecs ); 
})

router.get('/list/enabled', async function (req, res, next) {
  setHeader(res);
 
	var allRecs = await Inquiry.find({enabled: true}).sort({date: -1});
  sendok(res, allRecs ); 
})

router.get('/get/:bid', async function (req, res, next) {
  setHeader(res);
  var { bid } = req.params;
	
	var batchRec = await Batch.findOne({bid: bid});
  sendok(res, batchRec ); 
})

router.get('/enabledbatch/:fid', async function (req, res, next) {
  setHeader(res);
  var { fid } = req.params;
	
	var allRecs = await Batch.find({fid: fid, enabled: true}).sort({creationDate: -1});
  sendok(res, allRecs ); 
})

router.get('/get/:fid', async function (req, res, next) {
  setHeader(res);
  var { fid } = req.params;
	
	var allRecs = await Batch.find({fid: fid}).sort({creationDate: -1});
  sendok(res, allRecs ); 
})

router.get('/add/:inquiryData', async function (req, res, next) {
  setHeader(res);
  var { inquiryData } = req.params;

	inquiryData = JSON.parse(inquiryData);
	console.log(inquiryData);
	
	// Now start basic validation
	
	var newInquiry = new Inquiry();
	newInquiry.sequence = SEQUENCE_CURRENT;
	newInquiry.date = new Date();
	newInquiry.area = inquiryData.area;
	newInquiry.contactName = inquiryData.contactName;
	newInquiry.contactNumber = inquiryData.contactNumber;
	newInquiry.contactEmail = dbdecrypt(inquiryData.contactEmail);
	newInquiry.reference = inquiryData.reference;
	newInquiry.status = inquiryData.status;
	newInquiry.remarks = inquiryData.remarks;
	newInquiry.enabled = true;
	
	await newInquiry.save();
	console.log(newInquiry);
	
	sendok(res, newInquiry ); 
})

router.get('/update/:inquiryData', async function (req, res, next) {
  setHeader(res);
  var { inquiryData } = req.params;

	inquiryData = JSON.parse(inquiryData);
	console.log(inquiryData);
	
	// Now start basic validation
	var myInquiry = await Inquiry.findOne({_id: inquiryData._id});
	
	myInquiry.area = inquiryData.area;
	myInquiry.contactName = inquiryData.contactName;
	myInquiry.contactNumber = inquiryData.contactNumber;
	myInquiry.contactEmail = dbdecrypt(inquiryData.contactEmail);
	myInquiry.reference = inquiryData.reference;
	myInquiry.status = inquiryData.status;
	myInquiry.remarks = inquiryData.remarks;
	myInquiry.enabled = true;
	
	await myInquiry.save();
	console.log(myInquiry);
	
	sendok(res, myInquiry ); 
})

router.get('/delete/:_id', async function (req, res, next) {
  setHeader(res);
  var {_id } = req.params;

	await Inquiry.deleteOne({_id: _id});

  sendok(res, "Deleted" ); 
})


function sendok(res, usrmgs) { res.send(usrmgs); }
function senderr(res, errcode, errmsg) { res.status(errcode).send({error: errmsg}); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
module.exports = router;
