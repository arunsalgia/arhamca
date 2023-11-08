import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
//import Tooltip from "react-tooltip";
//import ReactTooltip from 'react-tooltip'
//import { useAlert } from 'react-alert';
import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import BlueRadio from 'components/Radio/BlueRadio';
import { UserContext } from "../../UserContext";
import { JumpButton, DisplayPageHeader, ValidComp, BlankArea} from 'CustomComponents/CustomComponents.js';

import lodashSortBy from "lodash/sortBy";

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';

//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { isMobile, getWindowDimensions, displayType, decrypt, encrypt } from 'views/functions';

import globalStyles from "assets/globalStyles";

import {setTab} from "CustomComponents/CricDreamTabs.js"

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";

//const ALLROLES = ["Student", "Faculty", "Admin"];

import {
	ROLE_FACULTY , ROLE_STUDENT,
	ALLSELECTIONS, BLANKCHAR,
	NOFRACTION,
	SHORTWEEKSTR, HOURBLOCKSTR, MINUTEBLOCKSTR, SESSIONHOURSTR,
	STATUS_INFO,
	DURATIONSTR,
	BATCHTIMESTR	,
	BLOCK_START, BLOCK_END,
} from 'views/globals';

import {
	mergedName, getCodeFromMergedName, getNameFromMergedName,
} from 'views/functions';

var origBatchRec = null;
var mode = "ADD";

export default function FacultySchedule() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	//const alert = useAlert();
	
	const [currentSelection, setCurrentSelection] = useState(ALLSELECTIONS[0]);
	
	const [facultyName, setFacultyName] = useState([]);
	//const [facultySchedule, setFacultySchedule] = useState([]);
	
	const [teacherSchedule, setTeachedSchedule] = useState([]);
	const [batchArray, setBatchArray] = useState([]);
	const [facultyArray, setFacultyArray] = useState([]);
	const [masterBatchArray, setMasterBatchArray] = useState([]);
	
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	//const [batchRec, setBatchtRec] = useState(null);
	const [userRec, setUserRec] = useState(null);
	
	const [newArea, setNewArea] = useState("");
	const [newFaculty, setNewFaculty] = useState("");

	const [sessDuration, setSessDuration] = useState(DURATIONSTR[1].name);

	const [newStudent, setNewStudent] = useState("");
	const [batchStudents, setBatchStudents] = useState([]);
	const [batchSessions, setBatchSessions] = useState([]);
	
	const [newDay, setNewDay] = useState("");
	const [newHourMinute, setNewHourMinute] = useState("03:00 PM");
	const [newMin, setNewMin] = useState("");
	const [newFess, setNewFees] = useState(200);
	const [origHourMinute, setOrigHourMinute] = useState("");
	const [origDay, setOrigDay] = useState("");
	
	const [drawer, setDrawer] = useState("");
	const [drawerDetail, setDrawerDetail] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
	const [dispType, setDispType] = useState("lg");

	useEffect(() => {
		function handleResize() {
			let myDim = getWindowDimensions();
      setWindowDimensions(myDim);
			//let myRows = 0;
			let defHeight = 100;
      //console.log(displayType(myDim.width)) ;
      setDispType(displayType(myDim.width));
     
			//switch (displayType(myDim.width)) {
			//	case 'xs': myRows = 10; break;
			//	case 'sm': myRows = 24; break;
			//	case 'md': myRows = 36; break;
			//	case 'lg': myRows = 48; break;
			//}
			//console.log(myRows);
			//setROWSPERPAGE(myRows);
		}


		async function getAllFaculty() {	
		try {
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/list/enabled`;
			const response = await axios.get(myUrl);
			//console.log(response.data);
			var tmp = response.data;
				for(var i=0; i<tmp.length; ++i) {
					tmp[i]["mergedName"] = mergedName(tmp[i].name, tmp[i].fid);
			}
			setFacultyArray(tmp);
			setNewFaculty(tmp[0].mergedName);
		} catch (e) {
			console.log(e);
			alert("Error Fetching Faculty");
		}
	}

		async function getFacultySchedule(fid) {
			console.log(fid);
			try {
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/getfacultyblock/${fid}`;
				const response = await axios.get(myUrl);
				//console.log(response.data);
				setTeachedSchedule(response.data);
			} 
			catch (e) {
				console.log(e);
				alert("Error Fetching Faculty qdwqdwqdwqdq");
			}
		}

		// get the data
		var myData = sessionStorage.getItem("batchInfo");
		if (!myData) {
			alert("Direct call not permitted");
			setTab(process.env.REACT_APP_FACULTY);
		}
		var tmp = JSON.parse(myData);
		if (tmp.status === STATUS_INFO.FACULTYSCHEDULE) {
			mode = "ADD";
			origBatchRec = tmp.record;
		} 
		else {
			alert("Invalid status batch");
			setTab(process.env.REACT_APP_FACULTY);
		}
		sessionStorage.removeItem("batchInfo");

		// now Start
		console.log(origBatchRec.fid);
		setFacultyName([mergedName(origBatchRec.facultyName, origBatchRec.fid)]);
		getFacultySchedule(origBatchRec.fid);
		//getAllFaculty();
		
		handleResize();
		window.addEventListener('resize', handleResize);
		
	}, [])

