import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { TextareaAutosize } from '@material-ui/core';
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

import InquiryAddEdit from "views/Inquiry/InquiryAddEdit";

import {
	ROLE_FACULTY, ROLE_STUDENT,
	ALLSELECTIONS, BLANKCHAR, STATUS_INFO,
	INQUIRYSTATUS, MAXDISPLAYTEXTROWS, MAXSTRINGLEN,
} from 'views/globals';


import {
	mergedName, getCodeFromMergedName, getNameFromMergedName,
	isAdmin, isAdmMan, isAdmManFac, isFaculty,
	dateString,
} from 'views/functions';


//const useMemo = React.useMemo;
//const useState = React.useState;
//const useCallback = React.useCallback;

const spacing = "5px";


export default function Inquiry() {
	//const classes = useStyles();
	const gClasses = globalStyles();
	
	const [currentSelection, setCurrentSelection] = useState(ALLSELECTIONS[0]);
	const [mode, setMode] = useState("");
	const [inquiryArray, setInquiryArray] = useState([]);
	//const [masterBatchArray, setMasterBatchArray] = useState([]);


	const [infoRec, setInfoRec] = useState([]);

	// for faculty schule call
	const [inquiryRec, setInquiryRec] = useState({});
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
		async function getAllInquiry() {
			try {
				if (isAdmin()) {
					console.log("Admin or Main");
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inquiry/list/all`;
					const response = await axios.get(myUrl);
					//console.log(response.data);
					setInquiryArray(response.data);
				}
				else {
					console.log("Not correctr role");
				}
			} catch (e) {
				console.log(e);
			}
		}
		

		getAllInquiry();
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

	function handleAddInquiry() {
		setInquiryRec(null);
		setDrawer("ADDINQUIRY");
	}
	
	function handleEditBatch(rec) {
		//var batchInfo = {inUse: true, status: STATUS_INFO.EDIT_BATCH, msg: "", record:  rec };
		//sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		//setTab(process.env.REACT_APP_BATCH_ADDEDITBATCH);
		setInquiryRec(rec);
		setDrawer("EDITINQUIRY");
	}
	
	function handleAddSession(rec) {
		//var batchInfo = {inUse: true, from: process.env.REACT_APP_BATCH, status: STATUS_INFO.ADD_SESSION, msg: "", record:  rec, record2: null };
		//sessionStorage.setItem("batchInfo", JSON.stringify(batchInfo));
		//setTab(process.env.REACT_APP_BATCH_ADDEDITSESSION);
		setInquiryRec(rec);
		setDrawer("ADDSESSION");
	}
	
	function handleBackInquiry(sts)
	{
		if ((sts.msg !== "") && (sts.status === STATUS_INFO.ERROR)) toast.error(sts.msg); 
		else if ((sts.msg !== "") && (sts.status === STATUS_INFO.SUCCESS)) toast.success(sts.msg);
		
		if (sts.status !== STATUS_INFO.ERROR) {
			if (drawer === "ADDINQUIRY") {
				var clonedInquiryArray = inquiryArray.concat([sts.inquiryRec]);
				setInquiryArray(clonedInquiryArray);
			}	
			else {
				var clonedInquiryArray = inquiryArray.filter(x => x._id !== sts.inquiryRec._id);
				setInquiryArray(clonedInquiryArray.concat([sts.inquiryRec]));
			}
		}
		setDrawer("");
	}
	
	function handleInfo(rec) {
		setInfoRec(rec);
		setDrawerInfo("detail");
	}

	async function handleDeleteInquiry(rec) {
		try {
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/inquiry/delete/${rec._id}`;
			const response = await axios.get(myUrl);
			var allRec  = inquiryArray.filter(x => x._id !== rec._id);
			setInquiryArray(allRec);
			toast.success(`Successfull deleted inquiry`);
		} catch (e) {
			console.log(e);
			toast.error("Error deleting inquiry");
		}
	}

	
	function DisplayAllInquiry() {
		//console.log(dispType);
		return (
			<div>
			<Table  align="center">
			<TableHead p={0}>
			<TableRow key="header" align="center">
				<TableCell className={gClasses.th} p={0} align="center">Date</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Area</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Name</TableCell>
					<TableCell className={gClasses.th} p={0} align="center">Contact</TableCell>
				{((dispType === "md") || (dispType === "lg")) &&
				<TableCell className={gClasses.th} p={0} align="center">Reference</TableCell>
				}
				{((dispType === "md") || (dispType === "lg")) &&
				<TableCell className={gClasses.th} p={0} align="center">Remarks</TableCell>
				}
				<TableCell className={gClasses.th} p={0} align="center">Status</TableCell>
				<TableCell className={gClasses.th} p={0} align="center"></TableCell>
			</TableRow>
			</TableHead>
			<TableBody p={0}>
				{inquiryArray.map(x => {
					let myInfo = "Inquiry dated: " + dateString(x.date) + "<br />";
					myInfo += "Reference:  " + x.reference + "<br />";
					myInfo += "Remarks : " + x.remarks;
					return (
					<TableRow key={x._id}>
						<TableCell className={gClasses.td} p={0} >{dateString(x.date)}</TableCell>
						<TableCell align="center" className={gClasses.td} p={0} >{x.area}</TableCell>
						<TableCell align="center" className={gClasses.td} p={0} >{x.contactName}</TableCell>
						<TableCell align="center" className={gClasses.td} p={0} >{x.contactNumber}</TableCell>
						{((dispType === "md") || (dispType === "lg")) &&
							<TableCell align="center" className={gClasses.td} p={0} >{x.reference}</TableCell>
						}
						{((dispType === "md") || (dispType === "lg")) &&
							<TableCell align="center" className={gClasses.td} p={0} >{x.remarks.substr(0, MAXSTRINGLEN)+((x.remarks.length > MAXSTRINGLEN) ? "*" : "" )}</TableCell>
						}
						<TableCell align="center" className={gClasses.td} p={0} >{x.status}</TableCell>
						<TableCell className={gClasses.td} p={0} >
							<IconButton color="primary" disabled={!isAdmMan()} size="small" onClick={() => {handleEditBatch(x)}} ><EditIcon /></IconButton>
							<IconButton color="primary" size="small" onClick={() => {handleInfo(x)}} ><InfoIcon /></IconButton>
							<IconButton color="secondary" size="small" onClick={() => {handleDeleteInquiry(x)}} ><CancelIcon /></IconButton>
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
			case "Disabled":  setInquiryArray(masterArray.filter(x => !x.enabled ));  break;
			case "Enabled":   setInquiryArray(masterArray.filter(x => x.enabled ));  break;
			default:          setInquiryArray(masterArray);  break;
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
			<VsButton disabled={!isAdmMan()} name="New Inquiry" align="right" onClick={handleAddInquiry} />
		</Grid>
	</Grid>
	)}
		
	return (
	<div>
	<DisplayPageHeader headerName="Inquiry" groupName="" tournament="" />
	<DisplayOptions />
	<DisplayAllInquiry/>
	<Drawer anchor="top" variant="temporary" open={drawer !== ""}>
		<VsCancel align="right" onClick={() => { setDrawer("")}} />
		{( (drawer === "ADDINQUIRY") || (drawer === "EDITINQUIRY") ) &&
			<InquiryAddEdit mode={(drawer === "ADDINQUIRY") ? "ADD" : "EDIT"}  inquiryRec={inquiryRec} onReturn={handleBackInquiry} />
		}
	</Drawer>
	<Drawer anchor="bottom" variant="temporary" open={drawerInfo !== ""}>
		<VsCancel align="right" onClick={() => { setDrawerInfo("")}} />
	<DisplayPageHeader headerName="Inquiry information" groupName="" tournament="" />
		<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<br />
		<Grid key="INFOINQUIRY" className={gClasses.noPadding} container >
			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left"  className={gClasses.info18Blue} >Date</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<Typography align="left"  className={gClasses.info18} >{dateString(infoRec.date)}</Typography>
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />
			
			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left"  className={gClasses.info18Blue} >Area</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<Typography align="left"  className={gClasses.info18} >{infoRec.area}</Typography>
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />
			
			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left"  className={gClasses.info18Blue} >Name</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<Typography align="left"  className={gClasses.info18} >{infoRec.contactName}</Typography>
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />

			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left"  className={gClasses.info18Blue} >Contact</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<Typography align="left"  className={gClasses.info18} >{infoRec.contactNumber}</Typography>
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />

			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left"  className={gClasses.info18Blue} >Reference</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<Typography align="left"  className={gClasses.info18} >{infoRec.reference}</Typography>
			</Grid>
			<Grid style={{margin: spacing}} item xs={12} sm={12} md={12} lg={12} />

			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={5} sm={5} md={3} lg={2} >
				<Typography align="left" className={gClasses.info18Blue} >Status</Typography>
			</Grid>
			<Grid item xs={7} sm={7} md={3} lg={1} >
				<Typography align="left"  className={gClasses.info18} >{infoRec.status}</Typography>
			</Grid>
			<Grid style={{margin: spacing }} item xs={12} sm={12} md={12} lg={12} />

			{((dispType !== "xs") && (dispType !== "sm")) &&			
				<Grid item xs={1} sm={1} md={2} lg={4} />
			}
			<Grid item xs={6} sm={6} md={3} lg={2} >
				<Typography align="left" className={gClasses.info18Blue}>Remarks</Typography>
			</Grid>
			<Grid item xs={6} sm={6} md={3} lg={4} >
				<TextareaAutosize readOnly maxRows={MAXDISPLAYTEXTROWS} className={gClasses.info18}  value={infoRec.remarks} />
			<br />
		</Grid>
		</Grid>
		</Box>
	</Drawer>
	<ToastContainer />
	</div>
	);
}
