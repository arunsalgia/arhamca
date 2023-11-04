const fetch = require('node-fetch');

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

router.get('/latestversion', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  let tmp = await MasterData.findOne({msKey: "LATESTVERSION"});
  //console.log(tmp);
  let lVer = (tmp) ? tmp.msValue : "0.0";
  //console.log(lVer);
  sendok(res, lVer);
});


router.get('/feedback/:userid/:message', async function (req, res, next) {
  // AplRes = res;
  setHeader(res);
  
    let { userid, message } = req.params;
    let tDate = new Date();
    let userRec = await User.findOne({uid: userid})
	let aplRec = new Apl();
	aplRec.aplCode = tDate.getTime();
	aplRec.date = cricDate(tDate)
	aplRec.uid = userid;
	aplRec.message = `feedback from ${userRec.displayName} (${userRec.uid}) on ${tDate}` ;
	aplRec.email = userRec.email;
	aplRec.status = "PENDING";
	aplRec.save();
	//console.log(aplRec);
	
	// now send the mail 
  let resp = await sendCricMail(APLEMAILID, aplRec.message, decrypt(message));
  if (resp.status) {
    sendok(res, aplRec._id);
  } else {
    console.log(resp.error);
    senderr(res, 603, resp.error);
  }
}); 

router.get('/html', async function (req, res, next) {
  // now send the mail 
	let message = `
<p>Simple HTML.</p>
<h3><em>So very simple.</em></h3>
<p><span style="color: #ff0000;">Lame joke that follows.</span></p>
<p>
  <span style="color: #ff0000;"
    ><img
      src="https://afinde-production.s3.amazonaws.com/uploads/981ebabb-5722-44c1-ad30-fc57fbc8ee9d.jpeg"
      alt="Lame joke"
      width="245"
      height="221"
  /></span>
</p>
<h2 style="padding-left: 30px;">do you?</h2>
<ul>
  <li>yes</li>
  <li>no</li>
  <li><strong>not entirely sure</strong></li>
</ul>`;

  let resp = await sendCricHtmlMail("arunsalgia@gmail.com", "HTML", message);
  if (resp.status) {
    sendok(res, "Done");
  } else {
    console.log(resp.error);
    senderr(res, 601, resp.error);
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
