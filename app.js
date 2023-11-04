express = require('express');
bodyParse = require('body-parser');
path = require('path');
cookieParser = require('cookie-parser');
logger = require('morgan');
mongoose = require("mongoose");
cors = require('cors');
fetch = require('node-fetch');
_ = require("lodash");
cron = require('node-cron');
nodemailer = require('nodemailer');
crypto = require('crypto');
Razorpay = require("razorpay");
axios = require('axios');
//import {scheduledJobs} from 'node-schedule';
nodeSched = require('node-schedule');
 
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

SPECIAL_TOURNAMENT = "";

//  cc301267-8a6c-4840-87ff-b7c43ce10bc4

//nextScheduleTime =  new Date();
//nextScheduleTime.setSeconds(nextScheduleTime.getSeconds()+arunSchedule);
//console.log(nextScheduleTime);

RAZOR_API_KEY="rzp_test_7Jy768RzohwoHJ";
RAZOR_AUTH_KEY="foqgh11SiDs3fHd5VaDOOC91";
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


auctionRouter = require('./routes/auction');
playersRouter = require('./routes/player');
groupRouter = require('./routes/group');
groupMemberRouter = require('./routes/groupmember');
teamRouter = require('./routes/team');
statRouter = require('./routes/playerstat');
matchRouter = require('./routes/match');
tournamentRouter = require('./routes/tournament');
walletRouter = require('./routes/wallet');
prizeRouter = require('./routes/prize');
aplRouter = require('./routes/apl');
kycRouter = require('./routes/kyc');
razorRouter = require('./routes/razor');
masterRouter = require('./routes/master');
testRouter = require('./routes/test');

// maintaining list of all active client connection
connectionArray  = [];
masterConnectionArray  = [];
clientData = [];
score ={};

CLIENTUPDATEINTERVAL = 1;
CRICUPDATEINTERVAL = 1;    // in seconds. Interval after seconds fetch cricket match data from cricapi
cricTimer = 0;
clientUpdateCount=0;

CRICDBCLEANUPINTERVAL = 15;
dbcleanupCount = 0;
// maintain list of running matches
runningMatchArray = [];
runningScoreArray = [];
clentData = [];
auctioData = [];

inAuctionPage = [];

 
io.on('connect', socket => {
  app.set("socket",socket);
  socket.on("page", (pageMessage) => {
  //console.log("page message from "+socket.id);
	//console.log(masterConnectionArray);
	//console.log(socket.id);
  //console.log(pageMessage);
  var myClient = _.find(masterConnectionArray, x => x.socketId === socket.id);
	// console.log(myClient);
	if (myClient) {
    //console.log("In connection");
		if (pageMessage.page.toUpperCase().includes("DASH")) {
		  myClient.page = "DASH";
		  myClient.gid = parseInt(pageMessage.gid);
		  myClient.uid = parseInt(pageMessage.uid);
      myClient.userName = pageMessage.userName;
		  myClient.firstTime = true;
		  clientUpdateCount = CLIENTUPDATEINTERVAL+1;
		} else if (pageMessage.page.toUpperCase().includes("STAT")) {
		  myClient.page = "STAT";
		  myClient.gid = parseInt(pageMessage.gid);
		  myClient.uid = parseInt(pageMessage.uid);
      myCkient.userName = pageMessage.userName;
		  myClient.firstTime = true;
		  clientUpdateCount = CLIENTUPDATEINTERVAL+1;
		} else if (pageMessage.page.toUpperCase().includes("AUCT")) {
		  myClient.page = "AUCT";
		  myClient.gid = parseInt(pageMessage.gid);
		  myClient.uid = parseInt(pageMessage.uid);
      myClient.userName = pageMessage.userName;
      myClient.interested = pageMessage.interested;
		  myClient.firstTime = true;
		  clientUpdateCount = CLIENTUPDATEINTERVAL+1;
		}
	}
  });
});

io.sockets.on('connection', function(socket){
  // console.log("Connected Socket = " + socket.id)
  masterConnectionArray.push({socketId: socket.id, page: "", gid: 0, uid: 0, userName: "", interested: true});
  //console.log("New connection");
  //updateSchedule(masterConnectionArray.length);

  if (masterConnectionArray.length == 1) startSchedule();

  socket.on('disconnect', function(){
    _.remove(masterConnectionArray, {socketId: socket.id});
    //console.log("Gone connection");
    //updateSchedule(masterConnectionArray.length);  
    //startSchedule();
  });
});

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



app.use('/player', playersRouter);
app.use('/auction', auctionRouter);
app.use('/group', groupRouter);
app.use('/groupmember', groupMemberRouter);
app.use('/team', teamRouter);
app.use('/stat', statRouter);
app.use('/match', matchRouter);
app.use('/tournament', tournamentRouter);
app.use('/wallet', walletRouter);
app.use('/prize', prizeRouter);
app.use('/apl', aplRouter);
app.use('/kyc', kycRouter);
app.use('/razor', razorRouter);
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
  fid: String,
	name: String,
  uid: Number,
  batchCount: Number,
  enabled: Boolean
});

studentSchema = mongoose.Schema({
  sid: String,
	name: String,
  uid: Number,			// User Id
	bid: String,			// Batch Id
	parentName: String,
	parentMobile: String,
  enabled: Boolean
});

batchSchema = mongoose.Schema({
  bid: String,		// Batch code
	fid: String,		// Faculty of this batch
	sid: [String],		// list of Id of students in batch
	timings: [{day: String, hour: Number, minute: Number}],		// batch timings
	sessionCount: Number,	// # of sessions of this batch
	fees: Number, 	// Batch fees / batch / student
	sessionTime:	Number,			// This will be number of BLOCKS (15 Minute is 1 block. There are 96 blocks per hour. 0 BLock is from 12:00AM to 12:a5AM
	batchStatus: String,	// To be used for future
	creationDate: Date,
  enabled: Boolean	// Batch open (true) / closed false
});


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
// USE CRICMATCHSCHEMA since match details will be imported from CRICAPI 
// Avoid createing match database
// MatchSchema = mongoose.Schema({
//   mid: Number,
//   description: String,
//   team1: String,
//   team2: String,
//   team1Desciption: String,
//   team2Desciption: String,
//   matchTime: Date,
//   weekDay: String
// });
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

PaymentSchema = mongoose.Schema({
  cid: Number,
  email: String,
  amount: Number,
  status: String,
  requestId: String,
  requestTime: Date,
  paymentId: String,
  paymentTime: Date,
  fee: Number,
});

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


