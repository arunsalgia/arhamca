import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';

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
import { isMobile, getWindowDimensions, displayType, decrypt, encrypt } from 'views/functions';

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
	isAdmin, isAdmMan, isAdmManFac, isFaculty,
	dateString,
} from 'views/functions';



export default function Summary() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	const [currentSelection, setCurrentSelection] = useState(ALLSELECTIONS[0]);
	const [mode, setMode] = useState("");
	const [summaryArray, setSummaryArray] = useState([]);
	//const [masterBatchArray, setMasterBatchArray] = useState([]);

	const [studentSummary ,setStudentSummary] = useState([]);
	const [selStudent, setSelStudent] = useState("");
	const [selPaymentRec, setSelPaymentRec] = useState("");

	// for faculty schule call
	const [batchRec, setBatchRec] = useState({});
	const [showAll, setShowAll] = useState(false);
	
	const [drawer, setDrawer] = useState("");
	const [drawerInfo, setDrawerInfo] = useState("");
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
		//console.log(firsTime);
		async function getAllSummary() {
			try {
				if (isAdmin()) {
					//console.log("Admin or Main");
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/payment/summary/all`;
					const response = await axios.get(myUrl);
					//console.log(response.data);
					setSummaryArray(response.data);
				}
				else {
					console.log("Not correctr role");
				}
			} catch (e) {
					console.log(e);
			}
		}
		
		
		getAllSummary();
		handleResize();
		window.addEventListener('resize', handleResize);
	}, [])


	function handleBack(sts) {
		//console.log(sts);
		if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) toast.error(sts.msg); 
		else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) toast.success(sts.msg); 
		
		//console.log(sts.status, selPaymentRec);
		if (sts.status == STATUS_INFO.SUCCESS) {
			if (selPaymentRec) {
				//console.log("in edit payment return");
				//console.log(sts.paymentRec);
			
				// two chnages to be done.
				// first chnage in studentSummary Array
				//console.log(sts.paymentRec._id);
				var clonedArray = studentSummary.filter(x => x._id !== sts.paymentRec._id);
				clonedArray.push(sts.paymentRec);
				let sorted_array = lodashSortBy(clonedArray, 'date').reverse();
				setStudentSummary(sorted_array);
			
				// Now make correction in grand total
				var clonedMainArray = [].concat(summaryArray);
				var tmp = clonedMainArray.find(x => x._id.sid === sts.paymentRec.sid);
				var sum = 0;
				clonedArray.map(x => sum += x.amount);
				//console.log(sum);
				tmp.amount = sum;
				//console.log(tmp);
				setSummaryArray(clonedMainArray);				
			}
			else {
				// New Payment
				console.log("payment new");
				var clonedArray = [].concat(summaryArray);
				var tmp = clonedArray.find( x => x._id.sid === sts.paymentRec.sid);
				if (tmp) {
					tmp.amount += sts.paymentRec.amount;
					setSummaryArray(clonedArray);
				}
				else {
					//console.log(sts.paymentRec);
					clonedArray.push(
						{ 
						_id: {sid: sts.paymentRec.sid, studentName: sts.paymentRec.studentName },
						amount: sts.paymentRec.amount
						}
					);
					setSummaryArray(lodashSortBy(clonedArray, ['_id.studentName'] ));
				}
			}
		}
		else {
			console.log("Yaha kaise aaya");
		}
		setDrawer("");
	}
	
	function ShowResisterStatus() {
        // console.log(`Status is ${registerStatus}`);
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
          default:
            myMsg = "Error updating Captain / ViceCaptain details";
            break;
        }
				//console.log(errmsg, registerStatus);
				if (errmsg)
					alert(myMsg);
				//else
        let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
				return null;
        return(
          <div>
            <Typography align="center" className={myClass}>{myMsg}</Typography>
          </div>
        );
      }

	function handleNewPayment() {
		setSelStudent({sid: ""});
		setDrawer("ADDPAYMENT");
	}
	
	function handleAddStudentPayment(rec) {
		setSelStudent({sid: rec._id.sid});
		setSelPaymentRec(null);
		setDrawer("ADDPAYMENT");
	}
	
	function handleEditStudentPayment(rec) {
		//console.log(rec);
		//console.log(selStudent);
		setSelPaymentRec(rec);
		setDrawer("EDITPAYMENT");
	}
	
	
	async function handleDelStudentPayment(rec) {
		try {
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/payment/delete/${rec._id}`;
			await axios.get(myUrl);
			let newArray = studentSummary.filter(x => x._id !== rec._id);
			setStudentSummary(newArray)
			
			if (newArray.length > 0) {
				var clonedArray = [].concat(summaryArray);
				let tmp = clonedArray.find( x => x._id.sid === rec.sid);
				tmp.amount = lodashSumBy(newArray, 'amount');
				setSummaryArray(clonedArray);
			}
			else {
				setSummaryArray(summaryArray.filter( x => x._id.sid !== rec.sid));
			}
			toast.success(`Deleted payment record of ${mergedName( rec.studentName, rec.sid )}`);
		}
		catch (e) {
			console.log(e);
			toast.error(`Error deleting payment record`);
		}
	}
	
	
	function handleEditBatch(rec) {
		var batchInfo = {inUse: true, status: STATUS_INFO.EDIT_BATCH, msg: "", record:  rec };
		sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		setTab(process.env.REACT_APP_BATCH_ADDEDITBATCH);
	}
	

	async function handleInfo(rec) {
		//console.log(rec);
		setSelStudent({sid: rec.sid, studentName: rec.studentName});
		try {
			var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/payment/summary/detail/${rec.sid}`);
			setStudentSummary(response.data);
			setDrawerInfo("detail");
		}
		catch(e) {
			console.log(e);
			toast.error("error fatching student payment detials.");
		}
	}


	function DisplayAllPayment() {
		//console.log(dispType);
		return (
			<div>
			<Table  align="center">
			<TableHead p={0}>
			<TableRow key="header" align="center">
				<TableCell className={gClasses.th} p={0} align="center">Code</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Student</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Credit</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Debit</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Due</TableCell>
				<TableCell className={gClasses.th} p={0} align="center"></TableCell>
			</TableRow>
			</TableHead>
			<TableBody p={0}>
				{summaryArray.map(x => {
						var myClasses = (x.credit < x.debit ) ? gClasses.disabledtd : gClasses.td ; 
						//console.log(x.credit, x.debit);
						//console.log(myClasses)
					return (
					<TableRow key={x.sid}>
						<TableCell className={myClasses} p={0} align="center" >{x.sid}</TableCell>
						<TableCell className={myClasses} p={0}  >{x.studentName}</TableCell>
						<TableCell className={myClasses} align="center" p={0} >{x.credit}</TableCell>
						<TableCell className={myClasses} align="center" p={0} >{x.debit}</TableCell>
						<TableCell className={myClasses} align="center" p={0} >{x.debit - x.credit}</TableCell>
						<TableCell className={myClasses} p={0} >
							<IconButton color="primary" size="small" onClick={() => {handleInfo(x)}} ><InfoIcon /></IconButton>
						</TableCell>
					</TableRow>
				)})}
			</TableBody>
			</Table>
		</div>
		);

	}
	
 
	function DisplayOptions() {
	return (
	<Grid key="Options" className={gClasses.noPadding} container alignItems="center" >
		<Grid  item xs={3} sm={2} md={2} lg={1} >
			{/*<VsSelect size="small" align="center" label="Selection" options={ALLSELECTIONS} value={currentSelection} onChange={(event) => { selectAll(event.target.value)}} />*/}
		</Grid>
		<Grid align="left"  item xs={6} sm={7} md={8} lg={10} >
			<span></span>
		</Grid>
		<Grid  item xs={3} sm={3} md={2} lg={1} >
		</Grid>
	</Grid>
	)}
	
	
	return (
	<div>
	<DisplayPageHeader headerName="Account Summary" groupName="" tournament="" />
	<DisplayOptions />
	<DisplayAllPayment/>
	<Drawer anchor="top" variant="temporary" open={drawer !== ""}>
		<VsCancel align="right" onClick={() => { setDrawer("")}} />
		{(drawer === "ADDPAYMENT") &&
			<PaymentAddEdit mode="ADD" sid={selStudent.sid} paymentRec={null}  onReturn={handleBack} />
		}
		{(drawer === "EDITPAYMENT") &&
			<PaymentAddEdit mode="EDIT" sid={selStudent.sid} paymentRec={selPaymentRec}  onReturn={handleBack} />
		}
	</Drawer>
	<Drawer anchor="bottom" variant="temporary" open={drawerInfo !== ""}>
	<VsCancel align="right" onClick={() => { setDrawerInfo("")}} />
	<DisplayPageHeader headerName={`Account summary of ${ mergedName(selStudent.studentName, selStudent.sid ) }`} groupName="" tournament="" />
		<Table  align="center">
		<TableHead p={0}>
		<TableRow key="header" align="center">
			<TableCell className={gClasses.th} p={0} align="center">Date</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Desc</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Credit</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Debit</TableCell>
		</TableRow>
		</TableHead>
		<TableBody p={0}>
			{studentSummary.map(x => {
					var myClasses = gClasses.td ;
					//console.log(x)
				return (
				<TableRow key={x.date+x.desc}>
					<TableCell className={myClasses} p={0} align="center" >{dateString(x.date)}</TableCell>
					<TableCell className={myClasses} align="center" p={0} >{x.desc}</TableCell>
					<TableCell className={myClasses} align="center" p={0} >{(x.credit !== 0) ? x.credit : ""}</TableCell>
					<TableCell className={myClasses} align="center" p={0} >{(x.debit !== 0)  ? x.debit  : ""}</TableCell>
				</TableRow>
			)})}
		</TableBody>
		</Table>	
		<br />
	</Drawer>
	<ToastContainer />
	</div>
	);
}
