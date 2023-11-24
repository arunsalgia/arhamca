import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';

import Drawer from '@material-ui/core/Drawer';
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
	dateString,
	mergedName, getCodeFromMergedName, getNameFromMergedName,
	isAdmMan, isAdmManFac, isFaculty,
} from 'views/functions';



export default function Session() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	//const alert = useAlert();
		
	
	const [currentSelection, setCurrentSelection] = useState(ALLSELECTIONS[0]);
	const [mode, setMode] = useState("");
	const [sessionArray, setSessionArray] = useState([]);
	const [studentSession, setStudentSession] = useState([]);
	//const [masterBatchArray, setMasterBatchArray] = useState([]);

	const [batchRec, setBatchRec] = useState({});

	// for faculty schule call
	const [sessionRec, setSessionRec] = useState({});
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
		async function getAllSessions() {
			try {
				if (isAdmMan()) {
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/session/list/all`;
					const response = await axios.get(myUrl);
					//console.log(response.data);
					setSessionArray(response.data);
					//setMasterBatchArray(response.data);
				}
				else if (isFaculty()) {
					// first get the faculty id
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/enabledfacultybyuid/${sessionStorage.getItem("uid")}/`;				
					var response = await axios.get(myUrl);
					//console.log(response.data);
					// now using faculty id. Get faculty's batch
					if (response.data) {
						myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/session/list/byFaculty/${response.data.fid}`;
						response = await axios.get(myUrl);
						setSessionArray(response.data);
						//setMasterBatchArray(response.data);
					}
					
				}
				else {
					console.log("Not correct role");
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

	async function handleAddSession(rec) {
		try {
			var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/student/getbatch/${rec.sid}`);
			if (response.data.bid === "") {
				toast.error(`No current batch for student ${rec.sid}`);
				return;
			}
			setBatchRec(response.data);
			setDrawer("ADDSESSION");
		}
		catch (e) {
			console.log(e);
			toast.error(`Error getting batch record of ${rec.sid}`);
		}
	}

	function handleBack(sts)
	{
		if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) toast.error(sts.msg); 
		else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) toast.success(sts.msg); 
		
		if (sts.status !== STATUS_INFO.ERROR) {
			if (drawer === "ADDSESSION") {
				var clonedSessionArray = [].concat(sessionArray);
				for(var i = 0; i < clonedSessionArray.length; ++i) {
					if ( batchRec.sid.includes(clonedSessionArray[i].sid) )
						clonedSessionArray[i].count += 1;
				}
				setSessionArray(clonedSessionArray);
			}	
		}
		setDrawer("");
	}
		
	async function handleInfo(rec) {
		setSessionRec(rec);
		try {
			var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/session/listbysid/${rec.sid}`);
			setStudentSession(response.data);
		}
		catch (e) {
			setStudentSession([]);
			console.log(e);
			toast.error(`Error getting session details of ${mergedName(rec.name, rec.sid)}`);
		}
		setDrawerInfo("detail");
	}


	function DisplayAllSession() {
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
				{sessionArray.map(x => {
						var myClasses = gClasses.td ;
						//console.log(x)
					return (
					<TableRow key={x.sid}>
						<TableCell className={myClasses} p={0} align="center" >{x.sid}</TableCell>
						<TableCell className={myClasses} p={0}  >{x.name}</TableCell>
						<TableCell className={myClasses} align="center" p={0} >{x.count}</TableCell>
						<TableCell className={myClasses} p={0} >
							<IconButton disabled={x.count === 0} color="primary" size="small" onClick={() => {handleInfo(x)}} ><InfoIcon /></IconButton>
							<IconButton color="primary"  size="small" onClick={() => {handleAddSession(x)}} ><SchoolIcon /></IconButton>
						</TableCell>
					</TableRow>
				)})}
			</TableBody>
			</Table>
		</div>
		);

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
		</Grid>
	</Grid>
	)}
		
	return (
	<div>
	<DisplayPageHeader headerName="Sessions" groupName="" tournament="" />
	<DisplayOptions />
	<DisplayAllSession/>
	<Drawer anchor="bottom" variant="temporary" open={drawerInfo !== ""} >
		<VsCancel align="right" onClick={() => { setDrawerInfo("")}} />	
		<DisplayPageHeader headerName={`Session details of ${mergedName(sessionRec.name, sessionRec.sid)}`} groupName="" tournament="" />
		<Table  align="center">
		<TableHead p={0}>
		<TableRow key="header" align="center">
			<TableCell className={gClasses.th} p={0} align="center">Date</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Sess. Info</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Present</TableCell>
		</TableRow>
		</TableHead>
		<TableBody p={0}>
			{studentSession.map(x => {
					var myClasses = gClasses.td ;
					//console.log(x)
					var isPresent = (x.attendedSidList.includes(sessionRec.sid)) ? "Yes" : "No";
				return (
				<TableRow key={x.sessionDate+x.sessionNumber}>
					<TableCell className={myClasses} p={0} align="center" >{dateString(x.sessionDate)}</TableCell>
					<TableCell className={myClasses} p={0}  >{`Sesion ${x.sessionNumber} of batch ${x.bid} by ${x.facultyName}`}</TableCell>
					<TableCell className={myClasses} align="center" p={0} >{isPresent}</TableCell>
				</TableRow>
			)})}
		</TableBody>
		</Table>
	</Drawer>
	<Drawer anchor="top" variant="temporary" open={drawer !== ""}>
		<VsCancel align="right" onClick={() => { setDrawer("")}} />
		{(drawer === "ADDSESSION") &&
			<SessionAddEdit mode="ADD" batchRec={batchRec} sessionRec={null} onReturn={handleBack} />
		}
	</Drawer>	
	<ToastContainer />
	</div>
	);
}
