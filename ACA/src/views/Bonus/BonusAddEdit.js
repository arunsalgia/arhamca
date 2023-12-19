import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator, TextValidatorcvariant} from 'react-material-ui-form-validator';
import { TextareaAutosize, TextField } from '@material-ui/core';

import Drawer from '@material-ui/core/Drawer';
//import Tooltip from "react-tooltip";
//import ReactTooltip from 'react-tooltip'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
	
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
	MAXDISPLAYTEXTROWS,
	PAYMENTMODE, PAYMENTSTATUS,
} from 'views/globals';

import {
	isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	disablePastDt, disableFutureDt,
	mergedName, getCodeFromMergedName, getNameFromMergedName,
	getAreafromBid,
	showError, showSuccess, showInfo,
} from 'views/functions';

var pageHeader = "";

export default function BonusAddEdit(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();

	const [role, setRole] = useState(ROLE_FACULTY);

	const [userArray, setUserArray] = useState([]);
	const [userMasterArray, setUserMasterArray] = useState([]);
	const [batchArray, setBatchArray] = useState([]);
	const [userName, setUserName] = useState("");
	const [bonusDate, setBonusDate] = useState(new Date());
	const [bonusAmount, setBonusAmount] = useState(300);
	const [refBatch, setRefBatch] = useState("");
	const [paymentMode, setPaymentMode] = useState(PAYMENTMODE[0]);
	const [remarks, setRemarks] = useState("");


	
	const [drawer, setDrawer] = useState("");
	const [drawerDetail, setDrawerDetail] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
	const [dispType, setDispType] = useState("lg");

	useEffect(() => {
		console.log(props);
		pageHeader = (props.mode === "ADD")
			?  (props.isBonus) ? "Add new bonus" : `Add new payment to ${props.bonusRec.name}`
			:  (props.isBonus) ? `Edit bonus of ${props.bonusRec.name}` :  `Edit payment to ${props.bonusRec.name}`;
			
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

		async function getAllUsers() {
			try {
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/acabrieflist`;
				const response = await axios.get(myUrl);
				var tmp = response.data;
				setUserMasterArray(tmp);
				var tmp1 = tmp.filter(x => x.role === role)
				setUserArray(tmp1);
				setUserName((tmp1.length > 0) ? tmp1[0].displayName : "");
			} 
			catch (e) {
				console.log(e);
				showError("Error Fetching Users");
			}
		}
		
		async function getAllBatch() {
			try {
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/batch/listnamesonly/withoutbonus`;
				const response = await axios.get(myUrl);
				//setBatchArray(response.data);
				return response.data;
			} 
			catch (e) {
				console.log(e);
				showError("Error Fetching Bonus");
				return [];
			}
		}
		
		async function updateBatchArray() {
			var allBatches = await getAllBatch();
			//console.log(allBatches);
			if (props.mode === "ADD") {
				setRefBatch(allBatches[0].bid);
			}
			else {
				allBatches.push({bid: props.bonusRec.bid});
				allBatches = lodashSortBy(allBatches, 'bid');
				setRefBatch(props.bonusRec.bid);
			}
			setBatchArray(allBatches);			
		}
		
		// get all users and set user name
		if ((props.isBonus) && (props.mode === "ADD")) {
			getAllUsers();
		}
		else {
			var rec = {uid: props.bonusRec.uid, displayName: props.bonusRec.name};
			setUserArray([rec]);
			setUserMasterArray([rec]);
			setUserName(rec.displayName);			
		}
		
		if (props.isBonus) updateBatchArray();
			
		if (props.mode === "EDIT") {
			var tmp = new Date(props.bonusRec.date);
			console.log(props.bonusRec.date, tmp);
			setBonusDate(tmp);
			
			//setBatchArray([{bid: props.bonusRec.bid}]);
			setPaymentMode(props.bonusRec.mode);
			setRemarks(props.bonusRec.remarks);
			setBonusAmount((props.bonusRec.isBonus) ? props.bonusRec.bonusAmount : props.bonusRec.bonusPayment);
		}

		handleResize();
		window.addEventListener('resize', handleResize);
	}, [])


	async function handleAddEditBonusSubmit() {
	
	var bonusData = {};
	var tmp = userMasterArray.find(x => x.displayName === userName);
	bonusData["uid"] = tmp.uid;
	bonusData["name"] = tmp.displayName;
	bonusData["date"] = bonusDate;
	bonusData["bid"] = refBatch;
	bonusData["amount"] = bonusAmount;
	bonusData["mode"] = paymentMode;
	bonusData["remarks"] = remarks;

	var bonusUrl = '';
	var returMessage = '';	
	if (props.mode === "ADD") {	
		bonusData["_id"] = "";
		bonusUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/bonus/add/${(props.isBonus) ? "bonus" : "payment"}/`;
		returMessage = (props.isBonus)
			? `Successfully added bonus to  ${tmp.displayName}.`
			: `Successfully added payment ${tmp.displayName}.`;
	}
	else {
		bonusData["_id"] = props.bonusRec._id;
		bonusUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/bonus/update/`;
		returMessage = (props.isBonus)
			? `Successfully updated bonus to ${tmp.displayName}.`
			: `Successfully updated payment to ${tmp.displayName}.`;
	}
		
	var myJsonData = JSON.stringify(bonusData);
	bonusUrl += encodeURI(myJsonData);
	
	try {
		var response = await axios.get(bonusUrl);
		props.onReturn.call(this, {status: STATUS_INFO.SUCCESS, bonusRec: response.data, msg: returMessage} );
		return;
	}
	catch (e) {
		console.log(e);
		props.onReturn.call(this, {status: STATUS_INFO.ERROR, msg: "Error in add/update bonus/payment"});
		return;
	}
	
}

	function handleBonusDate(d) {
		setBonusDate(d.toDate());
	}
	
	function handleChangeUserRole(newRole) {
		var tmp = userMasterArray.filter(x => x.role === newRole);
		if (tmp.length > 0) {
			setUserArray(tmp);
			setUserName(tmp[0].displayName);
			setRole(newRole);
		}
		else {
			showError("No user of the selected role");
		}
	}
	
	return (
	<div align="center">
	<Container component="main" maxWidth="xs">	
	<DisplayPageHeader headerName={ pageHeader} groupName="" tournament="" />
	<br />
	<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} paddingLeft={2} paddingRight={2} >
	<ValidatorForm margin={2} align="center" className={gClasses.form} onSubmit={handleAddEditBonusSubmit}  >
		{((props.isBonus) && (props.mode === "ADD")) &&
			<VsRadioGroup value={role} radioList={ROLE_MANAGERFACULTYSTUDENT} onChange={(event) => { handleChangeUserRole(event.target.value) } } />
		}
		<Grid key="INFOBATCH" className={gClasses.noPadding} container alignItems="flex-start" >
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography align="left" className={gClasses.info18Blue} >Name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<VsSelect align="left" size="small"  field="displayName" options={userArray} value={userName} onChange={(event) => { setUserName(event.target.value)}} />
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography align="left" className={gClasses.info18Blue} >Date</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<div align="left">
				<Datetime 
					className={gClasses.dateTimeBlock}
					inputProps={{className: gClasses.dateTimeNormal}}
					timeFormat={false} 
					value={bonusDate}
					initialValue={bonusDate}
					dateFormat="DD/MM/yyyy"
					isValidDate={disableFutureDt}
					onClose={handleBonusDate}
				/>
				</div>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography align="left" className={gClasses.info18Blue} >Amount</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<div align="left">
				<TextValidator align="left" variant="outlined" required name="amount" type="number"
					value={bonusAmount} onChange={(event) => setBonusAmount(event.target.value)}
					validators={['required', 'minNumber:0', 'maxNumber:100000', 'isNumeric']}
					errorMessages={['Bonus amount to be provided', 'Bonus amount cannot be less than 0', 'Bonus cannot be more than 100000',NOFRACTION ]}
				/>					
				</div>
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			{(props.isBonus) &&
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography align="left" className={gClasses.info18Blue} >Ref. Batch</Typography>
			</Grid>
			}
			{(props.isBonus) &&
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<VsSelect align="left" size="small"  field="bid" options={batchArray} value={refBatch} onChange={(event) => { setRefBatch(event.target.value)}} />
			</Grid>
			}
			{(props.isBonus) &&
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			}
			{(!props.isBonus) &&
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography align="left" className={gClasses.info18Blue} >Payment Mode</Typography>
			</Grid>
			}
			{(!props.isBonus) &&
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<VsSelect size="small" align="left" options={PAYMENTMODE} value={paymentMode} onChange={(event) => { setPaymentMode(event.target.value)}} />
			</Grid>
			}
			{(!props.isBonus) &&
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			}
			{(!props.isBonus) &&
			<Grid item xs={5} sm={5} md={5} lg={5} >
				<Typography align="left" className={gClasses.info18Blue} >Remarks</Typography>
			</Grid>
			}
			{(!props.isBonus) &&
			<Grid item xs={7} sm={7} md={7} lg={7} >
				<TextareaAutosize maxRows={MAXDISPLAYTEXTROWS} className={gClasses.textAreaFixed}  value={remarks} onChange={() => {setRemarks(event.target.value)}} />
			</Grid>
			}
			{(!props.isBonus) &&
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
			}
			<Grid item xs={12} sm={12} md={12} lg={12} >
				<VsButton type="submit" name={"Submit"} />
			</Grid>
			<Grid style={{margin: "5px"}} item xs={12} sm={12} md={12} lg={12} />
		</Grid>
		</ValidatorForm>
		<ValidComp />   
	</Box>
	</Container>
	<ToastContainer />
	</div>
	)
}
