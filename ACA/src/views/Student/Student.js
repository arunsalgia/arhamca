import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { TextareaAutosize, TextField } from '@material-ui/core';
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

import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import FilterSharpIcon from '@material-ui/icons/FilterSharp';

//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { 
	isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	isAdmin, isAdmMan, isAdmManFac, isStudent,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsSelect from "CustomComponents/VsSelect";
import VsRadio from "CustomComponents/VsRadio";

//const ALLROLES = ["Student", "Faculty", "Admin"];

const ALLSELCTIONS = ["Enabled", "Disabled", "All"];

const BLANKCHAR = "-";

//var props.mode = "ADD";
const spacing = "5px"


export default function Student() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	
	const [currentSelection, setCurrentSelection] = useState(ALLSELCTIONS[0]);
	
	const [studentArray, setStudentArray] = useState([]);
	const [masterStudentArray, setMasterStudentArray] = useState([]);
	const [custFilter, setCustFilter] = useState({status: "Enabled"});
	const [filterDisplayData, setFilterDisplayData] = useState([]);
	
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	const [studentRec, setStudentRec] = useState(null);
	const [userRec, setUserRec] = useState(null);
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
	const [drawerFilter, setDrawerFilter] = useState("");
	
	const [filterName,   setFilterName] = useState("");
	const [filterBatch, setFilterBatch] = useState("");
	const [filterStatus, setFilterStatus] = useState("Enabled");
	
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
		async function getAllStudent() {
			try {
				if (isAdmMan() || isStudent()) { 
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/student/list/all`;
					const response = await axios.get(myUrl);
					//console.log(response.data);
					setStudentArray(response.data);
					setFilter(response.data, custFilter);	
					setMasterStudentArray(response.data);
				}
			} catch (e) {
				console.log(e);
			}
		}
		getAllStudent();
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

  async function handleAddEditSubmit() {
		//console.log("Add / Edit User");
		var response;
		var a1 = (area1 !== "") ? area1 : BLANKCHAR;
		var a2 = (area2 !== "") ? area2 : BLANKCHAR;
		var a3 = (area3 !== "") ? area3 : BLANKCHAR;
		var a4 = (area4 !== "") ? area4 : BLANKCHAR;
		var pName = (parentName !== "") ? parentName : BLANKCHAR;
		var pMob = (parentMobile !== "") ? parentMobile : BLANKCHAR;
		
		try {
			if (studentRec == null) {
			// for add new user
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/student/add/${userName}/${encrypt(password)}/${encrypt(email)}/${mobile}/${a1}/${a2}/${a3}/${a4}/${pName}/${pMob}`;
				//console.log(myUrl);
				var response = await axios.get(myUrl);
				//console.log("axios done", response.data);
				var tmp = masterStudentArray.concat([response.data]);
				tmp = lodashSortBy(tmp, 'name');
				setMasterStudentArray(tmp);
				//filterStudent(tmp, currentSelection);
				setDrawer("");
				setFilter(tmp, custFilter);
				toast.success("Successfully added details of " + userName);
			}
			else {
				// for edit user
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/student/update/${studentRec.sid}/${userName}/${encrypt(password)}/${encrypt(email)}/${mobile}/${a1}/${a2}/${a3}/${a4}/${pName}/${pMob}`;	
				//console.log(myUrl);
				var response = await axios.get(myUrl);
				var tmp = masterStudentArray.filter(x => x.uid !== studentRec.uid);
				tmp = tmp.concat([response.data])
				tmp = lodashSortBy(tmp, 'name');
				setMasterStudentArray(tmp);
				//filterStudent(tmp, currentSelection);
				setDrawer("");
				setFilter(tmp, custFilter);
				toast.success("Successfully updated details of " + userName);
			}
		}
		catch (e) {
			toast.error("Error adding / updateing Area");
			console.log("Error");
			
		}
	}
	
	function handleAdd() {
    console.log("In add");
    setStudentRec(null);
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
    setStudentRec(r);
		// Now get the user record
		var myUser;
		try {
			var resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/acagetbyid/${r.uid}`);
			myUser = resp.data;
			//console.log(myUser);
			setUserRec(myUser);
		}
		catch (e) {
			toast.error('Error while fetching user record');
			setStudentRec(null);
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
		setStudentRec(r);
		setDrawerDetail("detail");
	}

	function DisplayAllToolTips() {
	return(
		<div>
		{studentArray.map( t =>
			<DisplaySingleTip id={"USER"+t.uid} />
		)}
		</div>
	)}

	function DisplaySingleTip(props) {
		return null; //<Tooltip className={gClasses.tooltip} backgroundColor='#42EEF9' borderColor='black' arrowColor='blue' textColor='black' key={props.id} type="info" effect="float" id={props.id} multiline={true}/>
	}
	
	async function handleDisableStudent(x) {
		let myRec = masterStudentArray.find(rrr => rrr.sid === x.sid);
		if (myRec.bid != "") {
			toast.error(`Student ${myRec.name} has batch ${myRec.bid} in progress.`);
			return;
		}
		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/student/disabled/${myRec.sid}`);
			myRec.enabled = false;
			var allRec  = [].concat(masterStudentArray)
			setMasterStudentArray(allRec);
			setFilter(allRec, custFilter);

			//filterStudent(allRec, currentSelection);
		}
		catch (e) {
			// error 
			console.log(e);
			toast.error("Error disabling student "+x.name);
		}
	}

	async function handleEnableStudent(x) {
		let myRec = masterStudentArray.find(rrr => rrr.sid === x.sid);
		try {
			await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/student/enabled/${myRec.sid}`);
			myRec.enabled = true;
			var allRec  = [].concat(masterStudentArray)
			setMasterStudentArray(allRec);
			setFilter(allRec, custFilter);
			//filterStudent(allRec, currentSelection);
		}
		catch (e) {
			// error 
			console.log(e);
			toast.error("Error disabling student "+x.name);
		}
	}

	function DisplayAllStudent() {
		//console.log(dispType);
		return (
			<div>
			<Table  align="center">
			<TableHead p={0}>
			<TableRow key="header" align="center">
				<TableCell className={gClasses.th} p={0} align="center">Code</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Student Name</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Batch</TableCell>
				<TableCell className={gClasses.th} p={0} align="center"></TableCell>
			</TableRow>
			</TableHead>
			<TableBody p={0}>
				{studentArray.map(x => {
					let myInfo = "Address" + "<br />";
						myInfo +=  x.addr1 + "<br />";
						myInfo +=  x.addr2 + "<br />";
						myInfo +=  x.addr3 + "<br />";
						myInfo +=  x.addr4 + "<br />";
						//console.log(x);
						var myClasses = (x.enabled) ? gClasses.td : gClasses.disabledtd;
						//console.log(x.bid);
					return (
					<TableRow key={x.sid}>
						<TableCell className={myClasses} p={0} >{x.sid}</TableCell>
						<TableCell className={myClasses} p={0} >{x.name}</TableCell>
						<TableCell className={myClasses} p={0} >{x.bid}</TableCell>
						<TableCell className={myClasses} p={0} >
							<IconButton disabled={!isAdmMan()} color="primary" size="small" onClick={() => {handleEdit(x)}} ><EditIcon /></IconButton>
							<IconButton color="primary" size="small" onClick={() => {handleInfo(x)}} ><InfoIcon /></IconButton>
							{(x.enabled) &&
								<IconButton disabled={(x.bid != "") || !isAdmMan() } color="primary" size="small" onClick={() => {handleDisableStudent(x)}} ><IndeterminateCheckBoxIcon /></IconButton>							
							}
							{(!x.enabled) &&
								<IconButton disabled={ !isAdmMan() } color="primary" size="small" onClick={() => {handleEnableStudent(x)}} ><CheckBoxIcon /></IconButton>						
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
			case "Disabled":  setStudentArray(masterArray.filter(x => !x.enabled ));  break;
			case "Enabled":   setStudentArray(masterArray.filter(x => x.enabled ));  break;
			default:          setStudentArray(masterArray);  break;
		}
	}
	
	function selectAll(x) {
		setCurrentSelection(x);
		filterStudent(masterStudentArray, x);
	}
	
	// style={{marginTop: "5px" }}  
	function DisplayOptionsOrg() {
	return (
	<Grid key="Options" className={gClasses.noPadding} container alignItems="center" >
		<Grid  item xs={3} sm={2} md={2} lg={1} >
			<VsSelect size="small" align="center" label="Selection" options={ALLSELCTIONS} value={currentSelection} onChange={(event) => { selectAll(event.target.value)}} />
		</Grid>
		<Grid align="left"  item xs={6} sm={7} md={8} lg={10} >
			<span></span>
		</Grid>
		<Grid  item xs={3} sm={3} md={2} lg={1} >
			<VsButton disabled={!isAdmMan()} name="New Student" align="right" onClick={handleAdd} />
		</Grid>
	</Grid>
	)}
	
	
	function handleFilter() {
		setFilterName( (custFilter["name"]) ? custFilter["name"] : "");
		setFilterBatch((custFilter["batch"]) ? custFilter["batch"] : "");
		setFilterStatus((custFilter["status"]) ? custFilter["status"] : "All");
		setDrawerFilter("filter");
	}
	
	function setFilter(masterData, filterObject) {
		//console.log(filterObject);
		var keyNames = Object.keys(filterObject);
		//console.log(keyNames);
		var myData = [];
		for(var i=0; i<keyNames.length; ++i) {
			myData.push({key: keyNames[i], value: filterObject[keyNames[i]] });
		}
		setFilterDisplayData(myData);
		
		var myArray = [].concat(masterData);
		//console.log(myArray);
		if (filterObject.name) {
			myArray = myArray.filter(x => x.name.toLowerCase().includes(filterName.toLowerCase()) );
		}
		
		if (filterObject.batch) {
			myArray = myArray.filter(x => x.bid.includes(filterBatch.toUpperCase()));
		}
		
		if (filterObject.status)  {
			if (filterObject.status === "Enabled")
				myArray = myArray.filter(x => x.enabled);
			else if (filterObject.status === "Disabled")
				myArray = myArray.filter(x => !x.enabled);
		}
		setCustFilter(filterObject);
		setStudentArray(myArray);	
	}

	function handleSubmitFilter() {
		var myFilter = {};
		if (filterName != "") {
			myFilter["name"] = filterName;
		}
		if (filterBatch != "") {
			myFilter["batch"] = filterBatch;
		}
		//console.log(filterRole);
		if (filterStatus != "All") {
			myFilter["status"] = filterStatus;
		}
		//console.log(myFilter);
		setFilter(masterStudentArray, myFilter);
		setCustFilter(myFilter);
		setDrawerFilter("")
	}
		
	function DisplayOptions() {
	return (	
		<div>
		<VsButton align="right" disabled={!isAdmin()} name="New Student" align="right" onClick={handleAdd} />
		<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} paddingTop={1} >
		<Grid key="Filter" className={gClasses.noPadding} container  >
			<Grid  align="left" item xs={11} sm={11} md={11} lg={11} >
				<Typography>
				{ filterDisplayData.map(x => {
					return (
					<span key={x.key} className={gClasses.filter}  >{x.key + ": " + x.value}</span>
				)})}
				</Typography>
			</Grid>
			<Grid align="right"  item xs={1} sm={1} md={1} lg={1} >
				<IconButton color="primary" size="small" onClick={handleFilter}  ><FilterSharpIcon /></IconButton>
			</Grid>
		</Grid>
		</Box>
		</div>
	)}
	

	
	return (
		<div>
			<DisplayPageHeader headerName="Student" groupName="" tournament="" />
			<DisplayOptions />
			<DisplayAllStudent/>
			{/*<DisplayAllToolTips />*/}
			<Drawer anchor="right" variant="temporary" open={drawer !== ""}>
			<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				<VsCancel align="right" onClick={() => { setDrawer("")}} />
				<ValidatorForm margin={2} align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}>
					<Typography className={gClasses.title}>{drawer+" Student "}</Typography>	
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
					<TextValidator variant="outlined"  fullWidth label="Parent Name" name="pName"
						value={parentName} onChange={(event) => setParentName(event.target.value)}
					/>
					<br />
					<TextValidator variant="outlined" required fullWidth label="Parent Mobile" name="mobile"
						validators={['required', 'mobile']}
						errorMessages={[, 'Mobile to be provided', '10 digit mobile number required']}
						value={parentMobile} onChange={(event) => setParentMobile(event.target.value)}
					/>
					<ShowResisterStatus />
					<br />
					<VsButton name={(drawer == "New") ? "Add" : "Update"} />
				</ValidatorForm>
				<ValidComp p1={password}/>   
			</Box>
			</Drawer>
			<Drawer anchor="left" variant="temporary" open={drawerFilter !== ""} >
			<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				<DisplayPageHeader headerName="Filter Options" groupName="" tournament="" />
				<VsCancel align="right" onClick={() => { setDrawerFilter("")}} />
				<br />
				<ValidatorForm margin={2} align="center" className={gClasses.form} onSubmit={handleSubmitFilter}  >
				<Grid key="Filter" className={gClasses.noPadding} container >
					{((dispType !== "xs") && (dispType !== "sm")) &&			
						<Grid item xs={1} sm={1} md={2} lg={4} />
					}
					<Grid item xs={5} sm={5} md={3} lg={2} >
						<Typography align="left"  className={gClasses.info18Blue} >Name</Typography>
					</Grid>
					<Grid item xs={7} sm={7} md={3} lg={3} >
						<TextField fullWidth  value={filterName} onChange={(event) => { setFilterName(event.target.value)}} />	
					</Grid>
					<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />	
					
					{((dispType !== "xs") && (dispType !== "sm")) &&			
						<Grid item xs={1} sm={1} md={2} lg={4} />
					}
					<Grid item xs={5} sm={5} md={3} lg={2} >
						<Typography align="left"  className={gClasses.info18Blue} >Batch</Typography>
					</Grid>
					<Grid item xs={7} sm={7} md={3} lg={3} >
						<TextField fullWidth value={filterBatch} onChange={(event) => { setFilterBatch(event.target.value)}} />	
					</Grid>
					<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />	
					
					{((dispType !== "xs") && (dispType !== "sm")) &&			
						<Grid item xs={1} sm={1} md={2} lg={4} />
					}
					<Grid item xs={5} sm={5} md={3} lg={2} >
						<Typography align="left"  className={gClasses.info18Blue} >Status</Typography>
					</Grid>
					<Grid item xs={7} sm={7} md={3} lg={1} >
						<VsSelect size="small" align="left" options={ALLSELCTIONS} value={filterStatus} onChange={(event) => { setFilterStatus(event.target.value)}} />
					</Grid>
					<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />	
					
					<Grid item xs={12} sm={12} md={12} lg={12} >
						<VsButton type="submit" name="Apply Filter" />
					</Grid>					
					</Grid>
					</ValidatorForm>
			</Box>
			</Drawer>
			<ToastContainer />
		</div>
		)
}
