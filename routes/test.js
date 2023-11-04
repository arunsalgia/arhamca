const fetch = require('node-fetch');
const project_key = 'RS_P_1439602356420481067'
const api_key = 'RS5:c219fa31988c970ee110d79d0a785435'
var request = require('request')
const token="v5sRS_P_1439602356420481067s1440985143178303760";
const BCCI="c__board__bcci__b13f0";
const IPL21 = "iplt20_2021";
let IPLMATCHES;

const { 
	encrypt, decrypt, dbencrypt, dbdecrypt, 
	dbToSvrText, svrToDbText, 
	sendCricMail, sendCricHtmlMail,
	getMaster, setMaster,
	GroupMemberCount, akshuGetGroup, akshuUpdGroup, akshuUpdGroupMember, 
	akshuUpdUser, akshuGetUser, 
	akshuGetTournament,
	akshuGetAuction,
	akshuGetGroupMembers,
} = require('./cricspecial'); 

const {
  cricapi_get_score,
} = require('./cricapifunctions');

const {
	getNewBatchCode,

} = require('./functions');

var router = express.Router();

// let AplRes;

/* GET users listing. */
router.use('/', function(req, res, next) {
  // AplRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  next('route');
});

router.get('/gettoken', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);


	var request = require('request')
	var options = {
		method: 'POST',
		url: `https://api.sports.roanuz.com/v5/core/${project_key}/auth/`,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			api_key: `"${api_key}"`
		})

	}
	request(options, function (error, response) {
		if (error) throw new Error(error)
		console.log(response.body)
	})
});


router.get('/master/list', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);

  let myData = await MasterData.find({});
  sendok(res, myData);
});

router.get('/getfile/:myFileName', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  let { myFileName } = req.params;
  console.log(myFileName);
  myFileName = decrypt(myFileName);
  console.log(myFileName);
  sendok(res, myFileName);
});


router.get('/master/add/:myKey/:myValue', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  let { myKey, myValue } = req.params;
  
  let myData = await MasterData.findOne({msKey: myKey.toUpperCase()});
  if (!myData) {
    myData = new MasterData();
    let tmp = await MasterData.find().limit(1).sort({ msId: -1 });
    myData.msId = (tmp.length > 0) ? tmp[0].msId + 1 : 1;
    myData.msKey = myKey.toUpperCase();
  }
  myData.msValue = myValue;
  myData.save();
  sendok(res, myData);
});

router.get('/master/delete/:myKey', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  let { myKey } = req.params;
  
  try {
    await MasterData.deleteOne({msKey: myKey.toUpperCase()});
    sendok(res, `Key ${myKey} successfully delete from Master Settings`);
  } catch (e) {
    senderr(res, 601, `Key ${myKey} not found in Master Settings`);
  }
});



router.get('/getmaster/:key', async function (req, res, next) {
  setHeader(res); 
  
  var {key} = req.params;
  let  myValue = await getMaster(key.toUpperCase());
  sendok(res, myValue);
}); 

router.get('/setmaster/:key/:value', async function (req, res, next) {
  setHeader(res);
  
  var {key, value} = req.params;
  await setMaster(key.toUpperCase(), value);
  sendok(res, "Done");
}); 


/*
batchSchema = mongoose.Schema({
  bid: String,		// Batch code
	fid: String,		// Faculty of this batch
	sid: [String],		// list of Id of students in batch
	timings: [{day: Number, hour: Number, minute: Number}],		// batch timings
	sessionCount: Number,	// # of sessions of this batch
	fees: Number, 	// Batch fees / batch / student
	batchStatus: String,	// To be used for future
	creationDate: Date,
  enabled: Boolean	// Batch open (true) / closed false
});
*/


router.get('/addbatch', async function (req, res, next) {
	 setHeader(res);
	 
	 var newBatch = new Batch();
	 newBatch.bid = await getNewBatchCode("DHE");
	 newBatch.fid = 'F00001'
	 newBatch.sid = [];
	 newBatch.sid.push("S00001");
	 newBatch.sid.push("S00002");
	 newBatch.sid.push("S00003");
	 newBatch.timings = [];
	 newBatch.timings.push({day: "WED", hour: 16, minute: 15});
	 newBatch.timings.push({day: "FRI", hour: 14, minute: 15});
	 newBatch.sessionCount = 0;
	 newBatch.fees = 500;
	 newBatch.batchStatus = "";
	 newBatch.sessionTime = 4;
	 newBatch.creationDate = new Date();
	 newBatch.enabled = true;
	 
	 await newBatch.save();
	 
	 sendok(res, newBatch);
});

router.get('/batchfilterstudent/:student', async function (req, res, next) {
	 setHeader(res);
	  var {student} = req.params;
	 /*
	 Event
		.find({tags.tagId: {$in: arrayOfTagsIds}})
.exec(function (err, events) { ... }
	 */
	 var allBatches = await Batch.find({sid: {$in: [student]} });
	
	 
	 sendok(res, allBatches);
});

router.get('/batchcountstudent/:student', async function (req, res, next) {
	 setHeader(res);
	  var {student} = req.params;
	 /*
	 Event
		.find({tags.tagId: {$in: arrayOfTagsIds}})
.exec(function (err, events) { ... }
	 */
	 var allBatches = await Batch.count({sid: {$in: [student]} });
	
	 
	 sendok(res, allBatches.toString());
});

router.get('/batchstudent/:bid', async function (req, res, next) {
	 setHeader(res);
	  var {bid} = req.params;
	 /*
	 Event
		.find({tags.tagId: {$in: arrayOfTagsIds}})
.exec(function (err, events) { ... }
	 */
	 var allBatches = await Batch.count({sid: {$in: [student]} });
	
	 
	 sendok(res, allBatches.toString());
});

function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}


module.exports = router;
