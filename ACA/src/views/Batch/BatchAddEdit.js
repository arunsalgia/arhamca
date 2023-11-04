import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
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

import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import CancelIcon from '@material-ui/icons/Cancel';

//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { isMobile, getWindowDimensions, displayType, decrypt, encrypt } from 'views/functions';

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";

//const ALLROLES = ["Student", "Faculty", "Admin"];

import {
	ROLE_FACULTY , ROLE_STUDENT,
	ALLSELCTIONS, BLANKCHAR,
	NOFRACTION,
	SHORTWEEKSTR, HOURBLOCKSTR, MINUTEBLOCKSTR, SESSIONHOURSTR,
	
} from 'views/globals';

var batchRec = null;

export default function BatchAddEdit(props) {
	//const classes = useStyles();
	const gClasses = globalStyles();
	//const alert = useAlert();
	batchRec = props.batch;
	
	const [currentSelection, setCurrentSelection] = useState(ALLSELCTIONS[0]);
	
	const [areaArray, setAreaArray] = useState([]);
	const [studentArray, setStudentArray] = useState([]);
	const [batchArray, setBatchArray] = useState([]);
	const [facultyArray, setFacultyArray] = useState([]);
	const [masterBatchArray, setMasterBatchArray] = useState([]);
	
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	//const [batchRec, setBatchtRec] = useState(null);
	const [userRec, setUserRec] = useState(null);
	
	const [area, setArea] = useState("");
	const [faculty, setFaculty] = useState("");

	const [sessHour, setSessHour] = useState(SESSIONHOURSTR[0]);

	const [newStudent, setNewStudent] = useState("");
	const [batchStudents, setBatchStudents] = useState([]);
	const [batchSessions, setBatchSessions] = useState([]);
	
	const [newDay, setNewDay] = useState("");
	const [newHour, setNewHour] = useState("");
	const [newMin, setNewMin] = useState("");
	const [newFess, setNewFees] = useState(200);
	
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("Student");
	const [area1, setArea1] = useState("");
	const [area2, setArea2] = useState("");
	const [area3, setArea3] = useState("");
	const [area4, setArea4] = useState("");
	const [parentName, setParentName] = useState("");
	const [parentMobile, setParentMobile] = useState("");
	
	const [areaCode, setAreaCode] = useState("");
	const [areaDesc, setAreaDesc] = useState("");
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

		async function getAllAreas() {
			try {
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/area/list`;
				const response = await axios.get(myUrl);
				//console.log(response.data);
				setAreaArray(response.data);
				setArea(response.data[0]);
			} catch (e) {
				console.log(e);
				alert("Error Fetching area");
			}
		}
		
		async function getAllStudents() {
		try {
			var subfun = (props.batch) ? "list/freeorbatch/" + props.batch.bid :  "list/free";
			console.log(subfun);
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/student/${subfun}`;
			const response = await axios.get(myUrl);
			//console.log(response.data);
			setStudentArray(response.data);
		} catch (e) {
			console.log(e);
			alert("Error Fetching Studnets");
		}
	}

		async function getAllFaculty() {	
		try {
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/list/enabled`;
			const response = await axios.get(myUrl);
			//console.log(response.data);
			setFacultyArray(response.data);
			setFaculty(response.data[0]);
		} catch (e) {
			console.log(e);
			alert("Error Fetching Faculty");
		}
	}

		getAllAreas();
		getAllFaculty();
		getAllStudents()
		
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
					myMsg = "Student already in Batch";
					break;
				default:
					myMsg = "Error updating Captain / ViceCaptain details";
					break;
			}
			//console.log(errmsg, registerStatus);
			let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
			return(
				<div>
					<Typography align="center" className={myClass}>{myMsg}</Typography>
				</div>
			);
		}

async function handleAddEditSubmit() {
	console.log("Add / Edit User");
	return;
	var response;
	var a1 = (area1 !== "") ? area1 : BLANKCHAR;
	var a2 = (area2 !== "") ? area2 : BLANKCHAR;
	var a3 = (area3 !== "") ? area3 : BLANKCHAR;
	var a4 = (area4 !== "") ? area4 : BLANKCHAR;
	var pName = (parentName !== "") ? parentName : BLANKCHAR;
	var pMob = (parentMobile !== "") ? parentMobile : BLANKCHAR;
	
	try {
		if (props.batch == null) {
		// for add new user
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/student/add/${userName}/${encrypt(password)}/${encrypt(email)}/${mobile}/${a1}/${a2}/${a3}/${a4}/${pName}/${pMob}`;
			//console.log(myUrl);
			var response = await axios.get(myUrl);
			//console.log("axios done", response.data);
			var tmp = masterBatchArray.concat([response.data]);
			tmp = lodashSortBy(tmp, 'name');
			setMasterBatchArray(tmp);
			filterStudent(tmp, currentSelection);
			setDrawer("");
			alert("Successfully added details of " + userName);
		}
		else {
			// for edit user
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/student/update/${batchRec.sid}/${userName}/${encrypt(password)}/${encrypt(email)}/${mobile}/${a1}/${a2}/${a3}/${a4}/${pName}/${pMob}`;	
			//console.log(myUrl);
			var response = await axios.get(myUrl);
			var tmp = masterBatchArray.filter(x => x.uid !== batchRec.uid);
			tmp = tmp.concat([response.data])
			tmp = lodashSortBy(tmp, 'name');
			setMasterBatchArray(tmp);
			filterStudent(tmp, currentSelection);
			setDrawer("");
			alert("Successfully edit details of " + userName);
		}
	}
	catch (e) {
		//alert.error("Error adding / updateing Area");
		console.log("Error");
		
	}
}

function handleAdd() {
	console.log("In add");
	setBatchtRec(null);
	setUserName("");
	setMobile("");
	setEmail("")
	//setRole(ALLROLES[0]);
	setPassword("");
	setArea1("");
	setArea2("");
	setArea3("");
	setArea4("");
	setParentName("");
	setParentMobile("");
	setDrawer("New");
}

async function handleEdit(r) {
	//console.log(r);
	setBatchtRec(r);
	// Now get the user record
	var myUser;
	try {
		var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/acagetbyid/${r.uid}`);
		myUser = resp.data;
		//console.log(myUser);
		setUserRec(myUser);
	}
	catch (e) {
		alert('Error while fetching user record');
		setBatchtRec(null);
		return;
	}
	setUserName(myUser.displayName);
	setMobile(myUser.mobile);
	setEmail(decrypt(myUser.email))
	//setRole(r.role);
	setPassword(decrypt(myUser.password));
	setArea1(myUser.addr1);
	setArea2(myUser.addr2);
	setArea3(myUser.addr3);
	setArea4(myUser.addr4);
	setParentName(r.parentName);
	setParentMobile(r.parentMobile);
	setDrawer("Edit");
}

