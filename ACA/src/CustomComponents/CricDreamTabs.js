import React, { useEffect } from 'react';


/* 
import { createBrowserHistory } from "history";

*/

import { useHistory } from "react-router-dom";
import { useParams } from 'react-router-dom'
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';

import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu'; 
import {red, blue, green, deepOrange} from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
/// cd items import

import Area from "views/Area/Area"
import User from "views/User/User"
import Faculty	 from "views/Faculty/Faculty"
import FacultySchedule	 from "views/Faculty/FacultySchedule"
import Student	 from "views/Student/Student"
import Batch	 from "views/Batch/Batch"
import Session	 from "views/Session/Session"
import BatchAddEdit	 from "views/Batch/BatchAddEdit"
import SessionAddEdit	 from "views/Session/SessionAddEdit"
import Payment	 from "views/Payment/Payment"
import Inquiry	 from "views/Inquiry/Inquiry"
import InquiryAddEdit	 from "views/Inquiry/InquiryAddEdit"
import Summary	 from "views/Summary/Summary"


import AdminWallet from "views/Wallet/AdminWallet"
import Wallet from "views/Wallet/Wallet.js"
import Update from "views/UpgradeToPro/Update.js"
import AddWallet from "views/Wallet/AddWallet";
import WithdrawWallet from "views/Wallet/WithdrawWallet";

import Profile from "views/Profile/UserProfile"
import ChangePassword from "views/Login/ChangePassword.js"
import About from "views/APL/About.js";
import Home from "views/APL/Home.js";
import ContactUs from "views/APL/ContactUs.js";
import Modal from 'react-modal';
// import download from 'js-file-downloader';
import { BlankArea } from './CustomComponents';
import {cdRefresh, specialSetPos, upGradeRequired, 
  downloadApk, clearBackupData,
  checkIdle, setIdle,
  internalToText, textToInternal,
	isAdmin, isFaculty, isManager,
} from "views/functions.js"
import { LocalSee } from '@material-ui/icons';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : '#000000',
    color                 : '#FFFFFF',
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  noSpacing: { 
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(0),
    marginRight: theme.spacing(1),
  },
  menuButton: {
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  icon : {
    color: '#FFFFFF',
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(2),
  },
  statButton: {
    //marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  teamButton: {
    marginRight: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  dashButton: {
    // marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
  },
  new: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: '#FFFFFF'
  },
  whatIsNew: {
    backgroundColor: '#B3E5FC',
    color: '#000000',
    fontWeight: theme.typography.fontWeightBold,
  },
  title: {
    flexGrow: 1,
  },
  avatar: {
    margin: theme.spacing(0),
    // backgroundColor: theme.palette.secondary.main,
    // width: theme.spacing(10),
    // height: theme.spacing(10),
  
  },
  avatar1: {
    margin: theme.spacing(0),
    backgroundColor: 'white',		//deepOrange[500],  //'#FFFFFF',
    color: 'black', 
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
  },
}));

export function setTab(num) {
  
  //myTabPosition = num;
  //console.log(`Menu pos ${num}`);
  sessionStorage.setItem("menuValue", num);
  cdRefresh();
}

