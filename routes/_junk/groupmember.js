router = express.Router();
router = express.Router();
const { 
  akshuGetGroup, akshuUpdGroup, akshuGetGroupMembers,
} = require('./cricspecial'); 


router.use('/', function(req, res, next) {
  // AuctionRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  next('route');
});


// get users belonging to group "mygroup"
router.get('/allmember/:mygroup', async function (req, res, next) {
  // CricRes = res;
  setHeader(res);

  var { mygroup } = req.params;
  if (isNaN(mygroup)) { senderr(res, 601, `Invalid group number ${mygroup}`); return; }
  showGroupMembers(res, parseInt(mygroup));
});

function sendok(res, usrmgs) { res.send(usrmgs); }
function senderr(res, errcode, errmsg) { res.status(errcode).send({error: errmsg}); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  _group = defaultGroup;
  _tournament = defaultTournament;
}
module.exports = router;

async function showGroupMembers(res, groupno) {
  gmlist = await akshuGetGroupMembers(groupno);
  if (gmlist.length > 0)
    gmlist = _.map(gmlist, o => _.pick(o, ['gid', 'uid', 'userName', 'displayName']));
  gmlist = _.sortBy(gmlist, 'displayName')
  sendok(res, gmlist);
}