// table name will be <tournament Name>_brief r.g. IPL2020_brief
BRIEFSUFFIX = "_brief";
RUNNINGMATCH=1;
PROCESSOVER=0;
AUCT_RUNNING="RUNNING";
AUCT_PENING="PENDING"; 
AUCT_OEVR="OVER";

// models
User = mongoose.model("users", UserSchema);
Area = mongoose.model("areas", AreaSchema);
Faculty = mongoose.model("facultys", FacultySchema);
Student = mongoose.model("students", studentSchema);
Batch   = mongoose.model("batchs", batchSchema);


Guide = mongoose.model("guide", GuideSchema);
Player = mongoose.model("iplplayers", PlayerSchema);
Auction = mongoose.model("iplauction", AuctionSchema);
IPLGroup = mongoose.model("iplgroups", IPLGroupSchema);
GroupMember = mongoose.model("groupmembers", GroupMemberSchema);
Captain = mongoose.model("iplcaptains", CaptainSchema);
Team = mongoose.model("iplteams", TeamSchema);
// Match = mongoose.model("iplmatches", MatchSchema);
Stat = mongoose.model("iplplayerstats", StatSchema);
Tournament = mongoose.model("tournaments", TournamentSchema);
MasterData = mongoose.model("MasterSettings", MasterSettingsSchema)
SkippedPlayer = mongoose.model("skippedplayers", SkippedPlayerSchema)
CricapiMatch = mongoose.model("cricApiMatch", CricapiMatchSchema)
Wallet = mongoose.model('wallet', WalletSchema);
Prize = mongoose.model('prize', PrizeSchema);
Apl = mongoose.model('aplinfo', AplSchema);
Payment = mongoose.model('payment', PaymentSchema);
UserKyc = mongoose.model('userkyc', UserKycSchema);
Reference = mongoose.model('reference', ReferenceSchema);
Firebase = mongoose.model('firebase', FirebaseSchema);
Offer = mongoose.model('offer', OfferSchema);
IdInfo = mongoose.model("idinfo", IdSchema);
Currency = mongoose.model('currency', CurrencySchema); 
Product = mongoose.model("productImage", ProductSchema);


nextMatchFetchTime = new Date();
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

// if match type not provided by cric api and
// team1/team2 both contains any of these string then
// set match type as T20  (used in playerstat)
IPLSPECIAL = ["MUMBAI", "HYDERABAD", "CHENNAI", "RAJASTHAN",
 "KOLKATA", "BANGALORE", "DELHI", "PUNJAB",
 "VELOCITY", "SUPERNOVAS", "TRAILBLAZERS"
];

SENDRES = 1;        // send OK response
SENDSOCKET = 2;     // send data on socket

// Error messages
DBERROR = 990;
DBFETCHERR = 991;
CRICFETCHERR = 992;
ERR_NODB = "No connection to CricDream database";

// Bid amount given to user when he/she joins group 1
GROUP1_MAXBALANCE = 1000;
allUSER = 99999999;

// Number of hours after which match details to be read frpom cricapi.
MATCHREADINTERVAL = 3;

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

// match id for record which has bonus score for  Maximum Run and Maximum Wicket
// Note that it has be be set -ve
MaxRunMid = -1;
MaxWicketMid = -2;

defaultGroup = 1;
defaultTournament = "IPL2020";
forceGroupInfo = false;
defaultMaxPlayerCount = 15;

// Point scoring
ViceCaptain_MultiplyingFactor = 1.5;
Captain_MultiplyingFactor = 2;

BonusRun = {"TEST": 1, "ODI": 1, "T20": 1};  //1;
Bonus4 = {"TEST": 1, "ODI": 1, "T20": 1};  //1;
Bonus6 = {"TEST": 2, "ODI": 2, "T20": 2};  //2;

BonusRunRange = [
	{ matchType: "T20", 
		range: [
			{ runs: 150, points: 100,  field: "run150" },
			{ runs: 100, points: 50,   field: "hundred" },
			{ runs: 50,  points: 20,   field: "fifty" }
		]
	},
	{ matchType: "ODI", 
		range: [
			{ runs: 200, points: 100,  field: "run200"  },
			{ runs: 100, points: 50,   field: "hundred"  },
			{ runs: 75,  points: 20,   field: "75" },
			{ runs: 50,  points: 10,   field: "fifty" },
		]
	}
];

Bonus50 = {"TEST": 10, "ODI": 20, "T20": 20};  //20;
Bonus100 = {"TEST": 50, "ODI": 50, "T20": 50};  //50;
Bonus200 = {"TEST": 100, "ODI": 100, "T20": 100};  //50;

BonusStrikeRate = {"TEST": 0, "ODI": 1, "T20": 1};
MinBallsPlayed = {"TEST": 1000000.0, "ODI": 20, "T20": 10};  //2.0;
BonusStrikeRateRange = [
	{ matchType: "T20", 
		range: [
			{ strikeRate: 200, points: 6},
			{ strikeRate: 170, points: 4},
			{ strikeRate: 150, points: 2},
			{ strikeRate: 100, points: 0},
			{ strikeRate: 90,  points: -2},
			{ strikeRate: 80,  points: -4},
			{ strikeRate:  0,  points: -6}
		]
	},
	{ matchType: "ODI", 
		range: [
			{ strikeRate: 150, points: 6},
			{ strikeRate: 120, points: 4},
			{ strikeRate: 100, points: 2},
			{ strikeRate: 70,  points: 0},
			{ strikeRate: 50,  points: -2},
			{ strikeRate: 30,  points: -4},
			{ strikeRate:  0,  points: -6}
		]
	}
];

BonusWkt = {"TEST": 25, "ODI": 25, "T20": 25};  //25;
BonusMaiden = {"TEST": 0, "ODI": 10, "T20": 20};  //20;
BonusHattrick = {"TEST": 100, "ODI": 100, "T20": 100};  // if hat-trick, the bonus of 3 wkt and 5 wkt

//BonusWkt3 = {"TEST": 20, "ODI": 20, "T20": 20};  //20;
//BonusWkt4 = {"TEST": 20, "ODI": 20, "T20": 20};  //20;
//BonusWkt5 = {"TEST": 50, "ODI": 50, "T20": 50};  //50;
//Wicket3 = {"TEST": 4, "ODI": 4, "T20": 3}
//Wicket5 = {"TEST": 5, "ODI": 5, "T20": 5}

