import React, { useState, useEffect ,useContext} from 'react';
//import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
//import { Switch, Route } from 'react-router-dom';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
//import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
//import { UserContext } from "../../UserContext";
import axios from "axios";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import red from '@material-ui/core/colors/red';
import { useHistory } from "react-router-dom";
import { cdRefresh, encrypt} from "views/functions.js";
import { ACALogo, BlankArea, ValidComp } from 'CustomComponents/CustomComponents.js';
import { setTab } from "CustomComponents/CricDreamTabs.js"


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

/***
class ChildComp extends React.Component {

  componentDidMount()  {
    // custom rule will have name 'isPasswordMatch'
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      return (value === this.props.p1)
    });

    ValidatorForm.addValidationRule('minLength', (value) => {
      return (value.length >= 6)
    });

    ValidatorForm.addValidationRule('noSpecialCharacters', (value) => {
      return validateSpecialCharacters(value);
    });

    ValidatorForm.addValidationRule('isEmailOK', (value) => {
      return validateEmail(value);
    });
  }

  
  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isPasswordMatch');
    ValidatorForm.removeValidationRule('isEmailOK');
    ValidatorForm.removeValidationRule('minLength');
    ValidatorForm.removeValidationRule('noSpecialCharacters');   
  }

  render() {
    return <br/>;
  }

}
***/



export default function ResetPassword() {
  const classes = useStyles();
	const gClasses = globalStyles();
//  const history = useHistory();
  // const [userName, setUserName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [registerStatus, setRegisterStatus] = useState(0);
	const [disableButton, setDisableButton] = useState(true);

  // const { setUser } = useContext(UserContext);

  // const handleChange = (event) => {
  //   const { user } = this.state;
  //   user[event.target.name] = event.target.value;
  //   this.setState({ user });
  // }
	
	useEffect(() => {

    const verifyCode = async () => {
			try {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricverifycode/${sessionStorage.getItem("currentUserCode")}`
				// console.log(myUrl);
				let  response = await axios.get(myUrl);
				// console.log(response.data);
				let sts = response.data.status;
				// console.log("Status:", sts);
				setRegisterStatus(sts);
				setDisableButton(false);
			} catch (e) {
				console.log("Failed");
				setRegisterStatus(1001);
			}
    }
    verifyCode();
  }, []);



  const handleSubmit = async() => {
    console.log("Submit command provided");
    if (true) {
      //let tmp1 = encrypt(currentPassword);
      let tmp2 = encrypt(newPassword);
      let response = await fetch(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/cricresetpassword/${sessionStorage.getItem("currentUserCode")}/${tmp2}`);
      if (response.status === 200) {
				sessionStorage.setItem("currentLogin","SIGNIN");
        setTab(0);
      } else {
        // error
        setRegisterStatus(response.status);
        console.log(`Status is ${response.status}`);
      }
    } 
  }


  function ShowResisterStatus() {
    // console.log(`Status is ${registerStatus}`);
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = ``;
        break;
      case 200:
        myMsg = `Updated Password successfully.`;
        break;
      case 602:
        myMsg = "Invalid Current password";
        break;
      case 611:
        myMsg = "New password cannot be same as Current Password";
      break;
			case 1001:
			case 1002:
        myMsg = "Invalid / Expired Link";
			break; 
			case 99999:
        myMsg = "Reset link expired";
			break; 
      default:
        myMsg = "Unknown Error";
        break;
    }
    return(
      <Typography className={(registerStatus === 200) ? classes.root : classes.error}>{myMsg}</Typography>
    )
	}

	function handleLogin() {
    // console.log("Call for login here");
    // history.push("/signin")
    sessionStorage.setItem("currentLogin", "SIGNIN");
    cdRefresh();

  }
	
	function handleForgot() {
		sessionStorage.setItem("currentLogin", "RESET");
    cdRefresh();
	}
	
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
			<ACALogo /> 
      <Typography component="h1" variant="h5">
        Reset Password
      </Typography>
      <ValidatorForm className={classes.form} onSubmit={handleSubmit}>
      <TextValidator
          variant="outlined"
          required
          fullWidth      
          label="New Password"
          onChange={(event) => setNewPassword(event.target.value)}
          name="password"
          type="password"
          validators={['required', 'minLength', 'noSpecialCharacters']}
          errorMessages={['Password to be provided', 'Mimumum 6 characters required', 'Special characters not permitted']}
          value={newPassword}
      />
      <BlankArea/>
      <TextValidator
          variant="outlined"
          required
          fullWidth      
          label="Repeat password"
          onChange={(event) => setRepeatPassword(event.target.value)}
          name="repeatPassword"
          type="password"
          validators={['isPasswordMatch', 'required']}
          errorMessages={['password mismatch', 'this field is required']}
          value={repeatPassword}
      />
      <ShowResisterStatus/>
      <BlankArea/>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={(registerStatus === 0) ? gClasses.show : gClasses.hide}
				//disabled={disableButton}
      >
        Update
			</Button>
			<Button
        //type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={(registerStatus !== 0) ? gClasses.show : gClasses.hide}
				onClick={handleForgot}
				//disabled={disableButton}
      >
        Regenrate Link
			</Button>
    </ValidatorForm>
    </div>
    <ValidComp p1={newPassword}/>  
		<Typography className={classes.root}>
      <Link href="#" onClick={handleLogin} variant="body2">
        Already have an account? Sign in 
      </Link>
    </Typography>		
    </Container>
  );
}