function handleInfo(r) {
	setBatchtRec(r);
	setDrawerDetail("detail");
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

async function handleDisableStudent(x) {
	let myRec = masterBatchArray.find(rrr => rrr.sid === x.sid);
	if (myRec.bid != "") {
		alert(`Student ${myRec.name} has batche ${myRec.bid} in progress.`);
		return;
	}
	try {
		await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/student/disabled/${myRec.sid}`);
		myRec.enabled = false;
		var allRec  = [].concat(masterBatchArray)
		setMasterBatchArray(allRec);
		filterStudent(allRec, currentSelection);
	}
	catch (e) {
		// error 
		console.log(e);
		alert("Error disabling student "+x.name);
	}
}

async function handleEnableStudent(x) {
	let myRec = masterBatchArray.find(rrr => rrr.sid === x.sid);
	try {
		await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/student/enabled/${myRec.sid}`);
		myRec.enabled = true;
		var allRec  = [].concat(masterBatchArray)
		setMasterBatchArray(allRec);
		filterStudent(allRec, currentSelection);
	}
	catch (e) {
		// error 
		console.log(e);
		alert("Error disabling student "+x.name);
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
			<TableCell className={gClasses.th} p={0} align="center">Students</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Days</TableCell>
			<TableCell className={gClasses.th} p={0} align="center">Sessions</TableCell>
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
				return (
				<TableRow key={x.bid}>
					<TableCell className={myClasses} p={0} >{x.bid}</TableCell>
					<TableCell className={myClasses} p={0} >{x.fid}</TableCell>
					<TableCell className={myClasses} p={0} >{sList.join()}</TableCell>
					<TableCell className={myClasses} p={0} >{tList.join()}</TableCell>
					<TableCell className={myClasses} p={0} >{x.sessionCount}</TableCell>
					<TableCell className={myClasses} p={0} >
						<EditIcon color="primary" size="small" onClick={() => {handleEdit(x)}}  />
						<InfoIcon color="primary" size="small" onClick={() => {handleInfo(x)}}  />
						{(x.enabled) &&
							<IndeterminateCheckBoxIcon color="primary" size="small" onClick={() => {handleDisableStudent(x)}}  />							
						}
						{(!x.enabled) &&
							<CheckBoxIcon color="primary" size="small" onClick={() => {handleEnableStudent(x)}}  />							
						}
					</TableCell>
				</TableRow>
			)})}
		</TableBody>
		</Table>
	</div>
	);

}

