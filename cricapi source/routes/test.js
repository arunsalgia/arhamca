const fetch = require('node-fetch');
const project_key = 'RS_P_1439602356420481067'
const api_key = 'RS5:c219fa31988c970ee110d79d0a785435'
var request = require('request')
const token="v5sRS_P_1439602356420481067s1440985143178303760";
const BCCI="c__board__bcci__b13f0";
const IPL21 = "iplt20_2021";
let IPLMATCHES;

const { 
	encrypt, decrypt, dbencrypt, dbdecrypt, 
	dbToSvrText, svrToDbText, 
	sendCricMail, sendCricHtmlMail,
	getMaster, setMaster,
} = require('./cricspecial'); 

var router = express.Router();

// let AplRes;

/* GET users listing. */
router.use('/', function(req, res, next) {
  // AplRes = res;
  setHeader(res);
  if (!db_connection) { senderr(res, DBERROR, ERR_NODB); return; }
  next('route');
});

router.get('/gettoken', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);

	var options = {
		method: 'POST',
		url: `https://api.sports.roanuz.com/v5/core/${project_key}/auth/`,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			api_key: `${api_key}`
		})
	}
	try {
		let resp = await axios.get(options.url, {headers: {'Content-Type': 'application/json'} });
		console.log(resp.data);
		/*for(let i=0; i<resp.data.data.tournaments.length; ++i) {
			console.log(resp.data.data.tournaments[i]);
		}
		sendok(res, resp.data.data);*/
		sendok(res, resp.data);
	} catch (e) {
		console.log(e);
		senderr(res, 601, e);
	}
});

router.get('/association', async function (req, res, next) {
  setHeader(res);


	var options = {
		method: 'GET',
		url: `https://api.sports.roanuz.com/v5/cricket/${project_key}/association/list/`,
		headers: {
			'rs-token': token
		}
	}

//	request(options, function (error, response) {
//  if (error) throw new Error(error)
  
	try {
		let resp = await axios.get(options.url, {headers: {'rs-token': token } });
		//console.log(resp.data.data.associations);
		let allAssocitations = resp.data.data.associations;
		let myData = [];
		for(let i=0; i <allAssocitations.length; ++i) {
			let myAssoc = {key: allAssocitations[i].key, name: allAssocitations[i].name, country: allAssocitations[i].country.name};
			console.log(myAssoc);
			myData.push(myAssoc);
		}
		sendok(res, myData);
	} catch (e) {
		console.log(e);
		senderr(res, 601, e);
	}

});


router.get('/tournament', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);

var association_key = BCCI;
var options = {
  method: 'GET',
  url: `https://api.sports.roanuz.com/v5/cricket/${project_key}/association/${association_key}/featured-tournaments/`,
  headers: {
    'rs-token': token
  }
}
//	request(options, function (error, response) {
//  if (error) throw new Error(error)
  
	try {
		let resp = await axios.get(options.url, {headers: {'rs-token': token } });
		//console.log(resp.data.data);
		let allTournaments = resp.data.data.tournaments;
		let myData = [];
		
		for(let i=0; i<allTournaments.length; ++i) {
			let tmp = {key: allTournaments[i].key, name: allTournaments[i].name, startDate: new Date(Number(allTournaments[i].start_date)*1000)};
			console.log(tmp);
			myData.push(tmp);
		}
		sendok(res, allTournaments);
	} catch (e) {
		console.log(e);
		senderr(res, 601, e);
	}

});



router.get('/match', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);

	var tournament_key = IPL21;
	var page_key = '2'
	var options = {
		method: 'GET',
		url: `https://api.sports.roanuz.com/v5/cricket/${project_key}/tournament/${tournament_key}/featured-matches/`,
		headers: {
			'rs-token': token
		}
	}
	try {
		let resp = await axios.get(options.url, {headers: {'rs-token': token } });
		//console.log(resp.data.data.matches);
		let myData = [];
		let allMatches=resp.data.data.matches;
		for(let i=0; i<allMatches.length; ++i) {
			let tmp = {key: allMatches[i].key, name: allMatches[i].name, startTime: new Date(Number(allMatches[i].start_at)*1000)}
			//console.log(myData[i].short_name, );
			//console.log(myData[i].teams.a, myData[i].teams.b);
			console.log(tmp);
			myData.push(tmp);
		}
		IPLMATCHES =[].concat(myData);
		sendok(res, resp.data.data.matches);
	} catch (e) {
		console.log(e);
		senderr(res, 601, e);
	}
});

