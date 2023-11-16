import React, { useEffect, useState, useContext } from 'react';
import Container from '@material-ui/core/Container';
import { spacing } from '@material-ui/system';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
// import { Switch, Route, Link } from 'react-router-dom';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select, { SelectChangeEvent } from '@material-ui/core/Select';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import { UserContext } from "../../UserContext";
import { DisplayPageHeader, BlankArea, JumpButton } from 'CustomComponents/CustomComponents.js';
import { encrypt, clearBackupData, hasGroup, upGradeRequired, downloadApk } from 'views/functions';
import { red, blue, deepOrange } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from "@material-ui/core/CardActions";
import CardFooter from "components/Card/CardFooter.js";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {setTab} from "CustomComponents/CricDreamTabs.js"
import Divider from '@material-ui/core/Divider';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import IconButton from '@material-ui/core/IconButton';
import Modal from 'react-modal';
import modalStyles from 'assets/modalStyles';

import VsButton from "CustomComponents/VsButton";
import VsCancel from "CustomComponents/VsCancel";
import VsRadio from "CustomComponents/VsRadio";
import VsSelect from "CustomComponents/VsSelect";

const CHECKBALANCE_CREATEJOIN = true;

// import NEWTOURNAMENTIMAGE from `${process.env.PUBLIC_URL}/NEWTOURNAMENT.JPG`;

/*
const cardStyles = {
  cardImage: {
      // backgroundImage: `url(${process.env.PUBLIC_URL}/NEWTOURNAMENT.JPG)`,
      height: '20px'
  }
};
*/

