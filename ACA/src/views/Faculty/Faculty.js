import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
import Container from '@material-ui/core/Container';

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
//import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Radio from '@material-ui/core/Radio';
//import BlueRadio from 'components/Radio/BlueRadio';
import { UserContext } from "../../UserContext";
import { DisplayPageHeader, ValidComp, BlankArea} from 'CustomComponents/CustomComponents.js';

import lodashSortBy from "lodash/sortBy";

import FacultySchedule	 from "views/Faculty/FacultySchedule"

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import TableChartSharpIcon from '@material-ui/icons/TableChartSharp';

import { 
	isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	isAdmMan, isAdmManFac, isFaculty,
	mergedName,
	vsDialog,
	showError, showSuccess, showInfo,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";

//const ALLROLES = ["Student", "Faculty", "Admin"];

const ALLSELECTIONS = ["All", "Enabled", "Disabled" ];
const BLANKCHAR = "-";

export default function Faculty() {
	//const classes = useStyles();
	const gClasses = globalStyles();

	const [errorMessage, setErrorMessage] = useState("");
	
	const [currentSelection, setCurrentSelection] = useState(ALLSELECTIONS[0]);
	
	const [facultyInfo, setFacultyInfo] = useState(null);
	const [showAll, setShowAll] = useState(false);
	
	const [facultyArray, setFacultyArray] = useState([]);
	const [masterFacultyArray, setMasterFacultyArray] = useState([]);
	
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	const [facultyRec, setFacultyRec] = useState(null);
	const [userRec, setUserRec] = useState(null);
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("Faculty");
	const [area1, setArea1] = useState("");
	const [area2, setArea2] = useState("");
	const [area3, setArea3] = useState("");
	const [area4, setArea4] = useState("");
	
	const [areaCode, setAreaCode] = useState("");
	const [areaDesc, setAreaDesc] = useState("");

	const [drawer, setDrawer] = useState("");
	const [drawerDetail, setDrawerDetail] = useState("");
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
		async function getAllFaculty() {
			try {
				if (isAdmMan()) {
					console.log("Admin or Main");
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/list/all`;				
					const response = await axios.get(myUrl);
					//console.log(response.data);
					setFacultyArray(response.data);
					setMasterFacultyArray(response.data);
				} 
				else if (isFaculty()) {
					console.log("Facultyn");
					// First get the Faculty id
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/enabledfacultybyuid/${sessionStorage.getItem("uid")}/`;				
					const response = await axios.get(myUrl);
					//console.log(response.data);
					setFacultyArray([response.data]);
					setMasterFacultyArray([response.data]);
				}
				else {
					console.log("None");
				}
			} catch (e) {
				console.log(e);
			}
		}
		
		handleResize();
		getAllFaculty();
		
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
					showError(myMsg);
				
        let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
				return null;
        return(
          <div>
            <Typography align="center" className={myClass}>{myMsg}</Typography>
          </div>
        );
      }

	async function handleFacultySchedule(rec) {
		/*
		var batchInfo = {inUse: true, from: process.env.REACT_APP_BATCH, status: STATUS_INFO.FACULTYSCHEDULE, msg: "", record:  rec };
		sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		setTab(process.env.REACT_APP_FACULTYSCHEDULE);
		*/
		setFacultyInfo({name: rec.name, fid: rec.fid});
		setShowAll(isAdmMan());
		setDrawerDetail("FACULTYSCHEDULE");
		
	}
  
	async function handleAddEditSubmit() {
		//console.log("Add / Edit User");
		var response;
		var a1 = (area1 !== "") ? area1 : BLANKCHAR;
		var a2 = (area2 !== "") ? area2 : BLANKCHAR;
		var a3 = (area3 !== "") ? area3 : BLANKCHAR;
		var a4 = (area4 !== "") ? area4 : BLANKCHAR;
		
		try {
			if (facultyRec == null) {
			// for add new user
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/add/${userName}/${encrypt(password)}/${encrypt(email)}/${mobile}/${a1}/${a2}/${a3}/${a4}`;
				//console.log(myUrl);
				var response = await axios.get(myUrl);
				//console.log("axios done", response.data);
				var tmp = masterFacultyArray.concat([response.data]);
				tmp = lodashSortBy(tmp, 'name');
				setMasterFacultyArray(tmp);
				filterFaculty(tmp, currentSelection);
				setDrawer("");
				showSuccess("Successfully added details of " + userName);
			}
			else {
				// for edit user
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/update/${facultyRec.fid}/${userName}/${encrypt(password)}/${encrypt(email)}/${mobile}/${a1}/${a2}/${a3}/${a4}`;	
				//console.log(myUrl);
				var response = await axios.get(myUrl);
				var tmp = masterFacultyArray.filter(x => x.uid !== facultyRec.uid);
				tmp = tmp.concat([response.data])
				tmp = lodashSortBy(tmp, 'name');
				setMasterFacultyArray(tmp);
				filterFaculty(tmp, currentSelection);
				setDrawer("");
				showSuccess("Successfully edit details of " + userName);
			}
		}
		catch (e) {
			showError("Error adding / updateing Area");
			console.log("Error");
			
		}
	}
	
	function handleAdd() {
    console.log("In add");
    setFacultyRec(null);
		setUserName("");
		setMobile("");
		setEmail("")
		//setRole(ALLROLES[0]);
		setPassword("");
		setArea1("");
		setArea2("");
		setArea3("");
		setArea4("");
		setDrawer("New");
	}
	
	async function handleEdit(r) {
		//console.log(r);
    setFacultyRec(r);
		// Now get the user record
		var myUser;
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/acagetbyid/${r.uid}`);
			myUser = resp.data;
			//console.log(myUser);
			setUserRec(myUser);
		}
		catch (e) {
			showError('Error while fetching user record');
			setFacultyRec(null);
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
		setDrawer("Edit");
	}
	
	
	async function handleInfo(rec) {
		setFacultyRec(rec);
		// Now fetch User details of the student
		// Now get the user record
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/acagetbyid/${rec.uid}`);
			setUserRec(resp.data);
			setDrawerInfo("detail");
		}
		catch (e) {
			showError('Error fetching user record');
			setFacultyRec(null);
		}
	}

	function DisplayFacultyInfo(props) {
	return(
		<div>
		<Grid key="FACULTYINFO" className={gClasses.noPadding} container >
			<Grid item xs={4} sm={4} md={3} lg={3} >
				<Typography align="left"  className={gClasses.info18Blue} >Name</Typography>
			</Grid>
			<Grid item xs={8} sm={8} md={9} lg={9} align="left" >
				<Typography align="left"  className={gClasses.info18} >{props.userRecord.displayName}</Typography>
			</Grid>
			<Grid item xs={4} sm={4} md={3} lg={3} >
				<Typography align="left"  className={gClasses.info18Blue} >Code</Typography>
			</Grid>
			<Grid item xs={8} sm={8} md={9} lg={9} align="left" >
				<Typography align="left"  className={gClasses.info18} >{props.facultyRecord.fid}</Typography>
			</Grid>
			<Grid item xs={4} sm={4} md={3} lg={3} >
				<Typography align="left"  className={gClasses.info18Blue} >Batches</Typography>
			</Grid>
			<Grid item xs={8} sm={8} md={9} lg={9} align="left" >
				<Typography align="left"  className={gClasses.info18} >{props.facultyRecord.batchCount}</Typography>
			</Grid>
			<Grid item xs={4} sm={4} md={3} lg={3} >
				<Typography align="left"  className={gClasses.info18Blue} >Mobile</Typography>
			</Grid>
			<Grid item xs={8} sm={8} md={9} lg={9} align="left" >
				<Typography align="left"  className={gClasses.info18} >{props.userRecord.mobile}</Typography>
			</Grid>
			<Grid item xs={4} sm={4} md={3} lg={3} >
				<Typography align="left"  className={gClasses.info18Blue} >Email</Typography>
			</Grid>
			<Grid item xs={8} sm={8} md={9} lg={9} align="left" >
				<Typography align="left"  className={gClasses.info18} >{decrypt(props.userRecord.email)}</Typography>
			</Grid>
			<Grid item xs={12} sm={12} md={12} lg={12} >
				<Typography align="left"  className={gClasses.info18Blue} >Address</Typography>
			</Grid>
			<Grid item xs={3} sm={3} md={2} lg={2} />
			<Grid item xs={9} sm={9} md={10} lg={10} align="left" >
				<Typography align="left"  className={gClasses.info18} >{props.userRecord.addr1}</Typography>
				{(props.userRecord.addr2 !== "-") &&
				<Typography align="left"  className={gClasses.info18} >{props.userRecord.addr2}</Typography>
				}
				{(props.userRecord.addr3 !== "-") &&
				<Typography align="left"  className={gClasses.info18} >{props.userRecord.addr3}</Typography>
				}
				{(props.userRecord.addr4 !== "-") &&
				<Typography align="left"  className={gClasses.info18} >{props.userRecord.addr4}</Typography>
				}
			</Grid>
			<Grid item xs={12} sm={12} md={12} lg={12} align="left" />
		</Grid>
		<br />
		<br />
		</div>
	)}


	function DisplayAllToolTips() {
	return(
		<div>
		{facultyArray.map( t =>
			<DisplaySingleTip id={"USER"+t.uid} />
		)}
		</div>
	)}

	function DisplaySingleTip(props) {
		return null; //<Tooltip className={gClasses.tooltip} backgroundColor='#42EEF9' borderColor='black' arrowColor='blue' textColor='black' key={props.id} type="info" effect="float" id={props.id} multiline={true}/>
	}
	
	
		
	function handleDisableFaculty(t) {
		vsDialog("Disable Faculty", `Are you sure you want disable faculty ${mergedName(t.name, t.fid)}?`,
			{label: "Yes", onClick: () => handleDisableFacultyConfirm(t) },
			{label: "No" }
		);
	}

	async function handleDisableFacultyConfirm(x) {
		let myRec = masterFacultyArray.find(rrr => rrr.fid === x.fid);
		if (myRec.batchCount > 0) {
			showError(`Faculty ${myRec.name} has ${myRec.batchCount} batches in progress.`);
			return;
		}
		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/disabled/${myRec.fid}`);
			myRec.enabled = false;
			var allRec  = [].concat(masterFacultyArray)
			setMasterFacultyArray(allRec);
			filterFaculty(allRec, currentSelection);
			showSuccess(`Disabled Faculty ${mergedName( myRec.name, myRec.fid)}`);
		}
		catch (e) {
			// error 
			console.log(e);
			showError("Error disabling faculty "+x.name);
		}
	}
	
	function handleEnableFaculty(t) {
		vsDialog("Enable Faculty", `Are you sure you want enable faculty ${mergedName(t.name, t.fid)}?`,
			{label: "Yes", onClick: () => handleEnableFacultyConfirm(t) },
			{label: "No" }
		);
	}

	async function handleEnableFacultyConfirm(x) {
		let myRec = masterFacultyArray.find(rrr => rrr.fid === x.fid);
		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/faculty/enabled/${myRec.fid}`);
			myRec.enabled = true;
			var allRec  = [].concat(masterFacultyArray);
			setMasterFacultyArray(allRec);
			filterFaculty(allRec, currentSelection);
			showSuccess(`Enabled Faculty ${mergedName( myRec.name, myRec.fid)}`);
		}
		catch (e) {
			// error 
			console.log(e);
			showError("Error disabling faculty "+x.name);
		}
	}

	function DisplayAllFaculty() {
		//console.log(dispType);
		return (
			<div>
			<Table  align="center">
			<TableHead p={0}>
			<TableRow key="header" align="center">
				<TableCell className={gClasses.th} p={0} align="center">Faculty</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Batch</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Hours</TableCell>
				<TableCell className={gClasses.th} p={0} align="center"></TableCell>
			</TableRow>
			</TableHead>
			<TableBody p={0}>
				{facultyArray.map(x => {
					let myInfo = "Address" + "<br />";
						myInfo +=  x.addr1 + "<br />";
						myInfo +=  x.addr2 + "<br />";
						myInfo +=  x.addr3 + "<br />";
						myInfo +=  x.addr4 + "<br />";
						//console.log(x);
						var myClasses = (x.enabled) ? gClasses.td : gClasses.disabledtd;
					return (
					<TableRow key={x.fid}>
						<TableCell align="center" className={myClasses} p={0} >{mergedName(x.name, x.fid)}</TableCell>
						<TableCell align="center" className={myClasses} p={0} >{x.batchCount}</TableCell>
						<TableCell align="center" className={myClasses} p={0} >{x.hours}</TableCell>
						<TableCell className={myClasses} p={0} >
							<IconButton disabled={!x.enabled} color="primary" size="small" onClick={() => {handleEdit(x)}}  ><EditIcon /></IconButton>
							<IconButton disabled={!x.enabled} color="primary" size="small" onClick={() => {handleInfo(x)}} ><InfoIcon /></IconButton>
							{(x.enabled) &&
								<IconButton  disabled={x.batchCount > 0} color="primary" size="small" onClick={() => {handleDisableFaculty(x)}} ><IndeterminateCheckBoxIcon  /></IconButton>
							}
							{(!x.enabled) &&
								<IconButton color="primary" size="small" onClick={() => {handleEnableFaculty(x)}} ><CheckBoxIcon /></IconButton>
							}
							<IconButton color="primary" disabled={!x.enabled} size="small" onClick={() => {handleFacultySchedule(x)}} ><TableChartSharpIcon /></IconButton>							
						</TableCell>
					</TableRow>
				)})}
			</TableBody>
			</Table>
		</div>
		);

	}
	
	function filterFaculty(masterArray, x) {
		switch (x) {
			case "Disabled":  setFacultyArray(masterArray.filter(x => !x.enabled ));  break;
			case "Enabled":   setFacultyArray(masterArray.filter(x => x.enabled ));  break;
			default:          setFacultyArray(masterArray);  break;
		}
	}
	
	function selectAll(x) {
		setCurrentSelection(x);
		filterFaculty(masterFacultyArray, x);
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
			<VsButton disabled={!isAdmMan()} name="New Faculty" align="right" onClick={handleAdd} />
		</Grid>
	</Grid>
	)}
		
		return (
		<div>
			<DisplayPageHeader headerName="Faculty" groupName="" tournament="" />
			<DisplayOptions />
			<DisplayAllFaculty/>
			{/*<DisplayAllToolTips />*/}
			<Drawer anchor="right" variant="temporary" open={drawer !== ""}>
			<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				<VsCancel align="right" onClick={() => { setDrawer("")}} />
				<ValidatorForm margin={2} align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}>
					<Typography className={gClasses.title}>{drawer+" Faculty "}</Typography>	
					<br />
					<TextValidator enable={(drawer == "New") ? "true" : "false"}  variant="outlined" required fullWidth id="userName" label="User Name" name="username"
						validators={['required', 'minLength', 'noSpecialCharacters']}
						errorMessages={['User Name to be provided', 'Mimumum 6 characters required', ]}
						value={userName} onChange={() => { setUserName(event.target.value) }}
					/>
					<BlankArea/>
					{/*<VsSelect fullWidth align="center" label="Role" options={ALLROLES} value={role} onChange={(event) => { setRole(event.target.value)}} />*/}
					<BlankArea/>
					<TextValidator variant="outlined" required fullWidth id="emaild" label="Email" name="Email"
						validators={['isEmailOK', 'required']}
						errorMessages={['Invalid Email', 'Email to be provided']}
						value={email} onChange={(event) => setEmail(event.target.value)}
					/>
					<BlankArea/>
					<TextValidator variant="outlined" required fullWidth label="Mobile" name="mobile"
						validators={['required', 'mobile']}
						errorMessages={[, 'Mobile to be provided', '10 digit mobile number required']}
						value={mobile} onChange={(event) => setMobile(event.target.value)}
					/>
					<br />
					<TextValidator variant="outlined" required fullWidth label="Password" name="password"
						validators={['required', 'minLength', 'noSpecialCharacters']}
						errorMessages={['Password to be provided', 'Mimumum 6 characters required', ]}
						value={password} onChange={(event) => setPassword(event.target.value)}
					/>
					<br />
					<TextValidator variant="outlined" required fullWidth label="Address 1" name="Addr1"
						validators={['required']}
						errorMessages={['Addres line 1 to be provided']}
						value={area1} onChange={(event) => setArea1(event.target.value)}
					/>
					<br />
					<TextValidator variant="outlined"  fullWidth label="Address 2" name="Addr2"
						value={area2} onChange={(event) => setArea2(event.target.value)}
					/>
					<br />
					<TextValidator variant="outlined"  fullWidth label="Address 3" name="Addr3"
						value={area3} onChange={(event) => setArea3(event.target.value)}
					/>
					<br />
					<TextValidator variant="outlined"  fullWidth label="Address 4" name="Addr4"
						value={area4} onChange={(event) => setArea4(event.target.value)}
					/>
					<br />
					<ShowResisterStatus />
					<br />
					<VsButton name={(drawer == "New") ? "Add Faculty" : "Update Faculty"} />
				</ValidatorForm>
				<ValidComp p1={password}/>   
			</Box>
			</Drawer>
			<Drawer anchor="top" variant="temporary" open={drawerDetail !== ""}>
				<VsCancel align="right" onClick={() => { setDrawerDetail("")}} />
				{(drawerDetail === "FACULTYSCHEDULE") &&
					<FacultySchedule faculty={facultyInfo} all={showAll} />
				}
			</Drawer>
			<Drawer anchor="bottom" variant="temporary" open={drawerInfo !== ""}>
			<Container component="main" maxWidth="xs">
			<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} paddingLeft={2} >
				<DisplayPageHeader headerName="Faculty Details" groupName="" tournament="" />
				<VsCancel align="right" onClick={() => { setDrawerInfo("")}} />
				<br />
				<DisplayFacultyInfo facultyRecord={facultyRec} userRecord={userRec} />
			</Box>
			</Container>
			</Drawer>			
			<ToastContainer />
		</div>
		)
}
