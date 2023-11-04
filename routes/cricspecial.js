const algorithm = 'aes-256-ctr';
const akshusecretKey = 'TihomHahs@UhskaHahs#19941995Bona';
const ankitsecretKey = 'Tikna@Itark#1989#1993Bonaventure';
const iv = '05bd9fbf50b124cd2bad8f31ca1e9ca4';           //crypto.randomBytes(16);



const FeeDetails = [
  {amount: 500, bonusPercent: 5},
  {amount: 400, bonusPercent: 5},
  {amount: 300, bonusPercent: 5},
  {amount: 200, bonusPercent: 5},
  {amount: 100, bonusPercent: 5},
  {amount: 0,   bonusPercent: 0}
];
  
const BonusDetails = [
  {amount: 500, bonusPercent: 5},
  {amount: 400, bonusPercent: 5},
  {amount: 300, bonusPercent: 5},
  {amount: 200, bonusPercent: 5},
  {amount: 100, bonusPercent: 5},
  {amount: 0,   bonusPercent: 0}
];

//zTvzr3p67VC61jmV54rIYu1545x4TlY
let debugTest = true;
// for sending email
const send = require('gmail-send')();

var mailOptions =  {
  user: 'cricketpwd@gmail.com',
  pass: 'cwezdlvmqqbegugi',
  to:   '', 
  subject: '',
	//text: '',
  //html: ''
}


var arun_user={};
var arun_group={};
var arun_groupMember={};
var arun_auction={};
var arun_tournament={};
var arun_master=[];

function nnn(sss) {
  let num = 0;
  // console.log("String os ", sss);
  if (sss)
  if (sss.length > 0)
    num = parseInt(sss);
  // console.log("number is ", num);
  return num;
}


const encrypt = (text) => {

    //console.log(`Text is ${text}`);
    const cipher = crypto.createCipheriv(algorithm, akshusecretKey, Buffer.from(iv, 'hex'));	
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    //myIv = iv.toString('hex');

    return encrypted.toString('hex');
};

