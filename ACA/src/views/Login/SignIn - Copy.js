import React, { useRef, useState, useContext, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import { TextField, InputAdornment } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import { Switch, Route } from 'react-router-dom';
// import Dialog from '@material-ui/core/Dialog';
// import DialogTitle from '@material-ui/core/DialogTitle';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
// import SignUp from "../Login/SignUp.js";
// import ForgotPassword from "./ForgotPassword.js";
import { useHistory } from "react-router-dom";
import { UserContext } from "../../UserContext";
import axios from "axios";
import {red, green, blue } from '@material-ui/core/colors';
import { DesktopWindows } from '@material-ui/icons';
import { isMobile, cdRefresh, specialSetPos, encrypt, clearBackupData, downloadApk } from "views/functions.js"
import {setTab} from "CustomComponents/CricDreamTabs.js"
import { ACALogo } from 'CustomComponents/CustomComponents.js';
import { BlankArea } from 'CustomComponents/CustomComponents';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

//const open = require('open');

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  android: {
    marginRight: theme.spacing(1),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  download: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  downloadButon: {
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
  error:  {
    // right: 0,
    fontSize: '12px',
    color: blue[700],
    // position: 'absolute',
    alignItems: 'center',
    marginTop: '0px',
},
}));

const handleSubmit = e => {
  e.preventDefault();
};