router.get('/playerlist', async function (req, res, next) {

	var key = IPLMATCHES[0].key;

	var options = {
		method: 'GET',
		url: `https://api.sports.roanuz.com/v5/cricket/${project_key}/match/${key}/`,
		headers: {
			'rs-token': token
		}
	}

	try {
		let resp = await axios.get(options.url, {headers: {'rs-token': token } });
		// get player keys
		let myPlayers = Object.keys(resp.data.data.players);
		let allPlayers=resp.data.data.players;
		console.log(myPlayers);
		let myData = [];
		for(let i=0; i <myPlayers.length; ++i) {
			let tmp = {key: allPlayers[myPlayers[i]].player.key}
			console.log(tmp);
		}
		sendok(res, resp.data.data.players);
	} catch (e) {
		console.log(e);
		senderr(res, 601, e);
	}

});


router.get('/stats', async function (req, res, next) {

	var key = //'iplt20_2021_g032' // PK Vs. RR
						'iplt20_2021_g033'	// SRH Vs. DC
	var request = require('request')
	var options = {
		method: 'GET',
		url: `https://api.sports.roanuz.com/v5/cricket/${project_key}/match/${key}/`,
		headers: {
			'rs-token': token
		}
	}

	try {
		let resp = await axios.get(options.url, {headers: {'rs-token': token } });
		//console.log(resp.data.data.players);
		
		
		// get player keys
		let myPlayers = Object.keys(resp.data.data.players);
		console.log(myPlayers);
		for(let i=0; i<myPlayers.length; ++i)
		{
			let myData = resp.data.data.players[myPlayers[i]];
			//console.log(myData.player.name);
			let myStats = myData.score["1"];
			if ( 	(myStats.batting === null) &&
						(myStats.bowling === null) &&
						(myStats.fielding === null))
				continue;
				
			//console.log(myStats.batting);
			//console.log(myStats.bowling);
			//console.log(myStats.fielding);
			let myPlayer = myData.player.name;
			
			let myBatting = myStats.batting
			let myBowling = myStats.bowling;
			let myFielding = myStats.fielding;
			
			let newData = {key: myPlayers[i], name: myData.player.name,
				runs: 0, fours: 0, sixes: 0, out: false,
				catches: 0, stumpings: 0, runouts: 0,
				wickets: 0, economy: 0.0, maiden_overs: 0
			};
			
			if (myBatting !== null) {
				newData.runs = myBatting.score.runs;
				newData.fours = myBatting.score.fours;
				newData.sixes = myBatting.score.sixes
				//balls = myBatting.score.balls
				out = (myBatting.dismissal !== null);
			}
			
			if (myBowling !== null) {
				//console.log(myBowling);
				newData.wickets = myBowling.score.wickets;
				newData.economy = myBowling.score.economy;
				newData.maiden_overs = myBowling.score.maiden_overs;
			}
			
			if (myFielding !== null) {
				newData.catches = myFielding.catches;
				newData.stumpings = myFielding.stumpings;
				newData.runouts = myFielding.runouts;
			}
			//console.log("---------------------------------");
			//console.log(newData);
			//console.log("---------------------------------");
		}
		sendok(res, myPlayers);
	} catch (e) {
		console.log(e);
		senderr(res, 601, e);
	}

});


router.get('/master/list', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);

  let myData = await MasterData.find({});
  sendok(res, myData);
});

router.get('/getfile/:myFileName', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  let { myFileName } = req.params;
  console.log(myFileName);
  myFileName = decrypt(myFileName);
  console.log(myFileName);
  sendok(res, myFileName);
});


router.get('/master/add/:myKey/:myValue', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  let { myKey, myValue } = req.params;
  
  let myData = await MasterData.findOne({msKey: myKey.toUpperCase()});
  if (!myData) {
    myData = new MasterData();
    let tmp = await MasterData.find().limit(1).sort({ msId: -1 });
    myData.msId = (tmp.length > 0) ? tmp[0].msId + 1 : 1;
    myData.msKey = myKey.toUpperCase();
  }
  myData.msValue = myValue;
  myData.save();
  sendok(res, myData);
});

router.get('/master/delete/:myKey', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  let { myKey } = req.params;
  
  try {
    await MasterData.deleteOne({msKey: myKey.toUpperCase()});
    sendok(res, `Key ${myKey} successfully delete from Master Settings`);
  } catch (e) {
    senderr(res, 601, `Key ${myKey} not found in Master Settings`);
  }
});


router.get('/addguide/:gNum/:gTitle/:gText', async function (req, res, next) {
  setHeader(res);

  var {gNum, gTitle, gText} = req.params;
  
  let myGuide = await Guide.findOne({guideNumber: gNum});
  if (!myGuide) {
	myGuide = new Guide();
	myGuide.guideNumber = gNum;
  }

  myGuide.guideTitle = gTitle;
  myGuide.guideText = gText;
  myGuide.save();
  
  sendok(res, myGuide);
}); 

