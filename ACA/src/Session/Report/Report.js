import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';

import Drawer from '@material-ui/core/Drawer';

import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";


import Typography from '@material-ui/core/Typography';

import { UserContext } from "../../UserContext";
import { JumpButton, DisplayPageHeader, ValidComp, BlankArea} from 'CustomComponents/CustomComponents.js';


import ReportIncome	 from "views/Report/ReportIncome"
import ReportPayment	 from "views/Report/ReportPayment"


//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { 
	isMobile, getWindowDimensions, displayType, 
	vsDialog,
	showError, showSuccess, showInfo,
} from 'views/functions';

import globalStyles from "assets/globalStyles";



import {
	ROLE_FACULTY, ROLE_STUDENT,
	ALLSELECTIONS, BLANKCHAR, STATUS_INFO,
} from 'views/globals';


import {
	mergedName, getCodeFromMergedName, getNameFromMergedName,
	isAdmMan, isAdmManFac, isFaculty,
	dateString,
} from 'views/functions';



export default function Report() {
	const gClasses = globalStyles();

	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
	const [dispType, setDispType] = useState("lg");

	const [currentSelection, setCurrentSelection] = useState("SessionFees");
	
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

		handleResize();
		window.addEventListener('resize', handleResize);
	}, [])


	function DisplayFunctionItem(props) {
	let itemName = props.item;
	return (
	<Grid key={"BUT"+itemName} item xs={4} sm={4} md={2} lg={2} >
	<Typography onClick={props.onClick}>
		<span 
			className={(itemName === currentSelection) ? gClasses.functionSelected : gClasses.functionUnselected}>
		{itemName}
		</span>
	</Typography>
	</Grid>
	)}
	
	function DisplayReportTabs() {
	return (
		<Grid className={gClasses.noPadding} key="AllPatients" container align="center">
		<DisplayFunctionItem item="SessionFees"  onClick={() => { setCurrentSelection("SessionFees");  } } />
		<DisplayFunctionItem item="Payment" onClick={() => { setCurrentSelection("Payment"); } } />
	</Grid>
	)}
	
	return (
	<div>
	<DisplayPageHeader headerName="Report" groupName="" tournament="" />
	<DisplayReportTabs />
	<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} paddingTop={1} >
	{ (currentSelection === "SessionFees") &&
		<ReportIncome />
	}
	{ (currentSelection === "Payment") &&
		<ReportPayment />
	}
	</Box>
	</div>
	);
}
