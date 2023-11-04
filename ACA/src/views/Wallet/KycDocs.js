import React, { useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
// import TextField from '@material-ui/core/TextField';
// import Grid from '@material-ui/core/Grid';
// import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
// import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
// import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
import axios from "axios";
import useScript from './useScript';
import { setTab }from "CustomComponents/CricDreamTabs";
import { BlankArea } from 'CustomComponents/CustomComponents';
var request= require('request');
// import { UserContext } from "../../UserContext";
// import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
// import { useHistory } from "react-router-dom";
// import {validateSpecialCharacters, validateEmail, cdRefresh} from "views/functions.js";
// import { red, deepOrange } from '@material-ui/core/colors';
// var Insta = require('instamojo-nodejs');




//const INSTAMOJOSCRIPT="https://js.instamojo.com/v1/checkout.js";
const COUNTPERPAGE=5;




export default function KycDocs(props) {

  //const history = useHistory();
  // const classes = useStyles();
  const gClasses = globalStyles();

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [registerStatus, setRegisterStatus] = useState(0);
  const [message, setMessage] = useState("");
  const [rowsPerPage, setRowsPerPage] = React.useState(COUNTPERPAGE);
  const [emptyRows, setEmptyRows] = React.useState(0);
  const [page, setPage] = React.useState(0);

  // havew we comw via route
  console.log("Wallet", localStorage.getItem("menuValue"));
  // console.log("dateils from Insta",
  // sessionStorage.getItem("payment_id"),
  // sessionStorage.getItem("payment_status"),
  // sessionStorage.getItem("payment_request_id")
  // );
  useEffect(() => {
    const WalletInfo = async () => {
      try {
        // get user details
        // get wallet transaction and also calculate balance
        var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/wallet/details/${localStorage.getItem("uid")}`);
        setTransactions(response.data);
        let myempty = rowsPerPage - Math.min(rowsPerPage, response.data.length - page * rowsPerPage);
        setEmptyRows(myempty);

        let myBalance = response.data.reduce((accum,item) => accum + item.amount, 0);
        setBalance(myBalance);
      } catch (e) {
          console.log(e)
      }
    }
    WalletInfo();
  }, []);

  function ShowResisterStatus() {
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
  const handleChangePage = (event, newPage) => {
    event.preventDefault();
    setPage(newPage);
    let myempty = rowsPerPage - Math.min(rowsPerPage, transactions.length - newPage * rowsPerPage);
    setEmptyRows(myempty);

  };


  function handleAddWallet() {
    setTab(process.env.REACT_APP_ADDWALLET);
  }

  function handleWithdraw() {
    setTab(process.env.REACT_APP_WITHDRAWWALLET);
  }


  function WalletButton() {
    return (
      <div>
      <Button type="submit" variant="contained" color="primary"
        onClick={handleAddWallet}
        className={gClasses.button}>Add to Wallet
      </Button>
      <Button type="submit" variant="contained" color="primary" 
       onClick={handleWithdraw}
        className={gClasses.button}>Withdraw
     </Button>
     </div>
    )
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={gClasses.paper}>
        <Typography component="h1" variant="h5">Upload KYC Documents</Typography>
        <ShowResisterStatus />
        <TableContainer>
        <Table>
        <TableHead p={0}>
            <TableRow align="center">
            <TableCell className={gClasses.th} p={0} align="center">Date</TableCell>      
            <TableCell className={gClasses.th} p={0} align="center">Type</TableCell>
            <TableCell className={gClasses.th} p={0} align="center">Amount</TableCell>
            </TableRow>
        </TableHead>
        < TableBody>
            {transactions.slice(page * rowsPerPage, (page + 1) * rowsPerPage )
            .map( (item, index) => {
              return (
                <TableRow key={index}>
                  <TableCell  className={gClasses.td} p={0} align="center" >
                    {item.date}
                  </TableCell>
                  <TableCell  className={gClasses.td} p={0} align="center" >
                    {item.type}
                  </TableCell>
                  <TableCell  className={gClasses.td} p={0} align="center" >
                    {item.amount}
                  </TableCell>
                </TableRow>
              )
            })}
        </TableBody> 
        </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[COUNTPERPAGE]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          // onChangeRowsPerPage={handleChangeRowsPerPage}
        />
        <BlankArea />
        <WalletButton />
      </div>
    </Container>
  );
}