router.get('/getmaxguide', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  
  let tmp = await Guide.find({}).limit(1).sort({ "guideNumber": -1 });
  console.log(tmp);
  sendok(res, tmp[0].guideNumber.toString());
});

router.get('/getguide/:guideNum', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  var { guideNum } = req.params;

  let guideRec = await Guide.findOne({guideNumber: guideNum});
 
  if (guideRec) sendok(res, guideRec);
  else          senderr(res, 601, "No guides available");
});


router.get('/resetguide/:userId', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  var { userId } = req.params;

  let guideRec;
  let userRec = await User.findOne({uid: userId});
  userRec.currentGuide = 0;
  userRec.showGuide = true;
  userRec.save();
  sendok(res, "Done");
});

router.get('/enableguide/:userId', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  var { userId } = req.params;

  let guideRec;
  let userRec = await User.findOne({uid: userId});
  userRec.currentGuide = 0;
  userRec.showGuide = true;
  userRec.save();
  sendok(res, "Done");
});

router.get('/disableguide/:userId', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  var { userId } = req.params;

  let guideRec;
  let userRec = await User.findOne({uid: userId});
  userRec.currentGuide = 0;
  userRec.showGuide = false;
  userRec.save();
  sendok(res, "Done");
});

router.get('/getnextguide/:userId', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  var { userId, guideNum } = req.params;

  let guideRec;
  let userRec = await User.findOne({uid: userId});
  if (userRec.showGuide) {
	guideRec = await Guide.findOne({guideNumber: (userRec.currentGuide+1)});
  }
  if (guideRec) {
	  ++userRec.currentGuide;
	  userRec.save();
	  sendok(res, guideRec);
  } else
	  senderr(res, 601, "No guides available");
});

router.get('/getprevguide/:userId', async function (req, res, next) {
  setHeader(res);
  var { userId, guideNum } = req.params;

  let guideRec;
  let userRec = await User.findOne({uid: userId});
  if ((userRec.showGuide) && (userRec.currentGuide > 1)) {
	guideRec = await Guide.findOne({guideNumber: (userRec.currentGuide-1)});
  }
  if (guideRec) {
	  --userRec.currentGuide;
	  userRec.save();
	  sendok(res, guideRec);
  } else
	  senderr(res, 601, "No guides available");
});

router.get('/getoffer/:reqType', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  var { reqType } = req.params;

	
let offerList = await Offer.find({}).sort({order: 1});
  if (offerList.length > 0) {
	  sendok(res, offerList);
  } else
	  senderr(res, 601, "No Offers available");
});


router.get('/getmaster/:key', async function (req, res, next) {
  setHeader(res); 
  
  var {key} = req.params;
  let  myValue = await getMaster(key.toUpperCase());
  sendok(res, myValue);
}); 

router.get('/setmaster/:key/:value', async function (req, res, next) {
  setHeader(res);
  
  var {key, value} = req.params;
  await setMaster(key.toUpperCase(), value);
  sendok(res, "Done");
}); 


var fcm_tokens = ["dA9LCvstMrLTDdi62lCJ_k:APA91bHfPMDFRXGi4TardAslpZYkVs4ooH9A7WcMBVHadDAFTdVNmVWK0ZP2ThgpUT9bfRnyb1rJNqHrrbCvyOM7fQuA7vU3x1HcX28ZLNhr8ZXeB5ybK4ZwJflx4NxSR4FPAwoA-e9v"];
// ch4SSa25V8zMo9tMo8v8Zh:APA91bF-DNQHmlH6Fs5F3wu9SePfPJklnREnccK5YPE0bXtsSWfZYpFUCM3Z50mCtWkBOd1PW_WiSq7hmgVK1SrqMVjYXNl1wI1wOnAUufPEdMI6UltOWdPMK9xQaNpgP_4Q24q5x1kK

router.get('/firebase/token/:code', async function (req, res, next) {
  setHeader(res);
	var {code} = req.params;
	code = decrypt(code);
	//fcm_tokens[0] = code;			// FOR TESTING
	let myFire = await Firebase.findOne({token: code});
	if (!myFire) {
		myFire = new Firebase();
		myFire.token = code;
		myFire.uid = 0;
		myFire.device = "WEB";
		myFire.context = "";
	}
	myFire.enabled = true;
	await myFire.save();
	
  console.log("code is ", code);
  sendok(res, 'Done');
}); 


