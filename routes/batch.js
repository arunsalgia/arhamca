router = express.Router();


const { 
	encrypt, decrypt, dbencrypt, dbdecrypt, dbToSvrText, 
  svrToDbText, getLoginName, getDisplayName, 
  getMaster, setMaster,
} = require('./cricspecial'); 

const { 
	addNewUser, updateUser,
	getNewSudentCode,
	timeToBlock, blockToTime, getWeeklyBlock
} = require('./functions'); 


router.get('/list/all', async function (req, res, next) {
  setHeader(res);
 
	var allRecs = await Batch.find({}).sort({creationDate: -1});
  sendok(res, allRecs ); 
})


router.get('/list/disabled', async function (req, res, next) {
  setHeader(res);
 
	var allRecs = await Batch.find({enabled: false}).sort({creationDate: -1});
  sendok(res, allRecs ); 
})

router.get('/list/enabled', async function (req, res, next) {
  setHeader(res);
 
	var allRecs = await Batch.find({enabled: true}).sort({creationDate: -1});
  sendok(res, allRecs ); 
})


router.get('/add/:uName/:uPassword/:uEmail/:mobileNumber/:addr1/:addr2/:addr3/:addr4/:parName/:parMobile', async function (req, res, next) {
  setHeader(res);
  var {uName, uPassword, uEmail, mobileNumber, addr1, addr2, addr3, addr4, parName, parMobile } = req.params;

	// first it as a user
	var myStatus = await addNewUser(uName, uPassword, ROLE_STUDENT, uEmail, mobileNumber, addr1, addr2, addr3, addr4);
	//console.log(myStatus);
	if (myStatus.status != 0)
		return senderr(res, myStatus.status, "Error");
	
	// user added. Now get Facilty id and add new fac
	var sid = await getNewSudentCode();

	var studentRec = new Student({
		sid: sid,
		name: myStatus.userRec.displayName,
		uid: myStatus.userRec.uid,
		bid: "",				// Batch id is blank for unassigned
		parentName: getDisplayName(parName),
		parentMobile: parMobile,
		enabled: true,   
	});
	console.log(studentRec);
  await studentRec.save();

  sendok(res, studentRec ); 
})

router.get('/update/:usid/:uName/:uPassword/:uEmail/:mobileNumber/:addr1/:addr2/:addr3/:addr4/:parName/:parMobile', async function (req, res, next) {
  setHeader(res);
  var { usid, uName, uPassword, uEmail, mobileNumber, addr1, addr2, addr3, addr4, parName, parMobile } = req.params;

	var studentRec = await Student.findOne({sid: usid});
	
	// first it as a user
	var myStatus = await updateUser(studentRec.uid, uName, uPassword, ROLE_STUDENT, uEmail, mobileNumber, addr1, addr2, addr3, addr4);
	//console.log(myStatus);
	if (myStatus.status != 0)
		return senderr(res, myStatus.status, "Error");
	
	// user added. Now update 
	studentRec.name = myStatus.userRec.displayName;
	studentRec.parentName = getDisplayName(parName);
	studentRec.parentMobile = parMobile;
  await studentRec.save();
	
  sendok(res, studentRec ); 
})


router.get('/disabled/:sid', async function (req, res, next) {
  setHeader(res);
  var {sid } = req.params;

	studentRec = await Student.findOne({sid: sid});
	if (!studentRec) return senderr(res, 601, "Invalid SID");
	
	// if student assign a batch then error
	if (studentRec.bid != "") return senderr(res, 602, "Student batch in progress");
	
	studentRec.enabled = false;
	studentRec.save();
	
	userRec = await User.findOne({uid: studentRec.uid});
	userRec.enabled = false;
	userRec.save();
	
  sendok(res, "Done" ); 
})

router.get('/enabled/:sid', async function (req, res, next) {
  setHeader(res);
  var {sid } = req.params;

	studentRec = await Student.findOne({sid: sid});
	if (!studentRec) return senderr(res, 601, "Invalid SID");
	
	studentRec.enabled = true;
	studentRec.bid = "";
	
	studentRec.save();
	
	userRec = await User.findOne({uid: studentRec.uid});
	userRec.enabled = true;
	userRec.save();
	
  sendok(res, "Done" ); 
})


router.get('/getfaculyblock/:fid', async function (req, res, next) {
  setHeader(res);
  
	var { fid } = req.params;
	
	var allBatches = await Batch.find({fid: fid});
	console.log(allBatches);
	
	var facultyBlockList = getWeeklyBlock(allBatches);
	
  sendok(res, facultyBlockList ); 
})



function sendok(res, usrmgs) { res.send(usrmgs); }
function senderr(res, errcode, errmsg) { res.status(errcode).send({error: errmsg}); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  _group = defaultGroup;
  _tournament = defaultTournament;
}
module.exports = router;