export function AcaTabs() {
  const history = useHistory();
  const classes = useStyles();
  // for menu 
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // for group menu
  const [grpAuth, setGrpAuth] = React.useState(true);
  const [grpAnchorEl, setGrpAnchorEl] = React.useState(null);
  const grpOpen = Boolean(grpAnchorEl);
  const [arunGroup, setArunGroup] = React.useState(false);
  const [value, setValue] = React.useState(0);
  const [upgrade, setUpgrade] = React.useState(false);
  const [modalIsOpen,setIsOpen] = React.useState(true);
  const [userGroup, setUserGroup] = React.useState([]);
  const [latestApk, setLatestApk] = React.useState(null);

  //console.log(location.pathname);

  useEffect(() => {       
    const checkVersion = async () => {
      //console.log("about to call upgrade");
      let upg = await upGradeRequired();
      // console.log(upg);
      if (upg.latest) setLatestApk(upg.latest);

      setUpgrade(upg.status);
      if (upg.status) setIsOpen(true);
    }
    function setMenuValue() {

      // check url
      let walletRouting = false;
      let x = location.pathname.split("/");
      if (x.length >= 3)
      if (x[1] === "apl")
      if (x[2] === "walletdetails") {
        walletRouting = true;
        // const { payment_id, payment_status,  payment_request_id} = useParams();
        //console.log("URLDATA", payment_id, payment_status, payment_request_id);
        let param = (x.length >= 4) ? x[3] : "";
        sessionStorage.setItem("payment_id", param)
        param = (x.length >= 5) ? x[4] : "";
        sessionStorage.setItem("payment_status", param)
        param = (x.length >= 6) ? x[5] : "";
        sessionStorage.setItem("payment_request_id", param)
      }
      
      if (walletRouting) {
        sessionStorage.setItem("menuValue", process.env.REACT_APP_WALLET);
        history.push("/");
      } else if (checkIdle()) {
        sessionStorage.setItem("menuValue", process.env.REACT_APP_HOME);
      } 
      setValue(parseInt(sessionStorage.getItem("menuValue")));
      setIdle(false);
    }
    // Version check is now done in Home component
    // if (value === parseInt(process.env.REACT_APP_HOME))
    //   checkVersion();  
    
    setMenuValue();

    // console.log("Params",
    //   sessionStorage.getItem("param1"),
    //   sessionStorage.getItem("param2"),
    //   sessionStorage.getItem("param3")
    // );

}, []);


  //console.log(`in Tab function  ${sessionStorage.getItem("menuValue")}`);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function handleGrpMenu(event) {
    setGrpAnchorEl(event.currentTarget);
    // console.log(event.currentTarget);
    var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/group/memberof/${sessionStorage.getItem("uid")}`;
    axios.get(myUrl).then((response) => {
      let allGroups = response.data[0].groups;
      if (allGroups.length > 0) {
        let tmp = allGroups.find(x => x.defaultGroup == true);
        if (!tmp) {
          tmp = allGroups[0];
          tmp.defaultGroup = true;
          sessionStorage.setItem("gid", tmp.gid.toString());
          sessionStorage.setItem("groupName", tmp.groupName);
          sessionStorage.setItem("tournament", tmp.tournament);
          sessionStorage.setItem("admin", tmp.admin);
          // clearBackupData();
        }
      }
      setUserGroup(allGroups);
      // console.log('Everything is awesome.');
      setArunGroup(true);
    }).catch((error) => {
      //console.log('Not good man :(');
      console.log(error);
      setUserGroup([]);
      setArunGroup(true);
    })
  };

  async function handleGroupSelect(index) {
    setArunGroup(false);
    let gRec = userGroup[index];
    try {
      await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setdefaultgroup/${sessionStorage.getItem("uid")}/${gRec.gid}`);
      sessionStorage.setItem("gid", gRec.gid);
      sessionStorage.setItem("groupName", gRec.groupName);
      sessionStorage.setItem("tournament", gRec.tournament);
      sessionStorage.setItem("admin", gRec.admin);
      clearBackupData();
      cdRefresh();
    } catch (e) {
      console.log(e);
      console.log("error setting default group");
    }
  }
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGrpClose = () => {
    setGrpAnchorEl(null);
    setArunGroup(false);
  };

  function setMenuValue(num) {
    setValue(num);
    handleClose();
    sessionStorage.setItem("menuValue", num);
  }

  const handleDash = () => { setMenuValue(1);  }
  const handleStat = () => { setMenuValue(2);  }
  const handleTeam = () => { setMenuValue(3);  }
  const handleHome = () => { setMenuValue(4);  }
	
	
	const handleArea = () => { handleClose(); setMenuValue(9001);}
	const handleUser = () => { handleClose(); setMenuValue(9002);}
	const handleStudent = () => { handleClose(); setMenuValue(9003);}
	const handleFaculty = () => { handleClose(); setMenuValue(9004);}
	const handleFacultySchedule = () => { handleClose(); setMenuValue(90041);}
	const handleBatch = () => { handleClose(); setMenuValue(9005);}
	const handleBatchAddEdit = () => { handleClose(); setMenuValue(90051);}
	const handleSessionAddEdit = () => { handleClose(); setMenuValue(90061);}
	const handleSession = () => { handleClose(); setMenuValue(9006);}
	const handlePayment = () => { handleClose(); setMenuValue(9007);}
	const handleInquiry = () => { handleClose(); setMenuValue(9008);}
	const handleInquiryAddEdit = () => { handleClose(); setMenuValue(90081);}
	const handleSummary = () => { handleClose(); setMenuValue(9009);}
	
  const handleMatch = () => { handleClose(); setMenuValue(101);}
  const handleAuction = () => { handleClose(); setMenuValue(102);}
  const handleCaptain = () => { handleClose(); setMenuValue(103);}
  const handleGroup = () => { handleGrpClose(); setMenuValue(104);}
  const handleWallet = () => { handleClose(); setMenuValue(105);}
  const handleProfile = () => { handleClose(); setMenuValue(106);}
  const handlePassword = () => { handleClose(); setMenuValue(107);}
  // 108 for add wallet
  const handleHelpDesk = () => { handleClose(); setMenuValue(201);}
  const handleContactUs = () => { handleClose(); setMenuValue(202);}
  const handlePointSystem = () => { handleClose(); setMenuValue(203);}
  const handleAbout = () => { handleClose(); setMenuValue(204);}
	
  const handleSuTournament = () => { handleClose(); setMenuValue(301);}
  const handleSuPlayer = () => { handleClose(); setMenuValue(302);}
  const handleSuImage = () => { handleClose(); setMenuValue(303);}

  const handleUpdate = () => { handleClose(); setMenuValue(304);}

  const handleGroupNew = () => { handleGrpClose(); setMenuValue(1001);}
  const handleGroupJoin = () => { handleGrpClose(); setMenuValue(1002);}
  const handleGroupDetails = () => { handleGrpClose(); setMenuValue(1003);}
  const handlePlayerStat = () => { handleGrpClose(); setMenuValue(1004);}
  const handleAdminWallet = () => { handleGrpClose(); setMenuValue(1005);}

  const handleLogout = () => {
    handleClose();
    sessionStorage.setItem("uid", "");
    //sessionStorage.setItem("menuValue", process.env.REACT_APP_DASHBOARD);
    cdRefresh();  
  };

  function Show_Supervisor_Options() {
    if (true) {  //sessionStorage.getItem("userPlan") == process.env.REACT_APP_SUPERUSER) {  
      return (
        <div>
        <MenuItem onClick={handleBatch}>Batch</MenuItem>
        <MenuItem onClick={handleFaculty}>Faculty</MenuItem>
        <MenuItem onClick={handleStudent}>Student</MenuItem>
        {/* <MenuItem onClick={handleSuImage}>SU Load Image</MenuItem> */}
        <Divider />
        </div>)
    } else {
      return null;
    }
  }

  function DisplayCdItems() {
		//console.log(value);
    switch(value) {
      case 4: return <Home />;
      case 105: return <Wallet />;
      case 106: return <Profile />;
      case 107: return <ChangePassword />;
      case 108: return <AddWallet />
      case 109: return <WithdrawWallet />
      case 202: return <ContactUs />;
			case 204: return <About />;
      case 304: return <Update />;
      case 1005: return <AdminWallet />;
			case 9001: return <Area />;
			case 9002: return <User />;
			case 9003: return <Student />;
			case 9004: return <Faculty />;
			case 90041: return <FacultySchedule />
			case 9005: return <Batch />;
			case 90051: return <BatchAddEdit />;
			case 9006: return <Session />;
			case 90061: return <SessionAddEdit />;
			case 9007: return <Payment />;
			case 9008: return <Inquiry />;
			case 90081: return <InquiryAddEdit />;
			case 9009: return <Summary />;
			
      default: return  <Typography>{`Inavlid value ${value}`}</Typography>;
    }
  }

  async function handleUpgrade() {
    //console.log("upgrade requested");
    closeModal();
    await downloadApk();
    console.log("APK has to be downloaded");
  }

  function openModal() { setIsOpen(true); }
 
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }
 
  function closeModal(){ setIsOpen(false); }

  function DisplayUpgrade() {
    //console.log(`Upgrate: ${upgrade} Menu Item:   ${value}`)
    // console.log("Current",process.env.REACT_APP_VERSION);
    if (upgrade)
      return(
        <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        {/* <Typography className={classes.new} align="center">
          Current Version {process.env.REACT_APP_VERSION}
        </Typography> */}
        <Typography className={classes.new} align="center">
          Latest Version {latestApk.version}
        </Typography>
        <BlankArea/>
        <Typography className={classes.new} align="center">
          What is new
        </Typography>
        <TextField variant="outlined" multiline fullWidth disabled
          id="producttext"
          // label="What is new" 
          className={classes.whatIsNew}
          defaultValue={latestApk.text} 
        />
        <BlankArea />
        <Button align="center" key="upgrade" variant="contained" color="primary" size="medium"
        className={classes.dashButton} onClick={handleUpgrade}>Update Now
        </Button>
      </Modal>
      )
    else
      return(null);
  }

 
  let mylogo = `${process.env.PUBLIC_URL}/APLLOGO1.ICO`;
  let groupCharacter="G";
  let currencyChar = 'U';  //'₹';
	//console.log(value);
  let myName = sessionStorage.getItem("userName");
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.noSpacing}>
          {auth && (
            <div>
						<MenuIcon className={classes.icon} onClick={handleMenu} />
              <Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{vertical: 'top', horizontal: 'left', }}
                // keepMounted
                transformOrigin={{vertical: 'top', horizontal: 'right', }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleWallet}>Wallet</MenuItem>
                <Divider/>
								<MenuItem onClick={handleAbout}>About</MenuItem> 
                <MenuItem onClick={handleContactUs}>Contact Us</MenuItem>                  
                {(process.env.REACT_APP_DEVICE === "APK") && 
                <div>
                  <Divider/>
                  <MenuItem onClick={handleUpdate}>Update</MenuItem>
                </div>
                }
                <Divider/>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          )}
					<HomeIcon className={classes.icon} onClick={handleHome} />
					{(isAdmin()) &&
						<div>
						<Button color="inherit" className={classes.dashButton} onClick={handleInquiry}>Inquiry</Button>
						<Button color="inherit" className={classes.teamButton} onClick={handleSummary}>Summary</Button>
						<Button color="inherit" className={classes.statButton} onClick={handlePayment}>Payment</Button>
						</div>
					}
					{(isManager()) &&
						<div>
						<Button color="inherit" className={classes.statButton} onClick={handlePayment}>Payment</Button>
						<Button color="inherit" className={classes.statButton} onClick={handleSession}>Session</Button>
						<Button color="inherit" className={classes.statButton} onClick={handleBatch}>Batch</Button>
						</div>
					}
					{(isFaculty()) &&
						<div>
						<Button color="inherit" className={classes.statButton} onClick={handleSession}>Session</Button>
						<Button color="inherit" className={classes.statButton} onClick={handleBatch}>Batch</Button>
						<Button color="inherit" className={classes.statButton} onClick={handleFaculty}>Faculty</Button>
						</div>
					}
					{/*<Avatar 
            aria-label="account of current user"
            aria-controls="user-appbar"
            aria-haspopup="true"
            onClick={handleUser}
            color="inherit"
            variant="circular" className={classes.avatar1}>{currencyChar}
          </Avatar>*/}
       </Toolbar>
      </AppBar>
      <DisplayCdItems/>
      {/* <DisplayUpgrade/> */}
    </div>
  );
}