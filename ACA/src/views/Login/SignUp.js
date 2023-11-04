import React, { useState ,useContext} from 'react';
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
// import { Switch, Route } from 'react-router-dom';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
//import { UserContext } from "../../UserContext";
//import axios from "axios";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { TextField, InputAdornment } from "@material-ui/core";
import red from '@material-ui/core/colors/red';
// import { useHistory } from "react-router-dom";
// import SignIn from "./SignIn.js";
import { cdRefresh, encrypt, decrypt, isMobile,
  validateSpecialCharacters, validateMobile, validateEmail,
} from "views/functions.js";
import { ACALogo, BlankArea, ValidComp } from 'CustomComponents/CustomComponents.js';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';


const useStyles = makeStyles((theme) => ({
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
}));


export default function SignUp() {
  const classes = useStyles();
  const gClasses = globalStyles();
  // const history = useHistory();
  const [referalCode, setReferalCode] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [registerStatus, setRegisterStatus] = useState(199);
  const [mobile, setMobile] = useState("");
  // const { setUser } = useContext(UserContext);

  const handleSubmit = async() => {
    console.log("Submit command provided");
    let x = getInput();
    console.log("fetched value", x);
    if (validate("userName")) return;
    if (validate("password")) return;
    if (validate("repeatPassword", "password")) return;
    // console.log("All okay");

    let tmp1 = encrypt(x.password);
    let tmp2 = encrypt(email);
    let rCode = (referalCode !== "") ? referalCode : "NA";
		
    let response = await fetch(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricsignup/${x.userName}/${tmp1}/${tmp2}/${mobile}/${rCode}`);
    if (response.status === 200) {
      let setemailresp = await fetch(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricemailwelcome/${tmp2}`);
      // history.push("/signin");
      sessionStorage.setItem("currentLogin", "SIGNIN");
      cdRefresh();

    } else {
      // error
      setRegisterStatus(response.status);
      console.log(`Status is ${response.status}`);
    }
  }

  function handleLogin() {
    // console.log("Call for login here");
    // history.push("/signin")
    sessionStorage.setItem("currentLogin", "SIGNIN");
    cdRefresh();

  }

  function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 199:
        myMsg = "";
        break;
      case 200:
        // setUserName("");
        // setPassword("");
        // setRepeatPassword("");
        // setEmail("");
        myMsg = `User ${userName} successfully regisitered.`;
        break;
      case 602:
        myMsg = "User Name already in use";
        break;
      case 603:
        myMsg = "Email id already in use";
        break;
      default:
          myMsg = "Unknown Error";
          break;
    }
    return(
      <div>
        <Typography className={(registerStatus === 200) ? gClasses.nonerror : gClasses.error}>{myMsg}</Typography>
      </div>
    )
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
      case "userName":
        if (!validateSpecialCharacters(myValue)) {
          newError = true;
          newText = 'Special characters not permitted';
        } else if (myValue.length < 6) {
          newError = true;
          newText = "Mimumum 6 characters required";
        }
      break;
      case "password":
        // console.log("Setting password as ", myValue);
        // setPassword(myValue);
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

    e.focus();
    return newError;
  }

  function getInput() {
    let myName = document.getElementById("userName").value;
    let myPass1 = document.getElementById("password").value;
    let myPass2 = document.getElementById("repeatPassword").value;
    // console.log(myName, myPass1, myPass2);

    setUserName(myName);
    setPassword(myPass1);
    setRepeatPassword(myPass2);
    return {
      userName: myName,
      password: myPass1,
      repeatPassword: myPass2
    }
  }

  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  function handleVisibility1(isVisible) {
    // console.log("In visisble 1", isVisible);
    getInput();
    setShowPass1(isVisible);
    let e = document.getElementById('password');
    e.focus();
  }

  function handleVisibility2(isVisible) {
    // console.log("In visisble 2", isVisible);
    getInput();
    setShowPass2(isVisible);
    let e = document.getElementById('repeatPassword');
    e.focus();
  }

  function Password1NonMobile() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="password" label="Password" type="password"
      defaultValue={password}
      // onChange={(event) => validate("password")}
      error={error.password}
      helperText={helperText.password}
      // validators={['required', 'minLength', 'noSpecialCharacters']}
      // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
      // value={password}
    />
    );
  }

  function Password2NonMobile() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="repeatPassword" label="Repeat Password" type="password"
      defaultValue={repeatPassword}
      // onChange={(event) => validate("repeatPassword", "password")}
      error={error.repeatPassword}
      helperText={helperText.repeatPassword}
      // validators={['required', 'minLength', 'noSpecialCharacters']}
      // errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
      // value={password}
    />
    );
  }

  function Password1Text() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="password" label="Password" type="text"
      defaultValue={password}
      // onChange={(event) => validate("password")}
      error={error.password}
      helperText={helperText.password}
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
      id="repeatPassword" label="Repeat Password" type="text"
      defaultValue={repeatPassword}
      // onChange={(event) => validate("password")}
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

  function Password1Password() {
    return (
      <TextValidator variant="outlined" required fullWidth
      id="password" label="Password" type="password"
      defaultValue={password}
      // onChange={(event) => validate("password")}
      error={error.password}
      helperText={helperText.password}
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
      // onChange={(event) => validate("password")}
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


  function DisplayPassword1() {
    // let tmp = isMobile();
    // console.log("is mobile2", tmp);
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


  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={gClasses.paper}>
        <ACALogo />
        <Typography component="h1" variant="h5">
          Register New User
        </Typography>
    <ValidatorForm className={gClasses.form} onSubmit={handleSubmit}>
      {/*<TextValidator variant="outlined" fullWidth
          id="referral" label="Referral Code" name="referral"
          // defaultValue={userName}
          onChange={(event) => setReferalCode(event.target.value)}
          validators={['noSpecialCharacters']}
          errorMessages={[`Special Characters not permitted`]}
          // error={error.userName}
          // helperText={helperText.userName}
          value={referalCode}
        />
      <BlankArea/>*/}
      <TextValidator variant="outlined" required fullWidth
          id="userName" label="User Name" name="username"
          // defaultValue={userName}
          onChange={(event) => setUserName(event.target.value)}
          validators={['required', 'minLength', 'noSpecialCharacters']}
          errorMessages={['User Name to be provided', 'Mimumum 6 characters required', ]}
          // error={error.userName}
          // helperText={helperText.userName}
          value={userName}
      />
      <BlankArea/>
      <TextValidator
          variant="outlined"
          required
          fullWidth      
          label="Email"
          onChange={(event) => setEmail(event.target.value)}
          name="email"
          type="email"
          validators={['isEmailOK', 'required']}
          errorMessages={['Invalid Email', 'Email to be provided']}
          value={email}
      />
      <BlankArea/>
      <TextValidator
          variant="outlined"
          required
          fullWidth      
          label="Mobile"
          onChange={(event) => setMobile(event.target.value)}
          name="mobile"
          //type="email"
          validators={['required', 'mobile']}
          errorMessages={[, 'Mobile to be provided', '10 digit mobile number required']}
          value={mobile}
      />
      <BlankArea/>
      <DisplayPassword1 />
      <BlankArea/>
      <DisplayPassword2 />
      <BlankArea/>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={gClasses.submit}
      >
        Register
    </Button>
    </ValidatorForm>
    <ShowResisterStatus/>
    </div>
    <ValidComp p1={password}/>    
    <Typography className={gClasses.root}>
      <Link href="#" onClick={handleLogin} variant="body2">
        Already have an account? Sign in 
      </Link>
    </Typography>
    {/* <Switch>
      <Route  path='/admin/signin' component={SignIn} key="MemberList"/>
    </Switch> */}
    </Container>
  );
}