function filterStudent(masterArray, x) {
	switch (x) {
		case "Disabled":  setBatchArray(masterArray.filter(x => !x.enabled ));  break;
		case "Enabled":   setBatchArray(masterArray.filter(x => x.enabled ));  break;
		default:          setBatchArray(masterArray);  break;
	}
}

function selectAll(x) {
	setCurrentSelection(x);
	filterStudent(masterBatchArray, x);
}

function handlAddStudent() {
	setNewStudent("");
	setDrawer("ADDSTUDENT");
}

function handlAddSession() {
	setNewDay(SHORTWEEKSTR[1]);
	setNewHour(HOURBLOCKSTR[0]);
	setNewMin(MINUTEBLOCKSTR[0]);
	setDrawer("ADDSESSION");
}

function handleAddStudent() {
	//console.log("Studnet " + newStudent + " selected");
	if (newStudent == "") {
		setRegisterStatus(501);
		return;
	}
	var tmp = batchStudents.find(x => x.name === newStudent);
	if (tmp) {
		setRegisterStatus(502);
		return;
	}
	// New student validation done
	tmp = studentArray.find(x => x.name == newStudent);
	tmp = batchStudents.concat([tmp]);
	setBatchStudents(tmp)
	setDrawer("");
}



function handleAddsession() {
	//console.log(batchSessions);
	//console.log("Add session handle");
	//console.log(newDay, newHour, newDay);	
	var tmp = batchSessions.find(x => ((x.day == newDay) &&  (x.hour ==  newHour) && (x.min == newMin)));
	if (tmp) {
		setRegisterStatus(701);
		return;
	}
	tmp = batchSessions.concat([{sessid: batchSessions.length+1, day: newDay, hour: newHour, min: newMin}]);
	setBatchSessions(tmp);	
	setRegisterStatus(0);
	setDrawer("");
}

function handleDelStudent(x) {
	setBatchStudents(batchStudents.filter(x => x.name !== x.name));
	setRegisterStatus(0);
}

function handleDelSession(x) {
	setBatchSessions(batchSessions.filter(x => x.sessid !== x.sessid));
	setRegisterStatus(0);
}


