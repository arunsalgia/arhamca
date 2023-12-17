import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { TextareaAutosize, TextField } from '@material-ui/core';
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
	PAYMENTMODE, PAYMENTSTATUS,
} from 'views/globals';

import {
	mergedName, getCodeFromMergedName, getNameFromMergedName,
	disablePastDt, disableFutureDt,
	showError, showSuccess, showInfo,
} from 'views/functions';


//var props.mode = "ADD";
const spacing = "5px"

export default function PaymentAddEdit(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();
	//const alert = useAlert();

	const [newStudent, setNewStudent] = useState("");
	const [studentArray, setStudentArray] = useState([]);
	const [origStudentRec, setOrigStudentRec] = useState(null);
	const [paymentDate, setPaymentDate] = useState(new Date());
	const [newAmount, setNewAmount] = useState(300);
	const [paymentMode, setPaymentMode] = useState(PAYMENTMODE[0]);
	const [paymentStatus, setPaymentStatus] = useState(PAYMENTSTATUS[0]);
	const [paymentRef, setPaymentRef] = useState("");

	const [drawer, setDrawer] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);

	
	const [origSessionRec, setOrigSessionRec] = useState(null);
	const [origBid, setOrigBid] = useState("");
	const [returnPath, setReturnPath] = useState(process.env.REACT_APP_BATCH);

	const [cbArray, setCbArray] = useState(Array(25).fill(true));
	
	
	const [sessionNumber, setSessionNumber] = useState("NEW");
	const [myNotes, setMyNotes] = useState("");

	const [newFaculty, setNewFaculty] = useState("");


	
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

		async function getAllStudents(mySid) {
			var allRecs = [];
			try {
				if (mySid !== "") {
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/student/get/${mySid}`;
					const response = await axios.get(myUrl);
					allRecs = [response.data];
				}
				else {
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/student/list/all`;
					const response = await axios.get(myUrl);
					//console.log(response.data);
					allRecs = response.data;
				}
				for (var i=0; i<allRecs.length; ++i) {
					allRecs[i]["mergedName"] = mergedName(allRecs[i].name, allRecs[i].sid);
				}
				setStudentArray(allRecs);
				setNewStudent( (allRecs.length > 0) ? allRecs[0].mergedName : "" );
			} catch (e) {
				console.log(e);
				alert("Error Fetching Studnets");
			}
		}
		
		//console.log(props);
		setOrigStudentRec( props.sid );	
		getAllStudents(props.sid);
		//console.log(props.paymentRec);
		if (props.mode !== "ADD") {
			setNewStudent(mergedName(props.paymentRec._id.sid, props.paymentRec._id.studentName));
			var tmp = new Date(props.paymentRec.date)
			setPaymentDate(tmp);
			setPaymentMode(props.paymentRec.mode);
			setPaymentRef(props.paymentRec.reference);
			setNewAmount(props.paymentRec.amount);
			setPaymentStatus(props.paymentRec.status);
			setMyNotes(props.paymentRec.remarks);
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

	// luckily not validation required
	var myData = {};
	//console.log(origStudentRec)
	
	var tmpRec = studentArray.find(x => x.name === getNameFromMergedName(newStudent));
	myData["studentRec"] = tmpRec;
	myData["paymentRec"] = props.paymentRec;
	myData["amount"] = newAmount;
	myData["paymentDate"] = paymentDate;
	myData["paymentMode"] = paymentMode;
	myData["paymentRef"] = paymentRef;
	myData["paymentStatus"] = paymentStatus;
	myData["remarks"] = myNotes;
	
	var myJsonData = JSON.stringify(myData);
	var finalData = encodeURI(myJsonData);

	//var studentRec;
	try {
		if (props.mode == "ADD") {
		// for add new batch
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/payment/add/${finalData}`;
			var response = await axios.get(myUrl);
			props.onReturn.call(this, {status: STATUS_INFO.SUCCESS, paymentRec: response.data, msg: `Successfully added payment of ${newStudent}.`} );
			return;
		}
		else {
			// for edit user
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/payment/update/${finalData}`;	
			//console.log(myUrl);
			var response = await axios.get(myUrl);
			//console.log(response.data);
			props.onReturn.call(this, {status: STATUS_INFO.SUCCESS, paymentRec: response.data, msg: `Successfully updated payment of ${response.data.sid}.`} );
			return;
		}
	}
	catch (e) {
		console.log(e);
		props.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: `Error adding payment of student ${newStudent}.`});
		return;
	}
	
}


