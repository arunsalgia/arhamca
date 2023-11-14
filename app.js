express = require('express');
bodyParse = require('body-parser');
path = require('path');
cookieParser = require('cookie-parser');
logger = require('morgan');
mongoose = require("mongoose");
axios = require('axios');
cors = require('cors');
fetch = require('node-fetch');
_ = require("lodash");
cron = require('node-cron');
nodemailer = require('nodemailer');
crypto = require('crypto');
//Razorpay = require("razorpay");
//import {scheduledJobs} from 'node-schedule';
//nodeSched = require('node-schedule');
 
const { 
  akshuGetGroup, 
  akshuGetGroupMembers, akshuGetGroupUsers,
	GroupMemberCount,
  akshuGetAuction,
  getTournamentType,
} = require('./routes/cricspecial'); 

//arunSchedule=0;
SECONDS5=1;
MINUTES10=600;
//aruncron=SECONDS5;
SCHED_KEY="TIMER";

// currency global
CURRENCY_API_KEY = "hFjtXUX7htOY0XUoJ1wWMrDCZ8apBsYX"
LastReadName = "LASTREADTIME"
BASECURRENCY = "INR";
BASECOUNTRY = "India";
EXCHANGERATEPERCENTAGE = 0.97;
READEXCHANGERATETIME = 3*60*60;		// Read every 3 hours


app = express();
const { akshuDelGroup, akshuUpdGroupMember,
  getMaster, setMaster, 
} = require('./routes/cricspecial'); 

PRODUCTION=true;  
WEB=true; 
PASSWORDLINKVALIDTIME=10			// Password link valid time in minutes


//
if (PRODUCTION) {
  //PORT = process.env.PORT || 80;
  BASELINK='https://auctionpremierleague.herokuapp.com';
} else {
  //PORT = process.env.PORT || 4000;
  BASELINK='http://localhost:3000';
}
PORT = process.env.PORT || 4000;



http = require('http');
httpServer = http.createServer(app);
io = require('socket.io')(httpServer, {
  handlePreflightRequest: (req, res) => {
    const headers = {
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
      "Access-Control-Allow-Credentials": true
    };
    res.writeHead(200, headers);
    res.end();
  }

});

// Routers
router = express.Router();
indexRouter = require('./routes/index');
usersRouter = require('./routes/user');
areaRouter = require('./routes/area');
facultyRouter = require('./routes/faculty');
studentRouter = require('./routes/student');
batchRouter = require('./routes/batch');
sessionRouter = require('./routes/session');
paymentRouter = require('./routes/payment');
inquiryRouter = require('./routes/inquiry');

walletRouter = require('./routes/wallet');
masterRouter = require('./routes/master');
testRouter = require('./routes/test');


app.set('view engine', 'html');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'ACA', 'build')));
app.use(express.json());


app.use((req, res, next) => {
  if (req.url.includes("admin") || 
      req.url.includes("signIn") ||
      req.url.includes("Logout") ||
      req.url.includes("aplmaster")
    ){
    //req.url = "/";
    //res.redirect('/');
    console.log("Path is ", req.url);
    res.sendFile(path.resolve(__dirname, 'ACA', 'build', 'index.html'));
  }
  else {
    next();
  }
});

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/area', areaRouter);
app.use('/faculty', facultyRouter);
app.use('/student', studentRouter);
app.use('/batch', batchRouter);
app.use('/session', sessionRouter);
app.use('/payment', paymentRouter);
app.use('/inquiry', inquiryRouter);

app.use('/wallet', walletRouter);
app.use('/master', masterRouter);
app.use('/test', testRouter);


// ---- start of global
// connection string for database
mongoose_conn_string = "mongodb+srv://arhamchess89:wlFkiOYc0Uj5HFyI@cluster0.pe6ahb3.mongodb.net/ArhamChess";

//Schema
MasterSettingsSchema = mongoose.Schema ({
  msId: Number,
  msKey: String,
  msValue: String
  //trialExpiry: String,
})

