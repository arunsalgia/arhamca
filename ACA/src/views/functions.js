import axios from "axios";
import download from 'js-file-download';
import LinearProgressWithLabel from '@material-ui/core/LinearProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgressWithLabel from '@material-ui/core/LinearProgress';
import moment from 'moment';
import { func } from "prop-types";

var crypto = require("crypto");
var ifscsystem = require('ifsc-finder');
var aadhar = require('aadhaar-validator')

export function cdRefresh() {
  window.location.reload();
}

export function cdCurrent() {
  return String.fromCharCode(169);
}

export function cdDefault() {
  return String.fromCharCode(9745);
}

export function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}

export function displayType(width) {
	if(width < 768 ){
			return 'xs';
	 }else if( width <= 991){
			return 'sm'; 
	 }else if( width <= 1199){
			return 'md';
	 }else{
		 return 'lg';
	 }
}

export function validateSpecialCharacters(sss) {
    var sts = false;
    const TerroristCharacters = [];

    if (!sss.includes("\""))
    if (!sss.includes("\'"))
    if (!sss.includes("\`"))
    if (!sss.includes("\\"))
    if (!sss.includes("/"))
    if (!sss.includes("~"))
    if (!sss.includes("\%"))
    if (!sss.includes("^"))
    if (!sss.includes("\&"))
    if (!sss.includes("\+"))
      sts = true;
    return sts;
}

export function validateMobile(sss) {
  var sts = false;
  const TerroristCharacters = [];

  if (sss.length === 10)
  if (!sss.includes("\."))
  if (!sss.includes("\-"))
  if (!sss.includes("\+"))
  if (!sss.includes("\*"))
  if (!sss.includes("\/"))
  if (!sss.includes("e"))
  if (!sss.includes("E"))
  if (!isNaN(sss))
    sts = true;
  return sts;
}

export function validateEmail(sss) {
    let sts = false;
    if (validateSpecialCharacters(sss)) {
      let xxx = sss.split("@");
      if (xxx.length === 2) {
        if (xxx[1].includes(".")) 
          sts = true;
      }
    }
    return sts;
}

export function validateUpi(sss) {
  let sts = false;
  if (validateSpecialCharacters(sss)) {
    let xxx = sss.split("@");
    if (xxx.length === 2) {
        sts = true;
    }
  }
  return sts;
}


const NumberString = /^[0-9]+$/;
export function validateInteger(sss) {
  let sts = sss.match(NumberString);
  return sts;
}


export function hasGroup() {
  //console.log(`current gis is ${localStorage.getItem("gid")}`)
  var sts = false;
    if (localStorage.getItem("gid") !== null) 
    if (localStorage.getItem("gid") !== "") 
    if (localStorage.getItem("gid") !== "0")
      sts = true;
  return sts;
}

export function encrypt(text) {
  let hash="";
  try {
    const cipher = crypto.createCipheriv(process.env.REACT_APP_ALGORITHM, 
      process.env.REACT_APP_AKSHUSECRETKEY, 
      Buffer.from(process.env.REACT_APP_IV, 'hex'));
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    hash = encrypted.toString('hex');
  }
  catch (err) {
    console.log(err);
  } 
  return hash;
};