// function handleTimer() {}

function mainCancel() {
	var batchInfo = {inUse: true, status: STATUS_INFO.CANCEL, msg: "", record: null };
	sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
	setTab(process.env.REACT_APP_BATCH);
}

function ShowResisterStatus() {
			//console.log(`Status is ${registerStatus}`);
			let myMsg;
			let errmsg = true;
			switch (registerStatus) {
				case 200:
					myMsg = "Successfully updated Captain / ViceCaptain details";
					errmsg = false;
					break;
				case 0:
					myMsg = "";
					errmsg = false;
					break;
				case -1:
					myMsg = "Area Code cannot be blank";
					break;
				case -2:
					myMsg = `Area Code cannot be more than ${MAXAREACODELENGTH} characters`;
					break;
				case -3:
					myMsg = "Area code already in use";
					break;
				case -4:
					myMsg = "Area description cannot be blank";
					break;
				case 501:
					myMsg = "Student name is blank";
					break;
				case 502:
					myMsg = "Duplicate entry of student in Batch";
					break;
				case 511:
					myMsg = "Duplicate entry of session in Batch";
					break;
				case 521:
					myMsg = "No students selected in Batch";
					break;
				case 522:
					myMsg = "No sessions selected in Batch";
					break;
				default:
					myMsg = "Error updating Captain / ViceCaptain details";
					break;
			}
			//console.log(errmsg, registerStatus);
			let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
			return(
				<div align="center">
					<Typography align="center" className={myClass}>{myMsg}</Typography>
				</div>
			);
		}