UserSchema = mongoose.Schema({
  uid: Number,
  userName: String,
  displayName: String,
  password: String,
  enabled: Boolean,
  email: String,
  mobile: String,
	addr1: String,
	addr2: String,
	addr3: String,
	addr4: String,
  role: String
});
//UserSchema.index({uid: 1});

AreaSchema = mongoose.Schema({
  aid: Number,
  shortName: String,   // id proof as encrypted
  // bank details
  longName: String,    // will store <username>-<account number>-<ifsc>  (encrypted)
  // UPI details
  enabled: Boolean    // will store <username>-<account number>-<ifsc>  (encrypted)
});

FacultySchema = mongoose.Schema({
	sequence: Number,
  fid: String,
	name: String,
  uid: Number,
  batchCount: Number,
  enabled: Boolean
});

studentSchema = mongoose.Schema({
	sequence: Number,
  sid: String,
	name: String,
  uid: Number,			// User Id
	bid: String,			// Batch Id
	parentName: String,
	parentMobile: String,
  enabled: Boolean
});

batchSchema = mongoose.Schema({
	sequence: Number,
  bid: String,		// Batch code
	fid: String,		// Faculty of this batch
	facultyName: String, // Faculty name
	sid: [String],		// list of Id of students in batch
	studentNameList: [String],		// list of names of students in batch
	timings: [{day: String, hour: Number, minute: Number}],		// batch timings
	sessionCount: Number,	// # of sessions of this batch
	fees: Number, 	// Batch fees / batch / student
	sessionTime:	Number,			// This will be number of BLOCKS (15 Minute is 1 block. There are 96 blocks per hour. 0 BLock is from 12:00AM to 12:a5AM
	batchStatus: String,	// To be used for future
	creationDate: Date,
  enabled: Boolean	// Batch open (true) / closed false
});

sessionSchema = mongoose.Schema({
	sequence: Number,
	sessionNumber: Number,
  bid: String,		// Batch code
	fees: Number,		// Batch fees per session per student
	sessionDate: Date,
	fid: String,		// Faculty of this batch
	facultyName: String, // Faculty name
	sidList: [String],		// list of Id of students in batch
	studentNameList: [String],		// list of names of students in batch
	attendedSidList: [String],		// list of Id of students who attended the session
	attendedStudentNameList: [String],		// list of name of students who attended the session
	creationDate: Date,
  enabled: Boolean	// Batch open (true) / closed false
});

PaymentSchema = mongoose.Schema({
	sequence: Number,
	sessionNumber: Number,
  sid: String,		     // Student code
	studentName: String, // Faculty name
	amount: Number,		   // payment amount
	date: Date,
	mode: String,			  // payment mode Online, Net banking, cash etc.
	reference: String,  // payment Reference
	status: String,     // payment status Pending, reveived
	remarks: String,
	creationDate: Date,
  enabled: Boolean	// Batch open (true) / closed false
});

InquirySchema = mongoose.Schema({
	sequence: Number,
  //iid: Number,		// Inquiry code
	date: Date,			// inquiry date
	area:	String,		// Short area name 
	contactName: String,
  contactNumber: String,
	contactEmail: String,
	reference:  String,
	status: String,
	remarks: String,
	enabled: Boolean	// Batch open (true) / closed false
});
  
  

