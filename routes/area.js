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



router.get('/getprizeportion', async function (req, res, next) {
  setHeader(res);
  let myPortion = await getMaster("PRIZEPORTION");
  console.log(myPortion);
  let amt = (myPortion !== "") ? parseInt(myPortion) : 100;
  sendok(res, {prizePortion: amt});
}); 

router.get('/setprizeportion/:percentage', async function (req, res, next) {
  setHeader(res);
  var {percentage} = req.params;

  await setMaster("PRIZEPORTION", percentage);
  sendok(res, "OK");
}); 

router.get('/prizecount/:num', async function (req, res, next) {
  // PrizeRes = res;
  setHeader(res);
  var {num} = req.params;

	let myPrize = await Prize.findOne({prizeCount: num})
	sendok(res, myPrize);
}); 


router.get('/all/:amount', async function (req, res, next) {
  // PrizeRes = res;
  setHeader(res);

  var { amount } = req.params;
 
  let allPrize=[];
  for(i=1; i<=5; ++i) {
    let mytab = await getPrizeTable(i, amount);
    allPrize.push(mytab);
  }
  sendok(res, allPrize);
}); 



router.get('/addprize', async function (req, res, next) {
  // PrizeRes = res;
  setHeader(res);

  let myPrize = new Prize({
    prizeCount: 1,
    prize1: 100,
    prize2: 0,
    prize3: 0,
    prize4: 0,
    prize5: 0,
    prize6: 0,
    prize7: 0,
    prize8: 0,
    prize9: 0,
    prize10: 0,
  })
  myPrize.save();

  myPrize = new Prize({
    prizeCount: 2,
    prize1: 60,
    prize2: 40,
    prize3: 0,
    prize4: 0,
    prize5: 0,
    prize6: 0,
    prize7: 0,
    prize8: 0,
    prize9: 0,
    prize10: 0,
  })
  myPrize.save();

  myPrize = new Prize({
    prizeCount: 3,
    prize1: 50,
    prize2: 30,
    prize3: 20,
    prize4: 0,
    prize5: 0,
    prize6: 0,
    prize7: 0,	
    prize8: 0,
    prize9: 0,
    prize10: 0,
  })
  myPrize.save();

  myPrize = new Prize({
    prizeCount: 4,
    prize1: 40,
    prize2: 30,
    prize3: 20,
    prize4: 10,
    prize5: 0,
    prize6: 0,
    prize7: 0,
    prize8: 0,
    prize9: 0,
    prize10: 0,
  })
  myPrize.save();

  myPrize = new Prize({
    prizeCount: 5,
    prize1: 35,
    prize2: 25,
    prize3: 20,
    prize4: 13,
    prize5: 7,
    prize6: 0,
    prize7: 0,
    prize8: 0,
    prize9: 0,
    prize10: 0,
  })
  myPrize.save();

  sendok(res, "ok");
}); 


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}
module.exports = router;