export function decrypt(hash) {
  const decipher = crypto.createDecipheriv(process.env.REACT_APP_ALGORITHM, 
    process.env.REACT_APP_AKSHUSECRETKEY, 
    Buffer.from(process.env.REACT_APP_IV, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
  return decrpyted.toString();
};

const AMPM = [
  "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM",
  "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM"
];
  /**
 * @param {Date} d The date
 */
const TZ_IST={hours: 5, minutes: 30};
export function cricDate(d) {
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

export function cricTeamName(t) {
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

var prizeDetails = [];

async function getPrizeDetails() {
  // console.log("Checking length");
  try {
    // console.log("reading proze details from database")
    let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/prize/data`);
    prizeDetails = response.data;
  } catch(err)  {
    console.log("---------prize detail error");
    console.log(err);
  }
} 

async function getSinglePrizeDetails(count) {
  // console.log("Checking length");
  let myPrize;
  try {
    // console.log("reading proze details from database")
    let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/prize/prizecount/${count}`);
    myPrize = response.data;
  } catch(err)  {
    console.log("---------prize detail error");
    console.log(err);
  }
  return myPrize;
} 

async function getPrizePortion() {
  let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/prize/getprizeportion`);
  //console.log("resp", resp.data);
  let prizePortion = resp.data.prizePortion / 100;
  //console.log("prize portion", prizePortion);
  return prizePortion;

}

export async function getPrizeTable(prizeCount, prizeAmount) {
  
  let prizePortion = await getPrizePortion();
  let myPrize = await getSinglePrizeDetails(prizeCount);  //prizeDetails.find(x => x.prizeCount == prizeCount);
  // we will keep 5% of amount
  // rest (i.e. 95%) will be distributed among prize winners
  let totPrize = Math.floor(prizeAmount*prizePortion);
  let allotPrize = 0;
  let prizeTable=[]
  let i = 0;
  for(i=1; i<prizeCount; ++i) {
    let thisPrize = Math.floor(totPrize*myPrize["prize"+i.toString()]/100);
    prizeTable.push({rank: i, prize: thisPrize})
    allotPrize += thisPrize;
  }
  prizeTable.push({rank: prizeCount, prize: totPrize-allotPrize});
  return prizeTable;
}

async function getSinglePrize(prizeCount) {
  // console.log("Checking length");
  let myPrize;
  if (prizeDetails.length > 0) return;
  try {
    // console.log("reading proze details from database")
    let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/prize/prizecount/${prizeCount}`);
    myPrize = response.data;
  } catch(err)  {
    console.log("---------prize detail error");
    console.log(err);
  }
  return myPrize;
} 

export async function getSinglePrizeTable(prizeCount, prizeAmount) {
  let prizePortion = await getPrizePortion();
  //console.log(prizePortion)
  let myPrize = await getSinglePrize(prizeCount);
  //console.log(myPrize);

  let totPrize = Math.floor(prizeAmount*prizePortion)
  // console.log("Total prize", totPrize);
  let allotPrize = 0;
  let prizeTable=[]
  let i = 0;
  for(i=1; i<prizeCount; ++i) {
    let thisPrize = Math.floor(totPrize*myPrize["prize"+i.toString()]/100);
    prizeTable.push({rank: i, prize: thisPrize})
    allotPrize += thisPrize;
  }
  prizeTable.push({rank: prizeCount, prize: totPrize-allotPrize});
  return prizeTable;
}

export async function getAllPrizeTable(prizeAmount) {
  let allTable = [];
  for(let i=1; i<=5; ++i) {
    let tmp = await getSinglePrizeTable(i, prizeAmount);
    allTable.push(tmp);
  }
  return (allTable);
}


export async function getUserBalance() {
  let myBalance = {wallet: 0, bonus: 0};
  try {
    let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/balance/${localStorage.getItem("uid")}`);
    myBalance = response.data;
  } catch(e) {
    console.log(e);
  }
  return myBalance;
}

export async function org_feebreakup(memberfee, bonusAvailable) {
  try {
    let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/feebreakup/${memberfee}`);
    // console.log(response.data);
    let fee = response.data;
    if (fee.bonus > bonusAvailable) {
      fee.bonus = bonusAvailable;
      fee.wallet = memberfee - bonusAvailable;
    }
    fee["done"] = true;
    return fee;
  } catch(err) {
    console.log(e);
    return {done: false};
  }
}

export async function feebreakup(memberfee, bonusAvailable) {
  try {
    let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/groupfee`);
    // console.log(response.data);
    let fee = response.data;
    //if (fee.bonus > bonusAvailable) {
    //  fee.bonus = bonusAvailable;
    //  fee.wallet = memberfee - bonusAvailable;
    //}
    fee["done"] = true;
    return fee;
  } catch(err) {
    console.log(e);
    return {done: false};
  }
}


export async function groupfeebreakup(groupCode, bonusAvailable) {
  try {
    let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/groupfeebreakup/${groupCode}`);
    //console.log(response.data);
		console.log(bonusAvailable);
    let fee = response.data;
		console.log(fee);
    if (fee.bonus > bonusAvailable) {
			let memberfee = fee.bonus + fee.wallet;
      fee.bonus = bonusAvailable;
      fee.wallet = memberfee - bonusAvailable;
    }
    fee["done"] = true;
		console.log(fee);
    return fee;
  } catch(e) {
    console.log(e);
    return  {done: false};
  }

}

export function specialSetPos() {
  //console.log(`in SSP: ${localStorage.getItem("joinGroupCode")}`)
  let retval = parseInt(process.env.REACT_APP_DASHBOARD);  //parseInt(process.env.REACT_APP_GROUP);
  if (localStorage.getItem("joinGroupCode").length > 0)
    retval = parseInt(process.env.REACT_APP_JOINGROUP);
  //console.log(`in SSP: ${retval}`)
  return retval;
}

