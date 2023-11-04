import React, { useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import BlueCheckbox from 'components/CheckBox/BlueCheckbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
import axios from "axios";
import useScript from './useScript';
import { setTab }from "CustomComponents/CricDreamTabs";
import { BlankArea, JumpButton2, 
  DisplayCancel,
  DisplayBalance,
} from 'CustomComponents/CustomComponents';
import Modal from 'react-modal';
import modalStyles from 'assets/modalStyles';
import {
  validateSpecialCharacters, validateEmail, cdRefresh, validateInteger, validateUpi,
  encrypt, decrypt,
  ifscBank, ifscBranch, ifscCity, ifscNeft, 
  validateAadhar,
} from "views/functions.js";
import { Divider } from '@material-ui/core';
import { blue, red, brown, deepOrange } from '@material-ui/core/colors';



const useStyles = makeStyles((theme) => ({
  saveText: {
    color: blue[900],
    fontWeight: theme.typography.fontWeightBold,
  },
  note1: {
    color: brown[900],
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  note2: {
    color: blue[900],
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.pxToRem(14),
  },
  useBank: {
    color: blue[900],
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
  },
  root: {
    width: '100%',
    // backgroundColor: '#84FFFF'
    // backgroundColor: '#A1887F'
  },
  withTopSpacing: {
    marginTop: theme.spacing(1),
  },
  jumpButton: {
    marginTop: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    color: deepOrange[700],
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '16px',
    width: theme.spacing(40),
  },
  dashButton: {
    // marginRight: theme.spacing(2),
    //marginLeft: theme.spacing(2),
  },
  new: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: blue[900],
  },
  text: {
    //backgroundColor: '#FFFF00',
    color: '#FFFFFF',
    fontWeight: theme.typography.fontWeightBold,
  },  
  data: {
    // backgroundColor: '#FFFF00',
    color: '#FFFFFF',
    fontWeight: theme.typography.fontWeightBold,
  },  
  ngCard: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
    color: deepOrange[900],
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  groupName:  {
    // right: 0,
    fontSize: '16px',
    fontWeight: theme.typography.fontWeightBold,
    color: deepOrange[700],
    alignItems: 'center',
    marginTop: '0px',
  },
  error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      alignItems: 'center',
      marginTop: '0px',
  },
  updatemsg:  {
      // right: 0,
      fontSize: '12px',
      color: blue[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
  },
  hdrText:  {
      // right: 0,
      // fontSize: '12px',
      // color: red[700],
      // // position: 'absolute',
      align: 'center',
      marginTop: '0px',
      marginBottom: '0px',
  },
}));


export default function WithdrawWallet(props) {

  //const history = useHistory();
  const classes = useStyles();
  const gClasses = globalStyles();

  const [error, setError] = useState({});
  const [helperText, setHelperText] = useState({});
  const [modalIsOpen,setIsOpen] = useState(false);

  const [balance, setBalance] = useState({wallet: 0, bonus: 0});
  // const [transactions, setTransactions] = useState([]);

  const [amount, setAmount] = useState(1);
  const [account, setAccount] = useState("");
	const [repeatAccount, setRepeatAccount] = useState("");
	const [ifsc, setIfsc] = useState("");

  const [name, setName] = useState("");
  // const [aadhar, setAadhar] = useState("")

  const [upi, setUpi] = useState("");
  const [useBank, setUseBank] = useState(true);

  const [bank, setBank] = useState("");
	const [branch, setBranch] = useState("");
	const [city, setCity] = useState("");
  const [saveData, setSaveData] = useState(false);

  const [updateInProgress, setUpdateInProgress] = useState(false);

  // const [kycPending, setKycPending]  = useState(false);
  // const [submitText, setSubmitText] = useState("Submit")
  const [registerStatus, setRegisterStatus] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
	if (localStorage.getItem("saveBalance"))
      setBalance(JSON.parse(localStorage.getItem("saveBalance")));
	
    const walletInfo = async () => {
      try {
        let response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/balance/${localStorage.getItem("uid")}`);
        setBalance(response.data);
		localStorage.setItem("saveBalance", JSON.stringify(response.data));
      } catch (e) {
          console.log(e)
      }
    }
    const bankDetails = async () => {
      try {
        // get user details
        // get wallet transaction and also calculate balance
        var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/kyc/details/${localStorage.getItem("uid")}`);
        //console.log(response.data);
        //console.log(response.data.userName, response.data.bankAccount, response.data.bankIFSC);
        
        // db uses useUpi.  In this  form we are using useBank
        setUseBank(!response.data.use);

        let tmp = decrypt(response.data.bdata).split("-");
        //console.log(tmp.length);
        if (tmp.length === 3) {
          setName(tmp[0]);
          setAccount(tmp[1]);
          setRepeatAccount(tmp[1]);
          setIfsc(tmp[2])
        }

        tmp = decrypt(response.data.udata).split("-");
        //console.log(tmp.length);
        if (tmp.length === 3) {
          setUpi(tmp[1]);
        }

        console.log(response.data);

      } catch (e) {
          console.log(e)
      }
    }
    walletInfo();
    bankDetails();
  }, []);


  function openModal() { setIsOpen(true); }
   
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
 
  function closeModal(){ console.log("Close"); setIsOpen(false); }

  function ShowResisterStatus() {
    let myMsg;
    let errmsg = true;
    switch (registerStatus) {
      case 1001:
        myMsg = 'Error regsitering withdrawal';
      break;
      case 200:
        myMsg = `Successfully updated withdrawal of amount ${amount}`;
        errmsg = false;
      break;
      case 1100:
        myMsg = `Updating Withdrawal details.`;
        errmsg = false;
      break;
      case 1101:
        myMsg = `Saving Bank details for future transaction.`;
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
    return(
      <div>
        <Typography className={myClass}>{myMsg}</Typography>
      </div>
    );
  }
  
  function getInput() {
    //let aadStr =  document.getElementById("aadhar").value;
    let namStr = document.getElementById("name").value;
		let accStr = document.getElementById("account").value;
    let repAccStr = document.getElementById("repeatAccount").value;
		let ifscStr = document.getElementById("ifsc").value.toUpperCase();
		
    //setAadhar(aadStr);
    setName(namStr);
		setAccount(accStr);
    setRepeatAccount(repAccStr);
		setIfsc(ifscStr);
		return {
      //aadhar: aadStr,
      name: namStr,
		  account: accStr,
      repeatAccount: repAccStr,
		  ifsc: ifscStr,
		};
  }
	
  async function validate(eid, eid2) {
    getInput();
    let e = document.getElementById(eid);
    let myValue = e.value; 
    //console.log(eid, myValue);
    let newError=false;
    let newText = "";
    let sts;

    // eslint-disable-next-line default-case
    switch (eid) {
      case "amount":
        let amt = parseInt(myValue);
        if (!validateInteger(myValue)) {
          newError = true;
          newText = 'Amount should in multiple of Rupees';
        } else if (amt <= 0) {
          newError = true;
          newText = 'Withdrawal amount should be greater than 0';
        } else if (amt > balance) {
          newError = true;
          newText = `Withdrawal amount  cannot exceed ${balance}`;
        }
      break;
      case "aadhar":
        sts = await validateAadhar(myValue);
        //console.log("Aadhar Check:", sts);
        if (!sts) {
          newError = true;
          newText = 'Invalid Aadhar Number';
        } 
      break;
      case "upi":
        sts = await validateUpi(myValue);
        if (!sts) {
          newError = true;
          newText = 'Invalid UPI Code';
        } 
      break;
      case "name":
        if (!validateSpecialCharacters(myValue)) {
          newError = true;
          newText = 'Special characters not permitted';
        } 
      break;
      case "account":
        if (!validateInteger(myValue)) {
          newError = true;
          newText = "Account Number has to be numberic";
        }
      break;
      case "repeatAccount":
        let orgAcc = document.getElementById(eid2).value;
        if (myValue !== orgAcc) {
          newError = true;
          newText = "Account Number mismatch";
        }
      break;
      case "ifsc":
      //console.log("Setting ifsc as ", myValue);
      // setPassword(myValue);
      let mybank = await ifscBank(myValue);
      if (mybank === "") {
        newError = true;
        newText = 'Invalid IFSC Code';
      } else if (!ifscNeft(myValue)) {
        newError = true;
        newText = 'Neft not enabled';
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
	
  const handleChange = (event) => {
    setUseBank(event.target.checked);
  }

  const setBankMode = (event) => {
    // console.log("Bank mode", event.target.checked)
    setUseBank(event.target.checked ? true : false);
  }
  
  const setUpiMode = (event) => {
    // console.log("upi mode", event.target.checked)
    setUseBank(event.target.checked ? false : true);
    
  }

	const handleSubmit = async() => {
		//let x = getInput();
		let sts;
    setRegisterStatus(0);
    // sts = await validate("aadhar");
    // if (sts) return;
    
    sts = await validate("amount")
		if (sts) return;

    sts = await validate("name")
    if (sts) return;

    if (!useBank) {
      sts = await validate("upi")
		  if (sts) return;
    } else {
      sts = await validate("account")
      if (sts) return;
      sts = await validate("repeatAccount", "account")
      if (sts) return;
      sts = await validate("ifsc")
      if (sts) return;
      let code = ifsc.toUpperCase();
      let tmp = await ifscBank(code);
      setBank(tmp);
      tmp = await ifscBranch(code);
      setBranch(tmp);
      tmp = await ifscCity(code)
      setCity(tmp);
    }
	


    setMessage( (saveData) ?
      ((useBank) ? "BANK" : "UPI") + " details to be saved" :
      "Do not save BANK / UPI details"
    )

    console.log("Valid thru");

    openModal();
  }
	

  function WalletButton() {
    return (
      <JumpButton2 
        page1={process.env.REACT_APP_HOME} text1="Home"
        page2={process.env.REACT_APP_WALLET} text2="Wallet" 
      />
    )
  }

  async function handleConfirm() {
    setUpdateInProgress(true);
    closeModal();
    // alert("Confirmed by user. Refund to be initiated")
    try {
      // set withdraw
      setRegisterStatus(1100);
      let details, datatype;

      if (useBank) {
        details = encrypt(`${name}-${account}-${ifsc}`);
        datatype = 'bdata';
      } else {
        details = encrypt(`${name}-${upi}-UPI`);
        datatype = 'udata';
      }


      await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/withdraw/${localStorage.getItem("uid")}/${amount}/${details}`);
      setBalance(balance-amount);
      setRegisterStatus(200);

      // save bank details
      //NOTE:  updatebakn has been rename to "bdata" for security reasons
      if (saveData) {
        setRegisterStatus(1101);
        await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/kyc/${datatype}/${localStorage.getItem("uid")}/${details}`);
      }

      setTab(process.env.REACT_APP_WALLET)
    } catch (e) {
      setUpdateInProgress(false);
      console.log("error updating details")
      console.log(e)
    }
    //setSaveData(false);
  }

  return (
    <Container component="main" maxWidth="xs">
       <DisplayBalance wallet={balance.wallet} bonus={balance.bonus}/>
      <CssBaseline />
      <div className={gClasses.paper} align="center">
        <Typography component="h1" variant="h5">
        Withdraw from Wallet
        </Typography>
        <ValidatorForm className={gClasses.form} onSubmit={handleSubmit}>
        {/* <TextValidator variant="outlined" required fullWidth
          id="aadhar" label="Aadhar NUmber" name="aadhar"
          defaultValue={aadhar}
          onChange={(event) => setAadhar(event.target.value)}
          error={error.aadhar}
          helperText={helperText.aadhar}
        />
        <Divider /> */}
        <TextValidator variant="outlined" required fullWidth type="number" min="1" step="1" 
          id="amount" label="Withdrawal Amount" name="amount"
          //defaultValue={amount}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          error={error.amount}
          helperText={helperText.amount}
          disabled={updateInProgress}
        />    
		    <BlankArea/>
        <TextValidator variant="outlined" required fullWidth
          id="name" label="User Name" name="name"
          //defaultValue={name}
          value={name}
          onChange={(event) => setName(event.target.value)}
          error={error.name}
          helperText={helperText.name}
          disabled={updateInProgress}
        />
		    <BlankArea/>
        <div align="center">
        {/* <FormControlLabel align="left" className={classes.useBank}
          control={<Switch color="primary" checked={useBank} onChange={handleChange} aria-label="login switch" />}
          labelPlacement='start'
          label="Payment mode Bank"
        /> */}
        <FormControlLabel className={classes.useBank}
          control={<Radio color="primary" checked={useBank} onClick={setBankMode} aria-label="login switch" />}
          labelPlacement='start'
          label="Bank mode: "
        />
        <FormControlLabel className={classes.useBank}
          control={<Radio color="primary" checked={!useBank} onClick={setUpiMode} aria-label="login switch" />}
          labelPlacement='start'
          label="UPI mode: "
        />
        </div>
        <BlankArea/>
        <div className={(useBank) ? gClasses.show : gClasses.hide}>
        <TextValidator variant="outlined" fullWidth  type="password"
          id="account" label="Bank Account Number" name="account"
          //defaultValue={account}
          value={account}
          onChange={(event) => setAccount(event.target.value)}
          error={error.account}
          helperText={helperText.account}
          disabled={updateInProgress}
          required={useBank}
        />
		    <BlankArea/>
        <TextValidator variant="outlined" required fullWidth
          id="repeatAccount" label="Bank Account Number" name="repeatAccount"
          //defaultValue={repeatAccount}
          value={repeatAccount}
          onChange={(event) => setRepeatAccount(event.target.value)}
          error={error.repeatAccount}
          helperText={helperText.repeatAccount}
          disabled={updateInProgress}
          required={useBank}
        />
		    <BlankArea/>
        <TextValidator variant="outlined" required fullWidth
          id="ifsc" label="Bank IFSC Code" name="ifsc"
          //defaultValue={ifsc}
          value={ifsc}
          onChange={(event) => setIfsc(event.target.value.toUpperCase())}
          error={error.ifsc}
          helperText={helperText.ifsc}
          disabled={updateInProgress}
          required={useBank}
        />
        </div>
        <div className={(useBank) ? gClasses.hide : gClasses.show}>
        <TextValidator variant="outlined" required fullWidth
          id="upi" label="UPI Code" name="upi"
          //defaultValue={ifsc}
          value={upi}
          onChange={(event) => setUpi(event.target.value.toLowerCase())}
          error={error.upi}
          helperText={helperText.upi}
          disabled={updateInProgress}
          required={!useBank}
        />
        </div>
        <ShowResisterStatus/>
		    <BlankArea/>
        <FormControlLabel align="left" className={classes.saveText} 
          control={
            <BlueCheckbox 
              checked={saveData}
              onClick={() => setSaveData(event.target.checked)} 
              disabled={updateInProgress}
              name="saveDetails"  
            />
          }
          label={"Save " + (useBank ? "Bank" : "UPI") + " details for future transactions"}
        />
		    <BlankArea/>
        <Typography  >
        <span className={classes.note1}>Note: </span>
        <span className={classes.note2}>Amount will be transferred in 2 working days.</span>
        </Typography>
        <Button  type="submit" variant="contained" color="primary" className={gClasses.submit}
          disabled={updateInProgress}
        >
        Withdraw
        </Button>
	      </ValidatorForm>
        <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
          >
          {/* <DisplayCancel onCancel={closeModal} /> */}
          <Typography className={classes.new} align="center">
            Confirm Details
          </Typography>
          <BlankArea/>
          {/* <Typography >
            <span className={classes.text}>Aaadhar Number: </span>
            <span className={classes.data}>{aadhar}</span>
          </Typography> */}
          <Typography >
            <span className={classes.text}>Amount: </span>
            <span className={classes.data}>{amount}</span>
          </Typography>
          {/* <BlankArea /> */}
          <Typography >
            <span className={classes.text}>Name: </span>
            <span className={classes.data}>{name}</span>
          </Typography>
          {/* <BlankArea /> */}
          <div className={useBank ? gClasses.show : gClasses.hide} >
          <Typography >
            <span className={classes.text}>A/C# </span>
            <span className={classes.data}>{account}</span>
          </Typography>
          {/* <BlankArea /> */}
          {/* <Typography >
            <span className={classes.text}>Bank Details:</span>
          </Typography> */}
          {/* <BlankArea /> */}
          <Typography>
            <span className={classes.text}>Bank: </span>
            <span className={classes.data}>{bank}</span>
          </Typography>
          <Typography >
            <span className={classes.text}>Branch: </span>
            <span className={classes.data}>{branch}</span>
          </Typography>
          <Typography >
            <span className={classes.text}>IFSC Code: </span>
            <span className={classes.data}>{ifsc}</span>
          </Typography>
          <Typography >
            <span className={classes.text}>City: </span>
            <span className={classes.data}>{city}</span>
          </Typography>
          </div>
          <div className={useBank ? gClasses.hide : gClasses.show} >
          <Typography >
            <span className={classes.text}>UPI </span>
            <span className={classes.data}>{upi}</span>
          </Typography>
          </div>
          <BlankArea />
          <Typography >
            <span className={classes.data}>{message}</span>
          </Typography>
          <BlankArea/>
          <Button align="center" variant="contained" color="primary" size="medium"
            // className={classes.dashButton} 
            onClick={handleConfirm}>Confirm
          </Button>
        </Modal>
        <BlankArea />
        <WalletButton />
      </div>
    </Container>
  );
}