/*
UserKycSchema = mongoose.Schema({
  uid: Number,
  // ID details;
  idDetails: String,   // id proof as encrypted
  // bank details
  bankDetails: String,    // will store <username>-<account number>-<ifsc>  (encrypted)
  // UPI details
  upiDetails: String,    // will store <username>-<account number>-<ifsc>  (encrypted)
  // use kyc
  useUpi: Boolean,
  
});

ReferenceSchema = mongoose.Schema({
  date: Date,
  uid: Number,
  referenceUid: Number,
  scheme: String,				// NEWUSER
  pending: Boolean,			// true till recharge not done by uid2
  offer: Number,
  maxOffer: Number,

});

GuideSchema = mongoose.Schema({
  guideNumber: Number,
  guideTitle: String,
  guideText: String
});

IPLGroupSchema = mongoose.Schema({
  gid: Number,
  name: String,
  owner: Number,
  maxBidAmount: Number,
  tournament: String,
  auctionStatus: String,
  auctionPlayer: Number,
  auctionBid: Number,
  currentBidUid: Number,
  currentBidUser: String,
  memberCount: Number,
  memberFee: Number,
  prizeCount: Number,
  enable: Boolean,
	maxPlayers: Number
});
//IPLGroupSchema.index({gid: 1});

PlayerSchema = mongoose.Schema({
  pid: Number,
  cricPid: String,
  name: String,
  fullName: String,
  Team: String,
  role: String,
  bowlingStyle: String,
  battingStyle: String,
  tournament: String
});
//PlayerSchema.index({pid: 1});

SkippedPlayerSchema = mongoose.Schema({
  gid: Number,
  pid: Number,
  playerName: String,
  tournament: String
});

AuctionSchema = mongoose.Schema({
  gid: Number,
  uid: Number,
  pid: Number,
  cricPid: String,
  team: String,
	role: String,
  playerName: String,
  bidAmount: Number
});

GroupMemberSchema = mongoose.Schema({
  gid: Number,
  uid: Number,
  userName: String,
  balanceAmount: Number,        // balance available to be used for bid
  displayName: String,
  score: Number,
  rank: Number,
  prize: Number,
  enable: Boolean,
  // breakup of fees paid by user
  walletFee: Number,
  bonusFee: Number
});
//GroupMemberSchema.index({gid: 1, uid: 1});

CaptainSchema = mongoose.Schema({
  gid: Number,
  uid: Number,
  captain: Number,     // captain's player id 
  captainName: String,
  viceCaptain: Number,  // viceCaptain's players id
  viceCaptainName: String
});
//CaptainSchema.index({gid: 1, uid: 1});


TeamSchema = mongoose.Schema({
  name: String,
  fullname: String,
  tournament: String
})

TournamentSchema = mongoose.Schema({
  name: String,
  desc: String,
  type: String,
  started: Boolean,
  over: Boolean,
  cricTid: String,
  enabled: Boolean
})

*/

WalletSchema = mongoose.Schema({
  isWallet: Boolean,
  transNumber: Number,
  transDate: String,
  transType: String,
  transSubType: String,
  uid: Number,
  gid: Number,
  rank: Number,
  transLink: Number,
  amount: Number,
  transStatus: Boolean,
})

