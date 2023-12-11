import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
//import Tooltip from "react-tooltip";
//import ReactTooltip from 'react-tooltip'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";
import Container from '@material-ui/core/Container';

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

import globalStyles from "assets/globalStyles";

import {setTab} from "CustomComponents/CricDreamTabs.js"

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";
import VsRadioGroup from "CustomComponents/VsRadioGroup";

//const ALLROLES = ["Student", "Faculty", "Admin"];

import {
	ROLE_FACULTY , ROLE_STUDENT, ROLE_MANAGERFACULTYSTUDENT,
	ALLSELECTIONS, BLANKCHAR,
	NOFRACTION,
	SHORTWEEKSTR, HOURBLOCKSTR, MINUTEBLOCKSTR, SESSIONHOURSTR,
	STATUS_INFO,
	DURATIONSTR,
	BATCHTIMESTR,
} from 'views/globals';

import {
	isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	mergedName, getCodeFromMergedName, getNameFromMergedName,
	getAreafromBid,
	showError, showSuccess, showInfo,
} from 'views/functions';


export default function BonusAddEdit(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();

	const [role, setRole] = useState(ROLE_FACULTY);
	const [currentSelection, setCurrentSelection] = useState(ALLSELECTIONS[0]);
	const [userArray, setUserArray] = useState([]);
	const [filterUserArray, setFilterUserArray] = useState([]);
	const [userName, setUserName] = useState("");
	
	const [areaArray, setAreaArray] = useState([]);

	const [batchArray, setBatchArray] = useState([]);
	const [facultyArray, setFacultyArray] = useState([]);
	const [masterBatchArray, setMasterBatchArray] = useState([]);
	
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

		async function getAllAreas(myArea) {
			var allAreas = [];
			try {
				if (myArea === "") {
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/area/list`;
					const response = await axios.get(myUrl);
					//console.log(response.data);
					var allAreas = response.data;				
				}
				else {
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/area/get/shortname/${myArea}`;
					const response = await axios.get(myUrl);
					var allAreas = [response.data];
				}
				for(var i=0; i<allAreas.length; ++i) {
					allAreas[i]["mergedName"] = mergedName(allAreas[i].longName, allAreas[i].shortName);
				}
				setNewArea(allAreas[0].mergedName);
				setAreaArray(allAreas);
			} catch (e) {
				console.log(e);
				showError("Error Fetching area");
			}
		}
		

		async function getAllFaculty(myFid) {	
			var myFacultys = [];
			try {
				if (myFid == "") {
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/list/enabled`;
					const response = await axios.get(myUrl);
					myFacultys = response.data;
				}
				else {
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/get/${myFid}`;
					const response = await axios.get(myUrl);
					myFacultys = [response.data];
				}
				for(var i=0; i<myFacultys.length; ++i) {
					myFacultys[i]["mergedName"] = mergedName(myFacultys[i].name, myFacultys[i].fid);
				}
				setFacultyArray(myFacultys);
				setNewFaculty(myFacultys[0].mergedName);
			} catch (e) {
				console.log(e);
				showError("Error Fetching Faculty");
			}
		}

		
		async function getAllUsers() {
			try {
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/acabrieflist`;
				const response = await axios.get(myUrl);
				var tmp = response.data;
				for(var i=0; i<tmp.length; ++i) {
					tmp[i]["mergedName"] = mergedName(tmp[i].displayName, tmp[i].role);
				}
				//console.log(response.data);
				setUserArray(tmp);
				var tmp1 = tmp.filter(x => x.role === role) ;
				setFilterUserArray( tmp1 );
				if (tmp1.length > 0) setUserName(tmp1[0].mergedName);
			} 
			catch (e) {
				console.log(e);
				showError("Error Fetching Students");
			}
		}
		// get the data
		getAllAreas( (props.mode === "EDIT") ?	getAreafromBid(props.bonusRec.bid) : "" );
		getAllFaculty( (props.mode === "EDIT") ?	props.bonusRec.fid : "");
		getAllUsers();
		console.log("Add bonus 2");

		if (props.mode === "EDIT") {
			setNewFees(props.bonusRec.fees);
			var myRec = DURATIONSTR.find(x => x.block === props.bonusRec.sessionTime);
			setSessDuration(myRec.name);
			
			// Get the session details
			var bSessions = [];
			for(var i=0; i<props.bonusRec.timings.length; ++i) {
				//console.log(props.bonusRec.timings[i].hour, props.bonusRec.timings[i].minute);
				var dRec = BATCHTIMESTR.find(x => (x.hour == props.bonusRec.timings[i].hour) && (x.min === props.bonusRec.timings[i].minute) );
				//console.log(dRec);
				bSessions.push({name: dRec.name, hour: dRec.hour, min: dRec.min, block: dRec.block, day: props.bonusRec.timings[i].day });
			}
			setBatchSessions(bSessions);
		}
		
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

async function handleAddEditBonusSubmit() {

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
	var tmp = areaArray.find( x => x.mergedName === newArea);
	myData["area"] = tmp.shortName;
	tmp = facultyArray.find( x => x.mergedName === newFaculty);
	myData["faculty"] = tmp;
	myData["fees"] = Number(newFess);
	tmp = DURATIONSTR.find(x => x.name === sessDuration);
	myData["duration"] = Number(tmp.block);
	myData["students"] = batchStudents;
	myData["sessions"] = batchSessions;
	// findally add batch record. Required for Update
	myData["batchRec"] = props.bonusRec;
	console.log(myData);
	
	var myJsonData = JSON.stringify(myData);
	var finalData = encodeURI(myJsonData);

	console.log(props.mode);
	var batchRec;
	try {
		if (props.mode == "ADD") {
		// for add new batch
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/batch/add/${finalData}`;
			var response = await axios.get(myUrl);
			props.onReturn.call(this, {status: STATUS_INFO.SUCCESS, batchRec: response.data, msg: `Successfully added batch ${response.data.bid}.`} );
			return;
		}
		else {
			// for edit user
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/batch/update/${finalData}`;	
			//console.log(myUrl);
			var response = await axios.get(myUrl);
			props.onReturn.call(this, {status: STATUS_INFO.SUCCESS, batchRec: response.data, msg: `Successfully updated batch ${response.data.bid}.`} );
			return;
		}
	}
	catch (e) {
		console.log(e);
		var myMessage = "Error in add/update batch";
		var stayback = false;
		if (e.response)
		switch (e.response.status) {
			case 601: 
				myMessage = "Student(s) not assigned"; 
				stayback = true; 
				break;
			case 602: 
				myMessage = "Session(s) not assigned"; 
				stayback = true; 
				break;
			case 603: myMessage = "Student(s) aready assigned batch"; 
				stayback = true; 
				break;
			case 604: myMessage = "faculty block clash"; 
				stayback = true; 
				break;
			case 605: 
				myMessage = "test edit batch error";  
				break;
		}
		
		if (stayback) {
			showError(myMessage);
		}
		else {
			props.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: myMessage});
		}
		return;
	}
	
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
		showError('Error while fetching user record');
		setBatchtRec(null);
		return;
	}
	setUserName(myUser.displayName);

	setDrawer("Edit");
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
		var newStudentRec = userArray.find(x => x.name === studentName);
		tmp = batchStudents.concat([newStudentRec]);
		setBatchStudents(tmp)		
	}
	else {
		var newStudentRec = userArray.find(x => x.name === studentName);
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

	function changeFilterList(newRole) {
		var tmp = userArray.filter(x => x.role == newRole);
		if (tmp.length > 0) {
			setFilterUserArray(tmp);
			setUserName(tmp[0].mergedName);
			setRole(newRole);
		}
		else {
			showError(`No users with role ${newRole}`);
		}
	}

	//console.log(dispType);
	return (
	<div align="center">
	<Container component="main" maxWidth="xs">	
	<DisplayPageHeader headerName={ (props.mode ==="ADD") ? "Add new Bonus" : `Edit Bonus ${props.bonusRec.bid}` } groupName="" tournament="" />
	<br />
	<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} paddingLeft={2} paddingRight={2} >
	<ValidatorForm margin={2} align="center" className={gClasses.form} onSubmit={handleAddEditBonusSubmit}  >
		<VsRadioGroup value={role} radioList={ROLE_MANAGERFACULTYSTUDENT} onChange={(event) => { changeFilterList(event.target.value) } } />
		<Grid key="INFOBATCH" className={gClasses.noPadding} container alignItems="flex-start" >
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography align="left" className={gClasses.info18Blue} >Name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<VsSelect align="left" size="small"  field="mergedName" options={filterUserArray} value={userName} onChange={(event) => { setFilterUserArray(event.target.value)}} />
			</Grid>
		</Grid>
		</ValidatorForm>
		<ValidComp />   
	</Box>
	</Container>
		<Drawer anchor="right" variant="temporary" open={drawer != ""}>
			<Box style={{margin: "20px"}} margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				<VsCancel align="right" onClick={() => { setDrawer("")}} />
				<br />
				<br />
				{((drawer === "ADDSTUDENT") || (drawer === "EDITSTUDENT")) &&
					<div align="center">
					<Typography className={gClasses.info18Blue} >{((drawer === "ADDSTUDENT") ? "Add" : "Edit") +  " Student"}</Typography>
					<br />
					<br />
					<VsSelect size="small" align="center" options={userArray} field="mergedName" value={newStudent} onChange={(event) => { setNewStudent(event.target.value)}} />			
					<br />
					<ShowResisterStatus />
					<br />
					<VsButton type="button" name="Submit Student" onClick={handleAddEditSubmitStudent} />
					</div>
				}
				{((drawer === "ADDSESSION") || (drawer === "EDITSESSION")) &&
					<div align="center">
					<Typography className={gClasses.info18Blue} >{((drawer === "ADDSESSION") ? "Add" : "Edit") + " Session"}</Typography>
					<br />
					<Grid style={{margin: "10px"}} key="ADDSESSION" className={gClasses.noPadding} container alignItems="flex-start" >
						<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
						<Grid item xs={6} sm={6} md={6} lg={6} align="left" >
							<Typography className={gClasses.info18Blue} >Day of the week</Typography>
						</Grid>
						<Grid item xs={6} sm={6} md={6} lg={6} >
							<VsSelect size="small" align="center" options={SHORTWEEKSTR} value={newDay} onChange={(event) => { setNewDay(event.target.value)}} />			
						</Grid>
						<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
						<Grid item xs={6} sm={6} md={6} lg={6} align="left" >
							<Typography className={gClasses.info18Blue} >Start Time</Typography>
						</Grid>
						<Grid item xs={6} sm={6} md={6} lg={6} >
							<VsSelect size="small" align="center" options={BATCHTIMESTR} field="name" value={newHourMinute} onChange={(event) => { setNewHourMinute(event.target.value)}} />			
						</Grid>
					</Grid>
					<br />
					<ShowResisterStatus />
					<br />
					<VsButton type="button" name="Submit Session" onClick={handleAddEditSubmitSession} />
					</div>				
				}
			</Box>
		</Drawer>
		<ToastContainer />
	</div>
	)
}
