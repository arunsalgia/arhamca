import React, { useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
import axios from "axios";
import useScript from './useScript';
import { setTab }from "CustomComponents/CricDreamTabs";
import { BlankArea, ValidComp, JumpButton, DisplayBalance } from 'CustomComponents/CustomComponents.js';
import { validateSpecialCharacters, validateEmail, cdRefresh, validateInteger,
  getMinimumAdd,
} from "views/functions.js";
var request= require('request');
// import { UserContext } from "../../UserContext";
// import { useHistory } from "react-router-dom";
// import {validateSpecialCharacters, validateEmail, cdRefresh} from "views/functions.js";
// import { red, deepOrange } from '@material-ui/core/colors';
// var Insta = require('instamojo-nodejs');
const INSTALINK='https://test.instamojo.com/@arun_salgia/';

const INSTAMOJOSCRIPT = "https://js.instamojo.com/v1/checkout.js";
const RAZORSCRIPT = "https://checkout.razorpay.com/v1/checkout.js";


const PAYMENTGATEWAY="RAZOR";
var paymentId = "";
var paymentRequest = "";


export default function AddWallet() {
	const aplLogo = `${process.env.PUBLIC_URL}/APLLOGO2.JPG`;
	if (PAYMENTGATEWAY === "RAZOR")
		useScript(RAZORSCRIPT);
	else
		useScript(INSTAMOJOSCRIPT);
	
	
  // const history = useHistory();
  // const classes = useStyles();
  const gClasses = globalStyles();

  const [error, setError] = useState({});
  const [helperText, setHelperText] = useState({});

  const [minBalance, setMinBalance] = useState(parseInt(process.env.REACT_APP_MINADDWALLET));
  const [minMessage, setMinMessage] = useState("");

  const [amount, setAmount] = React.useState(parseInt(process.env.REACT_APP_MINADDWALLET));
  const [registerStatus, setRegisterStatus] = useState(0);

  const [balance, setBalance] = useState({wallet: 0, bonus: 0});
  const [message, setMessage] = useState("");

  // const [paymentRequest, setPaymentRequest ] = useState("");
  // const [paymentId, setPaymentId] = useState("");


  // const [transactions, setTransactions] = useState([]);
  // const [emptyRows, setEmptyRows] = React.useState(0);
  // const [page, setPage] = React.useState(0);

  useEffect(() => {
	if (localStorage.getItem("saveBalance"))
      setBalance(JSON.parse(localStorage.getItem("saveBalance")));

    const minimumAmount = async () => {
      let amt = await getMinimumAdd();
      setMinBalance(amt); 
      setAmount(amt);
      console.log("Min add ", amt);
      setMinMessage(`Minimum amount of  Rupees ${amt} to be added.`);
    }
    const getBalance = async () => {
      let  response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/balance/${localStorage.getItem("uid")}`);
      setBalance(response.data);
	  localStorage.setItem("saveBalance", JSON.stringify(response.data));
    }
    getBalance();
    minimumAmount()
  }, []);

  function junkShowResisterStatus() {
    let myMsg;
    let errmsg = true;
    switch (registerStatus) {
      case 1001:
        myMsg = message;
        errmsg = false;
      break;
      case 1002:
        myMsg = message;
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
    return(
      <div>
        <Typography className={myClass}>{myMsg}</Typography>
      </div>
    );
  }

  function onOpenHandler () {
    // alert('Payments Modal is Opened');
   }

  async function onCloseHandler () {
    let myURL;

    if (paymentId !== "") {
      myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/instapaymentok/${paymentRequest}/${paymentId}`;
    } else {
      myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/instapaymentfail/${paymentRequest}`;
    }

    try {
      let resp = await axios.get(myURL);
      if (paymentId !== "")
        setTab(process.env.REACT_APP_WALLET);
      else
        setRegisterStatus(1003);
    } catch (e) {
      console.log(e);
      setRegisterStatus(1002);
    }
   }

  function onPaymentSuccessHandler (response) {
    //alert('Payment Success');
    console.log('Successs -----', response);
    //setPaymentId(response.paymentId)
    paymentId = response.paymentId;
  }

	function onPaymentFailureHandler (response) {
     //alert('Payment Failure');
     console.log('Failed-----------------', response);
     //setPaymentId("");
     paymentId = "";
     console.log(paymentRequest);
   }

	async function handleRazor(response) {
		// AFTER RAZOR TRANSACTION IS COMPLETE and SUCCESSFULL YOU WILL GET THE RESPONSE HERE.
		console.log(response);
		let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/razorpaymentok/${localStorage.getItem("uid")}/${amount}/${response.razorpay_payment_id}`;
    
    try {
			console.log(myURL);
      await axios.get(myURL);
			setTab(process.env.REACT_APP_WALLET);
    } catch (e) {
      console.log(e);
      setRegisterStatus(1002);
    }
	}
  

  
  function ShowResisterStatus() {
    let myMsg;
    let errmsg = true;
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
      case 0:
        myMsg = ``;
        errmsg = false;
      break;      
      default:
        myMsg = `Unknown error code ${registerStatus}`;
        break;
    }
    let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
    return(
      <div>
        <Typography className={myClass}>{myMsg}</Typography>
      </div>
    );
  }
 
  async function handleSubmit() {
    setRegisterStatus(0);
    let sts;

    sts = await validate("amount")
		if (sts) return;

    paymentRequest = "";
    paymentId = "";

    try {
			if (PAYMENTGATEWAY !== "RAZOR") {
				var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/instageneratepaymentrequest/${localStorage.getItem("uid")}/${amount}`);
				//setPaymentRequest(response.data);
				paymentRequest = response.data;
				//let myrequestid = response.data;
				//let resp = await window.open(`${process.env.REACT_APP_GATEWAYURL}/${response.data}`, '_parent');
				Instamojo.configure({
					handlers: {
						onOpen: onOpenHandler,
						onClose: onCloseHandler,
						onSuccess: onPaymentSuccessHandler,
						onFailure: onPaymentFailureHandler
					}
				});
				Instamojo.open(INSTALINK + response.data);
				//setTab(process.env.REACT_APP_WALLET);
			} 
			else {
				var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/razorgeneratepaymentrequest/${localStorage.getItem("uid")}/${amount}`);
				let myOptions = response.data;
				myOptions.handler = handleRazor;
				myOptions.image = aplLogo;					    // COMPANY LOGO
				var rzp1 = new window.Razorpay(myOptions, '_parent');
				rzp1.open();
			}
    } catch (e) {
      setRegisterStatus(1001);
      console.log(e);
      console.log("Error calling wallet");
    }
  }

  async function validate(eid, eid2) {
    let e = document.getElementById(eid);
    let myValue = e.value; 
    //console.log(eid, myValue);
    let newError=false;
    let newText = "";

    // eslint-disable-next-line default-case
    switch (eid) {
      case "amount":
        let amt = parseInt(myValue);
        if (!validateInteger(myValue)) {
          newError = true;
          newText = 'Amount should in multiple of Rupees';
        } else if (amt < minBalance) {
          newError = true;
          newText = minMessage;
        } 
      break;
    }
  
    let x = {};
    x[eid] = newError;
    setError(x);
    
    x = {};
    x[eid] = newText;
    setHelperText(x);
    //console.log(x);

    e.focus();
    // console.log("Iserror",newError)
    return newError;
  }

  return (
    <Container component="main" maxWidth="xs">
       <DisplayBalance wallet={balance.wallet} bonus={balance.bonus}/>
      <CssBaseline />
      <div align="center" className={gClasses.paper}>
      <Typography component="h1" variant="h5">
        Add to Wallet
      </Typography>
      <ValidatorForm className={gClasses.form} onSubmit={handleSubmit}>
      <TextValidator variant="outlined" required type="number" min={minBalance} step="1" 
        id="amount" label="Add amount" name="amount"
        //defaultValue={amount}
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        error={error.amount}
        helperText={helperText.amount}
      />
      <BlankArea/>
      <ShowResisterStatus/>
      <BlankArea/>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className={gClasses.submit}
      >
        Add
    </Button>
    </ValidatorForm>
    <BlankArea/>
    <Grid key="jp1" container >
      <Grid item xs={6} sm={6} md={6} lg={6} >
        <JumpButton page={process.env.REACT_APP_HOME} text="Home" />
      </Grid>
      <Grid item xs={6} sm={6} md={6} lg={6} >
        <JumpButton page={process.env.REACT_APP_WALLET} text="Wallet" />
      </Grid>
    </Grid>
    </div>
    <ValidComp/>    
    </Container>
  );
}
