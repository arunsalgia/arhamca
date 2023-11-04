import React, { useState, useEffect} from 'react';
import axios from "axios";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.js";
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
import Divider from "@material-ui/core/Divider";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import lodashSortBy from "lodash/sortBy";
import lodashMap from "lodash/map";

import VsSelect from "CustomComponents/VsSelect";
import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsTextSearch from "CustomComponents/VsTextSearch";


import VisibilityIcon from '@material-ui/icons/Visibility';

import { BlankArea, ValidComp, JumpButton, DisplayBalance } from 'CustomComponents/CustomComponents.js';
import { validateSpecialCharacters, validateEmail, cdRefresh, validateInteger,
  getMinimumAdd,
} from "views/functions.js";

export default function AdminWallet() {
	const aplLogo = `${process.env.PUBLIC_URL}/APLLOGO2.JPG`;

  const gClasses = globalStyles();

	const [allUsers, setAllusers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [isDrawerOpened, setIsDrawerOpened] = useState("");
	const [searchText, setSearchText] = useState("");
	const [addCount, setAddCount] = useState(0);
	
  const [error, setError] = useState({});
  const [helperText, setHelperText] = useState({});

  const [minBalance, setMinBalance] = useState(parseInt(process.env.REACT_APP_MINADDWALLET));
  const [minMessage, setMinMessage] = useState("");

  const [amount, setAmount] = React.useState(parseInt(process.env.REACT_APP_MINADDWALLET));
  const [registerStatus, setRegisterStatus] = React.useState(0);


	
  useEffect(() => {

    const getAllUsers = async () => {
      let  response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/allnames`);
      setAllusers(response.data);
			setFilteredUsers(response.data);
	    //console.log(response.data.length);
    }
		getAllUsers();
  }, []);



 
  function ShowResisterStatus() {
    let myMsg = "";
    let errmsg = true;
		//console.log(registerStatus);
    switch (registerStatus) {
      case 1001:
        myMsg = 'Error connecting to Payment gateway';
      break;
      case 1002:
        myMsg = 'Error updating payment details...................';
      break;
      case 1003:
        myMsg = 'Payment failed. Retry payment';
      break;
      case 1004:
        myMsg = 'Wallet add failed';
			break;			
			case 2000:
			  //console.log("in success");
				myMsg = `Successfully added amount in ${addCount} user(s) wallet`;
				errmsg = false;
				break;
      case 0:
        myMsg = ``;
        errmsg = false;
      break;      
      default:
        myMsg = `Unknown error code ${registerStatus}`;
        break;
    }
    let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
		
		//myMsg = (myMsg == "ODD") ? "EVEN" : "ODD";
		//console.log("Msg is: ", myMsg);
    return(
      <div>
        <Typography className={myClass}>{myMsg}</Typography>
      </div>
    );
  }
 


	async function handleSubmit() {
		if (amount <= 0)  {
			alert("Invalid Amount entered");
			return;
		}
		
    //var myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/addadminwallet/${paymentRequest}/${paymentId}`;

		var uidList = lodashMap(selectedUsers, 'uid');
		var uidListStr = uidList.toString();
		console.log(uidListStr);
		
    try {
			var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/adduidlist/${uidListStr}/${amount}`;
			console.log(myUrl);
			let resp = await axios.get(myUrl);
			setAddCount(resp.data.count);
			setRegisterStatus(2000);
		}
		catch (e) {
			console.log(e);
			setRegisterStatus(1004);
		}
		
	}
	

	async function addNewUser() {
		setFilteredUsers(allUsers);
		setSearchText("");
		setIsDrawerOpened("New User");
		
	}
	
	async function handleSelectUser(rec) {
			if (!selectedUsers.find(x => x.uid === rec.uid))
			{
				selectedUsers.push(rec);
				setSelectedUsers(lodashSortBy(selectedUsers, 'displayName'));
			}
			setIsDrawerOpened("");
	}
	
	function deleteUser(rec) {
		setSelectedUsers(selectedUsers.filter(x => x.uid != rec.uid));
	}

	function filterUsers(playerInfo) {
		let tmp = playerInfo.toLowerCase()
		setSearchText(tmp);
		//console.log(tmp);
		if (tmp != "") {
			setFilteredUsers(allUsers.filter(x => x.userName.toLowerCase().includes(tmp) || x.userName.toLowerCase().includes(tmp)));
		} 
		else  {
			console.log("BLANK");
			setFilteredUsers(allUsers);
		}
	}
	
	if (allUsers.length === 0) return null;
	return (
    <Container component="main" maxWidth="xs">
		<CssBaseline />
		<div align="center" className={gClasses.paper}>
      <Typography component="h1" variant="h5">
        Admin Wallet
      </Typography>
			<BlankArea />
			<div>
			<Box bordercolor="primary.main" border={1}>
			<TableContainer>
			<Table>
				<TableHead>
					<TableRow className={gClasses.th} align="center" bordercolor="black" border={1}>
						<TableCell className={gClasses.th} align="center">User Name</TableCell>      
						<TableCell className={gClasses.th} align="center">Display Name</TableCell>
						<TableCell className={gClasses.th} align="center">UID</TableCell>
						<TableCell className={gClasses.th} align="center"></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{selectedUsers.map( (m, index) => 
						<TableRow key={"SEL"+m.uid} align="center" bordercolor="black" border={1}>
							<TableCell align="left" className={gClasses.td} >{m.userName}</TableCell> 
							<TableCell align="left" className={gClasses.td} >{m.displayName}</TableCell> 
							<TableCell align="center" className={gClasses.td}>{m.uid}</TableCell> 
							<TableCell className={gClasses.td}><VsCancel align="center" onClick={() => {deleteUser(m)}} /></TableCell> 
						</TableRow>
					)}
					{(selectedUsers.length === 0) &&
						<TableRow align="center">
							<TableCell align="center" colSpan={4} className={gClasses.td} p={1} >No User Selected</TableCell>      
						</TableRow>
					}
				</TableBody>
			</Table>
			</TableContainer>
			</Box>
			<VsButton align="right" name="Add User" onClick={addNewUser} />
			</div>
    <BlankArea/>
		<Divider style={{ color: 'blue', background: 'blue' }} variant="middle" />
		<BlankArea/>
		{(selectedUsers.length > 0) &&
			<ValidatorForm className={gClasses.form} onSubmit={handleSubmit}>
				<TextValidator variant="outlined" required type="number" min={minBalance} step="1" 
					id="amount" label="Add amount" name="amount"
					value={amount}
					onChange={(event) => setAmount(event.target.value)}
					error={error.amount}
					helperText={helperText.amount}
				/>
			<ShowResisterStatus/>
      <BlankArea/>
			<VsButton type="submit" align="center" name="Add to wallet"/>
			</ValidatorForm>
		}
		<JumpButton page={process.env.REACT_APP_HOME} text="Home" />
    </div>
    <ValidComp/>
		<Drawer anchor="right" variant="temporary" open={isDrawerOpened !== ""} >
			<VsCancel align="right" onClick={() => {setIsDrawerOpened("")}} />
			<VsTextSearch label="Search Player by User/Display name" value={searchText}
						onChange={(event) => filterUsers(event.target.value)}
						onClear={(event) => filterUsers("")}
					/>
			<BlankArea />
			<Table>
			<TableBody>
			{filteredUsers.map( (m, index) => 
				<TableRow key={"USR"+m.uid} className={gClasses.td} align="center">
					<TableCell className={gClasses.td} onClick={() => handleSelectUser(m) } >{m.userName} ({m.displayName}) (Uid: {m.uid})</TableCell> 
						{/*<TableCell className={gClasses.td} ><VisibilityIcon className={gClasses.blue} size="small" onClick={() => handleSelectUser(m) }  /></TableCell>*/}
				</TableRow>
			)}
			</TableBody>
			</Table>
		</Drawer>
    </Container>
  );
}