/*
AplSchema = mongoose.Schema({
  aplCode: Number,
  date: String,
  uid: Number,
  transType: String,
  message: String,
  email: String,
  status: String,
})

OfferSchema = mongoose.Schema({
	order: Number,
	header: String,
	message: String,
})


PrizeSchema = mongoose.Schema({
  prizeCount: Number,
  prize1: Number,
  prize2: Number,
  prize3: Number,
  prize4: Number,
  prize5: Number,
  prize6: Number,
  prize7: Number,
  prize8: Number,
  prize9: Number,
  prize10: Number,
});

StatSchema = mongoose.Schema({
  mid: Number,
  pid: Number,
  inning: Number,
  score: Number,
  playerName: String,
  // batting details
  run: Number,
  four: Number,
  six: Number,
  fifty: Number,
	run75: Number,
  hundred: Number,
	run150: Number,
	run200: Number,
  ballsPlayed: Number,
	strikeRateValue: Number,				// this is actual strike rate
	strikeRate: Number,							// this is bonus / penalty on strike rate
  // bowling details
  wicket: Number,
  wicket3: Number,
  wicket4: Number,
  wicket5: Number,
  hattrick: Number,
  maiden: Number,
  oversBowled: Number,
  maxTouramentRun: Number,
  maxTouramentWicket: Number,
  // fielding details
  runout: Number,
  stumped: Number,
  bowled: Number,
  lbw: Number,
  catch: Number,
	catch3: Number,
  duck: Number,
  economyValue: Number,  	// This is actual economy 
  economy: Number,				// This is bonus or penalty on economy
  // overall performance
  manOfTheMatch: Boolean
});

//--- data available from CRICAPI
CricapiMatchSchema = mongoose.Schema({
  mid: Number,
  cricMid: String,
  tournament: String,
  team1: String,
  team2: String,
  // team1Description:String,
  // team2Description:String,
  weekDay: String,
  type: String,
  matchStarted: Boolean,
  matchEnded: Boolean,
  matchStartTime: Date,
  matchEndTime: Date,
  squad: Boolean
})

BriefStatSchema = mongoose.Schema({
  sid: Number,    // 0 => data, 1 => maxRUn, 2 => maxWick
  pid: Number,
  inning: Number,
  score: Number,
  playerName: String,
  // batting details
  run: Number,
  four: Number,
  six: Number,
  fifty: Number,
	run75: Number,
  hundred: Number,
	run150: Number,
	run200: Number,
  ballsPlayed: Number,
	strikeRateValue: Number,				// this is actual strike rate
	strikeRate: Number,							// this is bonus / penalty on strike rate
  // bowling details
  wicket: Number,
  wicket3: Number,
  wicket4: Number,
  wicket5: Number,
  hattrick: Number,
  maiden: Number,
  oversBowled: Number,
  maxTouramentRun: Number,
  maxTouramentWicket: Number,
  // fielding details
  runout: Number,
  stumped: Number,
  bowled: Number,
  lbw: Number,
  catch: Number,
	catch3: Number,
  duck: Number,
  economyValue: Number,  	// This is actual economy 
  economy: Number,				// This is bonus or penalty on economy
  // overall performance
  manOfTheMatch: Number,
});  

*/


FirebaseSchema = mongoose.Schema({
	token: String,
	uid: Number,
	device: String,
	context: String,
	enabled: Boolean
});

IdSchema = mongoose.Schema({
		key: String,
	  name: String,
	  pid: Number,
		type: String
	});
	
CurrencySchema = mongoose.Schema({
  name: String,
  country: String,
  rate: Number,
  enable: Boolean
});


ProductSchema = mongoose.Schema({
  name: String,
  type: String,           // APK or EXE
  text: String,           // to store what is new
  version: String,        // <major version>.<minor version>.<patch number>
  versionNumber: Number,  // <major version> * 10000 + <minor Version>*100 + <patch number>
  image: { data: Buffer, contentType: String }
})



// models
User = mongoose.model("users", UserSchema);
Area = mongoose.model("areas", AreaSchema);
Faculty = mongoose.model("facultys", FacultySchema);
Student = mongoose.model("students", studentSchema);
Batch   = mongoose.model("batchs", batchSchema);
Session   = mongoose.model("sessions", sessionSchema);
Payment   = mongoose.model("payments", PaymentSchema);
Inquiry   = mongoose.model("inquirys", InquirySchema);


//Guide = mongoose.model("guide", GuideSchema);
//Player = mongoose.model("iplplayers", PlayerSchema);
//Auction = mongoose.model("iplauction", AuctionSchema);
//IPLGroup = mongoose.model("iplgroups", IPLGroupSchema);
//GroupMember = mongoose.model("groupmembers", GroupMemberSchema);
//Captain = mongoose.model("iplcaptains", CaptainSchema);
//Team = mongoose.model("iplteams", TeamSchema);
// Match = mongoose.model("iplmatches", MatchSchema);
//Stat = mongoose.model("iplplayerstats", StatSchema);
//Tournament = mongoose.model("tournaments", TournamentSchema);
MasterData = mongoose.model("MasterSettings", MasterSettingsSchema)
//SkippedPlayer = mongoose.model("skippedplayers", SkippedPlayerSchema)
//CricapiMatch = mongoose.model("cricApiMatch", CricapiMatchSchema)
Wallet = mongoose.model('wallet', WalletSchema);
//Prize = mongoose.model('prize', PrizeSchema);
//Apl = mongoose.model('aplinfo', AplSchema);
//UserKyc = mongoose.model('userkyc', UserKycSchema);
//Reference = mongoose.model('reference', ReferenceSchema);
//Firebase = mongoose.model('firebase', FirebaseSchema);
//Offer = mongoose.model('offer', OfferSchema);
//IdInfo = mongoose.model("idinfo", IdSchema);
Currency = mongoose.model('currency', CurrencySchema); 
//Product = mongoose.model("productImage", ProductSchema);