BonusWicketRange = [
	{ matchType: "T20", 
		range: [
			{ wickets: 5, points: 50,  field: "wicket5" },
			{ wickets: 3, points: 20,  field: "wicket3" }
		]
	},
	{ matchType: "ODI", 
		range: [
			{ wickets: 5, points: 50,  field: "wicket5" },
			{ wickets: 4, points: 20,  field: "wicket4" },
			{ wickets: 3, points: 10,  field: "wicket3" }
		]
	}
];

BonusDuck = {"TEST": -10, "ODI": -10, "T20": -10};  //-5;
BonusNoWkt = {"TEST": 0, "ODI": 0, "T20": 0};  //0;
BonusMOM = {"TEST": 20, "ODI": 20, "T20": 20};  //20;

BonusEconomy = {"TEST": 0, "ODI": 1, "T20": 1};  //2;
MinOvers = {"TEST": 1000000.0, "ODI": 4.0, "T20": 2.0};  //2.0;
BonusEconomyRange = [
	{ matchType: "T20", 
		range: [
			{ economyValue: 5, points: 6},
			{ economyValue: 6, points: 4},
			{ economyValue: 7, points: 2},
			{ economyValue: 9, points: 0},
			{ economyValue: 19,  points: -2},
			{ economyValue: 12,  points: -4},
			{ economyValue: 10000000000,  points: -6}
		]
	},
	{ matchType: "ODI", 
		range: [
			{ economyValue: 3, points: 6},
			{ economyValue: 4, points: 4},
			{ economyValue: 5, points: 2},
			{ economyValue: 6,  points: 0},
			{ economyValue: 7,  points: -2},
			{ economyValue: 8,  points: -4},
			{ economyValue:  10000000000,  points: -6}
		]
	}
];


BonusCatch = {"TEST": 4, "ODI": 4, "T20": 4};  //4;
BonusCatch3 = {"TEST": 8, "ODI": 8, "T20": 8};  //4;

BonusRunOut = {"TEST": 4, "ODI": 4, "T20": 4};  //4;
BonusStumped = {"TEST": 6, "ODI": 6, "T20": 6};  //6;

BonusMaxRun = {"TEST": 100, "ODI": 100, "T20": 100};  //100;
BonusMaxWicket = {"TEST": 100, "ODI": 100, "T20": 100};  //100;

// variables required by timer
sendDashboard = false;
sendMyStat = false;
myStatGroup = [];
myDashboardGroup = [];
serverTimer = 0;

// time interval for scheduler
serverUpdateInterval = 10; // in seconds. INterval after which data to be updated to server

// ----------------  end of global

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
cricDate = function (d)  {
  var xxx = new Date(d.getTime());
  xxx.setHours(xxx.getHours()+TZ_IST.hours);
  xxx.setMinutes(xxx.getMinutes()+TZ_IST.minutes);
  var myHour = xxx.getHours();
  var myampm = AMPM[myHour];
  if (myHour > 12) myHour -= 12;
  var tmp = `${MONTHNAME[xxx.getMonth()]} ${("0" + xxx.getDate()).slice(-2)} ${("0" + myHour).slice(-2)}:${("0" +  xxx.getMinutes()).slice(-2)}${myampm}`
  return tmp;
}

const notToConvert = ['XI', 'ARUN']
/**
 * @param {string} t The date
 */

cricTeamName = function (t)  {
  var tmp = t.split(' ');
  for(i=0; i < tmp.length; ++i)  {
    var x = tmp[i].trim().toUpperCase();
    if (notToConvert.includes(x))
      tmp[i] = x;
    else
      tmp[i] = x.substr(0, 1) + x.substr(1, x.length - 1).toLowerCase();
  }
  return tmp.join(' ');
}



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

refundGroupFee = async function(groupid, amount) {
  let allMembers = await GroupMember.find({gid: groupid});
  for(gm of allMembers) {
    await WalletAccountGroupCancel(gm.gid, gm.uid, gm.walletFee, gm.bonusFee)
  };
}

doDisableAndRefund = async function(g) {
  // console.log(`Disable group ${g.gid}`)
  let memberCount = await GroupMemberCount(g.gid);
  // let groupRec = await IPLGroup.findOne({gid: g.gid});
  if (memberCount !== g.memberCount) {
    g.enable = false;
    g.save();
    akshuDelGroup(g);

    // refund wallet amount since group is disabled.
    await refundGroupFee(g.gid, g.memberFee);
    console.log(`Refund compeletd fpr group ${g.gid}`)
  }
}

disableIncompleteGroup = async function(tournamentName) {
  // this will disable all groups in which reqiured numbers of members
  // have not joined. Remember to refund the member fee amount to their wallet
  allGroups = await IPLGroup.find({tournament: tournamentName, enable: true});
  // console.log("----in Disable");
  // console.log(allGroups);
  for(const g of allGroups ) {
    console.log(`Group is ${g.gid} to be DISABLED-------------------------`)
    await doDisableAndRefund(g);
  };
}



// set tournament Started
updateTournamentStarted = async function (tournamentName) {
  // console.log("in update tournament started")
  let tRec = await Tournament.findOne({name: tournamentName, started: false});
  if (tRec) {
    // disable group for which required number of members have not been formed.
    tRec.started = true;
    tRec.save();
    await disableIncompleteGroup(tournamentName);
  }
};


// set tournament Over
updateTournamentOver = async function (tournamentName) {
  let tRec = await Tournament.findOne({name: tournamentName});
  if (!tRec.over) {
    tRec.over = true;
    tRec.save();
  } 
};




getBlankStatRecord = function(tournamentStat) {
  return new tournamentStat( {
    mid: 0,
    pid: 0,
    score: 0,
    inning: 0,
    playerName: "",
  // batting details
    run: 0,
    four: 0,
    six: 0,
    fifty: 0,
    hundred:  0,
		run75: 0,
		run150: 0,
		run200: 0,
    ballsPlayed: 0,
		strikeRate: 0,
    // bowling details
    wicket: 0,
    wicket3: 0,
    wicket4: 0,
    wicket5: 0,
    hattrick: 0,
    maiden: 0,
    oversBowled: 0,
    // fielding details
    runout: 0,
    stumped: 0,
    bowled: 0,
    lbw: 0,
    catch: 0,
		catch3: 0,
    duck: 0,
    economy: 0,
    // overall performance
    maxTouramentRun: 0,
    maxTouramentWicket: 0,
    manOfTheMatch: false
  });
}

