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
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";

import BatchAddEdit from "views/Batch/BatchAddEdit";

import {
	ROLE_FACULTY, ROLE_STUDENT,
	ALLSELECTIONS, BLANKCHAR, STATUS_INFO,
	DURATIONSTR, BATCHTIMESTR,
} from 'views/globals';


import {
	mergedName, getCodeFromMergedName, getNameFromMergedName,
	isAdmin, isAdmMan, isAdmManFac, isFaculty,
} from 'views/functions';



export default function Batch() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	
	const [mode, setMode] = useState("");
	const [batchArray, setBatchArray] = useState([]);
	const [masterBatchArray, setMasterBatchArray] = useState([]);

	const [currentMode, setCurrentMode] = useState(ALLSELECTIONS[1]);
	const [currentText, setCurrentText] = useState("");
	
	//const [batchRec, setBatchRec] = useState("");

	// for faculty schule call
	const [batchRec, setBatchRec] = useState({sid: [], timings: []});
	const [batchTime, setBatchTime] = useState("");
	
	const [showAll, setShowAll] = useState(false);
	
	const [drawer, setDrawer] = useState("");
	const [drawerInfo, setDrawerInfo] = useState("");
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
		async function getAllBatch() {
			try {
				if (isAdmMan()) {
					//console.log("Admin or Main");
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/batch/list/all`;
					const response = await axios.get(myUrl);
					//console.log(response.data);
					setMasterBatchArray(response.data);
					filterBatch(response.data, currentText, currentMode);
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
						setMasterBatchArray(response.data);
						filterBatch(response.data, currentText, currentMode);
					}
					
				}
				else {
					console.log("Not correctr role");
				}
			} catch (e) {
				console.log(e);
			}
		}
		

		getAllBatch();
		handleResize();
		window.addEventListener('resize', handleResize);
	}, [])

	// function handleTimer() {}


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
					toast.error(myMsg);
				

        let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
				return null;
        return(
          <div>
            <Typography align="center" className={myClass}>{myMsg}</Typography>
          </div>
        );
      }

	function handleAddBatch() {
		//var batchInfo = {inUse: true, status: STATUS_INFO.ADD_BATCH, msg: "", record:  null };
		//sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		//setTab(process.env.REACT_APP_BATCH_ADDEDITBATCH);
		setBatchRec({sid: [], timings: []});
		setDrawer("ADDBATCH");
	}
	
	function handleEditBatch(rec) {
		//var batchInfo = {inUse: true, status: STATUS_INFO.EDIT_BATCH, msg: "", record:  rec };
		//sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		//setTab(process.env.REACT_APP_BATCH_ADDEDITBATCH);
		setBatchRec(rec);
		setDrawer("EDITBATCH");
	}
	
	function handleAddSession(rec) {
		//var batchInfo = {inUse: true, from: process.env.REACT_APP_BATCH, status: STATUS_INFO.ADD_SESSION, msg: "", record:  rec, record2: null };
		//sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		//setTab(process.env.REACT_APP_BATCH_ADDEDITSESSION);
		setBatchRec(rec);
		setDrawer("ADDSESSION");
	}
	
	function handleBack(sts)
	{
		if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) toast.error(sts.msg); 
		else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) toast.success(sts.msg); 
		
		if (sts.status !== STATUS_INFO.ERROR) {
			if (drawer === "ADDSESSION") {
				var clonedBatchArray = [].concat(batchArray);
				var myRec = clonedBatchArray.find(x => x.bid === batchRec.bid);
				myRec.sessionCount += 1;
				setBatchArray(clonedBatchArray);
			}	
		}
		setDrawer("");
	}
	
	function handleBackBatch(sts)
	{
		if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) toast.error(sts.msg); 
		else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) toast.success(sts.msg);
		if (sts.status !== STATUS_INFO.ERROR) {
			if (drawer === "ADDBATCH") {
				var clonedBatchArray = batchArray.concat([sts.batchRec]);
				setBatchArray(clonedBatchArray);
			}	
			else {
				var clonedBatchArray = batchArray.filter(x => x.bid !== sts.batchRec.bid);
				setBatchArray(clonedBatchArray.concat([sts.batchRec]));
			}
		}
		setDrawer("");
	}
	
	function handleInfo(rec) {
		setBatchRec(rec);
		let tmp = DURATIONSTR.find(x => x.block === rec.sessionTime);
		setBatchTime(tmp.name);
		setDrawerInfo("detail");
	}

	function handleDeleteBatch(t) {
		vsDialog("Delete Batch", `Are you sure you want to delete batch ${t.bid}?`,
			{label: "Yes", onClick: () => handleDeleteBatchConfirm(t) },
			{label: "No" }
		);
	}
	
	async function handleDeleteBatchConfirm(rec) {
		try {
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/batch/delete/${rec.bid}`;
			const response = await axios.get(myUrl);
			var allRec  = batchArray.filter(x => x.bid !== rec.bid);
			setMasterBatchArray(allRec);
			filterBatch(allRec, currentText, currentMode);
			toast.success(`Successfully deleted batch ${rec.bid}`);
		} catch (e) {
			console.log(e);
			toast.error("Error deleting batch");
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
	
		function handleDisableBatch(t) {
		vsDialog("Disable Batch", `Are you sure you want disable batch ${t.bid}?`,
			{label: "Yes", onClick: () => handleDisableBatchConfirm(t) },
			{label: "No" }
		);
	}
	
	async function handleDisableBatchConfirm(rec) {
		let myRec = masterBatchArray.find(x => x.bid === rec.bid);
		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/batch/disabled/${myRec.bid}`);
			myRec.enabled = false;
			var allRec  = [].concat(masterBatchArray)
			setMasterBatchArray(allRec);
			filterBatch(allRec, currentText, currentMode);
			toast.success(`Disabled batch ${myRec.bid}`);
		}
		catch (e) {
			// error 
			console.log(e);
			toast.error("Error disabling batch "+ rec.bid);
		}
	}

	function handleEnableBatch(t) {
		vsDialog("Enable Batch", `Are you sure you want enable batch ${t.bid}?`,
			{label: "Yes", onClick: () => handleEnableBatchConfirm(t) },
			{label: "No" }
		);
	}
	
	async function handleEnableBatchConfirm(rec) {
		let myRec = masterBatchArray.find(x => x.bid === rec.bid);
		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/batch/enabled/${myRec.bid}`);
			myRec.enabled = true;
			var allRec  = [].concat(masterBatchArray);
			setMasterBatchArray(allRec);
			filterBatch(allRec, currentText, currentMode);
			toast.success(`Disabled batch ${myRec.bid}`);
		}
		catch (e) {
			// error 
			console.log(e);
			toast.error("Error enabling batch "+rec.bid);
		}
	}

	function DisplayAllBatch() {
		//console.log(dispType);
		return (
			<div>
			<Table  align="center">
			<TableHead p={0}>
			<TableRow key="header" align="center">
				<TableCell className={gClasses.th} p={0} align="center">Batch</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Faculty</TableCell>
				{((dispType == "md") || (dispType == "lg")) &&
					<TableCell className={gClasses.th} p={0} align="center">Students</TableCell>
				}
				<TableCell className={gClasses.th} p={0} align="center">Days</TableCell>
				{((dispType == "md") || (dispType == "lg")) &&
				<TableCell className={gClasses.th} p={0} align="center">Sessions</TableCell>
				}
				<TableCell className={gClasses.th} p={0} align="center"></TableCell>
			</TableRow>
			</TableHead>
			<TableBody p={0}>
				{batchArray.map(x => {
					let myInfo = "Address" + "<br />";
						myInfo +=  x.addr1 + "<br />";
						myInfo +=  x.addr2 + "<br />";
						myInfo +=  x.addr3 + "<br />";
						myInfo +=  x.addr4 + "<br />";
						//console.log(x);
						var sList = [];
						x.sid.forEach( (item) => {
							sList.push(item);
						});
						var tList = [];
						x.timings.forEach( (item) => {
							tList.push(item.day);
						})
						var myClasses = (x.enabled) ? gClasses.td : gClasses.disabledtd;
						//console.log(x)
						var myStudents = [];
						//console.log(x);
						for(var i=0; i<x.studentNameList.length; ++i) {
							myStudents.push(mergedName(x.studentNameList[i], x.sid[i]));
						}
					return (
					<TableRow key={x.bid}>
						<TableCell align="center" className={myClasses} p={0} >{x.bid}</TableCell>
						<TableCell className={myClasses} p={0} >{mergedName(x.facultyName, x.fid)}</TableCell>
						{((dispType == "md") || (dispType == "lg")) &&
							<TableCell align="center" className={myClasses} p={0} >{myStudents.join()}</TableCell>
						}
						<TableCell align="center" className={myClasses} p={0} >{tList.join()}</TableCell>
						{((dispType == "md") || (dispType == "lg")) &&
						<TableCell align="center" className={myClasses} p={0} >{x.sessionCount}</TableCell>
						}
						<TableCell className={myClasses} p={0} >
							<IconButton color="primary" disabled={!isAdmMan()} size="small" onClick={() => {handleEditBatch(x)}} ><EditIcon /></IconButton>
							<IconButton color="primary" size="small" onClick={() => {handleInfo(x)}} ><InfoIcon /></IconButton>
							{(x.enabled) &&
								<IconButton color="primary" disabled={!isAdmMan()} size="small" onClick={() => {handleDisableBatch(x)}} ><IndeterminateCheckBoxIcon /></IconButton>
							}
							{(!x.enabled) &&
								<IconButton color="primary" disabled={!isAdmMan()} size="small" onClick={() => {handleEnableBatch(x)}} ><CheckBoxIcon /></IconButton>						
							}
							<IconButton color="primary" disabled={!x.enabled} size="small" onClick={() => {handleAddSession(x)}} ><SchoolIcon /></IconButton>
							<IconButton color="primary" disabled={!x.enabled} size="small" onClick={() => {handleFacultySchedule(x)}} ><TableChartSharpIcon /></IconButton>
							<IconButton disabled={(x.sessionCount > 0) || !isAdmMan() } color="secondary" size="small" onClick={() => {handleDeleteBatch(x)}} ><CancelIcon /></IconButton>
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
			//default:          setBatchArray(masterArray);  break;
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
		setBatchArray(finalFilterArray);
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
			<VsButton disabled={!isAdmMan()} name="New Batch" align="right" onClick={handleAddBatch} />
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
				<VsButton disabled={!isAdmMan()} name="New Batch" align="right" onClick={handleAddBatch} />
			</Grid>
		</Grid>
		</Box>
		</div>
	)}
	

	return (
	<div>
	<DisplayPageHeader headerName="Batch" groupName="" tournament="" />
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
				<VsButton disabled={!isAdmin()} name="New Batch" align="right" onClick={handleAddBatch} />
			</Grid>
		</Grid>
	</Box>
	<DisplayAllBatch/>
	{/*<DisplayAllToolTips />*/}
	<Drawer anchor="top" variant="temporary" open={drawer !== ""}>
		<VsCancel align="right" onClick={() => { setDrawer("")}} />
		{(drawer === "FACULTYSCHEDULE") &&
			<FacultySchedule faculty={{name: batchRec.facultyName, fid: batchRec.fid} } all={showAll} />
		}
		{(drawer === "ADDSESSION") &&
			<SessionAddEdit mode="ADD" batchRec={batchRec} sessionRec={null} onReturn={handleBack} />
		}
		{( (drawer === "ADDBATCH") || (drawer === "EDITBATCH") ) &&
			<BatchAddEdit mode={(drawer === "ADDBATCH") ? "ADD" : "EDIT"}  batchRec={batchRec} onReturn={handleBackBatch} />
		}
	</Drawer>
	<Drawer anchor="bottom" variant="temporary" open={drawerInfo !== ""} >
		<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >		<VsCancel align="right" onClick={() => { setDrawerInfo("")}} />	
		<DisplayPageHeader headerName={`Batch details`} groupName="" tournament="" />
			<Grid key="INFOBATCH" className={gClasses.noPadding} container alignItems="flex-start" >
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography style={{margin: "10px"}} className={gClasses.info18Blue} >Batch Id</Typography>
				</Grid>
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.info18} >{batchRec.bid}</Typography>
				</Grid>
				{((dispType == "xs") || (dispType == "sm")) &&
					<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				}
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography style={{margin: "10px"}} className={gClasses.info18Blue} >Faculty</Typography>
				</Grid>
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.info18} >{mergedName(batchRec.facultyName,  batchRec.fid)}</Typography>
				</Grid>
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography style={{margin: "10px"}} className={gClasses.info18Blue} >Fees</Typography>
				</Grid>
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.info18} >{batchRec.fees}</Typography>
				</Grid>
				{((dispType == "xs") || (dispType == "sm")) &&
					<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				}
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography style={{margin: "10px"}} className={gClasses.info18Blue} >Duration</Typography>
				</Grid>
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.info18} >{batchTime}</Typography>
				</Grid>
				{((dispType == "xs") || (dispType == "sm")) &&
					<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				}
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={8} sm={8} md={10} lg={10} >
					<Typography style={{margin: "10px"}} className={gClasses.info18Blue}>Batch students</Typography>
				</Grid>
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} >
					<Table  align="center">
					<TableHead p={0}>
					<TableRow key="header" align="center">
						<TableCell className={gClasses.th} p={0} align="center">Name</TableCell>
					</TableRow>
					</TableHead>
					<TableBody p={0}>
						{batchRec.sid.map( (x, index) => {
								var myClasses = gClasses.td;
							return (
							<TableRow key={x} align="center">
								<TableCell align="center" className={myClasses} p={0} >{mergedName(batchRec.studentNameList[index], batchRec.sid[index])}</TableCell>
							</TableRow>
						)})}
					</TableBody>
					</Table>
				</Grid>
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={12} sm={12} md={12} lg={12} >
					<Typography style={{margin: "10px"}} className={gClasses.info18Blue}>Session schedule (per week)</Typography>
				</Grid>
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} >
					<Table  align="center">
					<TableHead p={0}>
					<TableRow key="header" align="center">
						<TableCell className={gClasses.th} p={0} align="center">Day</TableCell>
						<TableCell className={gClasses.th} p={0} align="center">Time</TableCell>
					</TableRow>
					</TableHead>
					<TableBody p={0}>
						{batchRec.timings.map( x => {
								var myClasses = gClasses.td;
								//var timStr = `x.name`;
								var myTime = BATCHTIMESTR.find(rec => (rec.hour === x.hour) && (rec.min === x.minute));
							return (
							<TableRow key={x.day+x.hour+x.minute} align="center">
								<TableCell align="center"  className={myClasses} p={0} >{x.day}</TableCell>
								<TableCell align="center"  className={myClasses} p={0} >{myTime.name}</TableCell>
							</TableRow>
						)})}
					</TableBody>
					</Table>
					</Grid>
				<br />
			</Grid>
			</Box>
	</Drawer>
	<ToastContainer />
	</div>
	);
}