router = express.Router();

db_connection = false;      // status of mongoose connection
connectRequest = true;

// constant used by routers
minutesIST = 330;    // IST time zone in minutes 330 i.e. GMT+5:30
minutesDay = 1440;   // minutes in a day 24*60 = 1440
MONTHNAME = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
weekDays = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
weekShortDays = new Array("Sun", "Mon", "Tue", "Wedn", "Thu", "Fri", "Sat");
// IPL_Start_Date = new Date("2020-09-19");   // IPL Starts on this date

// Error messages
DBERROR = 990;
DBFETCHERR = 991;
CRICFETCHERR = 992;
ERR_NODB = "No connection to CricDream database";


// Wallet 
// WalletStatus = {success: "success", failed: "success"};
WalletTransType = {
  accountOpen: "accountOpen",
  refill: "refill",
  withdrawl: "withdrawal",
  offer: "offer",
  bonus: "bonus",
  prize: "prize",
  groupJoin: "groupJoin",
  groupCancel: "groupCancel",
  feeChange: "feeChange",
  pending: "pending",			// refund pending
  refundDone: "refundOk",
};

BonusTransType = {
  accountOpen: "registerBonus",
  refill: "refillBonus",
	referral: "referralBonus",
  //withdrawal: "withdrawal",
  offer: "offerBonus",
  bonus: "bonus",
  //prize: "prize",
  groupJoin: "groupJoinBonus",
  groupCancel: "groupCancelBonus",
  //feeChange: "feeChange",
  //pending: "pending",			// refund pending
  //refundDone: "refundOk",
};




// make mongoose connection

// Create the database connection 
//mongoose.connect(mongoose_conn_string);
if (WEB) {
	mongoose.connect(mongoose_conn_string, { useNewUrlParser: true, useUnifiedTopology: true });
} else {
	db_connection = true;
  connectRequest = true;
}
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + mongoose_conn_string);
  db_connection = true;
  connectRequest = true;
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error');
  console.log(err);
  db_connection = false;
  connectRequest = false;   // connect request refused
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
  db_connection = false;
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
  // close mongoose connection
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
  });
  process.exit(0);
});

// schedule task
if (WEB) {
  cron.schedule('*/15 * * * * *', () => {
    // console.log('running every 15 second');
    // console.log(`db_connection: ${db_connection}    connectREquest: ${connectRequest}`);
    if (!connectRequest)
      mongoose.connect(mongoose_conn_string, { useNewUrlParser: true, useUnifiedTopology: true });
  });
}


// start app to listen on specified port
httpServer.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});


// global functions

const AMPM = [
  "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM",
  "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM"
];
  /**
 * @param {Date} d The date
 */
const TZ_IST={hours: 5, minutes: 30};



USERTYPE = { TRIAL: 0, SUPERUSER: 1, PAID: 2}
userAlive = async function (uRec) {
  let sts = false;
  if (uRec) {
    switch (uRec.userPlan) {
      case USERTYPE.SUPERUSER:
        sts = true;
      break;
      case  USERTYPE.PAID:
        sts = true;
      break;
      case  USERTYPE.TRIAL:
        let expiryDate = getMaster("EXPIRYDATE");
        if (expiryDate === "") expiryDate = "2021-04-30"

        let cTime = new Date();
        let tTime = new Date(expiryDate);
        sts =  (tTime.getTime() > cTime.getTime());
      break;
    }
  }
  return sts;
}