// style={{marginTop: "5px" }}  
function DisplayOptions() {
return (
<Grid key="Options" className={gClasses.noPadding} container alignItems="center" >
	<Grid  item xs={3} sm={2} md={2} lg={1} >
		<VsSelect size="small" align="center" label="Selection" options={ALLSELCTIONS} value={currentSelection} onChange={(event) => { selectAll(event.target.value)}} />
	</Grid>
	<Grid align="left"  item xs={6} sm={7} md={8} lg={10} >
		<span></span>
	</Grid>
	<Grid  item xs={3} sm={3} md={2} lg={1} >
		<VsButton name="New Batch" align="right" onClick={handleAdd} />
	</Grid>
</Grid>
)}
	
	//console.log(dispType);
	return (
	<div>
		<DisplayPageHeader headerName="Add new Batch" groupName="" tournament="" />
		<br />
		<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
			<ValidatorForm margin={2} align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}  >
			<Grid key="ADDEDITBATCH" className={gClasses.noPadding} container alignItems="flex-start" >
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.info18Blue} >Area</Typography>
				</Grid>
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<VsSelect size="small" align="center" options={areaArray} field="longName" value={area} onChange={(event) => { setArea(event.target.value)}} />			
				</Grid>
				{((dispType == "xs") || (dispType == "sm")) &&
					<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				}
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.info18Blue} >Faculty</Typography>
				</Grid>
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<VsSelect size="small" align="center" options={facultyArray} field="name" value={faculty} onChange={(event) => { setFaculty(event.target.value)}} />			
				</Grid>
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.info18Blue} >Fees</Typography>
				</Grid>
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<TextValidator variant="outlined" required name="auctioncoins" type="number"
						value={newFess} onChange={(event) => setNewFees(event.target.value)}
						validators={['required', 'minNumber:200', 'maxNumber:10000', 'isNumeric']}
						errorMessages={['Session fees to be provided', 'Fees cannot be less than 200', 'Fees cannot be more than 10000',NOFRACTION ]}
					/>
				</Grid>
				{((dispType == "xs") || (dispType == "sm")) &&
					<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				}
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<Typography className={gClasses.info18Blue} >Duration</Typography>
				</Grid>
				<Grid item xs={6} sm={6} md={3} lg={3} >
					<VsSelect size="small" align="center" options={SESSIONHOURSTR} value={sessHour} onChange={(event) => { setSessHour(event.target.value)}} />			
				</Grid>
				{((dispType == "xs") || (dispType == "sm")) &&
					<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				}
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={8} sm={8} md={10} lg={10} >
					<Typography className={gClasses.info18Blue}>Students in the Batch</Typography>
				</Grid>
				<Grid  item xs={4} sm={4} md={2} lg={2} >
					<VsButton type="button" name="Add student" onClick={handlAddStudent} />
				</Grid>
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} >
					<Table  align="center">
					<TableHead p={0}>
					<TableRow key="header" align="center">
						<TableCell className={gClasses.th} p={0} align="center">Name</TableCell>
						<TableCell className={gClasses.th} p={0} align="center">Code</TableCell>
						<TableCell className={gClasses.th} p={0} align="center"></TableCell>
					</TableRow>
					</TableHead>
					<TableBody p={0}>
						{batchStudents.map(x => {
								var myClasses = gClasses.td;
							return (
							<TableRow key={x.sid} align="center">
								<TableCell align="center" className={myClasses} p={0} >{x.name}</TableCell>
								<TableCell align="center" className={myClasses} p={0} >{x.sid}</TableCell>
								<TableCell align="center" className={myClasses} p={0} >
									<CancelIcon color="secondary"  size="small" onClick={() => {handleDelStudent(x)}} />
								</TableCell>
							</TableRow>
						)})}
					</TableBody>
					</Table>
				</Grid>
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
				<Grid item xs={8} sm={8} md={10} lg={10} >
					<Typography className={gClasses.info18Blue}>Session details (per week)</Typography>
				</Grid>
				<Grid  item xs={4} sm={4} md={2} lg={2} >
					<VsButton type="button" name="Add Session" onClick={handlAddSession} />
				</Grid>
				<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} >
					<Table  align="center">
					<TableHead p={0}>
					<TableRow key="header" align="center">
						<TableCell className={gClasses.th} p={0} align="center">Day</TableCell>
						<TableCell className={gClasses.th} p={0} align="center">Time</TableCell>
						<TableCell className={gClasses.th} p={0} align="center"></TableCell>
					</TableRow>
					</TableHead>
					<TableBody p={0}>
						{batchSessions.map( x => {
								var myClasses = gClasses.td;
								var timStr = `${x.hour}:${x.min}`;
							return (
							<TableRow key={x.sessid} align="center">
								<TableCell align="center"  className={myClasses} p={0} >{x.day}</TableCell>
								<TableCell align="center"  className={myClasses} p={0} >{timStr}</TableCell>
								<TableCell align="center"  className={myClasses} p={0} >
									<CancelIcon color="secondary"  size="small" onClick={() => {handleDelSession(x)}} />
								</TableCell>
							</TableRow>
						)})}
					</TableBody>
					</Table>
				</Grid>
				<br />
				<ShowResisterStatus />
				<br />
				<Grid  item xs={12} sm={12} md={12} lg={12} >
					<VsButton type="button" name={(props.batch) ? "Update" : "Add"} />
				</Grid>
			</Grid>
			</ValidatorForm>
			<ValidComp p1={password}/>   
		</Box>
		<Drawer anchor="right" variant="temporary" open={drawer != ""}>
			<Box style={{margin: "20px"}} margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				<VsCancel align="right" onClick={() => { setDrawer("")}} />
				<br />
				<br />
				{(drawer === "ADDSTUDENT") &&
					<div align="center">
					<Typography className={gClasses.info18Blue} >Add Student</Typography>
					<br />
					<br />
					<VsSelect size="small" align="center" options={studentArray} field="name" value={newStudent} onChange={(event) => { setNewStudent(event.target.value)}} />			
					<br />
					<ShowResisterStatus />
					<br />
					<VsButton type="button" name="Select Student" onClick={handleAddStudent} />
					</div>
				}
				{(drawer === "ADDSESSION") &&
					<div align="center">
					<Typography className={gClasses.info18Blue} >Add Session</Typography>
					<br />
					<Grid style={{margin: "10px"}} key="ADDSESSION" className={gClasses.noPadding} container alignItems="flex-start" >
						<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
						<Grid item xs={6} sm={6} md={6} lg={6} align="left" >
							<Typography className={gClasses.info18Blue} >Day of the week</Typography>
						</Grid>
						<Grid item xs={6} sm={6} md={6} lg={6} >
							<VsSelect label="Day" size="small" align="center" options={SHORTWEEKSTR} value={newDay} onChange={(event) => { setNewDay(event.target.value)}} />			
						</Grid>
						<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
						<Grid item xs={6} sm={6} md={6} lg={6} align="left" >
							<Typography className={gClasses.info18Blue} >Hour</Typography>
						</Grid>
						<Grid item xs={6} sm={6} md={6} lg={6} >
							<VsSelect label="Hour" size="small" align="center" options={HOURBLOCKSTR} value={newHour} onChange={(event) => { setNewHour(event.target.value)}} />			
						</Grid>
						<Grid style={{margin: "10px"}} item xs={12} sm={12} md={12} lg={12} />
						<Grid item xs={6} sm={6} md={6} lg={6} align="left"  >
							<Typography className={gClasses.info18Blue} >Minute</Typography>
						</Grid>
						<Grid item xs={6} sm={6} md={6} lg={6} >
							<VsSelect label="Min" size="small" align="center" options={MINUTEBLOCKSTR} value={newMin} onChange={(event) => { setNewMin(event.target.value)}} />			
						</Grid>
					</Grid>
					<br />
					<ShowResisterStatus />
					<br />
					<VsButton type="button" name="Add new Session" onClick={handleAddsession} />
					</div>				
				}
			</Box>
		</Drawer>
	</div>
	)
}
