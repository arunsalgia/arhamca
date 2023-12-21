import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';

import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";

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
import lodashOrderBy from "lodash/orderBy";
import lodashSumBy from "lodash/sumBy";

import {setTab} from "CustomComponents/CricDreamTabs.js"

import FacultySchedule	 from "views/Faculty/FacultySchedule"
import PaymentAddEdit	 from "views/Payment/PaymentAddEdit"


import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import SchoolIcon from '@material-ui/icons/School';
import CancelIcon from '@material-ui/icons/Cancel';
import TableChartSharpIcon from '@material-ui/icons/TableChartSharp';
import Money from '@material-ui/icons/Money';

//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { 
	isMobile, getWindowDimensions, displayType, 
	decrypt, encrypt ,
	vsDialog,
	showError, showSuccess, showInfo,
	disablePastDt, disableFutureDt,

} from 'views/functions';

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";

//import BatchAddEdit from "./BatchAddEdit";

import {
	ROLE_FACULTY, ROLE_STUDENT,
	ALLSELECTIONS, BLANKCHAR, STATUS_INFO,
} from 'views/globals';


import {
	mergedName, getCodeFromMergedName, getNameFromMergedName,
	isAdmMan, isAdmManFac, isFaculty,
	dateString,
} from 'views/functions';


const spacing = "5px"


export default function ReportIncome() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	const [currentSelection, setCurrentSelection] = useState(ALLSELECTIONS[0]);
	const [reportDate, setReportDate] = useState(new Date());

	const [paymentArray, setPaymentArray] = useState([]);

	const [drawer, setDrawer] = useState("");

	
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
		//console.log(firsTime);
		/*async function getAllPayments() {
			try {
				if (isAdmMan()) {
					//console.log("Admin or Main");
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/session/list/all`;
					const response = await axios.get(myUrl);
					setPaymentArray(response.data);
				}
				else {
					console.log("Not correct role");
				}
			} catch (e) {
					console.log(e);
			}
		}
		*/
		
		generateReport();
		handleResize();
		window.addEventListener('resize', handleResize);
	}, [])



	function handleReportDate(d) {
		setReportDate(d.toDate());
	}

	async function generateReport() {
		console.log(reportDate);
		console.log(reportDate.getMonth());
		console.log(reportDate.getFullYear());
		try {
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/session/list/${reportDate.getMonth()}/${reportDate.getFullYear()}`;
			const response = await axios.get(myUrl);
			setPaymentArray(response.data);
		} catch (e) {
				console.log(e);
		}	
	}
	
	function DisplayAllPayment() {
		//console.log(dispType);
		var totalAmount = lodashSumBy(paymentArray, 'amount');
		return (
			<div>
			<Table  align="center">
			<TableHead p={0}>
			<TableRow key="header" align="center">
				<TableCell className={gClasses.th} p={0} align="center">Student</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Sess. Count</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Sess. Fees</TableCell>
			</TableRow>
			</TableHead>
			<TableBody p={0}>
				{paymentArray.map(x => {
						var myClasses = gClasses.td ;
						//console.log(x)
					return (
					<TableRow key={x.sid} >
						<TableCell className={myClasses} align="center" p={0}  >{mergedName( x.name, x.sid)}</TableCell>
						<TableCell className={myClasses} align="center" p={0} >{x.count}</TableCell>
						<TableCell className={myClasses} align="center" p={0} >{x.amount}</TableCell>
					</TableRow>
				)})}
				<TableRow key="Total" >
					<TableCell className={gClasses.tdBold} align="right" colSpan={2} p={0}  >{"Total"}</TableCell>
					<TableCell className={gClasses.tdBold} align="center" p={0} >{totalAmount}</TableCell>
				</TableRow>
			</TableBody>
			</Table>
		</div>
		);

	}
	
	
	return (
	<div>
		<br />
			<Grid key="REPORTINCOMEDATE" className={gClasses.noPadding} container >
			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={2} lg={1} >
				<Typography align="left"  className={gClasses.info18Blue} >Select Month</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<div align="left">
				<Datetime 
					className={gClasses.dateTimeBlock}
					inputProps={{className: gClasses.dateTimeNormal}}
					timeFormat={false} 
					initialValue={reportDate}
					value={reportDate}
					dateFormat="MMM yyyy"
					isValidDate={disableFutureDt}
					onClose={handleReportDate}
				/>
				</div>
			</Grid>
			<Grid item xs={2} sm={2} md={1} lg={1} >
				<VsButton type="button" name="Select" onClick={generateReport} />
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />
			</Grid>
		<DisplayAllPayment/>
		<br />
	</div>
	);
}
