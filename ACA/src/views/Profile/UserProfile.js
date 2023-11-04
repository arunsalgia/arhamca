import React, { useState ,useContex, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { UserContext } from "../../UserContext";
import axios from "axios";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {blue, red, deepOrange, yellow } from '@material-ui/core/colors';
import { useHistory } from "react-router-dom";
import { 
  encrypt, decrypt,
  validateSpecialCharacters, validateEmail, isMobile,
} from "views/functions.js";
import { BlankArea, ValidComp, DisplayPageHeader } from 'CustomComponents/CustomComponents.js';
import { setTab } from "CustomComponents/CricDreamTabs.js"
import { TextField, InputAdornment } from "@material-ui/core";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';


const useStyles = makeStyles((theme) => ({
  icon : {
    color: blue[900],
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  userMessage: {
    fontSize: theme.typography.pxToRem(10),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  userCode: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: yellow[900]
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  textColor: {
    color: blue[700],
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: blue[700]
  },
  helpMessage: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  th: { 
    spacing: 0,
    align: "center",
    padding: "none",
    backgroundColor: '#EEEEEE', 
    color: deepOrange[700], 
    // border: "1px solid black",
    fontWeight: theme.typography.fontWeightBold,
  },
  td : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
  },    
}));


export default function Profile() {
  const classes = useStyles();
  const history = useHistory();

  const [userCode, setUserCode] = useState("");
  const [userName, setUserName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState({});
  const [registerStatus, setRegisterStatus] = useState(199);

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [emptyRows, setEmptyRows] = React.useState(0);
  const [page, setPage] = React.useState(0);

  const [copyState, setCopyState] = useState({value: '', copied: false});

  useEffect(() => {
    const profileInfo = async () => {
      try {
        // get user details
        var userRes = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricprofile/${localStorage.getItem("uid")}`);
        setProfile(userRes.data); // master data for comparision if changed by user
        // setLoginName(userRes.data.loginName);
        setUserCode(userRes.data.userCode);
        setCopyState({value: userRes.data.userCode})
        //setUserCode("ArunCode123456");
        setUserName(userRes.data.userName);
        setGroupName(userRes.data.defaultGroup);
        let tmp = decrypt(userRes.data.email);
        setEmail(tmp);

        // get wallet transaction and also calculate balance
        // let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/details/${localStorage.getItem("uid")}`);
        // setTransactions(response.data);
        // let myempty = rowsPerPage - Math.min(rowsPerPage, response.data.length - page * rowsPerPage);
        // setEmptyRows(myempty);

        // let myBalance = response.data.reduce((accum,item) => accum + item.amount, 0);
        // setBalance(myBalance);

      } catch (e) {
          console.log(e)
      }
    }
    profileInfo();
  }, []);

  // const { setUser } = useContext(UserContext);

  
  const handleProfileSubmit = async() => {
    console.log("Submit command provided"); 
    let myUserName = document.getElementById("username").value;
    let myEmail = document.getElementById("email").value;
    console.log(myUserName, myEmail);
    setUserName(myUserName);
    setEmail(myEmail);

    console.log(userName, email);

    if (myUserName.length < 6) {
      setRegisterStatus(1000);
      return;
    }

    if (!validateSpecialCharacters(myUserName)) {
      setRegisterStatus(1001);
      return;
    }


    if (!validateEmail(myEmail)) {
      setRegisterStatus(1002);
      return;
    }

    // console.log(profile);

    if ((profile.email !== myEmail) || (profile.userName !== userName)) {
      // console.log("New EMail or user name");
      let tmp1 = encrypt(myEmail)
      let response = await fetch(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricupdateprofile/${localStorage.getItem("uid")}/${myUserName}/${tmp1}`);
      
      localStorage.setItem("userName", myUserName);
      setRegisterStatus(response.status);
    }
  }

  function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = "";
        break;
      case 200:
        myMsg = `User details successfully updated`;
        break;
      case 601:
        myMsg = "Invalid current password";
        break;
      case 602:
        myMsg = "Email id already in use";
        break;
      case 701:
        myMsg = "Incorrect current password";
        break;
      case 702:
        myMsg = "New and repeat password mismatch";
        break;
      case 703:
          myMsg = "Curent and  new password are identical";
          break;
      case 1000:
        myMsg = "Minimum 6 characters required";
        break;
      case 1001:
        myMsg = "Special characters not permitted";
        break;
      case 1002:
        myMsg = "Invalid Email id";
        break;
      case 1003:
        myMsg = "Invalid current password";
        break;
      case 199:
        myMsg = ``;
        break;
      default:
        myMsg = "unKnown error";
        break;
    }
    return(
      <Typography className={(registerStatus === 200) ? classes.root : classes.error}>{myMsg}</Typography>
    )
  }

  function UserProfile() {
    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">User Profile</Typography>
        <ValidatorForm className={classes.form} onSubmit={handleProfileSubmit}>
          <TextValidator
              className={classes.textColor}
              variant="outlined"
              required
              fullWidth      
              label="User Name"
              // onChange={(event) => setUserName(event.target.value)}
              id="username"
              name="username"
              // validators={['required', 'minLength', 'noSpecialCharacters']}
              // errorMessages={['User Name to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
              // value={userName}
              defaultValue={userName}
          />
          <BlankArea/>
          <TextValidator
              variant="outlined"
              required
              fullWidth      
              label="Email"
              // onChange={(event) => setEmail(event.target.value)}
              id="email"
              name="email"
              type="email"
              // validators={['isEmailOK', 'required']}
              // errorMessages={['Invalid Email', 'Email to be provided']}
              // value={email}
              defaultValue={email}
          />
          {/* <BlankArea/> */}
          {/* <TextValidator
              variant="outlined"
              // required
              fullWidth      
              // readonly
              disabled
              label="Default Group"
              name="groupName"
              value={groupName}
          /> */}
          <ShowResisterStatus/>
          <BlankArea/>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Update
        </Button>
        </ValidatorForm>
      </div>
      <ValidComp />    
      </Container>
    );
  }   

  function ShowAllWallet() {
    return (
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">Wallet Balance: {balance}</Typography>
        <Table>
        <TableHead p={0}>
            <TableRow align="center">
            <TableCell className={classes.th} p={0} align="center">Date</TableCell>      
            <TableCell className={classes.th} p={0} align="center">Type</TableCell>
            <TableCell className={classes.th} p={0} align="center">Amount</TableCell>
            </TableRow>
        </TableHead>
        < TableBody p={0}>
            {transactions.map( (item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell  className={classes.td} p={0} align="center" >
                    {item.date}
                  </TableCell>
                  <TableCell  className={classes.td} p={0} align="center" >
                    {item.type}
                  </TableCell>
                  <TableCell  className={classes.td} p={0} align="center" >
                    {item.amount}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody> 
        </Table>
      </div>
    );
  }

  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
    let myempty = rowsPerPage - Math.min(rowsPerPage, transactions.length - newPage * rowsPerPage);
    setEmptyRows(myempty);

  };

  function ShowWallet() {
    return (
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">Wallet Balance: {balance}</Typography>
        <TableContainer>
        <Table>
        <TableHead p={0}>
            <TableRow align="center">
            <TableCell className={classes.th} p={0} align="center">Date</TableCell>      
            <TableCell className={classes.th} p={0} align="center">Type</TableCell>
            <TableCell className={classes.th} p={0} align="center">Amount</TableCell>
            </TableRow>
        </TableHead>
        < TableBody>
            {transactions.slice(page * rowsPerPage, (page + 1) * rowsPerPage )
            .map( (item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell  className={classes.td} p={0} align="center" >
                    {item.date}
                  </TableCell>
                  <TableCell  className={classes.td} p={0} align="center" >
                    {item.type}
                  </TableCell>
                  <TableCell  className={classes.td} p={0} align="center" >
                    {item.amount}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody> 
        </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          // onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    );
  }


  const handlePasswordSubmit = async() => {
    console.log("Submit command provided");
    // let origPassword = document.getElementById("currentPassword").value;
    // let pass1 = document.getElementById("newPassword").value;
    // let pass2 = document.getElementById("repeatPassword").value;
    // console.log(origPassword, pass1, pass2);
    // console.log(currentPassword, newPassword, repeatPassword);

    // setCurrentPassword(origPassword)
    // setNewPassword(pass1);
    // setRepeatPassword(pass2);

    let x = getInput();
    if (validate("currentPassword")) return;
    if (validate("newPassword")) return;
    if (validate("repeatPassword", "newPassword")) return;
    setRegisterStatus(0);

    let tmp1 = encrypt(x.currentPassword);
    let tmp2 = encrypt(x.newPassword);

    let response = await fetch(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricreset/${localStorage.getItem("uid")}/${tmp1}/${tmp2}`);
    if (response.status === 200) {
      setRegisterStatus(200);
    } else {
      // error
      setRegisterStatus(response.status);
      console.log(`Status is ${response.status}`);
    }
  }

   
  const [error, setError] = useState({});
  const [helperText, setHelperText] = useState({});
  function validate(eid, eid2) {
    getInput();
    let e = document.getElementById(eid);
    let myValue = e.value; 
    // console.log(eid, myValue);
    let newError=false;
    let newText = "";
    
    switch (eid) {
      case "currentPassword":
      case "newPassword":
        if (!validateSpecialCharacters(myValue)) {
          newError = true;
          newText = 'Special characters not permitted';
        } else if (myValue.length < 6) {
          newError = true;
          newText = "Mimumum 6 characters required";
        }
      break;
      case "repeatPassword":
        let myValue2 = document.getElementById(eid2).value;
        // setRepeatPassword(myValue);
        if (myValue !== myValue2) {
          newError = true;
          newText = 'Password mismatch';
        } 
      break;
    }
    
    let x = {};
    x[eid] = newError;
    setError(x);
    
    x = {};
    x[eid] = newText;
    setHelperText(x);

    // e.focus();
    return newError;
  }


  function getInput() {
    let myName = document.getElementById("currentPassword").value;
    let myPass1 = document.getElementById("newPassword").value;
    let myPass2 = document.getElementById("repeatPassword").value;
    // console.log(myName, myPass1, myPass2);

    setCurrentPassword(myName);
    setNewPassword(myPass1);
    setRepeatPassword(myPass2);
    return {
      currentPassword: myName,
      newPassword: myPass1,
      repeatPassword: myPass2
    }
  }

  const [showPass0, setShowPass0] = useState(false);
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  function handleVisibility0(isVisible) {
    // console.log("In visisble 0", isVisible);
    getInput();
    setShowPass0(isVisible);
    // let e = document.getElementById('password');
    // e.focus();
  }

  function handleVisibility1(isVisible) {
    // console.log("In visisble 1", isVisible);
    getInput();
    setShowPass1(isVisible);
    // let e = document.getElementById('password');
    // e.focus();
  }

  function handleVisibility2(isVisible) {
    // console.log("In visisble 1", isVisible);
    getInput();
    setShowPass2(isVisible);
    // let e = document.getElementById('password');
    // e.focus();
  }

  function Password0NonMobile() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="currentPassword" label="Current Password" type="password"
      defaultValue={currentPassword}
      // onChange={(event) => validate("password")}
      error={error.currentPassword}
      helperText={helperText.currentPassword}
      // validators={['required', 'minLength', 'noSpecialCharacters']}
      // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
      // value={password}
    />
    );
  }


  function Password1NonMobile() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="newPassword" label="New Password" type="password"
      defaultValue={newPassword}
      // onChange={(event) => validate("newPassword")}
      error={error.newPassword}
      helperText={helperText.newPassword}
      // validators={['required', 'minLength', 'noSpecialCharacters']}
      // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
      // value={password}
    />
    );
  }

  function Password2NonMobile() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="repeatPassword" label="New Password" type="password"
      defaultValue={repeatPassword}
      // onChange={(event) => validate("repeatPassword")}
      error={error.repeatPassword}
      helperText={helperText.repeatPassword}
      // validators={['required', 'minLength', 'noSpecialCharacters']}
      // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
      // value={password}
    />
    );
  }

  function Password0Text() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="currentPassword" label="Current Password" type="text"
      defaultValue={currentPassword}
      // onChange={(event) => validate("currentPassword")}
      error={error.currentPassword}
      helperText={helperText.currentPassword}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <VisibilityOffIcon onClick={() => { handleVisibility0(false); }} />
          </InputAdornment>
        ),
      }}
      // validators={['required', 'minLength', 'noSpecialCharacters']}
      // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
      // value={password}
    />
    );
  }


  function Password1Text() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="newPassword" label="New Password" type="text"
      defaultValue={newPassword}
      // onChange={(event) => validate("newPassword")}
      error={error.newPassword}
      helperText={helperText.newPassword}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <VisibilityOffIcon onClick={() => { handleVisibility1(false); }} />
          </InputAdornment>
        ),
      }}
      // validators={['required', 'minLength', 'noSpecialCharacters']}
      // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
      // value={password}
    />
    );
  }

  function Password2Text() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="repeatPassword" label="New Password" type="text"
      defaultValue={repeatPassword}
      // onChange={(event) => validate("repeatPassword")}
      error={error.repeatPassword}
      helperText={helperText.repeatPassword}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <VisibilityOffIcon onClick={() => { handleVisibility2(false); }} />
          </InputAdornment>
        ),
      }}
      // validators={['required', 'minLength', 'noSpecialCharacters']}
      // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
      // value={password}
    />
    );
  }

  function Password0Password() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="currentPassword" label="Current Password" type="password"
      defaultValue={currentPassword}
      // onChange={(event) => validate("currentPassword")}
      error={error.currentPassword}
      helperText={helperText.currentPassword}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <VisibilityIcon onClick={() => { handleVisibility0(true); }} />
          </InputAdornment>
        ),
      }}
      // validators={['required', 'minLength', 'noSpecialCharacters']}
      // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
      // value={password}
    />
    );
  }

  function Password1Password() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="newPassword" label="New Password" type="password"
      defaultValue={newPassword}
      // onChange={(event) => validate("newPassword")}
      error={error.newPassword}
      helperText={helperText.newPassword}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <VisibilityIcon onClick={() => { handleVisibility1(true); }} />
          </InputAdornment>
        ),
      }}
      // validators={['required', 'minLength', 'noSpecialCharacters']}
      // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
      // value={password}
    />
    );
  }

  function Password2Password() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="repeatPassword" label="Repeat Password" type="password"
      defaultValue={repeatPassword}
      // onChange={(event) => validate("repeatPassword")}
      error={error.repeatPassword}
      helperText={helperText.repeatPassword}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <VisibilityIcon onClick={() => { handleVisibility2(true); }} />
          </InputAdornment>
        ),
      }}
      // validators={['required', 'minLength', 'noSpecialCharacters']}
      // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
      // value={password}
    />
    );
  }

  function DisplayPassword0() {
    // let tmp = isMobile();
    // console.log("is mobile0", tmp);
    if (isMobile()) {
      if (showPass0) {
        return <Password0Text />
      } else {
        return <Password0Password />
      }
    } else {
      return <Password0NonMobile />
    }
  }

  function DisplayPassword1() {
    // let tmp = isMobile();
    // console.log("is mobile1", tmp);
    if (isMobile()) {
      if (showPass1) {
        return <Password1Text />
      } else {
        return <Password1Password />
      }
    } else {
      return <Password1NonMobile />
    }
  }

  function DisplayPassword2() {
    // let tmp = isMobile();
    // console.log("is mobile2", tmp);
    if (isMobile()) {
      if (showPass2) {
        return <Password2Text />
      } else {
        return <Password2Password />
      }
    } else {
      return <Password2NonMobile />
    }
  }

  function ShowPassword() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
        <Typography component="h1" variant="h5">Change Password</Typography>
        <ValidatorForm className={classes.form} onSubmit={handlePasswordSubmit}>
        <DisplayPassword0 />
        <BlankArea/>
        <DisplayPassword1 />
        <BlankArea/>
        <DisplayPassword2 />
        <ShowResisterStatus/>
        <BlankArea/>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
        >
          Update
      </Button>
      </ValidatorForm>
      </div>
      <ValidComp p1={newPassword}/>    
      </Container>
    );  
  }

  const [expandedPanel, setExpandedPanel] = useState("");
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    setRegisterStatus(0);
  };

  function DisplayUserCode() {
    let myText = copyState.value
    //console.log("in user code");
    return (
        <div>
          {/* <BlankArea/> */}
          <Typography><span className={classes.userMessage}>Share Referral code with your friends and earn bonus </span></Typography>
          <BlankArea/>
          <Typography className={classes.userCode}>{userCode}</Typography>
          <BlankArea/>
          <CopyToClipboard text={myText}
              onCopy={() => setCopyState({copied: true})}>
              <button>Copy to clipboard</button>
          </CopyToClipboard>
          {copyState.copied ? <span style={{color: 'blue'}}>Copied.</span> : null}
        </div>       
      )
  }
  
  function handleInfo() {
    alert("scheme info to be displayed");
  }

  function DisplayAccordian() {
  return (
    <div>
    <Typography align="left" className={classes.helpMessage}>Update Profile</Typography>
    <Accordion expanded={expandedPanel === "userprofile"} onChange={handleAccordionChange("userprofile")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography className={classes.heading}>View/Edit Profile</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <UserProfile />
      </AccordionDetails>
    </Accordion>
    <BlankArea />
    {/* <Accordion expanded={expandedPanel === "wallet"} onChange={handleAccordionChange("wallet")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className={classes.heading}>Wallet Details</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ShowWallet />
      </AccordionDetails>
    </Accordion>
    <Typography align="left" className={classes.helpMessage}>View Wallet details</Typography>
    <BlankArea /> */}
    <Typography align="left" className={classes.helpMessage}>Change Password</Typography>
    <Accordion expanded={expandedPanel === "password"} onChange={handleAccordionChange("password")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography className={classes.heading}>Change Password</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ShowPassword />
      </AccordionDetails>
    </Accordion>
    <BlankArea />
    {/*<Accordion expanded={expandedPanel === "code"} onChange={handleAccordionChange("code")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography className={classes.heading}>Referral Code</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <DisplayUserCode />
      </AccordionDetails>
    </Accordion>
    <IconButton
      aria-label="account of current group"
      aria-controls="group-appbar"
      aria-haspopup="true"
      onClick={handleInfo}
      color="inherit"
      align="left"
    >
      <Typography align="left" className={classes.helpMessage}>Share Referral Code with friends and earn Bonus </Typography>
    </IconButton>*/}
    </div>
  )
  }
  

  let headerText = localStorage.getItem("userName") + "\`s Profile";
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <BlankArea />
      <DisplayPageHeader headerName={headerText} groupName="" tournament=""/>
      <BlankArea />
      <DisplayAccordian />
      {/* <ShowResisterStatus/> */}
    </Container>
  );

}
