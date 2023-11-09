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
		} catch (e) {
			console.log(e);
			alert("Error Fetching Faculty");
		}
	}


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

		//console.log(origBatchRec.fid);
		setNewFaculty(mergedName(origBatchRec.facultyName, origBatchRec.fid));

		getAllFaculty();

		getFacultySchedule(origBatchRec.fid);
		// now Start

		
		handleResize();
		window.addEventListener('resize', handleResize);
		
	}, [])


	async function getFacultySchedule(fid) {
		//console.log(fid);
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

	function  handleNewFaculty(newMergedFacultyName) {
		var newFid = getCodeFromMergedName(newMergedFacultyName);
		getFacultySchedule(newFid)
		var tmp = facultyArray.find(x => x.fid === newFid);
		setNewFaculty(tmp.mergedName);
	}

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
				<VsSelect size="small" align="center" options={facultyArray} field="mergedName" value={newFaculty} onChange={(event) => { handleNewFaculty(event.target.value)}} />			
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
							<TableCell align="center" className={(x[0] === "") ? gClasses.disabledtdrounded : gClasses.tdrounded} p={0} >{(x[0] !== "") ? x[0] : "Free"}</TableCell>
							<TableCell align="center" className={(x[1] === "") ? gClasses.disabledtdrounded : gClasses.tdrounded} p={0} >{(x[1] !== "") ? x[1] : "Free"}</TableCell>
							<TableCell align="center" className={(x[2] === "") ? gClasses.disabledtdrounded : gClasses.tdrounded} p={0} >{(x[2] !== "") ? x[2] : "Free"}</TableCell>
							<TableCell align="center" className={(x[3] === "") ? gClasses.disabledtdrounded : gClasses.tdrounded} p={0} >{(x[3] !== "") ? x[3] : "Free"}</TableCell>
							<TableCell align="center" className={(x[4] === "") ? gClasses.disabledtdrounded : gClasses.tdrounded} p={0} >{(x[4] !== "") ? x[4] : "Free"}</TableCell>
							<TableCell align="center" className={(x[5] === "") ? gClasses.disabledtdrounded : gClasses.tdrounded} p={0} >{(x[5] !== "") ? x[5] : "Free"}</TableCell>
							<TableCell align="center" className={(x[6] === "") ? gClasses.disabledtdrounded : gClasses.tdrounded} p={0} >{(x[6] !== "") ? x[6] : "Free"}</TableCell>
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
