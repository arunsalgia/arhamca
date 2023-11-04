import React, { useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.js";
// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
import VsSelect from "CustomComponents/VsSelect";

import axios from "axios";
import useScript from './useScript';
import { setTab }from "CustomComponents/CricDreamTabs";
import { BlankArea, ValidComp, JumpButton, DisplayBalance } from 'CustomComponents/CustomComponents.js';
import { validateSpecialCharacters, validateEmail, cdRefresh, validateInteger,
  getMinimumAdd,
} from "views/functions.js";
var request= require('request');

import VsButton from "CustomComponents/VsButton";


const INSTALINK='https://test.instamojo.com/@arun_salgia/';

const INSTAMOJOSCRIPT = "https://js.instamojo.com/v1/checkout.js";
const RAZORSCRIPT = "https://checkout.razorpay.com/v1/checkout.js";


const PAYMENTGATEWAY="RAZOR";
var paymentId = "";
var paymentRequest = "";

var orderId = "";
var razResponse;
function setOrderId(newId) { orderId = newId; };

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

  const [minInrBalance, setMinInrBalance] = useState(parseInt(process.env.REACT_APP_MINADDWALLET));
  const [minBalance, setMinBalance] = useState(parseInt(process.env.REACT_APP_MINADDWALLET));

  const [minCond, setMinCond] = useState("minNumber:100");
  const [minMessage, setMinMessage] = useState("");

  const [amount, setAmount] = React.useState(parseInt(process.env.REACT_APP_MINADDWALLET));
  const [registerStatus, setRegisterStatus] = useState(0);

  const [balance, setBalance] = useState({wallet: 0, bonus: 0});
  const [message, setMessage] = useState("");

	const [razOpt, setRazOpt] = useState({});
	const [payId, setPayId] = useState("");
	const [signId, setSignId] = useState("");
		
	const [currencyList, setCurrencyList] = useState([]);
	const [currentCurrency, setCurrentCurrency] = useState("INR");
	const [currentRate, setCurrentRate] = useState(1.0);
	
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
			// now find if new group amount is provided
			var createJoinGroup = sessionStorage.getItem("newGroupAmount");
			sessionStorage.setItem("newGroupAmount", 0);
			
			var groupAmount = (createJoinGroup)  ? Number(createJoinGroup) : 0;
			if (groupAmount > amt)
				amt = groupAmount;
			
      setMinBalance(amt); 
      setMinInrBalance(amt);
      
      setAmount(amt);
      console.log("Min add ", amt);
      
      setMinCond("minNumber:" + amt);
      setMinMessage(`Minimum amount is INR ${amt}`);
    }
    const getBalance = async () => {
      let  response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/balance/${localStorage.getItem("uid")}`);
      setBalance(response.data);
	  localStorage.setItem("saveBalance", JSON.stringify(response.data));
    }
		const getCurrency = async () => {
			try {
				var res = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/currency/getall`);	
				setCurrencyList(res.data);
				var tmp = res.data.find(x => x.name == "INR");
				//console.log(tmp);
				setCurrentCurrency(tmp.name);
				setCurrentRate(tmp.rate);
			} 
			catch (err) {
				console.log(err);
				console.log("Error in getting currency");
			}
		}

		getCurrency();
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

  function changeCurrency(newCurrency) {
		setCurrentCurrency(newCurrency);
		let tmp = currencyList.find(x => x.name === newCurrency);
    setCurrentRate(tmp.rate);

		//console.log(tmp);
    let newMinAmount = (tmp.name != "INR") ? Math.round(minInrBalance / tmp.rate + 0.5) : minInrBalance;
    setMinBalance(newMinAmount);
    
		if (amount < newMinAmount) { 
      setAmount(newMinAmount);
    }
      setMinCond("minNumber:" + newMinAmount);
      setMinMessage(`Minimum amount is ${tmp.name} ${newMinAmount}`);
/*      
    }
    else {
      //setAmount(newMinAmount);
      setMinCond("minNumber:" + newMinAmount);
      setMinMessage(`Minimum amount is ${tmp.name} ${newMinAmount}`);      
    }
*/    
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
 
  async function orghandleSubmit() {
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

	const doVerify =  async () => {
		console.log("in verify");
		console.log(razResponse);
		try {
			let  response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/razor/verify/${orderId}/${razResponse.razorpay_payment_id}/${razResponse.razorpay_signature}`);	
			console.log(response.data);
			alert("Verify Success");		
		} catch (e) {
			alert("Verify Failed");
		}
	}
	
	function handleRazor(response)  {
		console.log("in handleRazor");
		//console.log(orderId);
		if (orderId == response.razorpay_order_id) {
			//console.log("Order Id matched");
			razResponse = response;
			doVerify();
		} else {
			alert("Order Id mismatch");
		}
	}

	async function handleSubmit() {
    //console.log(amount);
    //console.log(minBalance);
    // currently disable calling razor pay
    alert("Awaiting Govt. regulatory permissions to enable Payment gateway.\n\nKindly contact 9920301805 for payment over WhatsApp / SMS.");
    return;
    
		if (amount < minBalance)  {
			alert("Invalid Amount. Minimum amount required is "+minBalance);
			return;
		}
    
		try {
			let  response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/razor/order/${amount}/${currentCurrency}`);	
				let myOpt = response.data;
				console.log(myOpt);
				setRazOpt(myOpt);
				myOpt["handler"] = handleRazor;
				setOrderId(myOpt.order_id);
				console.log(myOpt);
				var rzp1 = new Razorpay(myOpt);
				rzp1.open();
			} 
			catch (e) {
				console.log(e);
				console.log("Checkout failure");
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

	if (currencyList.length === 0) return null;
  return (
    <Container component="main" maxWidth="xs">
       <DisplayBalance wallet={balance.wallet} bonus={balance.bonus}/>
      <CssBaseline />
      <div align="center" className={gClasses.paper}>
      <Typography component="h1" variant="h5">
        Add to Wallet
      </Typography>
			<BlankArea />
      <ValidatorForm className={gClasses.form} onSubmit={handleSubmit}>
			<Grid container justifyContent="center" alignItems="center" >
				<GridItem xs={8} sm={8} md={8} lg={8} >
					<TextValidator variant="outlined" required type="number" min={minBalance} step="1" 
						id="amount" label="Add amount" name="amount"
						//defaultValue={amount}
						value={amount}
            validators={['required', minCond, 'isNumeric']}
            errorMessages={['Member count to be provided', minMessage, 'Fraction not allowed']}
						onChange={(event) => setAmount(event.target.value)}
						error={error.amount}
						helperText={helperText.amount}
					/>
				</GridItem>
				<GridItem xs={4} sm={4} md={4} lg={4} >
					<VsSelect fullWidth={true} align="center" value={currentCurrency} options={currencyList} 
						field="name" onChange={(event) => changeCurrency(event.target.value) } />
				</GridItem>
				<GridItem xs={12} sm={12} md={12} lg={12} >
					{(currentCurrency !== "INR") &&
            <div align="center">
						<Typography className={gClasses.patientInfo2Blue}>Exchange rate {currentCurrency} / INR is {currentRate.toFixed(2)}</Typography>
						<Typography className={gClasses.info14Blue}>(Includes Bank charges for currency conversion)</Typography>
            </div>
					}
				</GridItem>
			</Grid>
      <BlankArea/>
      <ShowResisterStatus/>
      <BlankArea/>
      {/*<Button
        type="submit"
        variant="contained"
        color="primary"
        className={gClasses.submit}
      >
        Add
			</Button>*/}
			<VsButton type="submit" name="Add" />
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