async function handleAddEditSubmit() {

	if (batchStudents.length === 0) {
		setRegisterStatus(521);
		return;
	}
	if (batchSessions.length === 0) {
		setRegisterStatus(522);
		return;
	}
	
	console.log("All okay");
	var myData = {};
	var tmp = facultyName.find( x => x.mergedName === newArea);
	myData["area"] = tmp.shortName;
	tmp = facultyArray.find( x => x.mergedName === newFaculty);
	myData["faculty"] = tmp;
	myData["fees"] = Number(newFess);
	tmp = DURATIONSTR.find(x => x.name === sessDuration);
	myData["duration"] = Number(tmp.block);
	myData["students"] = batchStudents;
	myData["sessions"] = batchSessions;
	console.log(myData);
	
	var myJsonData = JSON.stringify(myData);
	var finalData = encodeURI(myJsonData);

	var batchRec;
	try {
		if (mode == "ADD") {
		// for add new batch
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/batch/add/${finalData}`;
			var response = await axios.get(myUrl);
			//alert("Successfully added details of new batch");
			var batchInfo = {inUse: true, status: STATUS_INFO.OKAY, msg: `Successfully added batch ${response.data.bid}.`, record: response.data };
			sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		}
		else {
			// for edit user
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/batch/update/${origBatchRec.sid}/${userName}/${encrypt(password)}/${encrypt(email)}/${mobile}/${a1}/${a2}/${a3}/${a4}/${pName}/${pMob}`;	
			//console.log(myUrl);
			var response = await axios.get(myUrl);
			//var tmp = masterBatchArray.filter(x => x.uid !== batchRec.uid);
			//tmp = tmp.concat([response.data])
			//tmp = lodashSortBy(tmp, 'name');
			//setMasterBatchArray(tmp
			
			var batchInfo = {inUse: true, status: STATUS_INFO.OKAY, msg: `Successfully updated batch ${response.data.bid}.`, record: response.data };
			sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
			
			//filterBatch(tmp, currentSelection);
			//setDrawer("");
			//alert("Successfully edit details of " + userName);
		}
	}
	catch (e) {
		console.log("Error");
		var batchInfo = {inUse: true, status: STATUS_INFO.ERROR, msg: "Error adding/updating batch.", record: null };
		sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
	}
	setTab(process.env.REACT_APP_BATCH)
}

function handleAdd() {
	console.log("In add");

	setDrawer("New");
}

async function handleEdit(r) {
	//console.log(r);
	setBatchtRec(r);
	// Now get the user record
	var myUser;
	try {
		var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/acagetbyid/${r.uid}`);
		myUser = resp.data;
		//console.log(myUser);
		setUserRec(myUser);
	}
	catch (e) {
		alert('Error while fetching user record');
		setBatchtRec(null);
		return;
	}
	setUserName(myUser.displayName);

	setDrawer("Edit");
}

function handleInfo(r) {
	setBatchtRec(r);
	setDrawerDetail("detail");
}

function DisplayAllToolTips() {
return(
	<div>
	{batchArray.map( t =>
		<DisplaySingleTip id={"USER"+t.uid} />
	)}
	</div>
)}

function DisplaySingleTip(props) {
	return null; //<Tooltip className={gClasses.tooltip} backgroundColor='#42EEF9' borderColor='black' arrowColor='blue' textColor='black' key={props.id} type="info" effect="float" id={props.id} multiline={true}/>
}

async function handleDisableBatch(rec) {
	console.log("In disabled");
	let myRec = masterBatchArray.find(x => x.bid === rec.bid);
	console.log(myRec);
	/*if (myRec.sess != "") {
		alert(`Student ${myRec.name} has batche ${myRec.bid} in progress.`);
		return;
	}*/
	try {
		await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/batch/disabled/${myRec.bid}`);
		myRec.enabled = false;
		var allRec  = [].concat(masterBatchArray)
		setMasterBatchArray(allRec);
		filterBatch(allRec, currentSelection);
		setRegisterStatus(0);
	}
	catch (e) {
		// error 
		console.log(e);
		alert("Error disabling student "+x.name);
	}
}