router.get('/firebase/sendtoall', async function (req, res,next)  {
  setHeader(res);
	
	var notification = {
		'icon': './APLLOGO1.ICO',
		'title': 'From APL',
		'body': 'Create group using tournament IND-ENG WT20',
		//'image': './APLLOGO2.JPG'
	}
	
	//let allFire = await Firebase.find({});
	// fcm_tokens = _.map(allFire, 'token');

	console.log(fcm_tokens);
	
	let notification_body = {
		'notification': notification,
		'registration_ids': fcm_tokens
	}
	
	fetch('https://fcm.googleapis.com/fcm/send', {
		'method': 'POST',
		'headers': { 
			'Authorization': 'key='+'AAAA7SGD30s:APA91bEZj9abtcNu7ME08rJxw6Rgdgi1rqQLdZtyw_ieVmNxq8ckSACdJSSSBalBwYqdiop3ynvYfFwDFgxfE0LFqy2NUUVVR0lZ1zUvD7vfg06LOZ-8XvFwQDE0XBdtZyEO6v73A8Rr',
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(notification_body)
	}).then(() => {
		sendok(res, 'Done');
	}).catch((err) => {
		senderr(res, 601,'Cannot send');
		console.log(err);
	})

});


router.get('/firebase/test1', async function (req, res,next)  {
  setHeader(res);
	
	var notification = {
		"title" : "APL InfoMania",
		"body" : "Create new group using tournament IND-ENG-WT20",
		"icon" : "./APLLOGO1.ICO",
		//"image": "./APLLOGO2.JPG",
		"sound": "./CLICK.MP3",
	}
	
	
	let allFire = await Firebase.find({});
	//let fcm_tokens = _.map(allFire, 'token');

	//console.log(fcm_tokens);
	
	
	let notification_body = {
		notification: notification,
		//'registration_ids': fcm_tokens
		to: "f1xVa2IbFEhPK9oXmcxBZW:APA91bHWxS68nzY_Piluzbm06vuD8tW0eSjjd3Lxa5iXqBccfQj_B5THSIMeEIUXWglwvgFK-L1wZPv_GeuRZEHaqnQBKOseHXW2fB_IEzfipF--NVvyXLkmkZq0TEF-LPqy1SKg-PLg"
	}
	
	
	fetch('https://fcm.googleapis.com/fcm/send', {
		'method': 'POST',
		'headers': { 
			'Authorization': 'key='+'AAAA7SGD30s:APA91bEZj9abtcNu7ME08rJxw6Rgdgi1rqQLdZtyw_ieVmNxq8ckSACdJSSSBalBwYqdiop3ynvYfFwDFgxfE0LFqy2NUUVVR0lZ1zUvD7vfg06LOZ-8XvFwQDE0XBdtZyEO6v73A8Rr',
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(notification_body)
	}).then(() => {
		sendok(res, 'Done');
	}).catch((err) => {
		senderr(res, 601,'Cannot send');
		console.log(err);
	})

});



router.get('/firebase/test2', async function (req, res,next)  {
  setHeader(res);
	
	var data = {
		"title" : "APL InfoMania",
		"body" : "Create new group using tournament IND-ENG-WT20",
		"icon" : "./APLLOGO1.ICO",
		"image": "./APLLOGO2.JPG",
		//"sound": "./CLICK.MP3",
		"clickUrl": "https://google.com"
	}
	
	
	let allFire = await Firebase.find({});
	//let fcm_tokens = _.map(allFire, 'token');

	//console.log(fcm_tokens);
	
	
	let notification_body = {
		to: "dA9LCvstMrLTDdi62lCJ_k:APA91bHfPMDFRXGi4TardAslpZYkVs4ooH9A7WcMBVHadDAFTdVNmVWK0ZP2ThgpUT9bfRnyb1rJNqHrrbCvyOM7fQuA7vU3x1HcX28ZLNhr8ZXeB5ybK4ZwJflx4NxSR4FPAwoA-e9v",
		//'registration_ids': fcm_tokens,
		data: data,
	}
	
	
	fetch('https://fcm.googleapis.com/fcm/send', {
		'method': 'POST',
		'headers': { 
			'Authorization': 'key='+'AAAA7SGD30s:APA91bEZj9abtcNu7ME08rJxw6Rgdgi1rqQLdZtyw_ieVmNxq8ckSACdJSSSBalBwYqdiop3ynvYfFwDFgxfE0LFqy2NUUVVR0lZ1zUvD7vfg06LOZ-8XvFwQDE0XBdtZyEO6v73A8Rr',
			'Content-Type': 'application/json'
		},
		'body': JSON.stringify(notification_body)
	}).then(() => {
		sendok(res, 'Done');
	}).catch((err) => {
		senderr(res, 601,'Cannot send');
		console.log(err);
	})

});

router.get('/support1', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);

  let allUsers = await User.find({});
  for(let u=0; u<allUsers.length; ++u) {
	allUsers[u].showGuide = true;
	allUsers[u].currentGuide = 0;
	allUsers[u].save();
  }
  sendok(res, 'Done');
}); 


function sendok(res, usrmsg) { res.send(usrmsg); }
function senderr(res, errcode, errmsg) { res.status(errcode).send(errmsg); }
function setHeader(res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
}

module.exports = router;
