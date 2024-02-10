const {
	encrypt, decrypt, dbencrypt, dbdecrypt, dbToSvrText, 
  svrToDbText, getLoginName, getDisplayName, 
	sendCricMail, sendCricHtmlMail,
  getMaster, setMaster,
} = require('./cricspecial'); 


function timeToBlock(hr, min) {
	//console.log(hr, MINUTES_IN_HOUR, min, BLOCK_IN_MINUTES);
	var blk = (hr*MINUTES_IN_HOUR + min) / BLOCK_IN_MINUTES;
	//console.log(hr, min, blk);
	return blk;
}

function blockToTime(blk) {
	var hr = Math.floor(blk / BLOCK_PER_HOUR);
	var mn = (blk % BLOCK_PER_HOUR) * BLOCK_IN_MINUTES;
	return ({hour: hr, minute: mn});
}

function getWeeklyBlock(allBatches) {

	//var facultyBlockList = [].concat(BLOCKWEEKSTRLIST);
	
	var facultyBlockList = [];
	for (var i=0; i<48; ++i) {
		facultyBlockList.push(Array(7).fill(""));
	}
	
	//console.log(facultyBlockList.length);
	//console.log("totla batches: ", allBatches.length);
	allBatches.forEach( (dayBatch) => {
		//console.log(dayBatch.sessionTime);
		dayBatch.timings.forEach( (sess) => {
			//console.log(sess.day, sess.hour, sess.minute);
			var dayIndex = SHORTWEEKSTR.indexOf(sess.day);
			var startBlock = timeToBlock(sess.hour, sess.minute);
			//console.log(dayIndex, startBlock);
			for(var i=0; i < dayBatch.sessionTime; ++i) {
				//console.log(dayIndex, startBlock + i, dayBatch.bid);
				facultyBlockList[startBlock + i][dayIndex] = dayBatch.bid;
			}
		});
	});

	return facultyBlockList;
}


async function addNewUser(uName, uPassword, uRole, uEmail, mobileNumber, addr1, addr2, addr3, addr4) {
	var retstatus = {status: 0, userRec: null};
	
  var lname = getLoginName(uName);
  var dname = getDisplayName(uName);

	//console.log("mail",uEmail);
  var dbEmail = svrToDbText(uEmail);
  var dbPassword = svrToDbText(uPassword);

  let uuu = await User.findOne({userName: lname });
  if (uuu) { retstatus.status = 601;  return retstatus; }
	
	// if email not blank then check for duplicate
	if ((uEmail !== "cd") && (uRole !== ROLE_STUDENT)) {
		uuu = await User.findOne({ email: dbEmail });
		if (uuu) { retstatus.status = 602;  return retstatus; }
	}

  uRec = await User.find().limit(1).sort({ "uid": -1 });
  var user1 = new User({
      uid: uRec[0].uid + 1,
      userName: lname,
      displayName: dname,
      password: dbPassword,
      enabled: true,
      email: dbEmail,
      role: uRole,
			addr1: addr1,
			addr2: addr2,
			addr3: addr3,
			addr4: addr4,
			mobile: mobileNumber
    });
  await user1.save();
	
	user1.password = uPassword;
	user1.email = uEmail;	
	retstatus.userRec = user1;
	
  return(retstatus);
} 

// uUid/:uName/:uPassword/:uRole/:uEmail/:mobileNumber/:addr1/:addr2/:addr3/:addr4