async function handleEnableBatch(rec) {
	let myRec = masterBatchArray.find(x => x.bid === rec.bid);
	try {
		await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/batch/enabled/${myRec.bid}`);
		myRec.enabled = true;
		var allRec  = [].concat(masterBatchArray)
		setMasterBatchArray(allRec);
		filterBatch(allRec, currentSelection);
	}
	catch (e) {
		// error 
		console.log(e);
		alert("Error disabling student "+x.name);
	}
}

function filterBatch(masterArray, x) {
	switch (x) {
		case "Disabled":  setBatchArray(masterArray.filter(x => !x.enabled ));  break;
		case "Enabled":   setBatchArray(masterArray.filter(x => x.enabled ));  break;
		default:          setBatchArray(masterArray);  break;
	}
}

function selectAll(x) {
	setCurrentSelection(x);
	filterBatch(masterBatchArray, x);
}

function handleAddStudent() {
	setOrigHourMinute("");
	setNewStudent("");
	setDrawer("ADDSTUDENT");
}

function handleEditStudent(x) {
	setOrigHourMinute(x.name);
  setNewStudent(x.name);
	setDrawer("EDITSTUDENT");
}


function handleDelStudent(rec) {
	console.log(batchStudents);
	setBatchStudents(batchStudents.filter(x => x.name !== rec.name));
	setRegisterStatus(0);
}


function handleAddSession() {
	setOrigDay("");
	setOrigHourMinute("");
	setNewDay(SHORTWEEKSTR[0]);
	setNewHourMinute("03:00 PM");
	setDrawer("ADDSESSION");
}

function handleEditSession(x) {
	setOrigDay(x.day);
	setNewDay(x.day);
  setOrigHourMinute(x.name);
	setNewHourMinute(x.name);
	//setNewMin(x.min);
	setDrawer("EDITSESSION");
}


function handleDelSession(rec) {
	setBatchSessions(batchSessions.filter(x => x.name !== rec.name));
	setRegisterStatus(0);
}



function handleAddEditSubmitStudent() {
	//console.log("Studnet " + newStudent + " selected");

	// if student not chnaged during edit. noting to do
	if ((drawer == "EDITSTUDENT") && (origHourMinute == newStudent)) {
		setDrawer("");
		return;
	}
	else if (newStudent == "") {
		setRegisterStatus(501);
		return;
	}
	
	var studentName = getNameFromMergedName(newStudent);
	var studentId = getCodeFromMergedName(newStudent);
	console.log(studentName, studentId, batchStudents);
	var tmp = batchStudents.find(x => x.name == studentName && x.sid === studentId);
	if (tmp) {
		setRegisterStatus(502);
		return;
	}
	
	// New student validation done
	if (drawer == "ADDSTUDENT") {
		var newStudentRec = facultySchedule.find(x => x.name === studentName);
		tmp = batchStudents.concat([newStudentRec]);
		setBatchStudents(tmp)		
	}
	else {
		var newStudentRec = facultySchedule.find(x => x.name === studentName);
		var tmp = batchStudents.filter(x => x.name != origHourMinute);		// delete old student
		setBatchStudents( tmp.concat([newStudentRec]));						// add new studennt
	}
	setDrawer("");
}



function handleAddEditSubmitSession() {

	// check for duplicate sessio time
	console.log(origDay, origHourMinute, newHourMinute, newDay);

	if ((origHourMinute !== newHourMinute) && (origDay !== newDay)) {
		var tmp = batchSessions.find(x => x.name === newHourMinute && x.day === newDay);
		console.log(tmp);
		if (tmp) {
			setRegisterStatus(511);
			return;
		}
	}
	
	// get record of session start Time
	//console.log(newHourMinute, newDay);
	var startTimeRec = BATCHTIMESTR.find(x => x.name === newHourMinute);
	//console.log(startTimeRec);
	var clonedArray = [].concat(batchSessions);
	if (drawer === "ADDSESSION") {
		clonedArray.push({name: startTimeRec.name, hour: startTimeRec.hour, min: startTimeRec.min, block: startTimeRec.block, day: newDay })
	}
	else {
		var tmp = clonedArray.find(x => x.name === origHourMinute && x.day === origDay);
		tmp.name = newHourMinute;
		tmp.hour = startTimeRec.hour;
		tmp.min = startTimeRec.min;
		tmp.block = startTimeRec.block;
		tmp.day = newDay;
	}
	setBatchSessions(clonedArray);
	setRegisterStatus(0);
	setDrawer("");
}

function testfun(xxx) {
	console.log(xxx);
	setNewHourMinute(xxx);
}

// style={{marginTop: "5px" }}  
function DisplayOptions() {
return (
<Grid key="Options" className={gClasses.noPadding} container alignItems="center" >
	<Grid  item xs={3} sm={2} md={2} lg={1} >
		<VsSelect size="small" align="center" label="Selection" options={ALLSELECTIONS} value={currentSelection} onChange={(event) => { selectAll(event.target.value)}} />
	</Grid>
	<Grid align="left"  item xs={6} sm={7} md={8} lg={10} >
		<span></span>
	</Grid>
	<Grid  item xs={3} sm={3} md={2} lg={1} >
		<VsButton name="New Batch" align="right" onClick={handleAdd} />
	</Grid>
</Grid>
)}
	
	//console.log(dispType);
	return (
	<div align="center">
		<DisplayPageHeader headerName="Faculty Schedule" groupName="" tournament="" />
		<br />
		<Grid key="FACULTYSCHEDULE" className={gClasses.noPadding} container alignItems="flex-start" >
			<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={6} sm={6} md={3} lg={3} >
				<Typography className={gClasses.info18Blue} >Faculty</Typography>
			</Grid>
			<Grid item xs={6} sm={6} md={3} lg={3} >
				{/*<VsSelect size="small" align="center" options={facultyName} value={facultyName[0]}  />			*/}
			</Grid>
			{((dispType == "xs") || (dispType == "sm")) &&
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
			}
			<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={12} sm={12} md={12} lg={12} >
				<Table  align="center">
				<TableHead p={0}>
				<TableRow key="header" align="center">
					<TableCell className={gClasses.th} p={0} align="center">Time</TableCell>
					<TableCell className={gClasses.th} p={0} align="center">Mon</TableCell>
					<TableCell className={gClasses.th} p={0} align="center">Tue</TableCell>
					<TableCell className={gClasses.th} p={0} align="center">Wed</TableCell>
					<TableCell className={gClasses.th} p={0} align="center">Thu</TableCell>
					<TableCell className={gClasses.th} p={0} align="center">Fri</TableCell>
					<TableCell className={gClasses.th} p={0} align="center">Sat</TableCell>
					<TableCell className={gClasses.th} p={0} align="center">Sun</TableCell>
				</TableRow>
				</TableHead>
				<TableBody p={0}>
					{teacherSchedule.slice(BLOCK_START, BLOCK_END+1).map( (x, index) => {
							var myClasses = gClasses.td;
							//console.log(index, x);
							var tmp = BATCHTIMESTR[index];
							//console.log(index, tmp.name);
				
						return (
						<TableRow key={index} align="center">
							<TableCell align="center" className={gClasses.th} p={0} >{BATCHTIMESTR[index].name}</TableCell>
							<TableCell align="center" className={(x[0] === "") ? gClasses.disabledtd : gClasses.td} p={0} >{(x[0] !== "") ? x[0] : "Free"}</TableCell>
							<TableCell align="center" className={(x[1] === "") ? gClasses.disabledtd : gClasses.td} p={0} >{(x[1] !== "") ? x[1] : "Free"}</TableCell>
							<TableCell align="center" className={(x[2] === "") ? gClasses.disabledtd : gClasses.td} p={0} >{(x[2] !== "") ? x[2] : "Free"}</TableCell>
							<TableCell align="center" className={(x[3] === "") ? gClasses.disabledtd : gClasses.td} p={0} >{(x[3] !== "") ? x[3] : "Free"}</TableCell>
							<TableCell align="center" className={(x[4] === "") ? gClasses.disabledtd : gClasses.td} p={0} >{(x[4] !== "") ? x[4] : "Free"}</TableCell>
							<TableCell align="center" className={(x[5] === "") ? gClasses.disabledtd : gClasses.td} p={0} >{(x[5] !== "") ? x[5] : "Free"}</TableCell>
							<TableCell align="center" className={(x[6] === "") ? gClasses.disabledtd : gClasses.td} p={0} >{(x[6] !== "") ? x[6] : "Free"}</TableCell>
						</TableRow>
					)})}
				</TableBody>
				</Table>				
			</Grid>
		</Grid>
		
		<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		</Box>
	</div>
	)
}
