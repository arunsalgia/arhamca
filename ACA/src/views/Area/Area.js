import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import Drawer from '@material-ui/core/Drawer';
//import { useAlert } from 'react-alert';
import Box from '@material-ui/core/Box';
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
import { JumpButton, DisplayPageHeader } from 'CustomComponents/CustomComponents.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import lodashSortBy from "lodash/sortBy";


//import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
//import { hasGroup } from 'views/functions';

import globalStyles from "assets/globalStyles";

import VsButton from "CustomComponents/VsButton"; 
import VsCancel from "CustomComponents/VsCancel";

import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';

const MAXAREACODELENGTH = 4;
const MINAREACODELENGTH = 3;

import { 
	isMobile, getWindowDimensions, displayType, decrypt, encrypt,
	isAdmin, isAdmMan, isAdmManFac, isStudent, isFaculty,
	vsDialog,
	
} from 'views/functions';


export default function Area() {
    //const classes = useStyles();
    const gClasses = globalStyles();
		//const alert = useAlert();

    const [areaArray, setAreaArray] = useState([]);
		const [areaCode, setAreaCode] = useState("");
		const [areaDesc, setAreaDesc] = useState("");
    const [areaRec, setAreaRec] = useState(null);
		const [drawer, setDrawer] = useState("");
		const [registerStatus, setRegisterStatus] = useState(0);
		

    useEffect(() => {
			//console.log(firsTime);
			async function getAllAreas() {
				try {
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/area/list`;
					const response = await axios.get(myUrl);
					//console.log(response.data);
					setAreaArray(response.data);
				} catch (e) {
					console.log(e);
				}
			}
			if (isAdmin()) getAllAreas();
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
		console.log("Add / Edit Area", areaRec);
		var myShortCode = areaCode.toUpperCase();
    if (myShortCode.length == 0) {
			setRegisterStatus(-1);
      return;
		}
    if ((myShortCode.length < MINAREACODELENGTH) || (myShortCode.length > MAXAREACODELENGTH)) {
			setRegisterStatus(-2);
      return;
		}
		var duplicate = false
		var tmp = areaArray.filter(x => x.shortName === myShortCode);
		if (
			((areaRec == null) && (tmp.length > 0)) ||
		  ((areaRec != null) && (areaRec.shortName !== myShortCode) && (tmp.length > 0)) 
			) {
			setRegisterStatus(-3);
			return;
		}
		if (areaDesc.length == 0) {
			setRegisterStatus(-4);
			return;
		}
		//console.log("about to tell backend");
		//console.log("2", areaRec);
		try {
			//console.log("Setting utl");
			//console.log(areaRec);
			var myUrl = (areaRec == null)
				? `${process.env.REACT_APP_AXIOS_BASEPATH}/area/add/${myShortCode}/${areaDesc}`
				: `${process.env.REACT_APP_AXIOS_BASEPATH}/area/update/${areaRec.aid}/${myShortCode}/${areaDesc}`;
			//console.log(myUrl);
			var response = await axios.get(myUrl);
			var tmp = (areaRec == null)
				? [].concat(areaArray) 
				: areaArray.filter(x => x.shortName !== areaRec.shortName);
			//console.log("Filter", tmp);
			
			tmp.push(response.data);
			var myMsg = (areaRec == null) 
				? `Successfully added new area ${myShortCode}` 
				: `Successfully changed area ${areaRec.shortName} to ${myShortCode}` ;
			//console.log(myMsg);
			toast.success( myMsg );
			setAreaArray(lodashSortBy(tmp, 'shortName'));
		}
		catch (e) {
			//alert.error("Error adding / updateing Area");
			//console.log("Error");
			toast.error(`Error adding/updating area`);
		}
		setDrawer("");
	}
	
	function handleAdd() {
    console.log("In add");
    setAreaRec(null);
		setAreaCode("");
		setAreaDesc("");
		setDrawer("New");
    
	}
	
	function handleEdit(r) {
		setAreaRec(r);
		setAreaCode(r.shortName);
		setAreaDesc(r.longName);
		setDrawer("Edit");
	}
	
	
	function handleDelArea(rec) {
		vsDialog("Delete Area", `Are you sure you want to delete area ${rec.longName}?`,
			{label: "Yes", onClick: () => handleDelAreaConfirm(rec) },
			{label: "No",   }
		);		
	}
	
	
  async function handleDelAreaConfirm(rec) {
		try {
			//console.log("Setting utl");
			//console.log(areaRec);
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/area/delete/${rec.shortName}`;
			//console.log(myUrl);
			var response = await axios.get(myUrl);
			setAreaArray(lodashSortBy(areaArray.filter(x => x.shortName !== rec.shortName), 'shortName'));
			setDrawer("");
			toast.success( `Successfully deleted area ${rec.shortName}` );
			
		}
		catch (e) {
			toast.error(`Error deleting area. In use`);
		}
	}
	
	
	function DisplayAreas() {
		return (
			<div>
			{(isAdmin()) &&
			 <VsButton name="New Area" align="right" onClick={handleAdd} />
			}
			<Table>
			<TableHead p={0}>
			<TableRow key="header" align="center">
				<TableCell className={gClasses.th} p={0} align="center">Code</TableCell>
				<TableCell className={gClasses.th} p={0} align="center">Area Description</TableCell>
				<TableCell className={gClasses.th} p={0} align="center"></TableCell>
			</TableRow>
			</TableHead>
			<TableBody p={0}>
				{areaArray.map(x => 
					<TableRow key={x.shortName} align="left">
						<TableCell  className={gClasses.td} p={0} >
							{x.shortName}
						</TableCell>
						<TableCell  className={gClasses.td} p={0} >
							{x.longName}
						</TableCell>
						<TableCell className={gClasses.td} p={0} align="center" >
							<IconButton color="primary" size="small" onClick={() => {handleEdit(x) }} ><EditIcon /></IconButton>
							<IconButton color="secondary"  size="small" onClick={() => {handleDelArea(x)}} ><CancelIcon /></IconButton>
						</TableCell>
					</TableRow>
				)}
			</TableBody>
			</Table>
		</div>
		);

	}
		
		return (
		<div>
			<DisplayPageHeader headerName="Areas" groupName="" tournament="" />
			<DisplayAreas/>
			<Drawer anchor="right" variant="temporary" open={drawer !== ""}>
			<Box margin={1} className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
				<VsCancel align="right" onClick={() => { setDrawer("")}} />
				<ValidatorForm margin={2} align="center" className={gClasses.form} onSubmit={handleAddEditSubmit}>
					<Typography className={gClasses.title}>{drawer+" Area "}</Typography>	
					<br />
					<TextValidator  fullWidth  className={gClasses.vgSpacing} id="areacode" label="Area Code" type="text"
						value={areaCode} onChange={() => { setAreaCode(event.target.value) }}
					/>
					<br />
					<TextValidator  fullWidth  className={gClasses.vgSpacing} id="areadesc" label="Area Description" type="text"
						value={areaDesc} onChange={() => { setAreaDesc(event.target.value) }}
					/>
					<br />
					<ShowResisterStatus />
					<br />
					<VsButton name={(drawer == "New") ? "Add" : "Update"} />
				</ValidatorForm>
			</Box>
			</Drawer>
			<ToastContainer />
		</div>
		)
}
