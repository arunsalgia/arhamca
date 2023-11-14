import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { TextareaAutosize } from '@material-ui/core';
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

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

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
import VsCheckBox from "CustomComponents/VsCheckBox";



import {
	ROLE_FACULTY , ROLE_STUDENT,
	ALLSELECTIONS, BLANKCHAR,
	NOFRACTION,
	SHORTWEEKSTR, HOURBLOCKSTR, MINUTEBLOCKSTR, SESSIONHOURSTR,
	STATUS_INFO,
	MAXDISPLAYTEXTROWS,
} from 'views/globals';

import {
	mergedName, getCodeFromMergedName, getNameFromMergedName,
	disablePastDt, disableFutureDt,
} from 'views/functions';


var mode = "ADD";

export default function SessionAddEdit(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();
	//const alert = useAlert();
	
	//const [origSessionRec, setOrigSessionRec] = useState(null);
	//const [origBatchRec, setOrigBatchRec] = useState(null);
	//const [origBid, setOrigBid] = useState("");

	const [cbArray, setCbArray] = useState(Array(25).fill(true));
	const [sessionDate, setSessionDate] = useState(new Date());
	
	//const [currentSelection, setCurrentSelection] = useState(ALLSELECTIONS[0]);
	
	//const [areaArray, setAreaArray] = useState([]);
	const [studentArray, setStudentArray] = useState([]);
	///const [batchArray, setBatchArray] = useState([]);
	//const [facultyArray, setFacultyArray] = useState([]);
	//const [masterBatchArray, setMasterBatchArray] = useState([]);
	//const [sessionNumber, setSessionNumber] = useState("NEW");
	const [myNotes, setMyNotes] = useState("");
	
	//const [userName, setUserName] = useState("");
	//const [email, setEmail] = useState("");
	//const [mobile, setMobile] = useState("");
	//const [batchRec, setBatchtRec] = useState(null);
	//const [userRec, setUserRec] = useState(null);
	
	//const [newArea, setNewArea] = useState("");
	//const [newFaculty, setNewFaculty] = useState("");

	//const [sessHour, setSessHour] = useState(SESSIONHOURSTR[0]);

	//const [newStudent, setNewStudent] = useState("");
	//const [batchStudents, setBatchStudents] = useState([]);
	//const [batchSessions, setBatchSessions] = useState([]);
	
	//const [newDay, setNewDay] = useState("");
	//const [newHour, setNewHour] = useState("");
	//const [newMin, setNewMin] = useState("");
	//const [newFess, setNewFees] = useState(200);
	//const [sessId, setSessId] = useState(0);
	
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

		async function getAllStudents(sidList) {
		try {
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/student/list/selected/${sidList}`;
			const response = await axios.get(myUrl);
			console.log(response.data);
			setStudentArray(response.data);
			var filledArray = Array(response.data.length).fill(true);
			setCbArray(filledArray);
			
		} catch (e) {
			console.log(e);
			alert("Error Fetching Studnets");
		}
	}

		setOrigBatchRec(props.batchRec);
		setOrigSessionRec(null);
		ssetOrigBid(props.batchRec.bid);
		mode = (!props.sessionRec) ?	"ADD" : "EDIT";
		getAllStudents(props.batchRec.sid)
		
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

	// luckily not validation required
	var myData = {};
	console.log(origBatchRec)
	myData["batchData"] = origBatchRec;
	myData["remarks"] = myNotes;
	myData["sessionDate"] = sessionDate;
	var attendanceSid = [];
	for(var i=0; i<origBatchRec.sid.length; ++i) {
		if (cbArray[i]) attendanceSid.push(origBatchRec.sid[i]);
	}
	console.log(attendanceSid);
	myData["attendanceList"] = attendanceSid;
	console.log(myData);
	
	var myJsonData = JSON.stringify(myData);
	var finalData = encodeURI(myJsonData);

	//var batchRec;
	var myMsg = "";
	try {
		if (mode == "ADD") {
		// for add new batch
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/session/add/${finalData}`;
			var response = await axios.get(myUrl);
			//alert("Successfully added details of new batch");
			alert(`Successfully added session of batch ${response.data.bid}.`);
			
		}
		else {
			// for edit user
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/batch/update/${origBatchRec.sid}/${userName}/${encrypt(password)}/${encrypt(email)}/${mobile}/${a1}/${a2}/${a3}/${a4}/${pName}/${pMob}`;	
			//console.log(myUrl);
			var response = await axios.get(myUrl);
			alert(`Successfully updated batch ${response.data.bid}.`);
		}
	}
	catch (e) {
		console.log("Error");
		alert("Error adding/updating session.");
	}
}


function handleSessionDate(d) {
	setSessionDate(d.toDate());
}


function handlePresentAbsent(idx, state) {
	//console.log(cbArray);
	var tmp =[].concat(cbArray);
	tmp[idx] = state;
	setCbArray(tmp);
	//console.log(tmp);
}


	return (
	<div align="center">
		<DisplayPageHeader headerName={(mode == "ADD") ? `Add session of batch ${props.batchRec.bid}` : `Edit Session of batch ${props.batchRec.bid}`} groupName="" tournament="" />
		<br />
		<ValidatorForm margin={2} align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}  >
		<Grid key="ADDEDITBATCH" className={gClasses.noPadding} container alignItems="flex-start" >
			{((dispType == "md") || (dispType == "lg")) &&
				<Grid item xs={6} sm={6} md={3} lg={5} />
			}
			<Grid item xs={6} sm={6} md={3} lg={1} >
				<Typography className={gClasses.info18Blue} >Session Date</Typography>
			</Grid>
			<Grid item xs={6} sm={6} md={3} lg={1} >
				<Datetime 
					className={gClasses.dateTimeBlock}
					inputProps={{className: gClasses.dateTimeNormal}}
					timeFormat={false} 
					initialValue={sessionDate}
					dateFormat="DD/MM/yyyy"
					isValidDate={disableFutureDt}
					onClose={handleSessionDate}
				/>
			</Grid>
			{((dispType == "md") || (dispType == "lg")) &&
				<Grid item xs={6} sm={6} md={3} lg={5} />
			}
			<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
			{((dispType == "md") || (dispType == "lg")) &&
				<Grid item xs={6} sm={6} md={4} lg={4} />
			}				
			<Grid style={{margin: "10px"}} item xs={12} sm={12} md={4} lg={4} >
				<Typography className={gClasses.info18Blue}>Students Attendance</Typography>
				<Table  align="center">
				<TableHead p={0}>
				<TableRow key="header" align="center">
					<TableCell className={gClasses.th} p={0} align="center">Student</TableCell>
					<TableCell className={gClasses.th} p={0} align="center">Attended</TableCell>
				</TableRow>
				</TableHead>
				<TableBody p={0}>
					{studentArray.map( (x, idx)  => {
							var myClasses = gClasses.td;
						return (
						<TableRow key={x.sid} align="center">
							<TableCell align="center" className={myClasses} p={0} >{mergedName(x.name, x.sid)}</TableCell>
							<TableCell align="center" className={myClasses} p={0} >
								<VsCheckBox align="center" checked={cbArray[idx]} onClick={() => handlePresentAbsent(idx, event.target.checked)} /> 
							</TableCell>
						</TableRow>
					)})}
				</TableBody>
				</Table>
			</Grid>
			{((dispType == "md") || (dispType == "lg")) &&
				<Grid item xs={6} sm={6} md={4} lg={4} />
			}	
			<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
			{((dispType == "md") || (dispType == "lg")) &&
				<Grid item xs={6} sm={6} md={4} lg={4} />
			}	
			<Grid item xs={12} sm={12} md={4} lg={4} >
				<Typography className={gClasses.info18Blue}>Remarks</Typography>
				<TextareaAutosize maxRows={MAXDISPLAYTEXTROWS} className={gClasses.textAreaFixed}  value={myNotes} onChange={() => {setMyNotes(event.target.value)}} />
			</Grid>
			{((dispType == "md") || (dispType == "lg")) &&
				<Grid item xs={6} sm={6} md={4} lg={4} />
			}	
			<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
			<br />
			<ShowResisterStatus />
			<br />
			<Grid item xs={12} sm={12} md={12} lg={12} >
				<VsButton type="submit" name={(mode == "EDIT") ? "Update Session" : "Add Session"} />
			</Grid>
		</Grid>
		</ValidatorForm>
		<ValidComp />   
	</div>
	)
}