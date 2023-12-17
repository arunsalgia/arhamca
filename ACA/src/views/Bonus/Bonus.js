import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';

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

import {setTab} from "CustomComponents/CricDreamTabs.js"

import FacultySchedule	 from "views/Faculty/FacultySchedule"
import SessionAddEdit	 from "views/Session/SessionAddEdit"

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import SchoolIcon from '@material-ui/icons/School';
import CancelIcon from '@material-ui/icons/Cancel';
import TableChartSharpIcon from '@material-ui/icons/TableChartSharp';
import SearchIcon from '@material-ui/icons/Search';

//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { 
	isMobile, getWindowDimensions, displayType, 
	decrypt, encrypt ,
	vsDialog,
	dateString,
	showError, showSuccess, showInfo,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";

import BonusAddEdit from "views/Bonus/BonusAddEdit";

import {
	ROLE_FACULTY, ROLE_STUDENT,
	ALLSELECTIONS, BLANKCHAR, STATUS_INFO,
	DURATIONSTR, BATCHTIMESTR,
} from 'views/globals';


import {
	mergedName, getCodeFromMergedName, getNameFromMergedName,
	isAdmin, isAdmMan, isAdmManFac, isFaculty,
} from 'views/functions';



export default function Bonus() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	
	const [mode, setMode] = useState("");
	const [bonusArray, setBonusArray] = useState([]);
	const [userBonusArray, setUserBonusArray] = useState([]);

	const [currentMode, setCurrentMode] = useState(ALLSELECTIONS[1]);
	const [currentText, setCurrentText] = useState("");
	

	// for faculty schedule call
	const [bonusRec, setBonusRec] = useState({sid: [], timings: []});
	const [batchTime, setBatchTime] = useState("");
	
	const [showAll, setShowAll] = useState(false);
	
	const [drawer, setDrawer] = useState("");
	const [drawerInfo, setDrawerInfo] = useState("");
	const [drawerDetail, setDrawerDetail] = useState("");
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [isBonus, setIsBonus] = useState(true);
	
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
		async function getBonusSummary() {
			try {
				if (isAdmin()) {
					//console.log("Admin or Main");
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/bonus/summary/all`;
					const response = await axios.get(myUrl);
					setBonusArray(response.data);
				}
				else {
					showError("Not correct role");
				}
			} catch (e) {
				console.log(e);
			}
		}
		
		getBonusSummary();
		handleResize();
		window.addEventListener('resize', handleResize);
	}, [])


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
					showError(myMsg);
				

        let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
				return null;
        return(
          <div>
            <Typography align="center" className={myClass}>{myMsg}</Typography>
          </div>
        );
      }

	function handleAddBonus() {
		setBonusRec({uid: 0, name: ""});
		setIsBonus(true);
		setDrawer("ADD");
		console.log("Add bonus");
	}
	
	function handleAddPayment(rec) {
		setBonusRec({uid: rec._id.uid, name: rec._id.name});
		setIsBonus(false);
		setDrawer("ADD");
	}
	
	
	function handleEditBonusPayment(rec) {
		setIsBonus(rec.isBonus);
		setBonusRec(rec);
		setDrawer("EDIT");
	}
	
	function junk_handleBack(sts) {
		if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) showError(sts.msg); 
		else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) showSuccess(sts.msg); 
		
		if (sts.status !== STATUS_INFO.ERROR) {
			if (drawer === "ADDSESSION") {
				var cloneBonusArray = [].concat(bonusArray);
				var myRec = cloneBonusArray.find(x => x.bid === bonusRec.bid);
				myRec.sessionCount += 1;
				setBonusArray(cloneBonusArray);
			}	
		}
		setDrawer("");
	}
	
	function handleBackBonus(sts) {
		if (sts.msg !== "") {
			if (sts.status === STATUS_INFO.SUCCESS) showSuccess(sts.msg);  else  showError(sts.msg); 
		}
		if (sts.status !== STATUS_INFO.ERROR) {
			console.log(sts.bonusRec);
			var prevBonusAmount = 0;
			var prevBonusPayment = 0;
			if (drawer === "EDIT") {
				prevBonusAmount = bonusRec.bonusAmount;
				prevBonusPayment = bonusRec.bonusPayment;
				var tmp = userBonusArray.filter(x => x._id !== bonusRec._id);
				var finalArray = tmp.concat([sts.bonusRec]);
				setUserBonusArray(lodashSortBy(finalArray, 'date').reverse());
			}
			var clonedArray = [].concat(bonusArray);
			var tmpRec = clonedArray.find( x => x._id.uid === sts.bonusRec.uid);
			tmpRec.bonusAmount  += sts.bonusRec.bonusAmount - prevBonusAmount;
			tmpRec.bonusPayment += sts.bonusRec.bonusPayment - prevBonusPayment;
			setBonusArray(clonedArray);
		}
		setDrawer("");
	}
	
	async function handleInfo(rec) {
		// first get all records of User (bonus and payments)
		try {
			//console.log("Admin or Main");
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/bonus/list/user/${rec._id.uid}`;
			const response = await axios.get(myUrl);
			setUserBonusArray(response.data);
		} catch (e) {
			console.log(e);
			showError("Error fetching bonus details of user");
		}
		setDrawerInfo("detail");
	}

	function handleDeleteBonusPayment(t) {
		setDrawerInfo("");
		var hdr = (t.isBonus) ? "Delete Bonus" : "Delete payment";
		var msg = `Are you sure you want delete ${(t.isBonus) ? "bonus" : "payment"} to ${t.name}?`
		vsDialog(hdr, msg,
			{label: "Yes", onClick: () => { setDrawerInfo("detail"); handleDeleteBonusPaymentConfirm(t);  } } ,
			{label: "No", onClick: () => setDrawerInfo("detail") } 
		);
	}
	
	async function handleDeleteBonusPaymentConfirm(rec) {
		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/bonus/delete/${rec._id}`);
			setUserBonusArray(userBonusArray.filter(x => x._id !== rec._id));
			var clonedArray = [].concat(bonusArray);
			var tmpRec = clonedArray.find(x => x._id.uid === rec.uid);
			tmpRec.bonusPayment -= rec.bonusPayment;
			tmpRec.bonusAmount -= rec.bonusAmount;
			setBonusArray(clonedArray);
			showSuccess(`Successfully delete bonus/payment of ${rec.name}`);
		}
		catch (e) {
			// error 
			console.log(e);
			showError("Error disabling batch "+ rec.bid);
		}
	}


	function DisplayAllBonus() {
		//console.log(dispType);
		return (
			<div>
			<Table  align="center">
			<TableHead p={0}>
			<TableRow key="header" align="center">
				<TableCell className={gClasses.th} p={0} align="center">Name</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Bonus</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Payment</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Due</TableCell>
				<TableCell className={gClasses.th} p={0} align="center"></TableCell>
			</TableRow>
			</TableHead>
			<TableBody p={0}>
				{bonusArray.map(x => {
						//var myClasses = gClasses.td;
						var myClasses = (x.bonusAmount >= x.bonusPayment) ? gClasses.td : gClasses.disabledtd;
					return (
					<TableRow key={x._id.name}>
						<TableCell align="center" className={myClasses} p={0} >{x._id.name}</TableCell>
						<TableCell align="center" className={myClasses} p={0} >{x.bonusAmount}</TableCell>
						<TableCell align="center" className={myClasses} p={0} >{x.bonusPayment}</TableCell>
						<TableCell align="center" className={myClasses} p={0} >{x.bonusAmount - x.bonusPayment}</TableCell>
						<TableCell className={myClasses} p={0} >
							<IconButton color="primary" size="small" onClick={() => {handleInfo(x)}} ><InfoIcon /></IconButton>
							<IconButton color="primary" size="small" onClick={() => {handleAddPayment(x)}} ><TableChartSharpIcon /></IconButton>
						</TableCell>
					</TableRow>
				)})}
			</TableBody>
			</Table>
		</div>
		);

	}
	
	function filterBatch(masterArray, textFilter, modeFilter) {
		var filteredArray = [].concat(masterArray);
		
		// First filter on mode
		switch (modeFilter) {
			case "Disabled":  filteredArray = filteredArray.filter(x => !x.enabled );  break;
			case "Enabled":   filteredArray = filteredArray.filter(x => x.enabled );  break;
			//default:          setBonusArray(masterArray);  break;
		}
		
		var finalFilterArray = [];
		// Now filter on text
		if (textFilter !== "") {
			textFilter = textFilter.toUpperCase();
			// start filter process on all records one by one
			for(var i=0; i<filteredArray.length; ++i) {
				if (
					(filteredArray[i].bid.includes(textFilter)) ||
					(filteredArray[i].fid.includes(textFilter)) ||
					(filteredArray[i].facultyName.toUpperCase().includes(textFilter)) ||
					(filteredArray[i].sid.includes(textFilter))
				) {
					finalFilterArray.push(filteredArray[i]);					
				}
				else {
					for(var j=0; j<filteredArray[i].studentNameList.length; ++j) {
						if (filteredArray[i].studentNameList[j].toUpperCase().includes(textFilter)) {
							finalFilterArray.push(filteredArray[i]);
							break;
						}
					}
				}
			}
		}
		else  {
			finalFilterArray = filteredArray			// no filter required
		}
		setBonusArray(finalFilterArray);
	}
	

	// style={{marginTop: "5px" }}  
	function DisplayOptions() {
	return (
	<Grid key="Options" className={gClasses.noPadding} container alignItems="center" >
		<Grid  item xs={3} sm={2} md={2} lg={1} >
			<VsSelect size="small" align="center" label="Selection" options={ALLSELECTIONS} value={currentMode} onChange={(event) => { setModeFilter(event.target.value)}} />
		</Grid>
		<Grid align="left"  item xs={6} sm={7} md={8} lg={10} >
			<span></span>
		</Grid>
		<Grid  item xs={3} sm={3} md={2} lg={1} >
			<VsButton disabled={!isAdmMan()} name="New Batch" align="right" onClick={handleAddBonus} />
		</Grid>
	</Grid>
	)}
	
	function setTextFilter(textValue) {
		textValue = textValue.toLowerCase();
		setCurrentText(textValue);
		filterBatch(masterBatchArray, textValue, currentMode);
	}

	function setModeFilter(modeValue) {
		setCurrentMode(modeValue);
		filterBatch(masterBatchArray, currentText, modeValue);
	}
	
	function DisplayFilter() {
	return (	
		<div>
		<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} paddingTop={1} >
		<Grid key="Filter" className={gClasses.noPadding} container  >
			<Grid  item xs={3} sm={2} md={2} lg={1} align="left"  >
				<VsSelect size="small" align="left" options={ALLSELECTIONS} value={currentMode} onChange={(event) => { setModeFilter(event.target.value)}} />
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} align="right"   >
				<TextField fullWidth  value={currentText} onChange={ (event) => { setTextFilter(event.target.value) } } />	
			</Grid>
			<Grid  item xs={5} sm={6} md={7} lg={9} >
			</Grid>
			<Grid item xs={1} sm={1} md={1} lg={1} align="right"   >
				<IconButton align="right"  color="primary" size="small" onClick={(event) => {setTextFilter(event.target.value) } } ><SearchIcon /></IconButton>
			</Grid>
			<Grid  item xs={3} sm={3} md={2} lg={1} >
				<VsButton disabled={!isAdmMan()} name="New Batch" align="right" onClick={handleAddBonus} />
			</Grid>
		</Grid>
		</Box>
		</div>
	)}
	

	return (
	<div>
	<DisplayPageHeader headerName="Bonus" groupName="" tournament="" />
	<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} paddingTop={1} >
		<Grid key="Filter" className={gClasses.noPadding} container  >
			<Grid  item xs={3} sm={2} md={2} lg={1} align="left"  >
				<VsSelect size="small" align="left" options={ALLSELECTIONS} value={currentMode} onChange={(event) => { setModeFilter(event.target.value)}} />
			</Grid>
			<Grid item xs={1} sm={1} md={4} lg={3}  >
				<TextField fullWidth label="Filter Text" value={currentText} onChange={ (event) => { setTextFilter(event.target.value) } } />	
			</Grid>
			<Grid  item xs={5} sm={6} md={4} lg={7} >
			</Grid>
			<Grid  item xs={3} sm={3} md={2} lg={1} >
				<VsButton disabled={!isAdmin()} name="New Bonus" align="right" onClick={handleAddBonus} />
			</Grid>
		</Grid>
	</Box>
	<DisplayAllBonus/>
	<Drawer anchor="top" variant="temporary" open={drawer !== ""}>
		<VsCancel align="right" onClick={() => { setDrawer("")}} />
		<BonusAddEdit mode={drawer} isBonus={isBonus}  bonusRec={bonusRec} onReturn={handleBackBonus} />
	</Drawer>
	<Drawer anchor="bottom" variant="temporary" open={drawerInfo !== ""} >
		<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} paddingLeft={2} >		
		<VsCancel align="right" onClick={() => { setDrawerInfo("")}} />	
		<DisplayPageHeader headerName={`Bonus & Payment details`} groupName="" tournament="" />
			<Table  align="center">
			<TableHead p={0}>
			<TableRow key="header" align="center">
				<TableCell className={gClasses.th} p={0} align="center">Date</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Ref.Batch</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Bonus</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Payment</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Remarks</TableCell>
				<TableCell className={gClasses.th} p={0} align="center"></TableCell>
			</TableRow>
			</TableHead>
			<TableBody p={0}>
				{userBonusArray.map(x => {
						//console.log(x);
						//var myClasses = (x.bonusAmount > 0) ? gClasses.td : gClasses.disabledtd;
						var myClasses = gClasses.td;					
					return (
					<TableRow key={x._id}>
						<TableCell align="center" className={myClasses} p={0} >{dateString(x.date)}</TableCell>
						<TableCell align="center" className={myClasses} p={0} >{x.bid}</TableCell>
						<TableCell align="center" className={myClasses} p={0} >{(x.bonusAmount > 0) ? x.bonusAmount : "" }</TableCell>
						<TableCell align="center" className={myClasses} p={0} >{(x.bonusPayment > 0) ? x.bonusPayment : ""}</TableCell>
						<TableCell className={myClasses} p={0} >{x.remarks}</TableCell>
						<TableCell className={myClasses} p={0} >
							<IconButton color="primary" disabled={!x.enabled} size="small" onClick={() => {handleEditBonusPayment(x)}} ><EditIcon /></IconButton>
							<IconButton color="secondary" size="small" onClick={() => {handleDeleteBonusPayment(x)}} ><CancelIcon /></IconButton>
						</TableCell>
					</TableRow>
				)})}
			</TableBody>
			</Table>
		</Box>
	</Drawer>
	<ToastContainer />
	</div>
	);
}
