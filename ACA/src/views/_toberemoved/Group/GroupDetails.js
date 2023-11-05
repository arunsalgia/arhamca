import React, {useEffect, useState ,useContext} from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import globalStyles from "assets/globalStyles";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Drawer from '@material-ui/core/Drawer';
import Grid from '@material-ui/core/Grid';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { UserContext } from "../../UserContext";
import axios from "axios";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {red, blue, yellow, deepOrange } from '@material-ui/core/colors';
import { useHistory } from "react-router-dom";
import {BlankArea, JumpButton, NothingToDisplay, DisplayPageHeader, DisplayPrizeTable, MessageToUser} from "CustomComponents/CustomComponents.js"
import { useParams } from "react-router";
// import GroupMember from "views/Group/GroupMember.js"
import { SettingsPowerSharp } from '@material-ui/icons';
import {setTab} from "CustomComponents/CricDreamTabs.js"
import { getAllPrizeTable, getUserBalance} from "views/functions.js"
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { JumpButtonFull } from 'CustomComponents/CustomComponents';

import EditIcon from '@material-ui/icons/Edit';

import VsButton from "CustomComponents/VsButton";
import VsRefresh from "CustomComponents/VsRefresh";
import VsCancel from "CustomComponents/VsCancel";


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
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: blue[700]
  },
  helpMessage: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  jump: {
    margin: theme.spacing(3, 0, 2),
  },
	fullWidth: {
		width: "100%",
	},
  groupMessage: {
    fontSize: theme.typography.pxToRem(10),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  groupCode: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: yellow[900]
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    margin: theme.spacing(0, 1, 0),
  },
  groupName:  {
    // right: 0,
    fontSize: '12px',
    color: blue[700],
    // position: 'absolute',
    alignItems: 'center',
    marginTop: '0px',
},
error:  {
  // right: 0,
  fontSize: '12px',
  color: red[700],
  // position: 'absolute',
  alignItems: 'center',
  marginTop: '0px',
},
success:  {
  // right: 0,
  fontSize: '12px',
  color: blue[700],
  // position: 'absolute',
  alignItems: 'center',
  marginTop: '0px',
},
  th: { 
    spacing: 0,
    align: "center",
    padding: "none",
    backgroundColor: '#EEEEEE', 
    color: deepOrange[700], 
    // border: "1px solid black",
    fontWeight: theme.typography.fontWeightBold,
  },
  td : {
    spacing: 0,
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
  },    
}));


