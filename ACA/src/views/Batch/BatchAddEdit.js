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
import { isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	showError, showSuccess, showInfo,
} from 'views/functions';

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
} from 'views/globals';

import {
	mergedName, getCodeFromMergedName, getNameFromMergedName,
	getAreafromBid,
} from 'views/functions';


export default function BatchAddEdit(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();

	
	const [currentSelection, setCurrentSelection] = useState(ALLSELECTIONS[0]);
	
	const [areaArray, setAreaArray] = useState([]);
	const [studentArray, setStudentArray] = useState([]);
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

		
		async function getAllStudents() {
			try {
				var subfun = (props.mode == "EDIT") ? "list/freeorbatch/" + props.batchRec.bid :  "list/free";
				console.log(subfun);
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/student/${subfun}`;
				const response = await axios.get(myUrl);
				var tmp = response.data;
				for(var i=0; i<tmp.length; ++i) {
					tmp[i]["mergedName"] = mergedName(tmp[i].name, tmp[i].sid);
				}
				//console.log(response.data);
				setStudentArray(tmp);
				if (props.mode === "ADD") {
					setBatchStudents([]);
				} 
				else {
					setBatchStudents(tmp.filter(x => props.batchRec.sid.includes(x.sid)));
				}
			} 
			catch (e) {
				console.log(e);
				showError("Error Fetching Students");
			}
		}
		// get the data
		getAllAreas( (props.mode === "EDIT") ?	getAreafromBid(props.batchRec.bid) : "" );
		getAllFaculty( (props.mode === "EDIT") ?	props.batchRec.fid : "");
		getAllStudents();
		
		// other batch infor set if props.mode 
		if (props.mode === "EDIT") {
			setNewFees(props.batchRec.fees);
			var myRec = DURATIONSTR.find(x => x.block === props.batchRec.sessionTime);
			setSessDuration(myRec.name);
			
			// Get the session details
			var bSessions = [];
			for(var i=0; i<props.batchRec.timings.length; ++i) {
				//console.log(props.batchRec.timings[i].hour, props.batchRec.timings[i].minute);
				var dRec = BATCHTIMESTR.find(x => (x.hour == props.batchRec.timings[i].hour) && (x.min === props.batchRec.timings[i].minute) );
				//console.log(dRec);
				bSessions.push({name: dRec.name, hour: dRec.hour, min: dRec.min, block: dRec.block, day: props.batchRec.timings[i].day });
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
	myData["batchRec"] = props.batchRec;
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

function handleAddStudent() {
	setOrigHourMinute("");
	setNewStudent("");
	setDrawer("ADDSTUDENT");
}

function handleEditStudent(x) {
	//console.log(x);
	setOrigHourMinute(x.mergedName);
  setNewStudent(x.mergedName);
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
		var newStudentRec = studentArray.find(x => x.name === studentName);
		tmp = batchStudents.concat([newStudentRec]);
		setBatchStudents(tmp)		
	}
	else {
		var newStudentRec = studentArray.find(x => x.name === studentName);
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
<DisplayPageHeader headerName={ (props.mode ==="ADD") ? "Add new Batch" : `Edit batch ${props.batchRec.bid}` } groupName="" tournament="" />
		<br />
		<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<ValidatorForm margin={2} align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}  >
			<Grid key="ADDEDITBATCH" className={gClasses.noPadding} container alignItems="flex-start" >
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.info18Blue} >Area</Typography>
				</Grid>
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<VsSelect size="small" align="center" options={areaArray} field="mergedName" value={newArea} onChange={(event) => { setNewArea(event.target.value)}} />			
				</Grid>
				{((dispType == "xs") || (dispType == "sm")) &&
					<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				}
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.info18Blue} >Faculty</Typography>
				</Grid>
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<VsSelect size="small" align="center" options={facultyArray} field="mergedName" value={newFaculty} onChange={(event) => { setNewFaculty(event.target.value)}} />			
				</Grid>
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.info18Blue} >Fees</Typography>
				</Grid>
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<TextValidator variant="outlined" required name="auctioncoins" type="number"
						value={newFess} onChange={(event) => setNewFees(event.target.value)}
						validators={['required', 'minNumber:0', 'maxNumber:10000', 'isNumeric']}
						errorMessages={['Session fees to be provided', 'Fees cannot be less than 0', 'Fees cannot be more than 10000',NOFRACTION ]}
					/>
				</Grid>
				{((dispType == "xs") || (dispType == "sm")) &&
					<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				}
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.info18Blue} >Duration</Typography>
				</Grid>
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<VsSelect size="small" align="center" options={DURATIONSTR} field="name" value={sessDuration} onChange={(event) => { setSessDuration(event.target.value)}} />			
				</Grid>
				{((dispType == "xs") || (dispType == "sm")) &&
					<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				}
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={8} sm={8} md={10} lg={10} >
					<Typography className={gClasses.info18Blue}>Batch students</Typography>
				</Grid>
				{ (props.mode === "ADD") &&
					<Grid  item xs={4} sm={4} md={2} lg={2} >
						<VsButton type="button" name="Add Student" onClick={handleAddStudent} />
					</Grid>
				}
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} >
					<Table  align="center">
					<TableHead p={0}>
					<TableRow key="header" align="center">
						<TableCell className={gClasses.th} p={0} align="center">Name</TableCell>
						<TableCell className={gClasses.th} p={0} align="center"></TableCell>
					</TableRow>
					</TableHead>
					<TableBody p={0}>
						{batchStudents.map(x => {
								var myClasses = gClasses.td;
								//console.log(x);
							return (
							<TableRow key={x.sid} align="center">
								<TableCell align="center" className={myClasses} p={0} >{x.mergedName}</TableCell>
								<TableCell align="center" className={myClasses} p={0} >
									<IconButton disabled={props.mode !== "ADD"} color="primary"  size="small" onClick={() => {handleEditStudent(x)}} ><EditIcon /> </IconButton>
									<IconButton disabled={props.mode !== "ADD"} color="secondary"  size="small" onClick={() => {handleDelStudent(x)}} ><CancelIcon /> </IconButton>
								</TableCell>
							</TableRow>
						)})}
					</TableBody>
					</Table>
				</Grid>
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={8} sm={8} md={10} lg={10} >
					<Typography className={gClasses.info18Blue}>Session schedule (per week)</Typography>
				</Grid>
				<Grid  item xs={4} sm={4} md={2} lg={2} >
					<VsButton type="button" name="Add Session" onClick={handleAddSession} />
				</Grid>
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} >
					<Table  align="center">
					<TableHead p={0}>
					<TableRow key="header" align="center">
						<TableCell className={gClasses.th} p={0} align="center">Day</TableCell>
						<TableCell className={gClasses.th} p={0} align="center">Time</TableCell>
						<TableCell className={gClasses.th} p={0} align="center"></TableCell>
					</TableRow>
					</TableHead>
					<TableBody p={0}>
						{batchSessions.map( x => {
								var myClasses = gClasses.td;
								//var timStr = `x.name`;
							return (
							<TableRow key={x.name+x.day} align="center">
								<TableCell align="center"  className={myClasses} p={0} >{x.day}</TableCell>
								<TableCell align="center"  className={myClasses} p={0} >{x.name}</TableCell>
								<TableCell align="center"  className={myClasses} p={0} >
									<IconButton color="primary"  size="small" onClick={() => {handleEditSession(x)}} ><EditIcon /> </IconButton>
									<IconButton color="secondary"  size="small" onClick={() => {handleDelSession(x)}} ><CancelIcon /> </IconButton>
								</TableCell>
							</TableRow>
						)})}
					</TableBody>
					</Table>
				</Grid>
				<br />
				<ShowResisterStatus />
				<br />
				<Grid item xs={12} sm={12} md={12} lg={12} >
					<VsButton align="center" type="submit" name={(props.mode == "EDIT") ? "Update Batch" : "Add Batch"} />
				</Grid>
			</Grid>
			</ValidatorForm>
			<ValidComp />   
		</Box>
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
					<VsSelect size="small" align="center" options={studentArray} field="mergedName" value={newStudent} onChange={(event) => { setNewStudent(event.target.value)}} />			
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
