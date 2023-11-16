import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { createBrowserHistory } from "history";
import { UserContext } from "./UserContext";
//import Admin from "layouts/Admin.js";
import "assets/css/material-dashboard-react.css?v=1.9.0";
// import { DesktopWindows } from "@material-ui/icons";
import { AcaTabs, setTab }from "CustomComponents/CricDreamTabs"
import axios from "axios";
import SignIn from "views/Login/SignIn.js";
import SignUp from "views/Login/SignUp.js";
import Welcome from "views/ACA/Welcome";
import ResetPassword from "views/Login/ResetPassword";
//import JoinGroup from "views/Group/JoinGroup.js"
import ForgotPassword from "views/Login/ForgotPassword.js";
import ForgotName from "views/Login/ForgotName";
import IdleTimer from 'react-idle-timer'
import { setIdle }from "views/functions.js"
import Wallet from "views/Wallet/Wallet";
import { PinDropSharp } from "@material-ui/icons";
import firebase  from 'firebase/app';
//import messaging from "firebase/messaging"
//import messaging from "firebase/messaging"

import { 
isMobile, cdRefresh, specialSetPos, 
encrypt, 
clearBackupData, downloadApk 
} from "views/functions.js"



const hist = createBrowserHistory();


function checkJoinGroup(pathArray) {
  let sts = false;
  if ((pathArray[1].toLowerCase() === "joingroup") && (pathArray.length === 3) && (pathArray[2].length > 0)) {
    sessionStorage.setItem("joinGroupCode", pathArray[2]);
    sts = true;
  }
  return sts;
}

function initCdParams() {
  sessionStorage.setItem("joinGroupCode", "");
  let ipos = 0;
  if ((sessionStorage.getItem("tabpos") !== null) &&
  (sessionStorage.getItem("tabpos") !== "") ) {
    ipos = parseInt(sessionStorage.getItem("tabpos"));
    if (ipos >= process.env.REACT_APP_BASEPOS) sessionStorage.setItem("tabpos", ipos-process.env.REACT_APP_BASEPOS);
  } else
    sessionStorage.setItem("tabpos", 0);
  //console.log(`ipos: ${ipos}   Tabpos ${sessionStorage.getItem("tabpos")}`)
}

function isUserLogged() {
  //console.log("User is", sessionStorage.getItem("uid"));
  if ((sessionStorage.getItem("uid") === "") || 
      (sessionStorage.getItem("uid") === "0") ||
      (sessionStorage.getItem("uid") === null))
    return false;
  else
    return true;
}

function checkResetPasswordRequest() {
	let resetLink = "";
	let x = location.pathname.split("/");
  //console.log("Path is");
  //console.log(x);
	if (x.length >= 4)
	if (x[1] === "aplmaster")
	if (x[2] === "resetpasswordconfirm") {
		resetLink = x[3];
	}
	return resetLink;
}


function AppRouter() {
  //let history={hist}
	
  const [user, setUser] = useState(null);
	const [fireToken, setFireToken] = useState("");
	
  const value = useMemo(() => ({ user, setUser }), [user, setUser]);
  var idleTimer = null;
  
  // console.log(`000. User is ${sessionStorage.getItem("uid")}`)
  
  async function handleOnActive (event) {
    // console.log('user is active', event);
  }

  async function handleOnAction (event) {
    // console.log(`Action from user ${sessionStorage.getItem("uid")}`);
  }


  async function handleOnIdle (event) {
    // console.log('user is idle', event);
    // console.log('last active', idleTimer.getLastActiveTime());
    setIdle(true);
  }



  function DispayTabs() {
    let isLogged = isUserLogged();
    //console.log("Login status", isLogged)
    if (isLogged) {
      // console.log("User is logged");
      let timeoutvalue = parseInt(process.env.REACT_APP_IDLETIMEOUT) * 1000;
      return (
        <div>
          <AcaTabs/>
        </div>
      )  
    } else {
      //console.log("New login requested");
      if (sessionStorage.getItem("currentLogin") === "SIGNUP")
        return (<SignUp/>)
      else if (sessionStorage.getItem("currentLogin") === "RESET")
        return (<ForgotPassword/>);
      else if (sessionStorage.getItem("currentLogin") === "FORGOTNAME")
        return (<ForgotName/>);
      else if (sessionStorage.getItem("currentLogin") === "SIGNIN")
        return (<SignIn/>)
      else {
				let userId = checkResetPasswordRequest();
				//console.log("MyID", userId);
				if (userId !== "") {
					sessionStorage.setItem("currentUserCode", userId);
					hist.push("/");
					//console.log(history, hist);
					return (<ResetPassword />);
				} else {
					//console.log("sign in to be called");
					return (<SignIn/>)
				}
			}
    }
  }

  // logic before displaying component
  // window.onbeforeunload = () => Router.refresh();
  //console.log("in before unload");

  initCdParams();

  let mypath = window.location.pathname.split("/");
  if (checkJoinGroup(mypath)) {
    //console.log("join group found");
    sessionStorage.setItem("tabpos", 105);
    //history.push("/")
  } 

  // return (
  // <Router history={hist}> 
  //     <UserContext.Provider value={value}>
  //       {!user && <Redirect from="/" to="/signIn" />}
  //       <Route path="/joingroup" component={JoinGroup} />
  //       <Route path="/admin" component={value ? Admin : SignIn} />
  //       <Redirect from="/" to="/signIn" />
  //     </UserContext.Provider>
  //   </Router>
  // );

if ((true) && (process.env.REACT_APP_DEVICE === "WEB")) {
	const arhamFireBaseconfig = {
		apiKey: "AIzaSyBqJAEVFJOsrztnMrIqO0tfGmisU95Plrk",
		authDomain: "aplclient.firebaseapp.com",
		projectId: "aplclient",
		storageBucket: "aplclient.appspot.com",
		messagingSenderId: "1018469539659",
		appId: "1:1018469539659:web:102ea6f8c5cf39dda9d2ce",
		measurementId: "G-4RN59HCLKD"
	};
  // Firebase 8.3.2 package
	const arhamFireBase = firebase.initializeApp(arhamFireBaseconfig);
  //console.log(arhamFireBase);
  //const arhamFireMsg = messaging.getMessaging(arhamFireBase);
  //console.log(arhamFireMsg);
    /*
	const messaging = fireAPL.messaging();
	  // get the FIREBASE token and save it. We will send it to server in Home page
    messaging.requestPermission().then(()=>{
      return messaging.getToken()
    }).then(token=> {
      console.log('Token : ',token);
			sessionStorage.setItem("token", token);
			console.log("Done");
    }).catch((err)=>{
      console.log(err); 
	  })
*/
}


  return (
    <Router history={hist}> 
    <UserContext.Provider value={value}>
    {/* <Route path="/apl/walletdetails" component={Dummy} /> */}
    {/* <Route path="/apl/walletadd" component={Dummy} /> */}
    </UserContext.Provider>
    <DispayTabs />
    </Router>
  );

}

export default AppRouter;
