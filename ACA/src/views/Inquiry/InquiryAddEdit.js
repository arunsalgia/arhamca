import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import { TextareaAutosize, TextField } from '@material-ui/core';

//import Drawer from '@material-ui/core/Drawer';
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
	INQUIRYSTATUS, MAXDISPLAYTEXTROWS,
} from 'views/globals';

import {
	mergedName, getCodeFromMergedName, getNameFromMergedName,
	getAreafromBid,
} from 'views/functions';

const spacing = "5px"


export default function InquiryAddEdit(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();

	
	const [currentSelection, setCurrentSelection] = useState(ALLSELECTIONS[0]);
	
	const [areaArray, setAreaArray] = useState([]);
	
	const [newArea, setNewArea] = useState("");
	const [newContactName, setNewContactName] = useState("");
	const [newContactNumber, setNewContactNumber] = useState("");
	const [newContactReference, setNewContactReference] = useState("");
	const [status, setStatus] = useState(INQUIRYSTATUS[0]);
	const [myNotes, setMyNotes] = useState("");

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
			try {
				if (myArea === "") {
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/area/list`;
					const response = await axios.get(myUrl);
					//console.log(response.data);
					var allAreas = response.data;				
				}
				else {
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/area/get/longname/${myArea}`;
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
				toast.error("Error Fetching area");
			}
		}
		
		getAllAreas( (props.mode === "EDIT") ?	props.inquiryRec.area : "" );
		
		// other batch infor set if props.mode 
		if (props.mode === "EDIT") {
			setNewContactName(props.inquiryRec.contactName);
			setNewContactNumber(props.inquiryRec.contactNumber);
			setNewContactReference(props.inquiryRec.contactReference);
			setMyNotes(props.inquiryRec.remarks);
			setStatus(props.inquiryRec.status);
		}
		
		handleResize();
		window.addEventListener('resize', handleResize);
	}, [])

// function handleTimer() {}

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
	var myData = {};
	var tmp = areaArray.find( x => x.mergedName === newArea);
	myData["_id"] = (props.mode === "EDIT") ?	props.inquiryRec._id : "" ;
	myData["area"] = tmp.longName;
	myData["contactName"] = newContactName;
	myData["contactNumber"] = newContactNumber;
	myData["contactEmail"] = ""
	myData["reference"] = newContactReference;
	myData["status"] = status;
	myData["remarks"] = myNotes;

	//console.log(myData);
	
	var myJsonData = JSON.stringify(myData);
	var finalData = encodeURI(myJsonData);

	//console.log(props.mode);
	var inquiryRec;
	try {
		if (props.mode == "ADD") {
		// for add new inquiry
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inquiry/add/${finalData}`;
			var response = await axios.get(myUrl);
			props.onReturn.call(this, {status: STATUS_INFO.SUCCESS, inquiryRec: response.data, msg: `Successfully added inquiry.`} );
			return;
		}
		else {
			// for edit user
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inquiry/update/${finalData}`;	
			//console.log(myUrl);
			var response = await axios.get(myUrl);
			props.onReturn.call(this, {status: STATUS_INFO.SUCCESS, inquiryRec: response.data, msg: `Successfully updated inquiry.`} );
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
			toast.error(myMessage);
		}
		else {
			props.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: myMessage});
		}
		return;
	}
	
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
	<DisplayPageHeader headerName={ (props.mode ==="ADD") ? "New Inquiry" : `Edit inquiry` } groupName="" tournament="" />
		<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<ValidatorForm margin={2} align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}  >
		<Grid key="ADDEDITINQUIRY" className={gClasses.noPadding} container >
			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left"  className={gClasses.info18Blue} >Area</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<VsSelect size="small" align="left" options={areaArray} field="mergedName" value={newArea} onChange={(event) => { setNewArea(event.target.value)}} />
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />
			
			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left"  className={gClasses.info18Blue} >Name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={3} >
				<TextValidator variant="outlined" required fullWidth id="userName" name="username"
						validators={['required', 'minLength', 'noSpecialCharacters']}
						errorMessages={['User Name to be provided', 'Mimumum 6 characters required', ]}
						value={newContactName} onChange={() => { setNewContactName(event.target.value) }}
				/>
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />

			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left"  className={gClasses.info18Blue} >Contact</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={3} >
				<TextValidator variant="outlined" required fullWidth name="mobile"
					validators={['required', 'mobile']}
					errorMessages={[, 'Mobile to be provided', '10 digit mobile number required']}
					value={newContactNumber} onChange={(event) => setNewContactNumber(event.target.value)}
				/>
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />

			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left"  className={gClasses.info18Blue} >Reference</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={3} >
				<TextValidator variant="outlined"  fullWidth id="userName" name="username"
					value={newContactReference} onChange={() => { setNewContactReference(event.target.value) }}
				/>
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />

			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left" className={gClasses.info18Blue} >Status</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<VsSelect size="small" align="left" options={INQUIRYSTATUS} value={status} onChange={(event) => { setStatus(event.target.value)}} />
			</Grid>
			<Grid style={{margin: spacing }} item xs={12} sm={12} md={12} lg={12} />
			<Grid style={{margin: spacing }} item xs={12} sm={12} md={12} lg={12} />

			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left" className={gClasses.info18Blue}>Remarks</Typography>
			</Grid>
			<Grid item xs={6} sm={6} md={3} lg={4} >
				<TextareaAutosize maxRows={MAXDISPLAYTEXTROWS} className={gClasses.textAreaFixed}  value={myNotes} onChange={() => {setMyNotes(event.target.value)}} />
			</Grid>
			<br />
			<ShowResisterStatus />
			<br />
			<Grid item xs={3} sm={3} md={4} lg={5} />
			<Grid item xs={12} sm={12} md={12} lg={12} >
				<VsButton type="submit" name={(props.mode == "EDIT") ? "Update Inquiry" : "Add Inquiry"} />
			</Grid>
		</Grid>
			</ValidatorForm>
			<ValidComp />   
		</Box>
		<ToastContainer />
	</div>
	)
}