export function getImageName(teamName) {
  let imageName = `${process.env.PUBLIC_URL}/teamimage/${teamName}.JPG`;
  imageName = imageName.replaceAll(" ", "");
  // imageName = imageName.replace(/ /g, " ");
  //console.log("Function Image name", imageName);
  return imageName;
}

export function currentAPLVersion() {
	//console.log("Current");
	//console.log(process.env.REACT_APP_VERSION);
  return(process.env.REACT_APP_VERSION);
}

export async function latestAPLVersion()  {
  let version = "";
  try {
    let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/apl/latestversion`);
    // console.log(response);
    // let tmp = response.data;
    version = response.data;
  } catch(err) {
    //version = 0.1;
  }
  return version;
}

export async function upGradeRequired() {
  let upGrade = false;
  let upGradeRecord;
  if (process.env.REACT_APP_DEVICE === "APK") {
    let myName = process.env.REACT_APP_NAME;
    let myVersion = process.env.REACT_APP_VERSION;
    let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/apl/confirmlatest/${myName}/APK/${myVersion}`;
    //console.log(myURL);
    let response = await axios.get(myURL);
    //console.log("After axios call", response.data);
    upGrade = (response.data.status) ? false : true;
    upGradeRecord = response.data.latest;
    upGradeRecord.text = internalToText(upGradeRecord.text);
    //console.log(upGradeRecord);
  } else if (process.env.REACT_APP_DEVICE === "IOS") {
		console.log("IOS currently not supported");
	}
	
  //console.log(`upgrade required: ${upGrade}`);
  return ({status: upGrade, latest: upGradeRecord});
}


export async function org_downloadApk() {
  let myName = process.env.REACT_APP_NAME;
  let myURL = `${process.env.REACT_APP_APLAXIOS}/apl/downloadlatestbinary/${myName}/APK/`;
  try {
    axios({
      method: 'get',
      url: myURL,
      responseType: 'arraybuffer',
      // onDownloadProgress: (progressEvent) => {
      //   // let newPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //   // console.log("File download in progress ", newPercent);
      // },
      })
      .then( (response) => {
          let myFile = process.env.REACT_APP_NAME + ".APK";
          console.log(myFile);
          download(response.data, myFile);
          console.log("download over");
        }
      )
      .catch(
          (error) => {
            console.log(error);
            console.log("in axios catch");
          }
      ); 
  } catch (e) {
    console.log(e);
    console.log("in try catch");
  } 
  console.log("Debu complete");

}


export async function downloadApk() {
  let myName = process.env.REACT_APP_NAME;
  let myURL = `${process.env.REACT_APP_APLAXIOS}/apl/downloadlatestbinary/${myName}/APK/`;
  try {
    let response = await axios({
      method: 'get',
      url: myURL,
      responseType: 'arraybuffer',
      // onDownloadProgress: (progressEvent) => {
      //   // let newPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //   // console.log("File download in progress ", newPercent);
      // },
      });
    let myFile = process.env.REACT_APP_NAME + ".APK";
    console.log(myFile);
    download(response.data, myFile);
    console.log("download over");
  } catch (e) {
    console.log(e);
    console.log("in try catch");
  } 
  
  console.log("Debug complete");

}

export function clearBackupData() {
  /* Clear dash board items */
  localStorage.removeItem("saveRank");
  localStorage.removeItem("savePrize");
  localStorage.removeItem("saveScore");
  localStorage.removeItem("saveMaxRun");
  localStorage.removeItem("saveMaxWicket");
  localStorage.removeItem("statData");
  localStorage.removeItem("saveRankArray");
  /* Clear Stat items */
  localStorage.removeItem("statData");
  /* clear team */
  localStorage.removeItem("team");
  /* clear captain */
  localStorage.removeItem("captain");
  localStorage.removeItem("viceCaptain");
  localStorage.removeItem("captainList");
  /* clear home */
  localStorage.removeItem("home_tournamentList");
  localStorage.removeItem("home_groupList");
  /* clear wallet details */
  localStorage.removeItem("saveBalance");
  localStorage.removeItem("saveTransactions");
}


export function isMobile() {
  return (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Windows Phone/i.test(navigator.userAgent)) ? true : false;
}

export function checkIdle() {

  let x = sessionStorage.getItem("notidle");
  // console.log("Idle storage", x);
  let sts = (x) ? false : true;
  return sts;
}

export function setIdle(idle) {
  if (idle) {
    sessionStorage.removeItem("notidle");
    cdRefresh()
  } else {
    sessionStorage.setItem("notidle", "user is working");
  }
}


const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);
const SP = String.fromCharCode(32);