const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, akshusecretKey, Buffer.from(iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

const dbencrypt = (text) => {

    //console.log(`Text is ${text}`);
    const cipher = crypto.createCipheriv(algorithm, ankitsecretKey, Buffer.from(iv, 'hex'));
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    //myIv = iv.toString('hex');

    return encrypted.toString('hex');
};

const dbdecrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, ankitsecretKey, Buffer.from(iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

const getLoginName = (name) => {
    return name.toLowerCase().replace(/\s/g, "");
  }
  
const getDisplayName = (name) => {
		var ret = "";
		var repat = false;
    var xxx = name.split(" ");
    xxx.forEach( x => { 
			console.log(x);
      x = x.trim()
			if (repat) { 
				ret = ret + " "; 	
			}
			else
				repat = true; 
			ret = ret + x.substr(0,1).toUpperCase();
			if ((x.length > 1))
				ret = ret + x.substr(1, x.length-1).toLowerCase();
    });
		console.log(ret);
    return ret;		//xxx.join(" ");
  }

const svrToDbText = (text) => {
	// first decrypt text sent by server
    let xxx = decrypt(text);
		// now encrypt this for database
		xxx = dbencrypt(xxx);
    return xxx;
  }

const dbToSvrText = (text) => {
		console.log(text);
		// first decrypt text of database
    let xxx = dbdecrypt(text);
		console.log(xxx);
		// now encrypt this for server
		xxx = encrypt(xxx);
		console.log(xxx);
    return xxx;
  }

async function nommalPasswordsendCricMail (dest, mailSubject, mailText) {

  //console.log(`Destination is ${dest}`);
  var transporter = nodemailer.createTransport({
    service: 'gmail',
	  port: 587,
	  secure: false, // true for 465, false for other ports
    auth: {
      user: APLEMAILID,
      pass: 'Anob@1989#93'
    }
  });

  var mailOptions = {
    from: APLEMAILID,
    to: '',
    subject: '',
    text: ''
  };

  //console.log("About to start");
  mailOptions.to = dest;
  mailOptions.subject = mailSubject;
  mailOptions.text = mailText;

  //console.log(mailOptions.to);
  //console.log(mailOptions.subject);
  //console.log(mailOptions.text.length);
  //console.log(`About to send email`);
  try {
    let response = await transporter.sendMail(mailOptions);
    //console.log(response);
    return ({status: true, error: 'Email Successfully sent'});
  } catch (e) {
    console.log("error sending email");
    console.log(e);
    return ({status: false, error: 'error sending Email'});
  }
  // how to handle error. don't know may be use try/catch 
  /***
  transporter.sendMail(mailOptions, function(error, info){
	console.log('insertBefore');
    if (error) {
      console.log(error);
	  return ({status: false, error: error});
      //senderr(603, error);
    } else {
      console.log('Email sent: ' + info.response);
	  return ({status: true, error: info.response});
      //sendok('Email sent: ' + info.response);
    }
  });
  console.log('udi baba'); 
  ***/
}  

async function sendCricMail (dest, mailSubject, mailText) {

  // setup to, subject and text
  mailOptions.to = dest;
  mailOptions.subject = mailSubject;
  mailOptions.text = mailText;

	console.log(mailText);
	console.log(mailOptions.text);
  try {
    const res = await send(mailOptions);
    return {status: true, error: 'Email Successfully sent'};
  } catch (e) {
    console.log(e);
    return {status: false, error: 'error sending Email'}; 
  }
} 


async function sendCricHtmlMail (dest, mailSubject, mailText) {

  // setup to, subject and text
  mailOptions.to = dest;
  mailOptions.subject = mailSubject;
  mailOptions.html = mailText;

  try {
    const res = await send(mailOptions);
    return {status: true, error: 'Email Successfully sent'};
  } catch (e) {
    console.log(e);
    return {status: false, error: 'error sending Email'}; 
  }
} 

async function GroupMemberCount(groupid) {
  let memberCount = 0;
  let xxx = await GroupMember.aggregate([
    {$match: {gid: parseInt(groupid)}},
    {$group : {_id : "$gid", num_members : {$sum : 1}}}
  ]);
  if (xxx.length === 1) memberCount = xxx[0].num_members;
  return(memberCount);
}

/** calculate #time refill done by user till now **/
async function rechargeCount(userid) {
  let value = 0;
  let xxx = await Wallet.aggregate([
    {$match: {uid: parseInt(userid), isWallet: true, transType: WalletTransType.refill}},
    {$group : {_id : "$uid", count : {$sum : 1}}}
  ]);
  if (xxx.length === 1) value = xxx[0].count;
  return(value);
}

async function akshuGetUser(uid) {
  // let suid = uid.toString();
  let retUser = arun_user[uid];
  if (retUser) return retUser;

  if (debugTest) console.log(`read user ${uid} from database`);

  retUser = await User.findOne({uid: uid});
  if (retUser)
    arun_user[uid] = retUser;  // buffer this data
  return(retUser);
} 

function akshuUpdUser(userRec) {
  arun_user[userRec.uid] = userRec;
} 

// will buffer only enabled group
async function akshuGetGroup(gid) {
  let retGroup = arun_group[gid];
  if (retGroup) return retGroup;

  if (debugTest) console.log(`Read group ${gid} from database`);

  retGroup = await IPLGroup.findOne({gid: gid, enable: true});
  if (retGroup)
    arun_group[gid] = retGroup;
  return(retGroup);
} 


async function akshuGetGroupMembers(gid) {
  // let x = Object.keys(arun_groupMember);
  // console.log(x);

  let retGroupMember = arun_groupMember[gid];
  if (retGroupMember) {
    return retGroupMember;
  } 

  if (debugTest) console.log(`Read group members of Group ${gid} from database`);
  let myGroup = await akshuGetGroup(gid);
  if (!myGroup) return [];

  retGroupMember = await GroupMember.find({gid: gid});
  if (retGroupMember.length === myGroup.memberCount) {
    // only if all members joined, buffer this for future reference
    // console.log("buffering");
    arun_groupMember[gid] = retGroupMember;
  }
  return(retGroupMember);
} 

async function akshuGetGroupUsers(gid) {
	let retUserMembers = [];

	let myGroupMembers = await akshuGetGroupMembers(gid)
	for(gm=0; gm < myGroupMembers.length; ++gm) {
		let tmp = await akshuGetUser(myGroupMembers[gm].uid);
		if (tmp) retUserMembers.push(tmp);
	}
  return retUserMembers;
} 

function akshuUpdGroup(groupRec) {
  if (groupRec.enable)
    arun_group[groupRec.gid] = groupRec;
} 

// delete the entry of this group from buffer
function akshuDelGroup(groupRec) {
  delete arun_group[groupRec.gid];
  return;
} 



function akshuUpdGroupMember(gmRec) {
  let x = arun_groupMember[gmRec.gid];
  if (x) {
    let tmp = _.filter(x, u => u.uid !== gmRec.uid);
    tmp.push(gmRec);
    arun_groupMember[gmRec.gid] = tmp;
    // console.log(arun_groupMember);
  } 
}

async function akshuGetAuction(gid) {
  // let x = Object.keys(arun_auction);
  // console.log(x);

  let retVal = arun_auction[gid];
  if (retVal) return retVal;

  // not in buffer 
  
  if (debugTest) console.log(`Read Auction of Group ${gid} from database`);
  
  let myGroup = await akshuGetGroup(gid);
  if (!myGroup) return [];
  
  retVal = await Auction.find({gid: gid});
  if (myGroup.auctionStatus === "OVER")  {
    // console.log("buffering");
    arun_auction[gid] = retVal;
  } 
  return(retVal);
} 


async function akshuGetTournament(gid) {
  let retVal = arun_tournament[gid];
  if (retVal) return retVal;
  
  if (debugTest) console.log(`Read Tournament of group ${gid} from database`);
  let myGroup = await akshuGetGroup(gid);
  if (!myGroup)  return;
	//console.log(myGroup.tournament);

  retVal = await Tournament.findOne({name: myGroup.tournament})
	//console.log(retVal);
	
  if (retVal)
    arun_tournament[gid] = retVal;
  return(retVal);
} 

async function getTournamentType(myGid) {
  // let xxx = await IPLGroup.findOne({gid: myGid});
	// let tRec = await Tournament.findOne({name: xxx.tournament});
	// let tmp = tRec.type;
	// return(tmp);
  let tType = "";
  let myTournament = await akshuGetTournament(myGid);
  if (myTournament) tType = myTournament.type;
  return tType;
}

async function getMaster(key) {
  let retVal =  arun_master.find(x => x.msKey === key);
  if (!retVal) {
    retVal = await MasterData.findOne({msKey: key});
    if (retVal) arun_master.push(retVal);
  }
  console.log(retVal.msValue);
  return (retVal) ? retVal.msValue : "";
}

async function setMaster(key, value) {
  let retVal =  arun_master.find(x => x.msKey === key);
  if (!retVal) {
    retVal = new MasterData();
    retVal.msKey = key;
    retVal.msValue = value;
    arun_master.push(retVal);
  } else {
    retVal.msValue = value;
  }
  await retVal.save();
  return
}


  
function calculateBonus(refillAmount) {
  let bonusAmount = 0;
  for(let i=0; i<BonusDetails.length; ++i) {
    if (refillAmount >= BonusDetails[i].amount) {
      bonusAmount = Math.floor(refillAmount * BonusDetails[i].bonusPercent/100.0);
      break;
    } 
  }
  // console.log(bonusAmount);
  return bonusAmount;
}

// break up of group fee from wallet and bonus
function feeBreakup(memberfee) {
  // console.log(memberfee);
  let bonusAmount = 0;
  for(let i=0; i<FeeDetails.length; ++i) {
    if (memberfee >= FeeDetails[i].amount) {
      bonusAmount = Math.floor(memberfee * FeeDetails[i].bonusPercent/100.0);
      break;
    } 
  }
  // console.log(bonusAmount);
  return {wallet: (memberfee-bonusAmount), bonus: bonusAmount};
}

async function getUserBalance(userid) {
  let tmp = {wallet: 0, bonus: 0};
  let myUid = Number(userid);

  let xxx = await Wallet.aggregate([
    {$match: {uid: myUid, isWallet: true}},
    {$group : {_id : "$uid", balance : {$sum : "$amount"}}}
  ]);
  if (xxx.length === 1) tmp.wallet = xxx[0].balance;

	/***
  xxx = await Wallet.aggregate([
    {$match: {uid: myUid, isWallet: false}},
    {$group : {_id : "$uid", balance : {$sum : "$amount"}}}
  ]);
  if (xxx.length === 1) tmp.bonus = xxx[0].balance;
  ***/
	tmp.bonus = 0;
	
  return tmp;
}

var groupCost = -1;
async function getGroupCost() {
	if (groupCost <= 0) {
		let tmp = await getMaster("GROUPCOST");
		groupCost = parseInt(tmp)
	}
	return groupCost;
}


function addToInAuctionPage(gid, uid) {
  let newCount = 0;
  let tmp = inAuctionPage.find(x => x.gid === gid);
  if (tmp) {
    if (!tmp.uids.includes(uid))
      tmp.uids.push(uid);
    newCount = tmp.uids.length;
  } else {
    // 1st member of group to enter auction page
    inAuctionPage.push({gid: gid, uids: [uid] });
    newCount = 1;
  }
  console.log(newCount);
  return newCount;
}

const delFromInAuctionPage = (gid, uid) => {
let newCount = 0;
  let tmp = inAuctionPage.find(x => x.gid === gid);
  if (tmp) {
    tmp.uids = tmp.uids.filter(x => x != uid);
    newCount = tmp.uids.length;
  } 
  console.log(newCount);
  return newCount;
}

const countInAuctionPage = (gid) => {
let newCount = 0;
  let tmp = inAuctionPage.find(x => x.gid === gid);
  if (tmp) newCount = tmp.uids.length; 
  console.log(newCount);
  return newCount;
}

const initInAuctionPage = (gid) => {
let newCount = 0;
  let tmp = inAuctionPage.find(x => x.gid === gid);
  if (tmp) tmp.uids = [];
  inAuctionPage.push({gid: gid, uids: []})
  console.log(newCount);  
  return newCount;
}

function getVersionNumber(verStr) {
  let myNumber = 0;
  let tmp = verStr.split(".");
  // console.log("Tmp length ", tmp.length);
	
  /*** if (tmp.length ===  3) {
    let num1 = nnn(tmp[0]);
    let num2 = nnn(tmp[1]);
    let num3 = nnn(tmp[2]);
    // console.log("Indi version ", num1, num2,  num3);
    myNumber = num1 * 10000 + num2 * 100 + num3;
  }***/
	let num1 = nnn(tmp[0]);
	myNumber = num1;
	num1 = (tmp.length > 1) ? nnn(tmp[1]) : 0;
	myNumber = (myNumber * 100) + num1;
	num1 = (tmp.length > 2) ? nnn(tmp[2]) : 0;
	myNumber = (myNumber * 100) + num1;
	
  return myNumber;
}

module.exports = {
  getLoginName, getDisplayName,
  encrypt, decrypt, dbencrypt, dbdecrypt,
  dbToSvrText, svrToDbText,
  GroupMemberCount,
  sendCricMail, sendCricHtmlMail,
  // master
  getMaster, setMaster,
  // get
  akshuGetUser,
  akshuGetGroup, akshuGetGroupMembers, akshuGetGroupUsers,
  akshuGetAuction,
  akshuGetTournament, getTournamentType,
  // update
  akshuUpdUser,
  akshuUpdGroup, akshuUpdGroupMember,
  // delete
  akshuDelGroup,
  feeBreakup, getUserBalance,
  calculateBonus,
	rechargeCount,
	getGroupCost,
  addToInAuctionPage, delFromInAuctionPage,
  countInAuctionPage, initInAuctionPage,
  getVersionNumber,
}; 
