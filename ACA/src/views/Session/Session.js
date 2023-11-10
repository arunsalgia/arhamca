import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';

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
	isAdmMan, isAdmManFac, isFaculty,
} from 'views/functions';



export default function Session() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	//const alert = useAlert();
		
	
	const [currentSelection, setCurrentSelection] = useState(ALLSELECTIONS[0]);
	const [mode, setMode] = useState("");
	const [batchArray, setBatchArray] = useState([]);
	const [masterBatchArray, setMasterBatchArray] = useState([]);


	const [selBatch, setSelBatch] = useState("");

	// for faculty schule call
	const [batchRec, setBatchRec] = useState({});
	const [showAll, setShowAll] = useState(false);
	
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
		//console.log(firsTime);
		async function getAllSessions() {
			try {
				if (isAdmMan()) {
					console.log("Admin or Main");
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/session/list/all`;
					const response = await axios.get(myUrl);
					//console.log(response.data);
					setBatchArray(response.data);
					setMasterBatchArray(response.data);
				}
				else if (isFaculty()) {
					console.log("Facultyn");
					// first get the faculty id
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/enabledfacultybyuid/${sessionStorage.getItem("uid")}/`;				
					var response = await axios.get(myUrl);
					// not using facilty id. Get facult's batch
					if (response.data) {
						myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/batch/enabledbatch/${response.data.fid}`;
						response = await axios.get(myUrl);
						setBatchArray(response.data);
						setMasterBatchArray(response.data);
					}
					
				}
				else {
					console.log("Not correctr role");
				}
			} catch (e) {
				console.log(e);
			}
		}
		
		/*
		var myData = sessionStorage.getItem("batchInfo");
		if (myData) {
			var tmp = JSON.parse(myData);
			switch (tmp.status) {
				case STATUS_INFO.OKAY:   alert(tmp.msg); break;
				case STATUS_INFO.ERROR:  alert(tmp.msg); break;
			}
		}
		sessionStorage.removeItem("batchInfo");
		*/
		
		getAllSessions();
		handleResize();
		window.addEventListener('resize', handleResize);
	}, [])


	function handleBack(msg)
	{
		console.log(sts.msg);
		if (sts.msg !== "")  alert(sts.msg);
		if (sts.status === "ADD") {
			
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
				//	alert.info(
        let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
				return null;
        return(
          <div>
            <Typography align="center" className={myClass}>{myMsg}</Typography>
          </div>
        );
      }

	function handleAddBatch() {
		var batchInfo = {inUse: true, status: STATUS_INFO.ADD_BATCH, msg: "", record:  null };
		sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		setTab(process.env.REACT_APP_BATCH_ADDEDITBATCH);
	}
	
	function handleEditBatch(rec) {
		var batchInfo = {inUse: true, status: STATUS_INFO.EDIT_BATCH, msg: "", record:  rec };
		sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		setTab(process.env.REACT_APP_BATCH_ADDEDITBATCH);
	}
	
	async function handleAddSession(rec) {
		//var batchInfo = {inUse: true, from: process.env.REACT_APP_BATCH, status: STATUS_INFO.ADD_SESSION, msg: "", record:  rec, record2: null };
		//sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		//setTab(process.env.REACT_APP_BATCH_ADDEDITSESSION);
		
		// first get the batch record of the student
		try {
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/batch/get/${rec.bid}`;				
			const response = await axios.get(myUrl);
			//console.log(response.data);
			setBatchRec(response.data);
			setDrawer("ADDSESSION");
		} 
		catch (e) {
			alert("Error getting batch of student");
		}
	}
	
	function handleInfo(r) {
		setBatchtRec(r);
		setDrawerDetail("detail");
	}

	async function handleDeleteBatch(rec) {
		try {
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/batch/delete/${rec.bid}`;
			const response = await axios.get(myUrl);
			var allRec  = batchArray.filter(x => x.bid !== rec.bid);
			setMasterBatchArray(allRec);
			filterBatch(allRec, currentSelection);
			alert(`Successfull deleted batch ${rec.bid}`);
		} catch (e) {
			console.log(e);
			alert("Error deleting batch");
		}
	}

	async function handleFacultySchedule(rec) {
		/*
		var batchInfo = {inUse: true, from: process.env.REACT_APP_BATCH, status: STATUS_INFO.FACULTYSCHEDULE, msg: "", record:  rec };
		sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		setTab(process.env.REACT_APP_FACULTYSCHEDULE);
		*/
		setBatchRec(rec);
		setShowAll(isAdmMan());
		setDrawer("FACULTYSCHEDULE");
		
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
	
	async function handleDisableBatch(rec) {
		let myRec = masterBatchArray.find(x => x.bid === rec.bid);
		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/batch/disabled/${myRec.bid}`);
			myRec.enabled = false;
			var allRec  = [].concat(masterBatchArray)
			setMasterBatchArray(allRec);
			filterBatch(allRec, currentSelection);
		}
		catch (e) {
			// error 
			console.log(e);
			alert("Error disabling batch "+ rec.bid);
		}
	}

	async function handleEnableBatch(rec) {
		let myRec = masterBatchArray.find(x => x.bid === rec.bid);
		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/batch/enabled/${myRec.bid}`);
			myRec.enabled = true;
			var allRec  = [].concat(masterBatchArray)
			setMasterBatchArray(allRec);
			filterBatch(allRec, currentSelection);
		}
		catch (e) {
			// error 
			console.log(e);
			alert("Error enabling batch "+rec.bid);
		}
	}

	function DisplayAllBatch() {
		//console.log(dispType);
		return (
			<div>
			<Table  align="center">
			<TableHead p={0}>
			<TableRow key="header" align="center">
				<TableCell className={gClasses.th} p={0} align="center">Code</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Student</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Sess. Count</TableCell>
				<TableCell className={gClasses.th} p={0} align="center"></TableCell>
			</TableRow>
			</TableHead>
			<TableBody p={0}>
				{batchArray.map(x => {
						var myClasses = gClasses.td ;
						//console.log(x)
					return (
					<TableRow key={x.sid}>
						<TableCell className={myClasses} p={0} align="center" >{x.sid}</TableCell>
						<TableCell className={myClasses} p={0}  >{x.name}</TableCell>
						<TableCell className={myClasses} align="center" p={0} >{x.count}</TableCell>
						<TableCell className={myClasses} p={0} >
							<IconButton color="primary" size="small" onClick={() => {handleInfo(x)}} ><InfoIcon /></IconButton>
							{/*<IconButton color="primary" disabled={(!x.enabled || (x.bid === ""))} size="small" onClick={() => {handleAddSession(x)}} ><SchoolIcon /></IconButton>*/}
						</TableCell>
					</TableRow>
				)})}
			</TableBody>
			</Table>
		</div>
		);

	}
	
	function filterBatch(masterArray, x) {
		switch (x) {
			case "Disabled":  setBatchArray(masterArray.filter(x => !x.enabled ));  break;
			case "Enabled":   setBatchArray(masterArray.filter(x => x.enabled ));  break;
			default:          setBatchArray(masterArray);  break;
		}
	}
	
	function selectAll(x) {
		setCurrentSelection(x);
		filterBatch(masterBatchArray, x);
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
			<VsButton disabled={!isAdmMan()} name="New Batch" align="right" onClick={handleAddBatch} />
		</Grid>
	</Grid>
	)}
		
	return (
	<div>
	<DisplayPageHeader headerName="Sessions" groupName="" tournament="" />
	<DisplayOptions />
	<DisplayAllBatch/>
	{/*<DisplayAllToolTips />*/}
	<Drawer anchor="top" variant="temporary" open={drawer !== ""}>
		<VsCancel align="right" onClick={() => { setDrawer("")}} />
		{(drawer === "FACULTYSCHEDULE") &&
			<FacultySchedule batchRec={batchRec} all={showAll} />
		}
		{(drawer === "ADDSESSION") &&
			<SessionAddEdit mode="ADD" batchRec={batchRec} sessionRec={null} onReturn={handleBack} />
		}
	</Drawer>
	</div>
	);
}