export default function GroupDetails() {
  const classes = useStyles();
	const gClasses = globalStyles();

  const history = useHistory();
  const [registerStatus, setRegisterStatus] = useState(0);
  const [franchiseeName, setFranchiseeName] = useState("");
  const [masterData, setMasterData] = useState({name: "", tournamenet: ""})
  const [minimumMemberCount, setMinimumMemberCount] = useState(0);
  const [memberCount, setMemberCount] = useState(2);
  const [memberFee, setMemberFee] = useState(50);
	const [maxPlayers, setMaxPlayers] = useState(15);
	
  const [masterPrizeTable, setMasterPrizeTable] = useState([]);
  const [prizeTable, setPrizeTable] = useState([]);
  const [memberCountUpdated, setMemberCountUpdated] = useState(0);
  const [memberFeeUpdated, setMemberFeeUpdated] = useState(50);
  const [existingMembers, setExistingMembers] = useState(1);
  const [groupCode, setGroupCode] = useState("");
  const [copyState, setCopyState] = useState({value: '', copied: false});

  const [newGoupName, setNewGoupName] = useState("");
  
  const [expandedPanel, setExpandedPanel] = useState("");
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
    setRegisterStatus(0);
  };

  // const { setUser } = useContext(UserContext);
  const [backDropOpen, setBackDropOpen] = React.useState(false);
  const [userMessage, setUserMessage] = React.useState("");
  const [editNotStarted, setEditNotStarted] = React.useState(true);
  const [disableEdit, setDisableEdit] = React.useState(true);
  const [editButtonText, setEditButtonText] = React.useState("Edit");
  const [memberArray, setMemberArray] = useState([]);
  const [prizeCount, setPrizeCount]  = useState(1);
  const [groupList, setGroupList] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [currGroup, setCurrGroup] = useState(0);

	const [editGroupDrawer, setEditGroupDrawer] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  async function generatePrizeTable(mCount, mFee, pCount) {
    // console.log(`${mCount}    ${mFee}    ${pCount}`);
    //let amt = mCount * mFee;
    // console.log(amt);
    //let tmp = await getSinglePrizeTable(pCount, amt)
    // console.log(tmp);
    //setPrizeTable(tmp);
    // console.log("Done");
  }

  useEffect(() => {

    const updateGroupDetailData = async () => { 
      /***
      const listResponse = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/memberof/${localStorage.getItem("uid")}`);
      // console.log(listResponse);
      setGroupList(listResponse.data[0].groups);
      let tmp = listResponse.data[0].groups.find(x => x.gid == localStorage.getItem("gid"))
      if (tmp) {
        handleGroupbyRec(tmp);
        setCurrGroup(tmp.gid);
      } else {
        setCurrGroup(0);
      }
    ***/
      let myGid = parseInt(localStorage.getItem("gid"));
      handleGroupbyRec(myGid);
      setCurrGroup(myGid);
    }
      
    updateGroupDetailData();    
  }, [])

   /** Display Group members */

  function DisplayGroupMembers() {
  return (
		<div style={ {padding: "5px" } } >
		<VsRefresh align="right" onClick={reReadGroupMembers} />
		<Grid key="HEADER" container align="center">
			<Grid  item xs={6} sm={6} md={6} lg={6} >
				<Typography className={gClasses.th}>Member</Typography>
			</Grid>
			<Grid  item xs={6} sm={6} md={6} lg={6} >
				<Typography className={gClasses.th}>Franchise</Typography>
			</Grid>
		</Grid>
		{memberArray.map( (item, index)  => {
			return (
			<Grid key={"ALL"+index} container align="center">
			<Grid item xs={6} sm={6} md={6} lg={6} >
				<Typography className={gClasses.td}>{item.userName}</Typography>
			</Grid>
			<Grid item xs={6} sm={6} md={6} lg={6} >
				<Typography className={gClasses.td}>{item.displayName}</Typography>
			</Grid>
			</Grid>
			)
			})}
		</div>
  )};


  /*** Manage Franchise display and update  */
  async function handleFranchiseName() {
    if (currGroup !== 0) {
      // get new franchisee name updated in database
      let newName = document.getElementById("franchiseeName").value;
			if (newName === "") newName = localStorage.getItem("userName")
      console.log(newName);
			try {
				await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setfranchisename/${localStorage.getItem("uid")}/${currGroup}/${newName}`);
				// also make franchisee name update in local copy (i.e. memberArray)
				let clone = [].concat(memberArray);
				let myRec = clone.find(x => x.uid == localStorage.getItem("uid"));
				myRec.displayName = newName;
				setMemberArray(clone);
				//setExpandedPanel(false);
				setRegisterStatus(1000);  // SUCCESS
				setFranchiseeName(newName);
			}
			catch {
				setRegisterStatus(1003)
			}
    }
  }


  function DisplayFranchise() {
    return (
      <div style={ { padding: "5px"} } align="center">
        <Grid key="gr-group" container justify="center" alignItems="center" >
            <Grid item xs={9} sm={9} md={9} lg={9} >
            <TextField
              name="userName"
              variant="outlined"
              fullWidth
              id="franchiseeName"
              label="Franchisee Name"
              autoFocus
              defaultValue={franchiseeName}
              //onChange={(event) => setFranchiseeName(event.target.value)}
            />
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3} >
							{/*
							<Button key="filterbtn" variant="contained" color="primary" size="small"
              className={classes.button} onClick={handleFranchiseName}>Update
							</Button>*/}
							<VsButton name="Update" onClick={handleFranchiseName} />
            </Grid>
        </Grid>
        <ShowResisterStatus />
        {/* <MessageToUser mtuOpen={backDropOpen} mtuClose={setBackDropOpen} mtuMessage={userMessage} /> */}
      </div>
    );
  }

  /***  Prize count and amount  */

  async function writePrizeCount(count) {
    let sts = true;
    try {
      let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/group/updateprizecount/${currGroup}/${localStorage.getItem("uid")}/${count}`;
      let resp = await axios.get(myURL);
      // setPrizeCount(count);
      // await generatePrizeTable(memberCountUpdated, memberFeeUpdated, count);
    } catch (e) {
      console.log(e)
      sts = false;  
    }
    return sts;
  }

  async function handlePrizeCountChange(event) {
    let newPrizeCount = parseInt(event.target.value);
    setPrizeCount(newPrizeCount);
    setPrizeTable(masterPrizeTable[newPrizeCount-1]);
    let sts = await writePrizeCount(newPrizeCount);
    if (sts) {
      setRegisterStatus(3000);
    } else {
      setRegisterStatus(3001);
    }
  }

  
  function DisplayPrizeRadio(props) {
    let inumber = parseInt(props.number);
    //console.log(`${inumber}  and ${prizeCount}`);
    let disableRadio = true;
    if (!disableEdit) {
      if ((inumber <= memberCountUpdated) && (inumber <= 5))
        disableRadio = false;
    }
    return(
      <FormControlLabel
      value={props.number} label={props.number} color="primary" labelPlacement="end" disabled={disableRadio} checked={prizeCount == inumber}
      control={<Radio size="small" color="primary" />}
      />
    );
  } 
  
  function DisplayPrize() {
  // generatePrizeTable(memberCount, memberFee, prizeCount);
  return (
    <div align="center">
    <RadioGroup aria-label="position" name="position" value={prizeCount} onChange={handlePrizeCountChange} row>
      <DisplayPrizeRadio number="1"/>
      <DisplayPrizeRadio number="2"/> 
      <DisplayPrizeRadio number="3"/>
      <DisplayPrizeRadio number="4"/>
      <DisplayPrizeRadio number="5"/>
    </RadioGroup>
    <DisplayPrizeTable tableName={prizeTable}/>
    </div>
  )}

  /** Group details */

  async function handleGroupSubmit()  {
    if (editNotStarted) {
      // console.log("Enable Edit");
      setEditNotStarted(false);
      setEditButtonText("Update");
      setRegisterStatus(0);
    } else {
      console.log("in update mode");

      // check if number member count is valid
      let newCount = parseInt(document.getElementById("membercount").value);
      // console.log(memberCount, newCount);
			setMemberCount(newCount);
			let myPlayers = parseInt(document.getElementById("MaxPlayers").value);
			setMaxPlayers(myPlayers);
			
      if ((newCount < existingMembers) || (newCount > 25)) {
        setRegisterStatus(1001);
        return;
      }

			if ((myPlayers < 1) || (myPlayers > 1000)) {
        setRegisterStatus(1002);
        return; 
      }
			setRegisterStatus(0);
			console.log("Now ser");
      try {
        // use need to be owner of the group.
        console.log("prize", prizeCount, newCount)
        let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/group/updatewithplayers/${currGroup}/${localStorage.getItem("uid")}/${newCount}/${myPlayers}`;
        let resp = await axios.get(myURL);
        setMemberCount(newCount);
        setMemberCountUpdated(newCount);
        console.log("prize", prizeCount, newCount)
        // is this IF required *************************
        let newPrizeCount = prizeCount;
        if (prizeCount > newCount) {
          await writePrizeCount(newCount);
          setPrizeCount(newCount);
          newPrizeCount = prizeCount;
        }
        let myTable = await getAllPrizeTable(newCount * memberFee);
        //console.log(myTable);
        setMasterPrizeTable(myTable);
        setPrizeTable(myTable[newPrizeCount-1]);

        setRegisterStatus(2000);
        setEditNotStarted(true);
        // setExpandedPanel(false);
      } catch (e) {
        console.log(e)
        setRegisterStatus(2001);
      }
      setEditButtonText("Edit");
    }
  }

  function ShowResisterStatus() {
    let myMsg;
    let isError = true;
    switch (registerStatus) {
      case 999:
        myMsg = "Group Details Update not yet implemented";
        break;
      case 1000:
        myMsg = "Successfully updated Franchise details";
        isError = false;
        break;
      case 1001:
        myMsg = `Member count should be in the range ${existingMembers} - 25`;
        break;
      case 1002:
        myMsg = `Max players should be in the range 1 - 1000`;
        break;
			case 1003:
        myMsg = `Duplicate Franchisee Name`;
        break;
      case 1111:
        myMsg = `All Okay`;
        isError = false;
        break;
      case 2000:
        myMsg = "Successfully updated group details";
        isError = false;
        break;
      case 0:
        myMsg = "";
        isError = false;
        break;
      case 2001:
        myMsg = "Error updating group details";
        break;
      case 3000:
        myMsg = "Successfully updates Prize Count";
        isError = false;
        break;
      case 3001:
        myMsg = "Error updating Prize Count";
        break;
      case 200:
        myMsg = `User ${userName} successfully registered.`;
        break;
      case 602:
        myMsg = "User Name already in use";
        break;
      case 603:
        myMsg = "Email id already in use";
        break;
      default:
          myMsg = `Unknown Error ${registerStatus}`;
          break;
    }
    return(
        <Typography className={(isError) ? classes.error : classes.success}>{myMsg}</Typography>
    )
  }

  function DisplayGroupCode() {
    let myText = copyState.value
    // console.log("in group code");
    return (
        <div>
          {/* <BlankArea/> */}
          <Typography className={classes.groupMessage}>Share this code with your friends to join your group</Typography>
          <BlankArea/>
          <Typography className={classes.groupCode}>{groupCode}</Typography>
          <BlankArea/>
          <CopyToClipboard text={myText}
              onCopy={() => setCopyState({copied: true})}>
              <button>Copy to clipboard</button>
          </CopyToClipboard>
          {copyState.copied ? <span style={{color: 'blue'}}>Copied.</span> : null}
        </div>       
      )
  }

  async function changeMemberCount(newCount) {
    setMemberCount(newCount);
    let myTable = await getAllPrizeTable(newCount * memberFee);
    //console.log(myTable);
    setMasterPrizeTable(myTable);
    setPrizeTable(myTable[prizeCount-1]);
  }

  function DisplayGroupDetails() {
  let minNumber = `minNumber:${minimumMemberCount}`;
  let minMessage = `Group members cannot be less than ${minimumMemberCount}`
  return(
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
      <ValidatorForm className={classes.form} onSubmit={handleGroupSubmit}>
      <TextValidator
          variant="outlined"
          required
          fullWidth      
          label="Group Name"
          name="username"
          disabled
          value={masterData.name}
      />
      <BlankArea/>
      <TextValidator
          variant="outlined"
          required
          fullWidth      
          label="Tournament"
          name="tournament"
          disabled
          value={masterData.tournament}
      />
      <BlankArea/>
      <TextValidator
          variant="outlined"
          required
          autoFocus
          fullWidth      
          // size="small"  
          label="Member Count"
          id="membercount"
          name="membercount"
          type="number"
          // validators={['required', minNumber, 'maxNumber:25']}
          // errorMessages={['Member count to be provided', minMessage, 'Group members cannot be more than 25']}
          disabled={editNotStarted}
          defaultValue={memberCountUpdated}
          // value={memberCount}
          // onChange={(event) => setMemberCount(event.target.value)}
			/>
      <BlankArea/>
      <TextValidator
          variant="outlined"
          required
          fullWidth    
          label="MemberFee"
          //onChange={(event) => setMemberFee(event.target.value)}
          name="MemberFee"
          type="number"
          //validators={['required', 'minNumber:50']}
          //errorMessages={['Member count to be provided', 'Member fee cannot be less than 50']}
          disabled
          value={memberFee}
      />
      <BlankArea/>
      <TextValidator
          variant="outlined"
          required
          fullWidth    
          // size="small"  
          label="Maximum Players"
          //onChange={(event) => setMemberFee(event.target.value)}
          id="MaxPlayers"
          name="MaxPlayers"
          type="number"
          //validators={['required', 'minNumber:1', 'maxNumber: 1000']}
          //errorMessages={['Max Players to be provided', 'Maximum players need to more than 1', 'Maximum players need to less than 1000']}
          disabled={editNotStarted}
          defaultValue={maxPlayers}
      />
      <ShowResisterStatus/>
      <BlankArea/>
			{ (!disableEdit) &&
				<VsButton type="submit" name={editButtonText}  />			
			}
    </ValidatorForm>
    </div>
    {/* <ValidComp />     */}
    </Container>
  )}

  function DisplayAccordian() {
  if (currGroup !== 0) {
  return (
    <div>
    <Accordion expanded={expandedPanel === "frachisee"} onChange={handleAccordionChange("frachisee")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography className={classes.heading}>Update Franchise</Typography>
        </AccordionSummary>
				<DisplayFranchise />
				<br />
    </Accordion>
    <Typography align="left" className={classes.helpMessage}>Update Franchise name</Typography>
    <BlankArea />
    <Accordion expanded={expandedPanel === "group"} onChange={handleAccordionChange("group")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography className={classes.heading}>Group Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <DisplayGroupDetails />
        </AccordionDetails>
    </Accordion>
    <Typography align="left" className={classes.helpMessage}>View/Edit Group details</Typography>
    <BlankArea />
    <Accordion expanded={expandedPanel === "prize"} onChange={handleAccordionChange("prize")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography className={classes.heading}>Prize Details</Typography>
        </AccordionSummary>
        <DisplayPrize />
    </Accordion>
    <Typography align="left" className={classes.helpMessage}>View/Edit Prize Details</Typography>
    <BlankArea />
   <Accordion expanded={expandedPanel === "members"} onChange={handleAccordionChange("members")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography className={classes.heading}>Member List</Typography>
        </AccordionSummary>
        <DisplayGroupMembers />
    </Accordion>
    <Typography align="left" className={classes.helpMessage}>View Member List</Typography>
    <BlankArea />
    <Accordion expanded={expandedPanel === "code"} onChange={handleAccordionChange("code")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography className={classes.heading}>Group Code</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <DisplayGroupCode />
      </AccordionDetails>
    </Accordion>
    <Typography align="left" className={classes.helpMessage}>Copy and Share Group Code</Typography>
    <BlankArea />
    </div>
  )
  } else {
    return (<NothingToDisplay />)
  }
}


  async function handleGroupbyRec(myGid) {
    const grpResponse = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/info/${myGid}`);
    //console.log(grpResponse.data.info);
    setGroupName(localStorage.getItem("groupName"));
    
    setMasterData(grpResponse.data.info);
    // console.log(grpResponse.data.info);
    setMemberCount(grpResponse.data.info.memberCount);
		setMaxPlayers(grpResponse.data.info.maxPlayers);
    setMemberFee(grpResponse.data.info.memberFee);
    setMemberCountUpdated(grpResponse.data.info.memberCount);
    setExistingMembers(grpResponse.data.currentCount);
    console.log("MC from backend", grpResponse.data.info.memberCount);
    setMemberFeeUpdated(grpResponse.data.info.memberFee);
    setPrizeCount(grpResponse.data.info.prizeCount);
    //console.log(grpResponse.data.info._id);
    setCopyState({value: grpResponse.data.info._id})
    setGroupCode(grpResponse.data.info._id);
    // console.log("Calling generate prize table");
    // await generatePrizeTable(grpResponse.data.info.memberCount,
    //   grpResponse.data.info.memberFee,
    //   grpResponse.data.info.prizeCount);
    // console.log(grpResponse.data.info);
    let myTable = await getAllPrizeTable(grpResponse.data.info.memberCount *
      grpResponse.data.info.memberFee);
    // console.log(myTable);
    setMasterPrizeTable(myTable);
    setPrizeTable(myTable[grpResponse.data.info.prizeCount-1]);
    setMinimumMemberCount(grpResponse.data.currentCount);
    // edit group details
    //  1) user is owner of the group
    //  2) auction status is pending
    //  2) tournament has not yet started
    //if ((grpResponse.data.info.owner == localStorage.getItem("uid")) &&
    //    (grpResponse.data.info.auctionStatus === "PENDING") &&
    //    (!grpResponse.data.tournamentStarted))
    //  setDisableEdit(false);
	
    // if OWNER 
    // and AUTION PENDING
    // and TOURNAMENT not started 
    // the allow edit
    
    let myDisable = true;  // by default not edit permission. i.e edit disabled = true

    if (grpResponse.data.info.owner == localStorage.getItem("uid"))	
    if (grpResponse.data.info.auctionStatus === "PENDING")
    if (grpResponse.data.tournamentStarted === false)
      myDisable = false;				// allow group edit. Thus not disableEdit
    setDisableEdit(myDisable);
    let ggid = localStorage.getItem("gid");
    const sts = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/getfranchisename/${localStorage.getItem("uid")}/${ggid}`);
    setFranchiseeName(sts.data);
    //setMasterDisplayName(sts.data);
		await readGroupMembers(ggid);
    
  }

	async function readGroupMembers(myGid) {
		//console.log("Reading group members");		
    let memResponse = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/group/${myGid}`);
		//console.log(memResponse.data);
		setMemberArray(memResponse.data);
		return memResponse.data.length;
	}
	
	async function reReadGroupMembers(myGid) {
		var tmp = parseInt(localStorage.getItem("gid"));
		tmp = await readGroupMembers(tmp);
		//console.log(tmp);
		alert(`Refreshed. Currently ${tmp} members in the Group.`); 
	}

  async function handleFetchGroup(gname) {
    // console.log(`Grop is ${gname}`);
    // console.log(groupList);
    let tmp = groupList.find(x => x.groupName === gname);
    if (tmp) {
      handleGroupbyRec(tmp);
      setCurrGroup(tmp.gid);
    } else {
      setGroupName("");
      setCurrGroup(0);
      setMasterPrizeTable([]);
      setPrizeTable([]);
    }
  }

  function handleEditGroupName() {
    setErrorMessage("");
    setNewGroupName(localStorage.getItem("groupName"));
    setEditGroupDrawer("editGroupDrawer");
  }
  
  
  function SelectGroup() {
  return (
    <div>
      <Typography>
        <span className={gClasses.info18Brown}>{groupName}</span>
          {/*<span><EditIcon style={{color: 'blue', marginLeft: "5px" }} size="small" onClick={handleEditGroupName} /></span>*/}
      </Typography>
    </div>
  );
  return (
    <Grid key="gr-group" container justify="center" alignItems="center" >
    <Grid item key="gi1-group" xs={12} sm={12} md={12} lg={12} >
      <Select labelId='team' id='team'
        variant="outlined"
        required
        fullWidth
        label="Group"
        name="team"
        id="team"
        value={groupName}
        inputProps={{
          name: 'Group',
          id: 'filled-age-native-simple',
        }}
        onChange={(event) => handleFetchGroup(event.target.value)}
        >
        {groupList.map(x =>
          <MenuItem key={x.groupName} value={x.groupName}>{x.groupName}</MenuItem>)}
      </Select>
    </Grid>
    </Grid>
  )}

  function ShowJumpButtons() {
    return (
      <div>
        <BlankArea />
        <JumpButtonFull page={process.env.REACT_APP_AUCTION} text="Next (Auction)" />
      </div>
    )
  }

  async function updateGroupName() {
    let newName = document.getElementById("newGroupName").value;
    if (newName.length >= 6) {
      setEditGroupDrawer("");
    }
    else {
      setErrorMessage(newName != "" ? 'Group Name should be of minimum 6 characters' : 'Group Name cannot be blank');
    }
    
  }

  return (
    <div>
    <Container component="main" maxWidth="xs">
      <CssBaseline />
			<br />
      <div align="center">
        <SelectGroup />
        <BlankArea />
        <DisplayAccordian />
      </div>
    </Container>
    <ShowJumpButtons />
    <BlankArea />
    <Drawer maxWidth="xs" anchor="top" variant="temporary" open={editGroupDrawer != ""}>
      <Box className={gClasses.drawerStyle} borderColor="black" borderRadius={7} border={1} >
      <Container component="main" maxWidth="xs">
      <VsCancel align="right" onClick={() => { setEditGroupDrawer("")}} />	
      <br />
      <Typography align="center" className={gClasses.info18Blue}>Edit Group Name</Typography>
      <br />
      <TextField name="groupName" variant="outlined" fullWidth id="newGroupName" label="Group Name" autoFocus defaultValue={newGroupName} />
      <Typography className={gClasses.error} align="left">{errorMessage}</Typography>
      <br />
      <br />
      <VsButton align="center" name="Submit" onClick={updateGroupName} />
      <br />
      </Container>
      </Box>
    </Drawer>
    </div>
  );
}
