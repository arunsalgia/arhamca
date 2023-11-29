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
import { 
	isMobile, getWindowDimensions, displayType, 
	decrypt, encrypt ,
	vsDialog,
	showError, showSuccess, showInfo,
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



export default function Payment() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	const [currentSelection, setCurrentSelection] = useState(ALLSELECTIONS[0]);
	const [mode, setMode] = useState("");
	const [masterPaymentArray, setMasterPaymentArray] = useState([]);
	const [paymentArray, setPaymentArray] = useState([]);


	const [studentPayments ,setStudentPayments] = useState([]);
	const [selStudent, setSelStudent] = useState("");
	const [selPaymentRec, setSelPaymentRec] = useState("");

	// for faculty schedule call
	const [batchRec, setBatchRec] = useState({});
	const [showAll, setShowAll] = useState(false);
	
	const [drawer, setDrawer] = useState("");
	const [drawerInfo, setDrawerInfo] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [currentText, setCurrentText] = useState("");
	
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
		async function getAllPayments() {
			try {
				if (isAdmMan()) {
					//console.log("Admin or Main");
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/payment/total/all`;
					const response = await axios.get(myUrl);
					//console.log(response.data);
					setMasterPaymentArray(response.data);
					//setPaymentArray(response.data);
					filterPayment(response.data, currentText);
				}
				else {
					console.log("Not correct role");
				}
			} catch (e) {
					console.log(e);
			}
		}
		
		
		getAllPayments();
		handleResize();
		window.addEventListener('resize', handleResize);
	}, [])


	function handleBack(sts) {
		//console.log(sts);
		if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) showError(sts.msg); 
		else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) showSuccess(sts.msg); 
		
		//console.log(sts.status, selPaymentRec);
		if (sts.status == STATUS_INFO.SUCCESS) {
			if (selPaymentRec) {
				//console.log("in edit payment return");
				//console.log(sts.paymentRec);
			
				// two chnages to be done.
				// first chnage in studentPayments Array
				//console.log(sts.paymentRec._id);
				var clonedArray = studentPayments.filter(x => x._id !== sts.paymentRec._id);
				clonedArray.push(sts.paymentRec);
				let sorted_array = lodashSortBy(clonedArray, 'date').reverse();
				setStudentPayments(sorted_array);
			
				// Now make correction in grand total
				var clonedMainArray = [].concat(masterPaymentArray);
				var tmp = clonedMainArray.find(x => x._id.sid === sts.paymentRec.sid);
				var sum = 0;
				clonedArray.map(x => sum += x.amount);
				//console.log(sum);
				tmp.amount = sum;
				//console.log(tmp);
				//setPaymentArray(clonedMainArray);				
				filterPayment(clonedMainArray, currentText);
			}
			else {
				// New Payment
				console.log("payment new");
				var clonedArray = [].concat(masterPaymentArray);
				var tmp = clonedArray.find( x => x._id.sid === sts.paymentRec.sid);
				if (tmp) {
					tmp.amount += sts.paymentRec.amount;
					//setPaymentArray(clonedArray);
					filterPayment(clonedArray, currentText);
				}
				else {
					//console.log(sts.paymentRec);
					clonedArray.push(
						{ 
						_id: {sid: sts.paymentRec.sid, studentName: sts.paymentRec.studentName },
						amount: sts.paymentRec.amount
						}
					);
					//setPaymentArray(lodashSortBy(clonedArray, ['_id.studentName'] ));
					var myAaary = lodashSortBy(clonedArray, ['_id.studentName'] );
					setMasterPaymentArray(myAaary);
					filterPayment(myAaary, currentText);
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
	
	function handleDelStudentPayment(t) {
		setDrawerInfo("")
		vsDialog("Delete Payment", `Are you sure you want to delete payment of ${mergedName(t.studentName, t.sid)}?`,
			{label: "Yes", onClick: () => handleDelStudentPaymentConfirm(t) },
			{label: "No",  onClick: () => setDrawerInfo("detail") }
		);
	}
	
	async function handleDelStudentPaymentConfirm(rec) {
		setDrawerInfo("detail");
		try {
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/payment/delete/${rec._id}`;
			await axios.get(myUrl);
			let newArray = studentPayments.filter(x => x._id !== rec._id);
			setStudentPayments(newArray)
			
			if (newArray.length > 0) {
				var clonedArray = [].concat(masterPaymentArray);
				let tmp = clonedArray.find( x => x._id.sid === rec.sid);
				tmp.amount = lodashSumBy(newArray, 'amount');
				//setPaymentArray(clonedArray);
				setMasterPaymentArray(clonedArray);
				filterPayment(clonedArray, currentText);
			}
			else {
				//setPaymentArray(paymentArray.filter( x => x._id.sid !== rec.sid));
				var myArray = masterPaymentArray.filter( x => x._id.sid !== rec.sid);
				setMasterPaymentArray(myAaary);
				filterPayment(myAaary, currentText);
			}
			showSuccess(`Deleted payment record of ${mergedName( rec.studentName, rec.sid )}`);
		}
		catch (e) {
			console.log(e);
			showError(`Error deleting payment record`);
		}
	}
	
	
	function handleEditBatch(rec) {
		var batchInfo = {inUse: true, status: STATUS_INFO.EDIT_BATCH, msg: "", record:  rec };
		sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		setTab(process.env.REACT_APP_BATCH_ADDEDITBATCH);
	}
	

	async function handleInfo(rec) {
		//console.log(rec);
		setSelStudent({sid: rec._id.sid, studentName: rec._id.studentName});
		try {
			var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/payment/list/${rec._id.sid}`);
			setStudentPayments(response.data);
			setDrawerInfo("detail");
		}
		catch(e) {
			console.log(e);
			showError("error fatching student payment detials.");
		}
	}


	function DisplayAllPayment() {
		//console.log(dispType);
		return (
			<div>
			<Table  align="center">
			<TableHead p={0}>
			<TableRow key="header" align="center">
				<TableCell className={gClasses.th} p={0} align="center">Student</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Payment</TableCell>
				<TableCell className={gClasses.th} p={0} align="center"></TableCell>
			</TableRow>
			</TableHead>
			<TableBody p={0}>
				{paymentArray.map(x => {
						var myClasses = gClasses.td ;
						//console.log(x)
					return (
					<TableRow key={x._id.sid}>
						<TableCell className={myClasses} align="center" p={0}  >{mergedName( x._id.studentName, x._id.sid)}</TableCell>
						<TableCell className={myClasses} align="center" p={0} >{x.amount}</TableCell>
						<TableCell className={myClasses} p={0} >
							{/*<IconButton color="primary" size="small" onClick={() => {handleEditStudentPayment(x)}} ><EditIcon /></IconButton>*/}
							<IconButton color="primary" size="small" onClick={() => {handleInfo(x)}} ><InfoIcon /></IconButton>
							<IconButton color="primary"  size="small" onClick={() => {handleAddStudentPayment(x)}} ><Money /></IconButton>
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
			<VsButton disabled={!isAdmMan()} name="New Payment" align="right" onClick={handleNewPayment} />
		</Grid>
	</Grid>
	)}
	
		
	function filterPayment(masterArray, textFilter) {
		var filteredArray = [].concat(masterArray);
		
		var finalFilterArray = [];
		// Now filter on text
		if (textFilter !== "") {
			textFilter = textFilter.toUpperCase();
			// start filter process on all records one by one 
			for(var i=0; i<filteredArray.length; ++i) {
				if (
					(filteredArray[i]._id.sid.includes(textFilter)) ||
					(filteredArray[i]._id.studentName.toUpperCase().includes(textFilter))
					) 
				{
					finalFilterArray.push(filteredArray[i]);					
				}
			}
		}
		else  {
			finalFilterArray = filteredArray			// no filter required
		}
		setPaymentArray(finalFilterArray);
	}
	
	
	function setTextFilter(textValue) {
		textValue = textValue.toLowerCase();
		setCurrentText(textValue);
		filterPayment(masterPaymentArray, textValue);
	}

	
	return (
	<div>
	<DisplayPageHeader headerName="Payments" groupName="" tournament="" />
	{/*<DisplayOptions />*/}
	<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} paddingTop={1} >
		<Grid key="Filter" className={gClasses.noPadding} container  >
			<Grid  item xs={3} sm={2} md={2} lg={1} align="left"  >
			</Grid>
			<Grid item xs={1} sm={1} md={4} lg={3}  >
				<TextField fullWidth label="Filter Text" value={currentText} onChange={ (event) => { setTextFilter(event.target.value) } } />	
			</Grid>
			<Grid  item xs={5} sm={6} md={4} lg={7} >
			</Grid>
			<Grid  item xs={3} sm={3} md={2} lg={1} >
				<VsButton disabled={!isAdmMan()} name="New Payment" align="right" onClick={handleNewPayment} />
			</Grid>
		</Grid>
	</Box>
	<DisplayAllPayment/>
	{/*<DisplayAllToolTips />*/}
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
	<DisplayPageHeader headerName={`Payment details of ${ mergedName(selStudent.studentName, selStudent.sid ) }`} groupName="" tournament="" />
		<Table  align="center">
		<TableHead p={0}>
		<TableRow key="header" align="center">
			<TableCell className={gClasses.th} p={0} align="center">Date</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Amount</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Mode</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Status</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Reference</TableCell>
			<TableCell className={gClasses.th} p={0} align="center"></TableCell>
		</TableRow>
		</TableHead>
		<TableBody p={0}>
			{studentPayments.map(x => {
					var myClasses = gClasses.td ;
					//console.log(x)
				return (
				<TableRow key={x._id}>
					<TableCell className={myClasses} p={0} align="center" >{dateString(x.date)}</TableCell>
					<TableCell className={myClasses} p={0}  >{x.amount}</TableCell>
					<TableCell className={myClasses} align="center" p={0} >{x.mode}</TableCell>
					<TableCell className={myClasses} align="center" p={0} >{x.status}</TableCell>
					<TableCell className={myClasses} align="center" p={0} >{x.reference}</TableCell>
					<TableCell className={myClasses} p={0} >
						<IconButton color="primary"  size="small" onClick={() => {handleEditStudentPayment(x)}} ><EditIcon /></IconButton>
						<IconButton color="secondary"  size="small" onClick={() => {handleDelStudentPayment(x)}} ><CancelIcon /></IconButton>
						{/*<IconButton color="primary" size="small" onClick={() => {handleEditStudentPayment(x)}} ><EditIcon /></IconButton>
						<IconButton color="primary" size="small" onClick={() => {handleInfo(x)}} ><InfoIcon /></IconButton>
						<IconButton color="primary"  size="small" onClick={() => {handleAddStudentPayment(x)}} ><Money /></IconButton>*/}
					</TableCell>
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