// TRIAL user is to be conisered as normal user
userAlive = async function (uRec) {
  let sts = false;
  if (uRec) {
    switch (uRec.userPlan) {
      case USERTYPE.SUPERUSER:
        sts = true;
      break;
      case  USERTYPE.TRIAL:
      case  USERTYPE.PAID:
        sts = true;
      break;
      // case  USERTYPE.TRIAL:
      //   let expiryDate = getMaster("EXPIRYDATE");
      //   if (expiryDate === "") expiryDate = "2021-04-30"

      //   let cTime = new Date();
      //   let tTime = new Date(expiryDate);
      //   sts =  (tTime.getTime() > cTime.getTime());
      // break;
    }
  }
  return sts;
}


EMAILERROR="";
APLEMAILID='cricketpwd@gmail.com';
discarded_sendEmailToUser = async function(userEmailId, userSubject, userText) {
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: APLEMAILID,
    pass: 'Anob@1989#93'
  }
  });
  
  var mailOptions = {
  from: APLEMAILID,
  to: userEmailId,
  subject: userSubject,
  text: userText
  };
  
  //mailOptions.to = uRec.email;
  //mailOptions.text = 
  
  var status = true;
  try {
    await transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(`Unable to send email to ${transporter.auth.user} and ${transporter.auth.pass}`);
        console.log(error);
        EMAILERROR=error;
        //senderr(603, error);
        status=false;
      } 
    });
  } catch (e) {
    console.log("in CATCH");
    console.log(e);
  }
  return(status);
}

//------------- wallet function


getPrizeTable = async function (count, amount) {
  let tmp = await getMaster("PRIZEPORTION");
  let ourPortion = (tmp !== "") ? parseInt(tmp) : 100;
	//console.log(ourPortion);
	
  let myPrize = await Prize.findOne({prizeCount: count})
  // we will keep 5% of amount
  // rest (i.e. 95%) will be distributed among users
  let totPrize = Math.floor(amount*ourPortion/100);
  let allotPrize = 0;
  let prizeTable=[]
  for(i=1; i<count; ++i) {
    let thisPrize = Math.floor(totPrize*myPrize["prize"+i.toString()]/100);
    prizeTable.push({rank: i, prize: thisPrize})
    allotPrize += thisPrize;
  }
  prizeTable.push({rank: count, prize: totPrize-allotPrize});
  return prizeTable;
}

// module.exports = app;

function startSchedule() {
setTimeout(() => processSocketData(), 2000);   
}



getTournameDetails = async function (igroup) {
  var retVal = "";
  try {
    // g_groupRec = await IPLGroup.findOne({gid: igroup});
    g_groupRec = await akshuGetGroup(igroup);
    g_tournamentStat = mongoose.model(g_groupRec.tournament+BRIEFSUFFIX, BriefStatSchema);
    retVal = g_groupRec.tournament
  } catch (err) {
    g_tournamentStat = null;
    console.log(err);
  }
  return(retVal);
}


/// Constants
ROLE_FACULTY = "Faculty";
ROLE_STUDENT = "Student";
ROLE_MANAGER = "Manager";
ROLE_ADMIN   = "Admin";

SHORTWEEKSTR = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


PREFIX_AREA_LEN = 3
PREFIX_FACULTY = "F";
PREFIX_STUDENT = "S";

BLOCK_DAY_LIST = [
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

BLOCKWEEKLIST = [
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	],
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	],
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	],
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	],
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	],
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	],
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]	
];

BLOCKWEEKSTRLIST = [
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
["", "", "", "", "", "", ""],
];

JUNKED_BLOCKWEEKSTRLIST = [
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	],
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	],
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	],
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	],
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	],
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	],
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	]	
];

MINUTES_IN_HOUR = 60;
BLOCK_PER_HOUR = 2;
BLOCK_IN_MINUTES = 30;				// Block of 30 minutes
BLOCK_START	= 18;					// Starting of 9AM
BLOCK_END = 42;						// Ending at 9PM.
Z5 = "00000";

SEQUENCE_CURRENT = 9999999;
SEQUENCE_START   = 1;