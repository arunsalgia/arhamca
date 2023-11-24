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
	lastArea = (aRec.length > 0) ? aRec[0].aid + 1 : 1;
	tmp = new Area({
      aid: lastArea,
      shortName: shortName,
      longName: longName,
      enabled: true
    });
	await tmp.save();
	sendok(res, tmp);
}); 

router.get('/update/:aid/:shortName/:longName', async function (req, res, next) {
  setHeader(res);
	var {aid, shortName, longName } = req.params;

	// validate Area Id
	var areaRec = await Area.findOne({aid: aid});
	if (!areaRec) return senderr(res, 602, "Invalid Area aid"); 
	
	var oldShortName = areaRec.shortName;
	var newShortName = shortName.toUpperCase();

	// First check the new short name is already present
	
	if (oldShortName !== newShortName) {		
		// Check if already in user
		var tmp =  await Area.findOne({shortName: shortName});
		if (tmp) return senderr(res, 601, "Already in use");

		areaRec.shortName = shortName;
		
		// Check if Batch creates for this area. Then change the area code in batch id
		var oldRecs = await Batch.find({ bid: new RegExp('^' + oldShortName ) } );
		for (var i=0; i < oldRecs.length; ++i) {
			oldRecs[i].bid = oldRecs[i].bid.replace(oldShortName, newShortName);
			await oldRecs[i].save();
		}
		
		// Now if students have current batch of this area then replace it
		oldRecs = await Student.find({ bid: new RegExp('^' + oldShortName ) } );
		for (var i=0; i < oldRecs.length; ++i) {
			oldRecs[i].bid = oldRecs[i].bid.replace(oldShortName, newShortName);
			await oldRecs[i].save();
		}
		
		/*  === FACULTY record does not have batch code ===
		// Now if faculty have current batch of this area then replace it
		oldRecs = await Faculty.find({ bid: new RegExp('^' + oldShortName ) } );
		for (var i=0; i < oldRecs.length; ++i) {
			oldRecs[i].bid = oldRecs[i].bid.replace(oldShortName, newShortName);
			await oldRecs[i].save();
		}
		*/
		
		// Now if session have current batch of this area then replace it
		oldRecs = await Session.find({ bid: new RegExp('^' + oldShortName ) } );
		for (var i=0; i < oldRecs.length; ++i) {
			oldRecs[i].bid = oldRecs[i].bid.replace(oldShortName, newShortName);
			await oldRecs[i].save();
		}
		// Look okay. Now update it
	}
	// NOw update long name and save
	areaRec.longName = longName;
	await areaRec.save();
	sendok(res, areaRec);
}); 

 
router.get('/delete/:shortName', async function (req, res, next) {
  setHeader(res);
	var { shortName } = req.params;

	var oldShortName = shortName.toUpperCase();
	
	// Error if batch is using it
	var recCount = await Batch.countDocuments({ bid: new RegExp('^' + oldShortName ) } );	
	if (recCount > 0) return senderr(res, 601, "Already in use");
	
	// Now delete the unused area
	await Area.deleteOne( { shortName: oldShortName } );
	sendok(res, "deleted");
	
}); 

 
router.get('/list', async function (req, res, next) {
  // PrizeRes = res;
  setHeader(res);
	let allAreas = await Area.find({}).sort({shortName: 1});
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