export default function SignIn() {
  //const classes = useStyles();
  const gClasses = globalStyles();
  //const history = useHistory();
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  // const [showPage, setShowPage] = useState(true);
  // const { setUser } = useContext(UserContext);
  const [ errorMessage, setErrorMessage ] = useState({msg: "", isError: false });
  const [ downloadMessage, setDownloadMessage ] = useState("");
  // const [errorFound, setErrorFound] = useState(false);

  useEffect(() => {

    if (window.sessionStorage.getItem("uid")) {
      // setUser({ uid: window.sessionStorage.getItem("uid"), admin: window.sessionStorage.getItem("admin") })
      // history.push("/admin")
    } else {
      // setShowPage(true)
    }
		//console.log("IN use effect if sign in");
  });

  function setError(msg, isError) {
    setErrorMessage({msg: msg, isError: isError});
  }

  function handleForgot() {
    //console.log("Call forgot password here")
    // history.push('/admin/emailpassword');
    sessionStorage.setItem("currentLogin", "RESET");
    cdRefresh();
  }
  
  function handleForgotName() {
    sessionStorage.setItem("currentLogin", "FORGOTNAME");
    cdRefresh();
  }
  
  
  function handleRegister() {
    //console.log("Call for register here");
    // history.push("/admin/register")
    sessionStorage.setItem("currentLogin", "SIGNUP");
    cdRefresh();
  }

  const handleSignUp = async () => {
    let myUserName = document.getElementById("userName").value;
    let myPassword = document.getElementById("password").value;
    setUserName(myUserName);
    setPassword(myPassword);

    let response = ""
    try { 
      let enPassword = encrypt(myPassword);
      response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/acalogin/${myUserName}/${enPassword}`); 
      setError("", false);
    } catch (err) {
      setError("Invalid Username / Password", true);
    }
    //console.log("Signinresponse", response.data);
    if (response.status === 200) {
      sessionStorage.setItem("uid", response.data.uid)
      sessionStorage.setItem("displayName", response.data.displayName);
      sessionStorage.setItem("userName", response.data.userName);
      sessionStorage.setItem("role", response.data.role);
			sessionStorage.setItem("isAdmin", response.data.role === "Admin");
      setTab(process.env.REACT_APP_HOME);
    }

  }
  
  async function handleAndroid() {

    // opens the url in the default browser 
    var myURL = `${process.env.REACT_APP_APLSERVER}/viraag/binarylatest/APL`;
    try {
      await window.open(myURL, '_blank', 'noreferrer');
    }
    catch(e) {
     console.log(e); 
    }
    return;
    
    try {
      setDownloadMessage("APL Android app download started. Please wait...")
      // console.log("Download Android app");
      await downloadApk();
      setDownloadMessage("APL Android app download complete.")
      // console.log("APK has to be downloaded");
    } catch (e) {
      setDownloadMessage("Error encountered while downloading APL Android app", true)
    }
  }

  function handleIos() {
    console.log("Download IOS app");
  }


  function DisplayDownload() {
    if (process.env.REACT_APP_DEVICE !== "WEB") return null;

    let androidImage = `${process.env.PUBLIC_URL}/image/ANDROID.JPG`;
    let iosImage = `${process.env.PUBLIC_URL}/image/IOS.JPG`;
    return (
      <div align="center">
      <Typography className={gClasses.message18}>Download the offical app</Typography>
      <BlankArea />
      <Typography className={gClasses.nonerror} align="center">{downloadMessage}</Typography>
      <Grid key="jp1" container align="center">
        <Grid item xs={12} sm={12} md={12} lg={12} >
        <button><img src={androidImage} alt="my image" onClick={handleAndroid} /></button>
        </Grid>
        {/* <Grid item className={gClasses.downloadButon} xs={6} sm={6} md={6} lg={6} >
        <button disabled><img src={iosImage}  alt="my image" onClick={handleIos} /></button>
        </Grid> */}
      </Grid>
      </div>
    )  
  } 
	
  
  const [showPassword, setShowPassword] = useState(false);

  function handleVisibility(visible) {
    let myName = document.getElementById("userName").value;
    let myPassword = document.getElementById("password").value;
    setUserName(myName);
    setPassword(myPassword);
    setShowPassword(visible);
  }

  function NonMobile() {
    return (
      <TextField variant="outlined" required fullWidth
        id="password" label="Password" type="password"
        defaultValue={password}
        // onChange={(event) => setPassword(event.target.value)}
      />
    )
  }

  
  function PwdVisible() {
    //console.log("IN visisble");
    return (
      <TextField variant="outlined" required fullWidth
        id="password" label="Password" type="text"
        defaultValue={password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <VisibilityOffIcon onClick={() => { handleVisibility(false); }} />
            </InputAdornment>
          ),
        }}
      />
    )
  }

  function PwdNotVisible() {
    //console.log("In non visisble")
    return (
      <TextField variant="outlined" required fullWidth
        id="password" label="Password" type="password"
        defaultValue={password}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <VisibilityIcon onClick={() => { handleVisibility(true); }} />
            </InputAdornment>
          ),
        }}
      />
    )

  }

  function GetPassword() {
    let itIsMobile = isMobile();
    //console.log("Mobile", itIsMobile)
    if (itIsMobile) {
      if (showPassword) 
        return <PwdVisible />
      else
        return <PwdNotVisible />
    } else {
      return <NonMobile />
    }
  }

  //console.log("In sign in");
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={gClasses.paper}>
        <ACALogo />        
        <Typography component="h1" variant="h5">Sign in</Typography>
        <form className={gClasses.form} onSubmit={handleSubmit} noValidate>
          <TextField
            // autoComplete="fname"
            id="userName"
            label="User Name"
            // name="userName"
            variant="outlined"
            required
            fullWidth
            defaultValue={userName}
            // autoFocus
            // onChange={(event) => setUserName(event.target.value)}
          />
          <Typography className={gClasses.root}>
              <Link href="#" onClick={handleForgotName} variant="body2">
              Forgot User name
              </Link>
            </Typography>
          <h3></h3>
          <GetPassword />
          <div>
            <Typography className={(errorMessage.isError) ? gClasses.error : gClasses.nonerror} align="left">{errorMessage.msg}</Typography>
            <Typography className={gClasses.root}>
              <Link href="#" onClick={handleForgot} variant="body2">
              Forgot password
              </Link>
            </Typography>
          </div>
          <Button 
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={gClasses.submit}
            onClick={handleSignUp}
          >
            Sign In
          </Button>
        </form>
        <BlankArea />
        <DisplayDownload />
      </div>
      {/* <Route  path='/admin/emailpassword' component={Reset} key="MemberList"/>
      <Route  path='/admin/register' component={SignUp} key="NewGroup"></Route> */}
    </Container>
  );
}
