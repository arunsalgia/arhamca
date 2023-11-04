var router = express.Router();

const { 
	 getMaster, setMaster, getGroupCost,
} = require('./cricspecial'); 




router.use('/', function(req, res, next) {
  // WalletRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  next('route');
});


router.get('/getgroupcost', async function (req, res) {
  setHeader(res);
	
  let tmp = await getGroupCost();
  return sendok(res, {groupCost: tmp} );

});


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;