const useStyles = makeStyles((theme) => ({
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
		nonerror:  {
			// right: 0,
			fontSize: '12px',
			color: blue[700],
			alignItems: 'center',
			marginTop: '0px',
			fontWeight: theme.typography.fontWeightBold,
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


const LASTSTAGE = 3;

export default function Home() {
    // const { setUser } = useContext(UserContext);
    // window.onbeforeunload = () => setUser("")
    const classes = useStyles();
		const gClasses = globalStyles();
    const [tournamentList, setTournamentList] = useState([]);
    const [registerStatus, setRegisterStatus] = useState(0);
    const [currentTournament, setCurrentTournament] = useState("");
    const [upgrade, setUpgrade] = React.useState(false);
    const [modalIsOpen,setIsOpen] = React.useState("");
    const [latestApk, setLatestApk] = React.useState(null);

    const [demo, setDemo] = React.useState(false);
    const [stage, setStage] = React.useState(0);
		//const [groupCost, setGroupCost] = React.useState(0);
		//const [lowBalance, setLowBalance] = React.useState(false);
		const [lowBalanceText, setLowBalanceText] = React.useState("");
		
    const [userGroup, setUserGroup] = React.useState([]);
    const [defaultGroup, setDefaultGroup] = React.useState("");
    const [currentGroup, setCurrentGroup] = useState("");

    const [startDownload, setStartDownload] = useState(false);
		const [downloadMessage, setDownloadMessage] = useState("");
    const [firstTime, setFirstTime] = useState(true);
		const [curretDrawer, setCurrentDrawer] = useState("");
		
    useEffect(() => {

      if (firstTime) {
        if (localStorage.getItem("home_tournamentList"))
            setTournamentList(JSON.parse(localStorage.getItem("home_tournamentList")));

        if (localStorage.getItem("home_groupList"))
            setUserGroup(JSON.parse(localStorage.getItem("home_groupList")));

        setFirstTime(false);
      }

      const checkVersion = async () => {
        if (process.env.REACT_APP_DEVICE !== "APK") return null;
        
        let upg = await upGradeRequired();
        console.log(`Update required: ${upg.status}`);
        if (upg.latest) setLatestApk(upg.latest);
  
        setUpgrade(upg.status);
        if (upg.status) setIsOpen("UPGRADE");
      }
      const origgetTournamentList = async () => {
        var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/list/notstarted`); 
        setTournamentList(response.data);
        // if (response.data.length > 0) {
        //   setCurrentTournament(0);
        // }
      }
      const getTournamentList = () => {
        let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/list/notstarted`;
        axios.get(myUrl).then((response) => {
          setTournamentList(response.data);
          localStorage.setItem("home_tournamentList", JSON.stringify(response.data));
        }).catch((error) => {
          console.log('Tournamnet fetch Not good man :(');
          console.log(error);
        })        
      }
      const getGroups = () => {

        if (!hasGroup()) return;

        let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/group/memberof/${localStorage.getItem("uid")}`;
        axios.get(myUrl).then((response) => {
          let allGroups = response.data[0].groups;
          setUserGroup(allGroups);
          localStorage.setItem("home_groupList", JSON.stringify(allGroups));

          if (allGroups.length > 0) {
            let tmp = allGroups.find(x => x.defaultGroup == true);
            if (!tmp) {
              tmp = allGroups[0];
              tmp.defaultGroup = true;
              localStorage.setItem("gid", tmp.gid.toString());
              localStorage.setItem("groupName", tmp.groupName);
              localStorage.setItem("tournament", tmp.tournament);
              localStorage.setItem("admin", tmp.admin);
              clearBackupData();
              setDefaultGroup(tmp.groupName);
            }
          }
          // setDefaultGroup(localStorage,getItem("groupName"));
        }).catch((error) => {
          console.log('Group Not good man :(');
          console.log(error);
        })        
      }
			const sendToken = () => {
				if (localStorage.getItem("token")) {
					let xxx = encrypt(localStorage.getItem("token"));
					axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/apl/firebase/token/${xxx}`)
					.then(response => {
						console.log("sent token"); 
					})
					.catch(error => {
							console.error('Token send error!', error);
					});
				}
			}
			
      if (hasGroup()) setDefaultGroup(localStorage.getItem("groupName"));
      getTournamentList();
      getGroups();
      checkVersion();
      
      
      var showDemo = !hasGroup();
      setDemo(showDemo);
      if  (showDemo)  setIsOpen("DEMO");
      else            setIsOpen(""); 
      
    }, [])

    function ShowResisterStatus() {
        // console.log(`Status is ${registerStatus}`);
        let myMsg;
        let errmsg = true;
        switch (registerStatus) { 
          case 1001:
            myMsg = "Insufficient Balance";
            break;
          case 0:
            myMsg = "";
            errmsg = false;
            break;
          default:
            myMsg = "Error updating Captain / ViceCaptain details";
            break;
        }
        let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
        return(
          <div>
            <Typography align="center" className={myClass}>{myMsg}</Typography>
          </div>
        );
    }
    
		async function handleCreate() {
      // console.log(currentTournament);
      // console.log(tournamentList[currentTournament]);
      //localStorage.setItem("cGroup", tournamentList[currentTournament].name);
			
			let myStatus = "OKAY";
			let groupServiceFee = 0;
			// First find out if sufficient amount is there in the wallet.
			if (CHECKBALANCE_CREATEJOIN) {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/checkbalanceforgroup/${localStorage.getItem("uid")}`
				let tmp = await axios.get(myUrl);
				groupServiceFee = tmp.data.groupCost;
				myStatus = tmp.data.status;
			}
			
			// If sufficient balance jump to Create Group
			if (myStatus === "OKAY") {
				localStorage.setItem("cGroup", currentTournament);
				setTab(process.env.REACT_APP_GROUPNEW);
			}
			else
			{
				setLowBalanceText(`Minimum amount of ${groupServiceFee} is required in wallet to create a new group.`);
				//setLowBalance(true);
				console.log('setting low balance as true');
				setIsOpen("WALLET");
				//setRegisterStatus(1001);
			}
    }

    async function handleJoin() {
      //console.log("Join group");
			
			// First find out if sufficient amount is there in the wallet.
			let myStatus = "OKAY";
			let groupServiceFee = 0;
			if (CHECKBALANCE_CREATEJOIN) {
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/checkbalanceforgroup/${localStorage.getItem("uid")}`
				let tmp = await await axios.get(myUrl);
				groupServiceFee = tmp.data.groupCost;
				myStatus = tmp.data.status;
			}
			
			// If sufficient balance jump to Join Group
			if (myStatus === "OKAY") {
				setTab(process.env.REACT_APP_GROUPJOIN);
			}
			else
			{
				setLowBalanceText(`Minimum amount of ${groupServiceFee} is required in wallet to join a group.`);
				setIsOpen("WALLET");
			}
    }

    function handleLeft() {
      let newLeft = currentTournament - 1;
      if (newLeft < 0) newLeft = tournamentList.length - 1
      setCurrentTournament(newLeft);
    }

    function handleRight() {
      let newRight = currentTournament + 1;
      if (newRight >= tournamentList.length)
        newRight = 0;
      setCurrentTournament(newRight);
    }

    function handlePrevGroup() {
      let newLeft = currentGroup - 1;
      if (newLeft < 0) newLeft = userGroup.length - 1
      setCurrentGroup(newLeft);
    }

    function handleNextGroup() {
      let newRight = currentGroup + 1;
      if (newRight >= userGroup.length)
        newRight = 0;
      setCurrentGroup(newRight);
    }

    async function handleGroupSelect() {
      let gRec = userGroup[currentGroup];
      try {
        await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setdefaultgroup/${localStorage.getItem("uid")}/${gRec.gid}`);
        localStorage.setItem("gid", gRec.gid);
        localStorage.setItem("groupName", gRec.groupName);
        localStorage.setItem("tournament", gRec.tournament);
        localStorage.setItem("admin", gRec.admin);
        clearBackupData();
				
        setTab(process.env.REACT_APP_DASHBOARD);
        // cdRefresh();
      } catch (e) {
        console.log(e);
        console.log("error setting default group");
      }
    }

		async function handleChangeGroup(newGroup) {
			//console.log(newGroup);
			let gRec = userGroup.find( x => x.groupName === newGroup);
      try {
				//console.log(gRec);
				let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/group/setdefaultgroup/${localStorage.getItem("uid")}/${gRec.gid}`;
				//console.log(myUrl);
        await axios.get(myUrl);
        localStorage.setItem("gid", gRec.gid);
        localStorage.setItem("groupName", gRec.groupName);
        localStorage.setItem("tournament", gRec.tournament);
        localStorage.setItem("admin", gRec.admin);
				setCurrentGroup(newGroup);
        clearBackupData();
				//setCurrentDrawer("");
        //setTab(process.env.REACT_APP_DASHBOARD);
        // cdRefresh();
      } catch (e) {
        console.log(e);
        console.log("error setting default group");
      }
		}
		
    function ShowCurrentGroup() {
      if (defaultGroup === "") {
        return (
          <div align='center'>
          <Typography className={classes.withTopSpacing} component="h1" variant="h5">Create new Group from Upcoming tournament</Typography>
          </div>
        )
      } else {
        return (
          <div align="center">
          <Typography className={classes.withTopSpacing} component="h1" variant="h5">Current Group</Typography>
          <Typography className={classes.groupName}>{defaultGroup}</Typography>
          </div>
        )
      }
    }
/*
*/

    function ShowJumpButtons() {
			let myDisable = (defaultGroup === "");
      return (
        <div>
          <Grid key="jp1" container >
            <Grid item xs={6} sm={6} md={6} lg={6} >
              {(demo && (stage === 0)) &&
                <JumpButton page={process.env.REACT_APP_HOWTOPLAY} text="How to Play" style={{backgroundColor: 'lightGreen'}} />
              }
              {(!demo || (stage != 0)) &&
                <JumpButton page={process.env.REACT_APP_HOWTOPLAY} text="How to Play" />
              }
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} >
              {(demo && (stage === 3)) &&
                <JumpButton page={process.env.REACT_APP_POINTSYSTEM} text="Point System" style={{backgroundColor: 'lightGreen'}}  />
              }
              {(!demo || (stage != 3)) &&
                <JumpButton page={process.env.REACT_APP_POINTSYSTEM} text="Point System" />
              }
            </Grid>
						<br />
            <Grid item xs={6} sm={6} md={6} lg={6} >
              {(demo && (stage === 1)) &&
                <JumpButton page={process.env.REACT_APP_AUCTION} text="Auction" style={{backgroundColor: 'lightGreen'}} />
              }
               {(!demo || (stage != 1)) &&
                <JumpButton page={process.env.REACT_APP_AUCTION} text="Auction" />
              }
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} >
              {(demo && (stage === 2)) &&
                <JumpButton page={process.env.REACT_APP_CAPTAIN} text="Captain" style={{backgroundColor: 'lightGreen'}} />
              }
               {(!demo || (stage != 2)) &&
                <JumpButton page={process.env.REACT_APP_CAPTAIN}  text="Captain" />
              }
            </Grid>
						<br />
            <Grid item xs={6} sm={6} md={6} lg={6} >
							<JumpButton page={process.env.REACT_APP_DASHBOARD} disabled={myDisable} text="DashBoard" />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} >
							<JumpButton page={process.env.REACT_APP_PLAYERINFO} disabled={myDisable} text="Statistics" />
            </Grid>
						<br />
            <Grid item xs={6} sm={6} md={6} lg={6} >
							<JumpButton page={process.env.REACT_APP_TEAM} disabled={myDisable} text="Team" />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} >
							<JumpButton page={process.env.REACT_APP_WALLET} disabled={false} text="Wallet" />
						</Grid>
						<br />
            <Grid item xs={6} sm={6} md={6} lg={6} >
							<JumpButton page={process.env.REACT_APP_GROUPDETAILS} disabled={myDisable} text="GroupDetails" />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} >
							<JumpButton page={process.env.REACT_APP_MATCH} disabled={myDisable} text="Match" />
						</Grid>
          </Grid>
        </div>
      )
    }
  
  
    async function handleUpgrade() {    
      // opens the url in the default browser 
      var myURL = `${process.env.REACT_APP_APLSERVER}/viraag/binarylatest/APL`;
      try {
        await window.open(myURL, '_blank', 'noreferrer');
      }
      catch(e) {
       console.log(e); 
      }
      return;
    }
    
    
    function openModal(type) { setIsOpen(type); }  
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
      //subtitle.style.color = '#f00';
    }
   
    function closeModal(){ setIsOpen(""); }
  
    function DisplayUpgrade() {
      //console.log(`Upgrate: ${upgrade} Menu Item:   ${value}`)
    // console.log("Current",process.env.REACT_APP_VERSION);
      if (upgrade)
        return(
          <Modal
            isOpen={"UPGRADE"}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
          >
          <VsCancel align="right" onClick={() => { setIsOpen("")}} />	
          <Typography className={gClasses.info18Bold} align="center">
            Latest Version {latestApk.version}
          </Typography>
          <BlankArea/>
          <Typography className={gClasses.info16Bold} align="center">
            What is new
          </Typography>
          <TextField variant="outlined" multiline fullWidth disabled
            style={{backgroundColor: '#B3E5FC'}}
            className={gClasses.info16}
            defaultValue={latestApk.text} 
          />
          <BlankArea />
          {/*<Button align="center" key="upgrade" variant="contained" color="primary" size="medium"
            className={classes.dashButton} disabled={startDownload} onClick={handleUpgrade}>Update Now
          </Button>*/}
					<VsButton align="center" name="Download latest APK" onClick={handleUpgrade} />
					
        </Modal>
        )
      else
        return(null);
    }
  

    function DisplayLowBalance() {
			return(
          <Modal
            isOpen={(modalIsOpen == "WALLET") && (lowBalanceText != "")}
            onAfterOpen={afterOpenModal}
            style={modalStyles}
            contentLabel="Example Modal"
            ariaHideApp={false}
          >
          <Typography className={gClasses.info18Bold} align="center">
            Low Balance
          </Typography>
          <BlankArea/>
          <Typography className={gClasses.info18} align="left">{lowBalanceText}</Typography>
          <BlankArea />
					<Grid key="BalanceButton" container >
						<Grid item align="center" xs={6} sm={6} md={6} lg={6} >
							{/*<Button variant="contained" size="small" color="primary" className={classes.submit} 
								onClick={() => { setTab(process.env.REACT_APP_ADDWALLET); } }>
								Add to wallet
							</Button>*/}
							<VsButton name="Add to wallet" onClick={() => { setTab(process.env.REACT_APP_ADDWALLET); } } />
						</Grid>
						<Grid item align="center"  xs={6} sm={6} md={6} lg={6} >
							{/*<Button variant="contained"size="small" color="primary" className={classes.submit}
								onClick={() => { closeModal(); setLowBalanceText("");  } }>
								Cancel
							</Button>*/}
							<VsButton name="Cancel" onClick={() => { closeModal(); setLowBalanceText("");  } }  />
						</Grid>
					</Grid>	
        </Modal>
        )
    }
  	
	function DisplayCurrentGroup() {
	if (userGroup.length === 0) return null;
	var myGroup = localStorage.getItem("groupName");
	setCurrentGroup(myGroup);
	return (
		<Box borderColor="primary" border={2} borderRadius={15} >	
		<div>
		<Typography className={gClasses.info22Bold} >Current Group</Typography>
		<br />
		<Grid key="selectcurrentgroup" container >
			<Grid item xs={2} sm={2} md={2} lg={2} />
			<Grid item xs={8} sm={8} md={8} lg={8} >
				<VsSelect fullWidth={true} align="center" value={currentGroup} options={userGroup} field="groupName" onChange={(event) => handleChangeGroup(event.target.value) } />
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} />
		</Grid>
		<br />
		</div>
		</Box>
	);}
	
	function NewGroup() {
	return (
		<div>
			<Grid key="NewGroup" container >
			<Grid align="center" item xs={9} sm={9} md={9} lg={9} >
				<Typography className={gClasses.info18Bold} >Play Upcoming Tournament</Typography>
			</Grid>
			<Grid item xs={3} sm={3} md={3} lg={3} >
				<Button variant="contained"size="small" color="primary" className={classes.submit} disabled={tournamentList.length === 0} 
					onClick={() => { setCurrentTournament("");  setCurrentDrawer("NewGroup"); } }>
					Play
				</Button>
			</Grid>
			</Grid>
		</div>
	)}
	
	
	function CreateJoinGroup() {
		if (tournamentList.length === 0) return null;
		if (currentTournament === "") setCurrentTournament(tournamentList[0].name);
		//console.log(currentTournament);
	return (	
	<Box borderColor="primary" border={2} borderRadius={15} >
	<div>
		<Typography className={gClasses.info22Bold} >Select Tournament</Typography>
		<br />
		<Grid key="selecttournament" container >
			<Grid item xs={2} sm={2} md={2} lg={2} />
				<Grid item xs={8} sm={8} md={8} lg={8} >
					<VsSelect fullWidth={true} align="center" value={currentTournament} options={tournamentList} field="name" onChange={(event) => setCurrentTournament(event.target.value) } />
			</Grid>
			<Grid item xs={2} sm={2} md={2} lg={2} />
			<Grid item xs={12} sm={12} md={12} lg={12} >
				<br />
			</Grid>
			<Grid item xs={6} sm={6} md={6} lg={6} >
				{/*<Button variant="contained"size="small" color="primary" className={classes.submit} disabled={tournamentList.length === 0} onClick={handleCreate}>Create Group</Button>*/}
				<VsButton name="Create Group" disabled={tournamentList.length === 0} onClick={handleCreate} />				
			</Grid>
			<Grid item align="center"  xs={6} sm={6} md={6} lg={6} >
				{/*<Button variant="contained" size="small" color="primary" className={classes.submit} disabled={tournamentList.length === 0} onClick={handleJoin}>Join Group</Button>*/}
				<VsButton name="Join Group" disabled={tournamentList.length === 0} onClick={handleJoin} />				
			</Grid>
		</Grid>
		<br />
	</div>
	</Box>
	)}
  
  function prevStage() {
    let tmp = stage - 1
    if (stage > 0) setStage(tmp);
  }
  
  function nextStage() {
    let tmp = stage + 1
    if (stage < LASTSTAGE) setStage(tmp);
  }
	
  //console.log(stage);
  var demoStyle = {paddingLeft: "10px", paddingRight: "10px", paddingBottom: "none", paddingTop: "none"};
	return (
	<Container component="main" maxWidth="xs">
	<div className={gClasses.root} align="center">
		<Typography className={gClasses.nonerror}>{downloadMessage}</Typography>
		<br />
    { demo && 
      <Box borderColor="primary" border={2} borderRadius={15} >	
        <VsCancel align="right" onClick={() => { setDemo(false)}} />	
        {(stage === 0) &&
          <div >
            <Typography className={gClasses.info22Bold} >How to play</Typography>
            <br />
            <Typography align="justify" style={demoStyle} className={gClasses.info18} >One can play along with family / friends  by creating group. One of then will create the group and share the GroupCode. Others will use the GroupCode to join the group. </Typography>
            <br />
            <Typography align="justify" style={demoStyle} className={gClasses.info18} >Go to page "How to Play" for details of Create/Join group</Typography>
          </div>
        }
        {(stage === 3) &&
        <div>
          <Typography className={gClasses.info22Bold} >Point System</Typography>
          <br />
          <Typography align="justify" style={demoStyle} className={gClasses.info18} >Once each group member have created their team by purchasing players during aution, job is done. Your team gets the points based on player's performance during tournament.</Typography>
          <br />
          <Typography align="justify" style={demoStyle} className={gClasses.info18} >Go to page "Point System" for point details.</Typography>
        </div>
        }
        {(stage === 1) &&
        <div >
          <Typography className={gClasses.info22Bold} >Auction</Typography>
          <br />
          <Typography align="justify" style={demoStyle} className={gClasses.info18} >Once all the members have joined the group, the next step is to make team by purchasing players in Auction.</Typography>
          <br />
          <Typography align="justify" style={demoStyle} className={gClasses.info18} >Group admin will start the auction by clicking on the "Auction" button.</Typography>
        </div>        
        }
        {(stage === 2) &&
        <div >
          <Typography className={gClasses.info22Bold} >Captain</Typography>
          <br />
          <Typography align="justify" style={demoStyle} className={gClasses.info18} >Once the Auction is complete the next step is to select Captain & Vice Captain for your team.</Typography>
          <br />
          <Typography align="justify" style={demoStyle} className={gClasses.info18} >You get 2x for Captain & 1.5x for Vice Captain based on the runs scrored and wickets taken by them.</Typography>
        </div>        
        }
        <br />
        <Grid container justify="center" alignItems="center" >
          <Grid item xs={6} sm={6} md={6} lg={6} >
            <VsButton disabled={stage == 0} name="Prev" onClick={prevStage} />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} >
            <VsButton disabled={stage == LASTSTAGE} name="Next" onClick={nextStage} />
          </Grid>
        </Grid>
      </Box>
    }
    {(!demo) &&
      <div>
      <CreateJoinGroup />
      <br />
      <DisplayCurrentGroup />
      </div>
    }
		<br />
		<ShowJumpButtons />
		<DisplayUpgrade/>
		<DisplayLowBalance />
		<BlankArea />
	</div>
	</Container>
	);
}