getBlankBriefRecord = function(tournamentStat) {
  let tmp = new tournamentStat( {
    sid: RUNNINGMATCH,
    pid: 0,
    playerName: "",
    score: 0,
    inning: 0,
  // batting details
    run: 0,
    four: 0,
    six: 0,
    fifty: 0,
    hundred:  0,
		run75: 0,
		run150: 0,
		run200: 0,
    ballsPlayed: 0,
		strikeRate: 0,
    // bowling details
    wicket: 0,
    wicket3: 0,
    wicket4: 0,
    wicket5: 0,
    hattrick: 0,
    maiden: 0,
    oversBowled: 0,
    // fielding details
    runout: 0,
    stumped: 0,
    bowled: 0,
    lbw: 0,
    catch: 0,
    catch3: 0,
    duck: 0,
    economy: 0,
    // overall performance
    manOfTheMatch: 0,
    maxTouramentRun: 0,
    maxTouramentWicket: 0,
  });
  // console.log(tmp);
  return(tmp);
}

awardRankPrize = async function(tournamentName) {
  let allGroups = await IPLGroup.find({tournament: tournamentName, enable: true});
  // allGroups.forEach(g => {
  for(const g of allGroups) {
    let prizeTable = await getPrizeTable(g.prizeCount, g.memberCount*g.memberFee);
		//console.log("mytable", prizeTable);
		
    let allgmRec = await GroupMember.find({gid: g.gid});
    // allgmRec.forEach(gmRec => {
    for (const gmRec of allgmRec) {
      if (gmRec.rank === 0) continue;
      if (gmRec.rank > g.prizeCount) continue;
      
      if (gmRec.rank <= g.prizeCount) {
        gmRec.prize = prizeTable[gmRec.rank-1].prize;
        await WalletPrize(gmRec.gid, gmRec.uid, gmRec.rank, prizeTable[gmRec.rank-1].prize)
				//console.log(gmRec);
        gmRec.save();
				akshuUpdGroupMember(gmRec);
      } 
    }
  }
}


updateTournamentMaxRunWicket = async function(tournamentName) {
  //--- start
  // ------------ Assuming tournament as over
  let tournamentStat = mongoose.model(tournamentName, StatSchema);
  let BriefStat = mongoose.model(tournamentName+BRIEFSUFFIX, BriefStatSchema);

  let tdata = await BriefStat.find({});
  let tmp = _.filter(tdata, x => x.sid === MaxRunMid);
  if (tmp.length > 0) return true;    // max run already assigned. Assuming same done for max wicket

  tmp = _.filter(tdata, x => x.sid == MaxWicketMid);
  if (tmp.length > 0) return true;

  let pidList = _.map(tdata, 'pid');
  pidList = _.uniqBy(pidList);

  // calculate total runs and total wickets of each player (played in tournament matches)
  let sumList = [];
  pidList.forEach( mypid => {
    tmp = _.filter(tdata, x => x.pid === mypid);
    if (tmp.length > 0) {
      var iRun = _.sumBy(tmp, 'run');
      var iWicket = _.sumBy(tmp, 'wicket');
      sumList.push({pid: mypid, playerName: tmp[0].playerName, totalRun: iRun, totalWicket: iWicket});
    }
  });

  // now get list of players who have score max runs (note there can be more than 1)
  tmp = _.maxBy(sumList, x => x.totalRun);
  //console.log(tmp);
  let maxList = _.filter(sumList, x => x.totalRun == tmp.totalRun);
  let bonusAmount  = BonusMaxRun["TEST"] / maxList.length;
  maxList.forEach( mmm => {
    let myrec = getBlankStatRecord(tournamentStat);
    myrec.mid = MaxRunMid;
    myrec.pid = mmm.pid;
    myrec.playerName = mmm.playerName;
    myrec.score = bonusAmount;
    myrec.maxTouramentRun = mmm.totalRun;  
    myrec.save(); 

    let mybrief = getBlankBriefRecord(BriefStat);
    mybrief.sid = MaxRunMid;
    mybrief.pid = mmm.pid;
    mybrief.playerName = mmm.playerName;
    mybrief.score = bonusAmount;
    mybrief.maxTouramentRun = mmm.totalRun;  
    mybrief.save(); 
  });

  // now get list of players who have taken max wickets (note there can be more than 1)
  tmp = _.maxBy(sumList, x => x.totalWicket);
  //console.log(tmp);
  maxList = _.filter(sumList, x => x.totalWicket == tmp.totalWicket);
  bonusAmount  = BonusMaxWicket["TEST"] / maxList.length;
  maxList.forEach( mmm => {
    let myrec = getBlankStatRecord(tournamentStat);
    myrec.mid = MaxWicketMid;
    myrec.pid = mmm.pid;
    myrec.playerName = mmm.playerName;
    myrec.score = bonusAmount;
    myrec.maxTouramentWicket = mmm.totalWicket;
    myrec.save(); 

    let mybrief = getBlankBriefRecord(BriefStat);
    mybrief.sid = MaxWicketMid;
    mybrief.pid = mmm.pid;
    mybrief.playerName = mmm.playerName;
    mybrief.score = bonusAmount;
    mybrief.maxTouramentWicket = mmm.totalWicket;  
    mybrief.save(); 
  });

  // all done
  return true;
}



