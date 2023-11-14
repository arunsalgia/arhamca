const { 
  getMaster, setMaster,
} = require('./cricspecial'); 
//var express = require('express');
var router = express.Router();
// let PrizeRes;

/* GET users listing. */


router.use('/', function(req, res, next) {
  // PrizeRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  next('route');
});

router.get('/add/:shortName/:longName', async function (req, res, next) {
  setHeader(res);
	var {shortName, longName } = req.params;
	
	shortName = shortName.toUpperCase();
	var tmp = await Area.findOne({shortName: shortName});
	if (tmp) return senderr(res, 601, "Area short name already exists."); 
	aRec = await Area.find().limit(1).sort({ "aid": -1 });
	lastArea = (aRec.length > 0) ? aRec[0].aid : 0;
	tmp = new Area({
      aid: lastArea + 1,
      shortName: shortName,
      longName: longName,
      enabled: true
    });
	tmp.save();
	sendok(res, tmp);
}); 

router.get('/update/:aid/:shortName/:longName', async function (req, res, next) {
  setHeader(res);
	var {aid, shortName, longName } = req.params;
	
	shortName = shortName.toUpperCase();
	var tmp = await Area.findOne({aid: aid});
	if (!tmp) return senderr(res, 601, "Invalid Area aid"); 
	tmp.shortName = shortName;
	tmp.longName = longName;
	tmp.save();
	sendok(res, tmp);
}); 

 
router.get('/list', async function (req, res, next) {
  // PrizeRes = res;
  setHeader(res);
	let allAreas = await Area.find({},{_id: 0, shortName: 1, longName: 1}).sort({longName: 1});
	sendok(res, allAreas);
}); 

router.get('/get/shortname/:shortName', async function (req, res, next) {
  var { shortName } = req.params;
	
  setHeader(res);
	let myArea = await Area.findOne({shortName: shortName},{_id: 0, shortName: 1, longName: 1});
	console.log(myArea);
	sendok(res, myArea);
}); 

router.get('/get/longName/:longName', async function (req, res, next) {
  var { longName } = req.params;
	
  setHeader(res);
	let myArea = await Area.findOne({longName: longName},{_id: 0, shortName: 1, longName: 1});
	sendok(res, myArea);
}); 



function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
module.exports = router;