const IntCR = String.fromCharCode(128+13);
const IntLF = String.fromCharCode(128+10);
const IntSP = String.fromCharCode(128+32);

export function textToInternal(txt) {
  let txt1 = txt;
  let x = txt1.split(CR);
  txt1 = x.join(IntCR);
  x = txt1.split(LF);
  txt1 = x.join(IntLF);
  x = txt1.split(SP);
  txt1 = x.join(IntSP);
  return txt1;
}

export function internalToText(txt) {
  let txt1 = txt;
  let x = txt1.split(IntCR);
  txt1 = x.join(CR);
  x = txt1.split(IntLF);
  txt1 = x.join(LF);
  x = txt1.split(IntSP);
  txt1 = x.join(SP);
  return txt1;
}


export async function ifscBank(code) {
  let mybank = await ifscsystem.getBankName(code.toUpperCase());
  //console.log(mybank.substring(0,3));
  if (mybank.substring(0,3) === "Not") 
    mybank = "";
  return mybank;
}

export async function ifscBranch(code) {
  let mybank = await ifscsystem.getBranchName(code.toUpperCase());
  //console.log(mybank.substring(0,3));
  if (mybank.substring(0,3) === "Not") 
    mybank = "";
  return mybank;
}

export async function ifscCity(code) {
  let mybank = await ifscsystem.getCity(code.toUpperCase());
  //console.log(mybank.substring(0,3));
  if (mybank.substring(0,3) === "Not") 
    mybank = "";
  return mybank;
}

export async function ifscNeft(code) {
  let mybank = await ifscsystem.getCity(code.toUpperCase());
  // console.log(mybank.substring(0,3));
  if (mybank.substring(0,3) === "Not") 
    mybank = false;
  return mybank;
}

export async function validateAadhar(code) {
  let sts = await aadhar.isValidNumber(code)
  return sts;
}

async function getMaster(key) {
  let value = "";
  try {
    let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/apl/getmaster/${key}`);
    //console.log(response.data);
    value = response.data;
  } catch(err)  {
    console.log("---------get master fetch error", key);
    console.log(err);
  } 
  return value; 
}

export async function getMinimumBalance() {
  let value = await getMaster("MINBALANCE");
  if (value === "") value = process.env.REACT_APP_MINBALANCE;
  return parseInt(value);
}

export async function getMinimumAdd() {
  let value = await getMaster("MINADDWALLET");
  if (value === "") value = process.env.REACT_APP_MINADDWALLET;
  return parseInt(value);
}

export async function getAuctionCountDown() {
  let value = await getMaster("AUCTIONCOUNTDOWN");
  if (value === "") value = process.env.AUCTIONCOUNTDOWN;
  return parseInt(value);

}

export async function getIdleTimeout() {
  let value = await getMaster("IDLETIMEOUT");
  if (value === "") value = process.env.REACT_APP_IDLETIMEOUT;
  return parseInt(value);
}

var groupCost = -1;
export async function getGroupCost() {
	if (groupCost <= 0) {
		let tmp = await getMaster("GROUPCOST");
		groupCost = parseInt(tmp)
	}
	return groupCost;
}

// disable future dates
const today = moment();
const yesterday = moment().subtract(1, 'day');

export function disablePastDt(current) {
  return current.isAfter(yesterday);
};

export function disableFutureDt(current) {
  return current.isBefore(today);
};

export function mergedName(name, code) {
	return (`${name} (${code})`)
}

export function getCodeFromMergedName(mergedName) {
	var tmp = mergedName.split("(");
	var tmp1 = tmp[1].split(")");
	return tmp1[0].trim();
}

export function getNameFromMergedName(mergedName) {
	var tmp = mergedName.split("(");
	return tmp[0].trim();
}

export function getAreafromBid(myBid) {
	return (myBid.substr(0, myBid.length-5));
}


export function isAdmin() {
 return ["Admin"].includes(sessionStorage.getItem("role")); 
}

export function isManager() {
 return ["Manager"].includes(sessionStorage.getItem("role")); 
}

export function isFaculty() {
 return ["Faculty"].includes(sessionStorage.getItem("role")); 
}

export function isStudent() {
 return ["Student"].includes(sessionStorage.getItem("role")); 
}

export function isAdmMan() {
 return ["Admin", "Manager"].includes(sessionStorage.getItem("role")); 
}


export function isAdmManFac() {
 return ["Admin", "Manager", "Faculty"].includes(localSession.getItem("role")); 
}


export function isAdmManStu() {
 return ["Admin", "Manager", "Student"].includes(localSession.getItem("role")); 
}

