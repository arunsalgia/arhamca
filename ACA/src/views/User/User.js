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


import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import FilterSharpIcon from '@material-ui/icons/FilterSharp';

//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { 
	isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	isAdmin, isAdmMan,
} from 'views/functions';

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";
import VsSelect from "CustomComponents/VsSelect";


const MAXAREACODELENGTH = 4;
const ALLROLES = ["Manager", "Student", "Faculty", "Admin"];

//var props.mode = "ADD";
const spacing = "5px"

export default function User() {
	//const classes = useStyles();
	const gClasses = globalStyles();

	const [userArray, setUserArray] = useState([]);
	const [userMasterArray, setUserMasterArray] = useState([]);
	const [custFilter, setCustFilter] = useState({role: "Faculty"})
	const [filterDisplayData, setFilterDisplayData] = useState([])
	
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	const [userRec, setUserRec] = useState(null);
	const [password, setPassword] = useState("");
	const [role, setRole] = useState(ALLROLES[0]);
	const [area1, setArea1] = useState("");
	const [area2, setArea2] = useState("");
	const [area3, setArea3] = useState("");
	const [area4, setArea4] = useState("");
	
	const [areaCode, setAreaCode] = useState("");
	const [areaDesc, setAreaDesc] = useState("");
	
	const [registerStatus, setRegisterStatus] = useState(0);
	
	const [drawer, setDrawer] = useState("");
	const [drawerDetail, setDrawerDetail] = useState("");
	const [drawerFilter, setDrawerFilter] = useState("");
	
	const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
	const [dispType, setDispType] = useState("lg");

	const [filterName,   setFilterName] = useState("");
	const [filterMobile, setFilterMobile] = useState("");
	const [filterRole, setFilterRole] = useState("Faculty");
	
	var myStyle = {margin: "3px",  border: 'solid', borderColor: 'blue'};

	
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
		async function getAllUsers() {
			try {
				if (isAdmin()) {
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/acalist`;
					const response = await axios.get(myUrl);
					//console.log(response.data);
					setUserMasterArray(response.data);
					setFilter(response.data, custFilter);
				}
			} catch (e) {
				console.log(e);
			}
		}
		getAllUsers();
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
        let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
        return(
          <div>
            <Typography align="center" className={myClass}>{myMsg}</Typography>
          </div>
        );
      }

  async function handleAddEditSubmit() {
		console.log("Add / Edit User");
		var response;
		
		try {
			if (userRec == null) {
			// for add new user
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/acaadd/${userName}/${encrypt(password)}/${role}/${encrypt(email)}/${mobile}/${area1}/${area2}/${area3}/${area4}`;
				//console.log(myUrl);
				var response = await axios.get(myUrl);
				//console.log("axios done", response.data);
				var tmp = userArray.concat([response.data]);
				setUserArray(tmp);
				//console.log("All done");
				// close drawer
				setDrawer("");
				toast.success("Successfully added details of " + userName);
			}
			else {
				// for edit user
				var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/acaupdate/${userRec.uid}/${userName}/${encrypt(password)}/${role}/${encrypt(email)}/${mobile}/${area1}/${area2}/${area3}/${area4}`;	
				//console.log(myUrl);
				var response = await axios.get(myUrl);
				var tmp = userArray.filter(x => x.uid !== userRec.uid);
				tmp = tmp.concat([response.data])
				setUserArray(tmp);
				//console.log("All done");
				// close drawer
				setDrawer("");
				toast.success("Successfully updated details of " + userName);
			}
		}
		catch (e) {
			toast.error("Error adding / updating User record");
			console.log("Error");
			
		}
	}
	
	function handleAdd() {
    console.log("In add");
    setUserRec(null);
		setUserName("");
		setMobile("");
		setEmail("")
		setRole(ALLROLES[0]);
		setPassword("");
		setArea1("");
		setArea2("");
		setArea3("");
		setArea4("");
		setDrawer("New");
	}
	
	function handleEdit(r) {
		//console.log(r);
    setUserRec(r);
		setUserName(r.displayName);
		setMobile(r.mobile);
		setEmail(decrypt(r.email))
		setRole(r.role);
		setPassword(decrypt(r.password));
		setArea1(r.addr1);
		setArea2(r.addr2);
		setArea3(r.addr3);
		setArea4(r.addr4);
		setDrawer("Edit");
	}
	
	function handleInfo(r) {
		setUserRec(r);
		setDrawerDetail("detail");
	}

	function handleFilter() {
		setFilterName( (custFilter["name"]) ? custFilter["name"] : "");
		setFilterMobile((custFilter["mobile"]) ? custFilter["mobile"] : "");
		setFilterRole((custFilter["role"]) ? custFilter["role"] : "All");
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
		if (filterObject.name) {
			myArray = myArray.filter(x => x.displayName.toLowerCase().includes(filterName.toLowerCase()) );
		}
		
		if (filterObject.mobile) {
			myArray = myArray.filter(x => x.mobile.includes(filterMobile));
		}
		
		if (filterObject.role)  {
			myArray = myArray.filter(x => x.role === filterRole);
		}
		setCustFilter(filterObject);
		setUserArray(myArray);	
	}

	function handleSubmitFilter() {
		var myFilter = {};
		if (filterName != "") {
			myFilter["name"] = filterName;
		}
		if (filterMobile != "") {
			myFilter["mobile"] = filterMobile;
		}
		//console.log(filterRole);
		if (filterRole != "All") {
			myFilter["role"] = filterRole;
		}
		setFilter(userMasterArray, myFilter);
		setCustFilter(myFilter);
		setDrawerFilter("")
	}
	
	
	function DisplayUsers() {
		//console.log(dispType);
		return (
			<div>
			<Table  align="center">
			<TableHead p={0}>
			<TableRow key="header" align="center">
				<TableCell className={gClasses.th} p={0} align="center">Code</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Role</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Name</TableCell>
				{(dispType !== "xs") &&
				<TableCell className={gClasses.th} p={0} align="center">Email</TableCell>
				}
				{(dispType !== "xs") &&
				<TableCell className={gClasses.th} p={0} align="center">Mobile</TableCell>
				}
				<TableCell className={gClasses.th} p={0} align="center"></TableCell>
			</TableRow>
			</TableHead>
			<TableBody p={0}>
				{userArray.map(x => {
					let myInfo = "Address" + "<br />";
						myInfo +=  x.addr1 + "<br />";
						myInfo +=  x.addr2 + "<br />";
						myInfo +=  x.addr3 + "<br />";
						myInfo +=  x.addr4 + "<br />";
					return (
					<TableRow key={x.uid}>
						<TableCell align="center" className={gClasses.td} p={0} >
							<span>{x.uid}</span>
								{/*<span align="left" data-for={"USER"+x.uid} data-tip={myInfo} data-iscapture="true" >
								<InfoIcon color="primary" size="small"/>
							</span>*/}
						</TableCell>
						<TableCell align="center" className={gClasses.td} p={0} >{x.role}</TableCell>
						<TableCell className={gClasses.td} p={0} >{x.displayName}</TableCell>
						{(dispType !== "xs") &&
						<TableCell className={gClasses.td} p={0} >{decrypt(x.email)}</TableCell>
						}
						{(dispType !== "xs") &&
						<TableCell align="center" className={gClasses.td} p={0} >{x.mobile}</TableCell>
						}
						<TableCell className={gClasses.td} p={0} >
							<IconButton color="primary" size="small" onClick={() => {handleEdit(x)}} ><EditIcon /></IconButton>
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
		<div>
		<VsButton align="right" disabled={!isAdmin()} name="New User" align="right" onClick={handleAdd} />
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
			<DisplayPageHeader headerName="Users" groupName="" tournament="" />
			<DisplayOptions />
			<DisplayUsers/>
			<Drawer anchor="right" variant="temporary" open={drawer !== ""}>
			<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				<VsCancel align="right" onClick={() => { setDrawer("")}} />
				<ValidatorForm margin={2} align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}>
					<Typography className={gClasses.title}>{drawer+" User "}</Typography>	
					<br />
					<TextValidator enable={(drawer == "New") ? "true" : "false"}  variant="outlined" required fullWidth id="userName" label="User Name" name="username"
						validators={['required', 'minLength', 'noSpecialCharacters']}
						errorMessages={['User Name to be provided', 'Mimumum 6 characters required', ]}
						value={userName} onChange={() => { setUserName(event.target.value) }}
					/>
					<BlankArea/>
					<VsSelect fullWidth align="center" label="Role" options={ALLROLES} value={role} onChange={(event) => { setRole(event.target.value)}} />
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
					<VsButton name={(drawer == "New") ? "Add" : "Update"} />
				</ValidatorForm>
				<ValidComp p1={password}/>   
			</Box>
			</Drawer>
			<Drawer anchor="left" variant="temporary" open={drawerFilter !== ""}>
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
						<Typography align="left"  className={gClasses.info18Blue} >Mobile</Typography>
					</Grid>
					<Grid item xs={7} sm={7} md={3} lg={3} >
						<TextField fullWidth value={filterMobile} onChange={(event) => { setFilterMobile(event.target.value)}} />	
					</Grid>
					<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />	
					
					{((dispType !== "xs") && (dispType !== "sm")) &&			
						<Grid item xs={1} sm={1} md={2} lg={4} />
					}
					<Grid item xs={5} sm={5} md={3} lg={2} >
						<Typography align="left"  className={gClasses.info18Blue} >Role</Typography>
					</Grid>
					<Grid item xs={7} sm={7} md={3} lg={1} >
						<VsSelect size="small" align="left" options={["All"].concat(ALLROLES)} value={filterRole} onChange={(event) => { setFilterRole(event.target.value)}} />
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