function handlePaymentDate(d) {
	setPaymentDate(d.toDate());
}


	return (
	<div align="center">
		<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<DisplayPageHeader headerName={(props.mode == "ADD") ? `Add student payment` : `Edit payment`} groupName="" tournament="" />
		<br />
		<ValidatorForm margin={2} align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}  >
		<Grid key="ADDEDITPAYMENT" className={gClasses.noPadding} container >
			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left"  className={gClasses.info18Blue} >Student</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<VsSelect size="small" align="left" options={studentArray} field="mergedName" value={newStudent} onChange={(event) => { setNewStudent(event.target.value)}} />
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />

			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left"  className={gClasses.info18Blue} >Payment Date</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<div align="left">
				<Datetime 
					className={gClasses.dateTimeBlock}
					inputProps={{className: gClasses.dateTimeNormal}}
					timeFormat={false} 
					initialValue={paymentDate}
					value={paymentDate}
					dateFormat="DD/MM/yyyy"
					isValidDate={disableFutureDt}
					onClose={handlePaymentDate}
				/>
				</div>
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />

			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left"  className={gClasses.info18Blue} >Amount</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<div align="left">
				<TextValidator align="left" variant="outlined" required name="amount" type="number"
					value={newAmount} onChange={(event) => setNewAmount(event.target.value)}
					validators={['required', 'minNumber:0', 'maxNumber:100000', 'isNumeric']}
					errorMessages={['Payment amount to be provided', 'Payment amount cannot be less than 0', 'Payment cannot be more than 100000',NOFRACTION ]}
				/>					
				</div>
			</Grid>
			<Grid style={{margin: spacing }} item xs={12} sm={12} md={12} lg={12} />

			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left" className={gClasses.info18Blue} >Payment Mode</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<VsSelect size="small" align="left" options={PAYMENTMODE} value={paymentMode} onChange={(event) => { setPaymentMode(event.target.value)}} />
			</Grid>
			<Grid style={{margin: spacing }} item xs={12} sm={12} md={12} lg={12} />

			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left" className={gClasses.info18Blue} >Payment Status</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<VsSelect size="small" align="left" options={PAYMENTSTATUS} value={paymentStatus} onChange={(event) => { setPaymentStatus(event.target.value)}} />
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />
			
			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left" className={gClasses.info18Blue} >Payment Ref.</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={5} lg={3} >
				<TextField fullWidth variant="outlined"  value={paymentRef} onChange={(event) => { setPaymentRef(event.target.value)}} />	
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />

				{/*{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={6} sm={6} md={3} lg={2} >
				<Typography align="left" className={gClasses.info18Blue}>Remarks</Typography>
			</Grid>
			<Grid item xs={6} sm={6} md={3} lg={4} >
				<TextareaAutosize maxRows={MAXDISPLAYTEXTROWS} className={gClasses.textAreaFixed}  value={myNotes} onChange={() => {setMyNotes(event.target.value)}} />
				</Grid>*/}
			<br />
			<ShowResisterStatus />
			<br />
			<Grid item xs={3} sm={3} md={4} lg={5} />
			<Grid item xs={12} sm={12} md={12} lg={12} >
				<VsButton type="submit" name={(props.mode == "EDIT") ? "Update Payment" : "Add Payment"} />
			</Grid>
			{/*<Grid  item xs={3} sm={3} md={2} lg={1} >
				<VsButton disabled={true} type="button" name="Cancel" onClick={mainCancel}/>
			</Grid>
			<Grid item xs={3} sm={3} md={4} lg={5} />*/}
		</Grid>
		</ValidatorForm>
		<ValidComp />   
		</Box>
	</div>
	)
}