updatePendingBrief = async function (mytournament) {
  // get match if the matches that are completed in this tournament
  let ttt = mytournament.toUpperCase();
  let completedMatchList = await CricapiMatch.find({tournament: ttt, matchEnded: true});
  if (completedMatchList.length <= 0) return;
  let midList = _.map(completedMatchList, 'mid');

  // get gets record in brief table which are not yet merge
  let BriefStat = mongoose.model(mytournament+BRIEFSUFFIX, BriefStatSchema);
  var briefList = await BriefStat.find({ sid: { $in: midList } });
  // console.log(briefList);
  if (briefList.length === 0) return;
  console.log("Pending procesing started");
  // some pending reocrd to be update
  sidList = _.map(briefList, 'sid');
  sidList = _.uniq(sidList);
  console.log(sidList);
  // console.log( `Completed match is ${PROCESSOVER}`)
  let masterList = await BriefStat.find({ sid: PROCESSOVER });
  console.log(`Compltetd: ${masterList.length}    Pedning: ${briefList.length}`);
  for(sidx=0; sidx < sidList.length; ++sidx) {
    let myList = _.filter(briefList, x => x.sid === sidList[sidx]);
    for(i=0; i<myList.length; ++i) {
      var myMasterRec = _.find(masterList, x => x.pid === myList[i].pid);
      if (!myMasterRec) {
        myMasterRec = new getBlankBriefRecord(BriefStat);
        myMasterRec.sid = PROCESSOVER;
        myMasterRec.pid = myList[i].pid;
        myMasterRec.playerName = myList[i].playerName;
        masterList.push(myMasterRec);
      }
      myMasterRec.score += myList[i].score;
      myMasterRec.inning += myList[i].inning;
      // batting details
      myMasterRec.run += myList[i].run;
      myMasterRec.four += myList[i].four;
      myMasterRec.six += myList[i].six;
      myMasterRec.fifty += myList[i].fifty;
      myMasterRec.hundred += myList[i].hundred;
      myMasterRec.ballsPlayed += myList[i].ballsPlayed;
      myMasterRec.strikeRate += myList[i].strikeRate;
      // bowling details
      myMasterRec.wicket += myList[i].wicket;
      myMasterRec.wicket3 += myList[i].wicket3;
      myMasterRec.wicket5 + myList[i].wicket5;
      myMasterRec.hattrick += myList[i].hattrick;
      myMasterRec.maiden += myList[i].maiden;
      // console.log(`${myMasterRec.pid} ${myMasterRec.playerName} ${myMasterRec.oversBowled}   ${myList[i].oversBowled}`);
      myMasterRec.oversBowled += myList[i].oversBowled
      // fielding details
      // runout: 0,
      // stumped: 0,
      // bowled: 0,
      // lbw: 0,
      // catch: 0,
      myMasterRec.runout += myList[i].runout;
      myMasterRec.stumped += myList[i].stumped;
      myMasterRec.bowled += myList[i].bowled;
      myMasterRec.lbw += myList[i].lbw;
      myMasterRec.catch += myList[i].catch;
      myMasterRec.catch3 += myList[i].catch3;
      myMasterRec.duck += myList[i].duck;
      myMasterRec.economy += myList[i].economy;
      // overall performance
      myMasterRec.manOfTheMatch += myList[i].manOfTheMatch;
      myMasterRec.maxTouramentRun += myList[i].maxTouramentRun;
      myMasterRec.maxTouramentWicket += myList[i].maxTouramentWicket;
    }
    console.log(`Now deleting recrods with sid ${sidList[sidx]}`)
    await BriefStat.deleteMany({sid: sidList[sidx]})
  }
  masterList.forEach(x => {
    x.save();
  })
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

createWalletTransaction = function () {
  myTrans = new Wallet();
  myTrans.isWallet = true;
  currTime = new Date();
  // Tue Dec 08 2020 14:22:21 GMT+0530 (India Standard Time)"
  myTrans.transNumber = currTime.getTime();
  let tmp = currTime.toString();
  let xxx = tmp.split(' ');
  myTrans.transDate = `${xxx[2]}-${xxx[1]}-${xxx[3]} ${xxx[4]}`;  
  myTrans.transType = "";
  myTrans.transSubType = "";
  myTrans.uid = 0;
  myTrans.gid = 0;
  myTrans.rank = 0;
  myTrans.transLink = 0;
  myTrans.amount = 0;
  myTrans.transStatus = true;
  return (myTrans);
}

WalletAccountOpen = async function (userid, openamount) {
  // console.log(`Account open for user ${userid} for amount ${openamount}`)
  
  let myTrans = createWalletTransaction();
  myTrans.isWallet = false;
  myTrans.transType = BonusTransType.accountOpen;
  myTrans.uid = userid;
  myTrans.amount = openamount;
  if (openamount !== 0) await myTrans.save();
  // console.log(myTrans);
  return myTrans;
}

WalletFeeChange = async function (userid, groupid, amount) {
  // console.log(`Account open for user ${userid} for amount ${openamount}`)
  let myTrans = createWalletTransaction();
  myTrans.transType = WalletTransType.feeChange;
  myTrans.uid = userid;
  myTrans.gid = groupid;
  myTrans.amount = amount;
  if (amount !== 0) await myTrans.save();
  // console.log(myTrans);
  return myTrans;
}

WalletAccountOffer = async function (userid, offeramount) {
  let myTrans = createWalletTransaction();
  myTrans.isWallet = false;
  myTrans.transType = WalletTransType.offer;
  myTrans.uid = userid;
  myTrans.amount = offeramount;
  await myTrans.save();
  return myTrans;
}

WalletPrize = async function (groupid, userid, rank, prizeAmount) {
  let myTrans = createWalletTransaction();
  myTrans.transType = WalletTransType.prize;
  myTrans.uid = userid;
  myTrans.gid = groupid;
  myTrans.rank = rank;
  myTrans.amount = prizeAmount;
	// JAN23 Do not save it in the database. Currently prize is not given
  // await myTrans.save();
  return myTrans;
}

//  = async function (userid, openamount) {
//   let myTrans = createWalletTransaction();
//   myTrans.transType = WalletTransType.offer;
//   myTrans.uid = userid;
//   myTrans.amount = openamount;
//   await myTrans.save();
//   return myTransWalletAccountOpen;
// }

WalletAccountWithdrawl = async function (userid, amount) {
  // console.log(`Account open for user ${userid} for amount ${openamount}`)
  let myTrans = createWalletTransaction();
  myTrans.transType = WalletTransType.pending;
  myTrans.uid = userid;
  myTrans.amount = amount;
  await myTrans.save();
  // console.log(myTrans);
  return myTrans;
}



WalletAccountGroupJoin = async function (groupid, userid, walletFee, bonusFee) {
  let myTrans;
  
  if (walletFee > 0) {
    myTrans = createWalletTransaction();
    myTrans.isWallet = true;
    myTrans.transType = WalletTransType.groupJoin;
    myTrans.gid = groupid;
    myTrans.uid = userid;
    myTrans.amount = -walletFee;
    await myTrans.save();
  }

  if (bonusFee > 0) {
    myTrans = createWalletTransaction();
    myTrans.isWallet = false;
    myTrans.transType = BonusTransType.groupJoin;
    myTrans.gid = groupid;
    myTrans.uid = userid;
    myTrans.amount = -bonusFee;
    await myTrans.save();
  }

  return myTrans;
}

WalletAccountGroupCancel = async function (groupid, userid, walletFee, bonusFee) {

  let myTrans;

  if (walletFee > 0) {
    myTrans = createWalletTransaction();
    myTrans.isWallet = true;
    myTrans.transType = WalletTransType.groupCancel;
    myTrans.uid = userid;
    myTrans.gid = groupid;
    myTrans.amount = walletFee;
    await myTrans.save();
  }

  if (bonusFee > 0) {
    myTrans = createWalletTransaction();
    myTrans.isWallet = false;
    myTrans.transType = BonusTransType.groupCancel;
    myTrans.uid = userid;
    myTrans.gid = groupid;
    myTrans.amount = bonusFee;
    await myTrans.save();
  }

  return myTrans;
}



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


var inProcessSocket = false;

async function processSocketData() {
  if (inProcessSocket) return;
  inProcessSocket = true;
  ++clientUpdateCount;
  if (!db_connection) {
    return;
  }
	

  let T1 = new Date();
  if (false) {
    if (cricTimer >= CRICUPDATEINTERVAL) {
      try {
        clearRunningClientData();
        cricTimer = 0;
        if (CRICAPIAVAILABLE) {
          //await update_cricapi_data_r1(false);
          var rmTmp = await update_cricapi_data_r2023(false);
          console.log("MOM: " + rmTmp);
          //runningMatchCount = rmTmp;    // for testing purpose
          await updateTournamentBrief();
        }
        //console.log(runningScoreArray);
        //await checkallover();  ---- Confirm this is done when match ends
      } catch (e) {
        console.log(e);
        console.log("error in crictimer");
      }
    }
  }

  if (clientUpdateCount >= CLIENTUPDATEINTERVAL) {
      clientUpdateCount = 0;
      await sendDashboardData(); 
    } 
  
  let T3 = new Date();
  let diff1 = T3.getTime() - T1.getTime();
  console.log("End --------------- time taken: ", diff1);

  console.log("padmavati Mata ki Jai");
  if (masterConnectionArray.length > 0)
    setTimeout(() => processSocketData(), 2000);  
  
  inProcessSocket = false;
}  

async function sendDashboardData() {
	console.log("Send Dash data");
  let T1 = new Date();
  connectionArray = [].concat(masterConnectionArray);
  let newClientdata = [];
  clientData.forEach(x => {
	  let tmp = _.filter(connectionArray, ca => ca.gid === x.gid);
	  if (tmp.length > 0) newClientdata.push(x);
  });
  clientData = [];		//[].concat(newClientdata);
  
  for(i=0; i<connectionArray.length; ++i)  {
    await processConnection(i);
  }
  let T2 = new Date();
  let diff = T2.getTime() - T1.getTime();
  // console.log(T1);
  // console.log(T2);
  console.log(`Processing all socket took time ${diff}`);
}

async function processConnection(i) {
  // just simple connection then nothing to do
  // console.log("in process connection array");
  // console.log(connectionArray[i]);
  if ((connectionArray[i].gid  <= 0)  || 
      (connectionArray[i].uid  <= 0)  ||
      (connectionArray[i].page.length  <= 0)) return;
  
  //console.log(connectionArray[i]); 
  var myDate1 = new Date();
  var myTournament = await getTournameDetails(connectionArray[i].gid);
  if (myTournament.length === 0) return;
  //console.log(`Tournament is ${myTournament}`);
  
  var myData = _.find(clientData, x => x.tournament === myTournament && x.gid === connectionArray[i].gid);
  let sts = false;
	
	//-------------------------------> for testing purpose
  //myData = null;	
	//if (myData)
	//	console.log("------- data available of tournament", myTournament, "---------------");
	//else
	//	console.log("******* reading data of tournament", myTournament,   "***************");
	
  if (!myData) {
    // no data of this tournament with us. Read database and do calculation
		//memoryLeaked();
    sts = await readDatabase(connectionArray[i].gid );
	  // console.log(`read database status ${sts}`);
    if (sts) {
      // console.log(` stat and brief calculation for group ${connectionArray[i].gid}` );
      let myDB_Data = await statCalculation(connectionArray[i].gid );
      let mySTAT_Data = await statBrief(connectionArray[i].gid , 0 , SENDSOCKET);
      myData = {tournament: myTournament, gid: connectionArray[i].gid,
				dbData: myDB_Data, statData: mySTAT_Data}
      clientData.push(myData);
      var myDate2 = new Date();
      var duration = myDate2.getTime() - myDate1.getTime();
      console.log(`Total calculation Time: ${duration}`)
    }
	//memoryLeaked();
  }

  switch(connectionArray[i].page.substr(0, 4).toUpperCase()) {
    case "DASH":
      if (myData) { 
        io.to(connectionArray[i].socketId).emit('maxRun', myData.dbData.maxRun);
        io.to(connectionArray[i].socketId).emit('maxWicket', myData.dbData.maxWicket);
        io.to(connectionArray[i].socketId).emit('rank', myData.dbData.rank);
		//console.log(myData.dbData.rank);
        io.to(connectionArray[i].socketId).emit('score', score[myTournament]);
        let myOvers = _.find(runningScoreArray, x => x.tournament === myData.tournament)
        if (!myOvers) { myOvers = {tournament: ""}; }
        // console.log("Overs ", myOvers);
        io.to(connectionArray[i].socketId).emit('brief', myData.statData);
        io.to(connectionArray[i].socketId).emit('overs', myOvers);
        console.log("sent Dash data to " + connectionArray[i].socketId);
      }
      break;
    case "STAT":
      if (myData) {
        let myOvers = _.find(runningScoreArray, x => x.tournament === myData.tournament)
        if (!myOvers) { myOvers = {tournament: ""}; }
        // console.log("Overs ", myOvers);
        io.to(connectionArray[i].socketId).emit('brief', myData.statData);
        io.to(connectionArray[i].socketId).emit('overs', myOvers);
        console.log("Sent Stat data to " + connectionArray[i].socketId);
      }
      break
    case "AUCT":
      //console.log(connectionArray[i]);
      //console.log("Count is " + connectionArray[i].socketId);
      let tmp = masterConnectionArray.filter(x => (x.page.substr(0, 4).toUpperCase() === "AUCT") &&
                                                  (x.gid === connectionArray[i].gid));
      //console.log(tmp);
      if (tmp) {
        //console.log(tmp.uids);
        io.to(connectionArray[i].socketId).emit('inAuction', tmp);
        //console.log("===============sent to auctions");  
      }
      break;
  }

  return;
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



readDatabase = async function (igroup) {
  // console.log("read started");
  let dataFound = false;
  try {
	  var PstatList = g_tournamentStat.find({});
	  dataFound = true;
  } catch (err) {
    // console.log("Stat read error");
    //return(false);
	  dataFound = false;
  }
  
  // var PauctionList = Auction.find({gid: igroup});
  // var Pgmembers = GroupMember.find({gid: igroup});
  // var Pallusers = User.find({});
  var Pcaptainlist = Captain.find({gid: igroup});

  g_captainlist = await Pcaptainlist;
  g_gmembers = await akshuGetGroupMembers(igroup);    //   Pgmembers;
  g_allusers = await akshuGetGroupUsers(igroup);      // Pallusers;
  g_statList = (dataFound) ? await PstatList : [];
  g_auctionList = await akshuGetAuction(igroup);  // PauctionList;         //await akshuGetAuction(igrou

  return  ( (g_captainlist) &&
           (g_gmembers) &&
           (g_allusers) && 
           (g_auctionList)) ? true : false;
           //(g_statList.length > 0))  ? true : false;
}



statCalculation = async function  (igroup) {
  let myType = await getTournamentType(igroup);
  var calStart = new Date();
  //console.log(`in STAT------------------------------------------------`);
  /*
  const groupRec = await IPLGroup.findOne({gid: igroup});
  var tournamentStat = mongoose.model(groupRec.tournament, StatSchema);
  const PstatList = tournamentStat.find({});
  const Pgmembers = GroupMember.find({gid: igroup});
  const PauctionList = Auction.find({gid: igroup });
  const Pallusers = User.find({});
  const Pcaptainlist = Captain.find({gid: igroup});

  var beforeAwait = new Date();
  gmembers = await Pgmembers;
  allusers = await Pallusers
  auctionList = await PauctionList
  captainlist = await Pcaptainlist;
  var beforeStat = new Date();
  statList = await PstatList;
*/

  var dataRead = new Date();
  // now calculate score for each user
  var userRank = [];
	var userMaxRunList = [];
	var userMaxWicketList = [];

  //console.log("GM start");
  g_gmembers.forEach( gm => {
    userPid = gm.uid; 
	//console.log("prize: ", gm.prize);
    var urec = _.filter(g_allusers, u => u.uid === userPid);
	//console.log(`${urec[0].userName}`);
    var myplayers = _.filter(g_auctionList, a => a.uid === userPid); 
	// user name and dislay name from User record
    var curruserName = (urec.length > 0) ? urec[0].userName : "";
    // var currdisplayName = (urec) ? urec[0].displayName : "";

    // find out captain and vice captain selected by user
    var capinfo = _.find(g_captainlist, x => x.uid == userPid);
    if (capinfo === undefined)
      capinfo = new Captain ({ gid: igroup, uid: userPid, captain: 0, viceCaptain: 0});

    //console.log(capinfo);
    // find out players of this user
    //console.log(myplayers);
    //console.log("Just shown my players")
    //var playerScoreList = [];

    var userScoreList = []; 
	var userMaxList = [];
	
    myplayers.forEach( p => {
	  //console.log(`Now calculating for ${p.playerName}`);
      var MF = 1;
      //console.log(capinfo);
      if (p.pid === capinfo.viceCaptain) {
        //console.log(`Vice Captain is ${capinfo.viceCaptain}`)
        MF = ViceCaptain_MultiplyingFactor;
      } else if (p.pid === capinfo.captain) {
        //console.log(`Captain is ${capinfo.captain}`)
        MF = Captain_MultiplyingFactor;
      } else {
        //console.log(`None of the above: ${p.pid}`);
		    MF = 1;
      }
      //console.log(`Mul factor: ${MF}`);
	  //console.log("Player stat");
	  
      // now get the statistics of this player in various maches
      var myplayerstats = _.filter(g_statList, x => x.pid === p.pid);
      var myScore1 = _.sumBy(myplayerstats, x => x.score);
      var myRunsBonus = _.sumBy(myplayerstats, x => x.run)*BonusRun[myType]*(MF-1);
      var myWicketsBonus = _.sumBy(myplayerstats, x => x.wicket)*BonusWkt[myType]*(MF-1);
      var myScore = myScore1 + myRunsBonus + myWicketsBonus;
	  //console.log(`${myType} ${myScore1}  ${BonusRun[myType]} ${myWicketsBonus}`);
      userScoreList.push({ uid: userPid, pid: p.pid, playerName: p.name, playerScore: myScore});
	  
	  // now find out max of each player
	  var totRun = _.sumBy(myplayerstats, x => x.run);
      var totWicket = _.sumBy(myplayerstats, x => x.wicket);
      var tmp = { 
        gid: igroup,
        uid: userPid, 
        userName: urec[0].displayName,   //  urec.userName,
        displayName: gm.displayName,     //urec.displayName,
        pid: p.pid, 
        playerName: p.playerName,
        playerScrore: myScore, 
        totalRun: totRun,
        totalWicket: totWicket
      };
      userMaxList.push(tmp);
    });
    //console.log(`Max list ${userMaxList.length}`);

	// calculation of player belonging to user is done.
	// Now do total score, run and wicket
    var totscore = _.sumBy(userScoreList, x => x.playerScore);
    userRank.push({ 
      uid: userPid, 
      gid: igroup,
      userName: urec[0].displayName,   //  curruserName, `
      displayName: gm.displayName,    //  currdisplayName,
      grandScore: totscore, 
			prize: gm.prize,
      rank: 0});

  var tmpRun = _.maxBy(userMaxList, x => x.totalRun);

  let dataAvailable = false;
  if (tmpRun)
  if (tmpRun.totalRun > 0)
      dataAvailable = true;

  if (!dataAvailable) {
		userMaxRunList.push({ uid: gm.uid, gid: igroup, userName: "", displayName: "",
		maxRunPlayerId: 0,  maxRunPlayerName: "", maxRun: 0});
  } else {
		var maxRun = _.filter(userMaxList, x => x.totalRun == tmpRun.totalRun );
		maxRun.forEach( runrec => {
		  userMaxRunList.push({ 
			uid: gm.uid, 
			gid: igroup,
			userName: runrec.userName,
			displayName: runrec.displayName,
			maxRunPlayerId: runrec.pid,
			maxRunPlayerName: runrec.playerName,
			maxRun: runrec.totalRun,
		  });
		});
  }

  var tmpWicket = _.maxBy(userMaxList, x => x.totalWicket);
  dataAvailable = false
  if (tmpWicket)
  if (tmpWicket.totalWicket > 0)
      dataAvailable = true;

  if (!dataAvailable) {
      userMaxWicketList.push({ uid: gm.uid, gid: igroup, userName: "", displayName: "", maxWicketPlayerId: 0,
      maxWicketPlayerName: "", maxWicket: 0});
  } else {
    var maxWicket = _.filter(userMaxList, x => x.totalWicket === tmpWicket.totalWicket );
    maxWicket.forEach( wktrec => {
      userMaxWicketList.push({ 
        uid: gm.uid, 
        gid: igroup,
        userName: wktrec.userName,
        displayName: wktrec.displayName,
        maxWicketPlayerId: wktrec.pid,
        maxWicketPlayerName: wktrec.playerName,
        maxWicket: wktrec.totalWicket
      });
    });
  }
});
  //console.log("GM end");

  // assign ranking. Sort by score. Highest first
  userRank = _.sortBy(userRank, 'grandScore').reverse();
  var nextRank = 0;
  var lastScore = 99999999999999999999999999999;  // OMG such a big number!!!! Can any player score this many points
  userRank.forEach( x => {
    if (x.grandScore < lastScore)
      ++nextRank;
    x.rank = nextRank;
    lastScore = x.grandScore;
  });

  calcEnd = new Date();

  //console.log(userRank);
  return({rank: userRank, maxRun: userMaxRunList, maxWicket: userMaxWicketList});
}

statBrief = async function (igroup, iwhichuser, doWhatSend)
{
  // Set collection name 
  // var tournamentStat = mongoose.model(_tournament, StatSchema);
  // var igroup = _group;
  
  // get list of users in group
  /*
  var PgroupRec = IPLGroup.findOne({gid: igroup});
  var PauctionList = Auction.find({gid: igroup});
  var Pallusers = User.find({});
  var Pgmembers = GroupMember.find({gid: igroup});
  var Pcaptainlist = Captain.find({gid: igroup});

  // first read group record and start data fetch for tournament stats
  var groupRec = await PgroupRec;
  var tournamentStat = mongoose.model(groupRec.tournament, StatSchema);
  var PstatList = tournamentStat.find({});

  var captainlist = await Pcaptainlist;
  var gmembers = await Pgmembers;
  var allusers = await Pallusers;
  var auctionList = await PauctionList;
  var statList = await PstatList;
*/

  // var groupRec = g_groupRec
  // var captainlist = g_captainlist;
  // var gmembers = g_gmembers;
  // var allusers = g_allusers;
  // var auctionList = g_auctionList;
  // var statList = g_statList;
  let tType = await getTournamentType(igroup);
  //console.log(tType);

  var userScoreList = [];      
  // now calculate score for each user
  g_gmembers.forEach( gm  => {
    var userPid = gm.uid;
    var urec = _.find(g_allusers, x => x.uid == userPid);
    // find out captain and vice captain selected by user
    var capinfo = _.find(g_captainlist, x => x.uid == userPid);
    if (capinfo === undefined)
      capinfo = new Captain ({ gid: igroup, uid: userPid, captain: 0, viceCaptain: 0});

    // find out players of this user
    var myplayers = _.filter(g_auctionList, a => a.uid === userPid); 
    var playerScoreList = [];
    myplayers.forEach( p => {
      var MF = 1;
      var nameSufffix = "";
      if (p.pid === capinfo.viceCaptain) {
        MF = ViceCaptain_MultiplyingFactor;
        nameSufffix = " (VC)";
      } else if (p.pid === capinfo.captain) {
        MF = Captain_MultiplyingFactor;
        nameSufffix = " (C)";
      }

      // now get the statistics of this player in various maches
      var myplayerstats = _.filter(g_statList, x => x.pid === p.pid);
      //console.log(myplayerstats);
      // var myScore = _.sumBy(myplayerstats, x => x.score)*MF;
      var myScore1 = _.sumBy(myplayerstats, x => x.score);
      var myScore2 = _.sumBy(myplayerstats, x => x.run)*BonusRun[tType]*(MF-1);
      var myScore3 = _.sumBy(myplayerstats, x => x.wicket)*BonusWkt[tType]*(MF-1);
      var myScore = myScore1 + myScore2 + myScore3;
      // var myplayerstats = _.map(myplayerstats, o => _.pick(o, ['mid', 'pid', 'score']));
      var myplayerstats = _.map(myplayerstats, o => _.pick(o, ['pid', 'score']));
      var tmp = { 
        // uid: userPid, 
        // userName: urec.userName,
        // displayName: urec.displayName,
        pid: p.pid, 
        playerName: p.playerName + nameSufffix,
				team: p.team,
        playerScore: myScore
        //matchStat: myplayerstats
      };
      playerScoreList.push(tmp);
      // playerScoreList.push(_.sortBy(tmp, x => x.playerScore).reverse());
    });
    playerScoreList = _.sortBy(playerScoreList, x => x.playerScore).reverse();
    var userScoreValue = _.sumBy(playerScoreList, x => x.playerScore);
    userScoreList.push({uid: userPid, 
      gid: igroup,
      userName: urec.userName, 
      displayName: gm.displayName,    //  urec.displayName, 
      userScore: userScoreValue,
      playerStat: playerScoreList});
  })
  if (iwhichuser != 0) {
    userScoreList = _.filter(userScoreList, x => x.uid == iwhichuser);
  }
  userScoreList = _.sortBy(userScoreList, x => x.userScore).reverse();
  //console.log(userScoreList);
  //console.log(userScoreList);
  // if (doWhatSend === SENDRES) {
  //   sendok(res, userScoreList); 
  // } else {
  //   const socket = app.get("socket");
  //   socket.emit("brief", userScoreList)
  //   socket.broadcast.emit('brief', userScoreList);    
  // //   console.log(userScoreList);
  // }
  return(userScoreList);
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
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

BLOCKWEEKLIST = [
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	],
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	],
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	],
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	],
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	],
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	],
	[
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]	
];

BLOCKWEEKSTRLIST = [
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	],
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	],
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	],
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	],
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	],
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	],
	[
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
	"", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""
	]	
];

BLOCK_PER_HOUR = 4;
BLOCK_IN_MINUTES = 15;				// Block of 15 minutes
BLOCK_START	= 36;					// Starting of 9AM
BLOCK_END = 84;						// Ending at 9PM.
Z5 = "00000";