async function updateUser(uUid, uName, uPassword, uRole, uEmail, mobileNumber, addr1, addr2, addr3, addr4) {
	var retstatus = {status: 0, userRec: null};
	
		// validate UID
  let userRec = await User.findOne({uid: uUid });
	if (!userRec) { retstatus.status = 603;   return retstatus; }
	
	// if user name already used up
  var lname = getLoginName(uName);
	var uuu;
	
	// check duplicate user name
	if (userRec.userName !== lname) {
		uuu = await User.findOne({ userName: lname });	
		if (uuu) { retstatus.status = 601;   return retstatus; }
	}
	
	// check duplicate email id
	var dbEmail = svrToDbText(uEmail);
	//console.log(uEmail);
	//console.log(dbEmail);
	//console.log(userRec.email);
	if (userRec.email !== dbEmail) {
		uuu = await User.findOne({ email: dbEmail });
		if (uuu) { retstatus.status = 602;   return retstatus; }
	}
	
	// All Ok.
	userRec.userName = lname;
	userRec.displayName = getDisplayName(uName);
	userRec.password = svrToDbText(uPassword);
	userRec.email = dbEmail;
	userRec.mobile = mobileNumber;
	userRec.addr1 = addr1;
	userRec.addr2 = addr2;
	userRec.addr3 = addr3;
	userRec.addr4 = addr4;
	//console.log(userRec);
	//console.log(addr1, addr2, addr3, addr4);
  await userRec.save();
	
	userRec.password = uPassword;
	userRec.email = uEmail;
	
	retstatus.userRec = userRec;
  return(retstatus);
} 



async function getNewFacultyCode() {
	lastRec = await Faculty.find({}).limit(1).sort({ "fid": -1 });
	//console.log(lastRec.length);
	//console.log("Number is ", lastRec[0].fid.slice(-5));
	var facultyNumber = ((	lastRec.length > 0 ) ? Number(lastRec[0].fid.slice(-5)) + 1 : 1).toString();
	//console.log(facultyNumber.length);
	//console.log(facultyNumber)
	return PREFIX_FACULTY + Z5.slice(0, 5-facultyNumber.length) + facultyNumber;
}


async function getNewSudentCode() {
	lastRec = await Student.find({}).limit(1).sort({ "sid": -1 });
	//console.log(lastRec[0]);
	//console.log("Number is ", lastRec[0].sid.slice(-5));
	var studentNumber = ((	lastRec.length > 0 ) ? Number(lastRec[0].sid.slice(-5)) + 1 : 1).toString();
	//console.log(studentNumber.length);
	//console.log(studentNumber)
	return PREFIX_STUDENT + Z5.slice(0, 5-studentNumber.length) + studentNumber;
}

async function getNewBatchCode(area) {
	lastRec = await Batch.find({bid: new RegExp('^' + area ) }).limit(1).sort({ "bid": -1 });
	//console.log(lastRec);
	//console.log("Number is ", lastRec[0].bid.slice(-5));
	var batchNumber = ((	lastRec.length > 0 ) ? Number(lastRec[0].bid.slice(-5)) + 1 : 1).toString();
	//console.log(batchNumber.length);
	//console.log(batchNumber)
	return area + Z5.slice(0, 5-batchNumber.length) + batchNumber;
}

async function getFacultyHours(facultyCode) {
	//console.log(facultyCode);
	/*var facultyHours = await Batch.aggregate(
		[ 
			{ $match: { fid: facultyCode, enabled: true } },
			{
			"$group" : { 
				"_id"   : "$fid" ,
				sessionHours: { $sum: "$sessionTime" }
			}
			}
		]
	);*/
	var facultyBlocks = await Batch.aggregate(
		[ 
			{ $match: { fid: facultyCode, enabled: true } },
			{
			"$group" : { 
				"_id"   : "$fid" ,
				sessionHours: { $sum: { $multiply: [ {$size: "$timings" }, "$sessionTime" ] } }
			}
			}
		]
	);
	
	var totalFacultyHours = facultyBlocks[0].sessionHours / BLOCK_PER_HOUR;
	//console.log(totalFacultyHours);
	
	return totalFacultyHours
}

module.exports = {
	// user functions
  addNewUser, updateUser,
	// Faculty funcrion
	getNewFacultyCode, getFacultyHours,
	// Student functions
	getNewSudentCode,
	// Batch functions
	getNewBatchCode,
	// time function
	timeToBlock, blockToTime, getWeeklyBlock,
}; 
