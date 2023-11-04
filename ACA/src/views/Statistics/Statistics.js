import React, { useEffect, useState } from 'react';
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardBody from "components/Card/CardBody.js";
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import globalStyles from "assets/globalStyles";
import modalStyles from "assets/modalStyles";
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import TextField from '@material-ui/core/TextField';
import { InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';

import axios from "axios";
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Checkbox from '@material-ui/core/Checkbox';
import BlueCheckbox from "components/CheckBox/BlueCheckbox";
// import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import {blue, orange, deepOrange}  from '@material-ui/core/colors';

import socketIOClient from "socket.io-client";
import { NoGroup, DisplayPageHeader, 
  BlankArea,
  ShowCreateGroup, ShowJoinGroup, ShowAuctionGroup, ShowCaptainGroup, ShowMultipleGroup,
	ShowTeamImage
} from 'CustomComponents/CustomComponents.js';

/*
// import {socketPoint} from "views/functions.js";

// const modalStyles = {
//   content : {
//     top                   : '50%',
//     left                  : '50%',
//     right                 : 'auto',
//     bottom                : 'auto',
//     marginRight           : '-50%',
//     marginBottom          : '-50%',
//     transform             : 'translate(-50%, -50%)',
//     background            : '#000000',
//     color                 : '#FFFFFF',
//     transparent           : false,   
//   }
// };
*/

const dashStyles = makeStyles(styles);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  modalCb: {
    color: '#000000',
    fontWeight: theme.typography.fontWeightBold,
  },
  th: { 
    backgroundColor: '#EEEEEE', 
    color: deepOrange[700], 
    // border: "1px solid black",
    fontWeight: theme.typography.fontWeightBold,
    align: "center",
  },
  td : {
    // border: 5,
    align: "center",
    padding: "none",
    height: 10,
  },
  cardContent: {
    // color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: '#18FFFF',   //deepOrange[500],
    margin: 0,
    padding: "none",
    //height: 20,
  },
  cc0: {
    // color: theme.palette.getContrastText(deepOrange[500]),
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '14px',
    margin: theme.spacing(0, 0, 0),
    padding: "none",
  },
  cc1: {
    // color: theme.palette.getContrastText(deepOrange[500]),
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '14px',
    margin: theme.spacing(0, 0, 0),
    padding: "none",
  },
  cc2: {
    margin: theme.spacing(0, 0, 0),
    fontSize: '12px',
    padding: "none",
    // color: theme.palette.getContrastText(deepOrange[500]),
    // fontWeight: theme.typography.fontWeightBold,
  },
})); 
  

function leavingStatistics(myConn) {
  console.log("Leaving Statistics wah wah ");
  myConn.disconnect();
}

let first = true;
export default function Stats() { 
  const classes = useStyles();
  const dashClasses = dashStyles();
  const gClasses = globalStyles();


  const [teamArray, setTeamArray] = useState([]);
  const [iplovers, setIPLOvers] = useState(0);
  const [ipltitle, setIPLTitle] = useState("");
  const [iplmatch, setIPLMatch] = useState("");
  const [updTime, setUpdTime] = useState("");
  const [searchText,setSearchText] = useState("")
  const [playerList, setPlayerList] = useState([]);
  // const [firstTime, setFirstTime] = useState(true);
  const [searchList, setSeachList] = useState([]);
  // const [statData, setStatData] = useState([]);
  const [currentGuide, setCurrentGuide] = useState({guideNumber: 0});
  const [maxGuide, setMaxGuide] = useState(0);


  function generatePlayerList(statData) {
    //console.log("In generate");
    
    // let allPlayers = [];
    let myseachList = [];

    for(let idx=0; idx < statData.length; ++idx) {
      let newPlayers = statData[idx].playerStat;      // franchisee.map(a => a.playerName);
      for(let p=0; p<newPlayers.length; ++p) {
        myseachList.push({
          userName: statData[idx].displayName,
          playerName: newPlayers[p].playerName.toLowerCase()
        });
      }
    }
    setSeachList(myseachList);
    // console.log(myseachList);
  }


  useEffect(() => {  
    if (localStorage.getItem("statData")) {
      let sData = JSON.parse(localStorage.getItem("statData"))
      setTeamArray(sData);
      // generatePlayerList(sData);
    }
    const makeconnection = async () => {
      await socket.connect();
    }

    const socket = socketIOClient(process.env.REACT_APP_ENDPOINT);

    makeconnection();

    socket.on("connect", () => {
      // console.log(`STATS gis ${localStorage.getItem("gid")}`);
      var sendMessage = {page: "STAT", gid: localStorage.getItem("gid"), uid: localStorage.getItem("uid") };
      socket.emit("page", sendMessage);
      // console.log("stat connected")

      socket.on("brief", (stat) => {
        var gStat = stat.filter(x => x.gid === parseInt(localStorage.getItem("gid")));
        if (gStat.length > 0) {
          setTeamArray(gStat)
          // console.log(first);
          // generatePlayerList(gStat);
          // first = false;
          localStorage.setItem("statData", JSON.stringify(gStat));
          // console.log(gStat);
        }
        let myTime = new Date().toDateString() + " " + new Date().toLocaleTimeString();
        setUpdTime(myTime);
      })

      socket.on("overs", (myOvers) => {
        // console.log(myOvers);
        if (myOvers.tournament !== "") {
          let currOver = 0;
          let currTitle = "";
          let currMatch = myOvers.team1 + " Vs. " + myOvers.team2;
          if (myOvers.bowl4)      { currOver = myOvers.bowl4;  currTitle = myOvers.title4 }
          else if (myOvers.bowl3) { currOver = myOvers.bowl3;  currTitle = myOvers.title3 }
          else if (myOvers.bowl2) { currOver = myOvers.bowl2;  currTitle = myOvers.title2 }
          else                    { currOver = myOvers.bowl1;  currTitle = myOvers.title1 }
          // currOver = currOver / 10;
          setIPLOvers(currOver);
          setIPLTitle(currTitle);
          setIPLMatch(currMatch);
        } else {
          setIPLOvers(0);
          setIPLTitle("");
          setIPLMatch("");
        }
      })
    });

    async function getGuide() {
      try {
        let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/apl/getmaxguide`;
        // console.log(myURL);
        let response = await axios.get(myURL);
        //console.log(response);
        setMaxGuide(parseInt(response.data));
        let tmp = await getNextGuide();
        if (tmp) {
          //console.log(tmp);
          openModal();
        } else
          closeModal();
      } catch(e) {
        console.log(e);
        setCurrentGuide({guideNumber: 0});
        closeModal();
      }
    }
    //getGuide();

    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      leavingStatistics(socket);
    }
  }, []);

  async function getNextGuide() {
    let myGuide;
    try {
    let tmp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/apl/getnextguide/${localStorage.getItem("uid")}`);
      myGuide = tmp.data;
      setCurrentGuide(myGuide);
      // myNum = myGuide.data.guideNUmber;
    } catch (e) {
      setCurrentGuide({guideNumber: 0});
      // myNum = 0;
      // console.log(e.response);
    }
    return myGuide;
  }

  async function getPrevGuide() {
    let myNum;
    try {
    let myGuide = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/apl/getprevguide/${localStorage.getItem("uid")}`);
      setCurrentGuide(myGuide.data);
      myNum = myGuide.data.guideNUmber;
      openModal();  
    } catch (e) {
      setCurrentGuide({guideNumber: 0});
      myNum = 0;
      console.log(e);
    }
    return myNum;
  }

  const [modalIsOpen,setIsOpen] = React.useState(false);
  
  function openModal() { setIsOpen(true); }
  function closeModal() { setIsOpen(false); }
  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }

  

  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    //console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };

  const [noGroupPanel, setNGExpandedPanel] = useState(false);
  const handleNoGroupChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setNGExpandedPanel(isExpanded ? panel : false);
  };

  const NGStyles = makeStyles((theme) => ({
    ngHeader: {
      fontSize: theme.typography.pxToRem(18),
      fontWeight: theme.typography.fontWeightBold,
    },
    ngCard: {
      backgroundColor: '#B3E5FC',
    },
  }));
  

/*
  function ShowNoGroup() {
    const classes = NGStyles();
    return (
      <Card className={classes.ngCard}>
      <CardContent>
      <Typography paragraph>
      Welcome to Aution Premier League (APL).
      </Typography>
      <Typography paragraph>
      You need to be a member of the group. You can Create New Group by clicking on "Group Icon" (on right hand side) and select "New Group".
      </Typography>
      <Typography paragraph>
      If your friend has created the group and shared the groupcode, just click on "Group Icon" (on right hand side) and select "Join Group".
      </Typography>
      <Typography paragraph>
      Once you join the group, enjoy the game. Auction Players, select Captain and Vice Captain.
      </Typography>
      <Typography paragraph>
      Once the tournament starts, APL will automatically assign the points based on performance of players.
      </Typography>
      <Typography paragraph>
      Dashbord will show the details of your group and Stats will show the point allocation.
      </Typography>
      <Accordion expanded={noGroupPanel === "CREATE"} onChange={handleNoGroupChange("CREATE")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography className={classes.ngHeader}>Create Group</Typography>
      </AccordionSummary>
      <AccordionDetails><ShowCreateGroup/></AccordionDetails>
      </Accordion>
      <Accordion expanded={noGroupPanel === "JOIN"} onChange={handleNoGroupChange("JOIN")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography className={classes.ngHeader}>Join Group</Typography>
      </AccordionSummary>
      <AccordionDetails><ShowJoinGroup/></AccordionDetails>
      </Accordion>
      <Accordion expanded={noGroupPanel === "AUCTION"} onChange={handleNoGroupChange("AUCTION")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography className={classes.ngHeader}>Auction</Typography>
      </AccordionSummary>
      <AccordionDetails><ShowAuctionGroup/></AccordionDetails>
      </Accordion>
      <Accordion expanded={noGroupPanel === "CAPTAIN"} onChange={handleNoGroupChange("CAPTAIN")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography className={classes.ngHeader}>Captain and ViceCaptain</Typography>
      </AccordionSummary>
      <AccordionDetails><ShowCaptainGroup/></AccordionDetails>
      </Accordion>
      <Accordion expanded={noGroupPanel === "MULTIPLE"} onChange={handleNoGroupChange("MULTIPLE")}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
      <Typography className={classes.ngHeader}>Multiple Group</Typography>
      </AccordionSummary>
      <AccordionDetails><ShowMultipleGroup/></AccordionDetails>
      </Accordion>
      </CardContent>
      </Card>
    )
  };
*/

  function handleSearchFieldOnChange() {
    // console.log("search presses");
    let arun = searchText.toLowerCase();
    // console.log(arun);
    // console.log(searchList);
    let myData = searchList.filter(x  => x.playerName.includes(arun));
    // console.log(myData);
    if (myData.length > 0)
      setExpandedPanel(myData[0].userName);
    else 
      setExpandedPanel("");
    return;
    /***
    console.log(playerName);
    setSearchText(playerName);
    let myText = playerName.toUpperCase()
    let userIdx = -1;
    for(let i=0; i< playerList.length; ++i) {
      let tmp = playerList[i].playerNames.findIndex(element => element.includes(myText));
      if (tmp >= 0) { userIdx = i; break; }
    }
    let currUser = (userIdx >= 0) ? playerList[userIdx].userName : "";
    // console.log(currUser); 
    setExpandedPanel(currUser);
    ***/
  }

  const handleChange = e => {
    setSearchText(e.target.value);
  };

  function updateSearchText() {
    let myText = document.getElementById("searchText").value.toLowerCase();
    setSearchText(myText);
  }

  function DisplayFilter() {
    return (
      <div>
      <TextField
        id="searchText"
        placeholder="Search Player"
        autoFocus
        // type="text"
        variant="outlined"
        fullWidth
        size="small"
        onChange={updateSearchText}
        value={searchText}
        InputProps={{
          endAdornment: searchText && (
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleSearchFieldOnChange}
            >
              <SearchIcon />
            </IconButton>
          )
        }}
      />
      </div>
    )
  }

  
  function ShowCurrent() {
    if (iplovers > 0)
      return (
        <div>
          <Typography className={classes.cc0}>{iplmatch}</Typography>
          <Typography className={classes.cc1}>Points last updated after {iplovers} overs</Typography>
        </div>
      )
    else
        return null;
  }

  function ShowStatCard() {
    console.log("DIsplay Board");
    return(
        <Card key="db_card">
          {/* <CardHeader key="db_cheader" color="warning"> */}
            {/* <h4>Statistics after ${overs}</h4> */}
            {/* <h4 className={dashClasses.cardTitleWhite}>Statistics after ${overs}</h4> */}
            {/* <p className={dashClasses.cardCategoryWhite}>
              {`Updated as of ${updTime}`}
            </p> */}
          {/* </CardHeader> */}
          <CardContent className={classes.cardContent}>
            <ShowCurrent />
            <Typography className={classes.cc2}>Updated as of {updTime}</Typography>
            {/* <DisplayFilter /> */}
          </CardContent>
          {/* <CardBody key="db_cbody"> */}
            {/* <Table
              tableHeaderColor="warning"
              tableHead={["Rank", "Franchise", "Owner", "Score"]}
              tableData={rankArray}
            /> */}
          {/* </CardBody> */}
        </Card>
    )
  }

  function DisplayFranchiseeDetails(props) {
		//console.log(props.franchisee);
    return (
      <Grid container justify="center" alignItems="center" >
      <GridItem xs={12} sm={12} md={12} lg={12} >
      <Table>
        <TableHead>
          <TableRow align="center">
					<TableCell className={gClasses.patientInfo2Brown} align="left">Team</TableCell>
            <TableCell className={gClasses.patientInfo2Brown} align="center">Player</TableCell>
            <TableCell className={gClasses.patientInfo2Brown} align="center">Score</TableCell>      
          </TableRow>
        </TableHead>
        <TableBody>
          {props.franchisee.map(item => {
            return (
              <TableRow key={item.playerName}>
								<TableCell  className={gClasses.info2} align="center" >
                  <ShowTeamImage teamName={item.team} />
                </TableCell>
                <TableCell  className={gClasses.info2} align="center" >
                  {item.playerName}
                </TableCell>
                <TableCell className={gClasses.info2} align="center" >
                  {item.playerScore}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody> 
      </Table>
      </GridItem>
      </Grid>
    )
  }

  function ShowStats() {  
      // console.log(teamArray);
      return (teamArray.map(team =>
      <Accordion key={"AC"+team.displayName} expanded={expandedPanel === team.displayName} onChange={handleAccordionChange(team.displayName)}>
          <AccordionSummary key={"AS"+team.displayName} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography className={classes.heading}>{team.displayName} ({team.userScore})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DisplayFranchiseeDetails franchisee={team.playerStat} />
              {/* <Grid container justify="center" alignItems="center" >
                  <GridItem xs={12} sm={12} md={12} lg={12} >
                      <Table
                          tableHeaderColor="warning"
                          tableHead={["Player Name", "Score"]}
                          tableData={team.playerStat.map(player => {
                              const arr = [player.playerName, player.playerScore]
                              return { data: arr, collapse: [] }
                          })}
                      />
                  </GridItem>
              </Grid> */}
          </AccordionDetails>
      </Accordion>
      ))
  }

  async function handleNextGuide() {
    let myNum = await getNextGuide();
    if (myNum === 0) closeModal();
  }

  async function handlePrevGuide() {
    let myNum = await getPrevGuide();
    if (myNum === 0) closeModal();
  }

  async function handleDisableGuide() {
    try {
      await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/apl/disableguide/${localStorage.getItem("uid")}`);
      closeModal();
    } catch (e) {
      console.log(e);
    }
  }

  function ShowGuide() {
    return (
    <form>
      <Typography id="modalTitle" className={gClasses.modalTitle} align="center">{currentGuide.guideTitle}</Typography>
      <BlankArea />
      <p align="center" className={gClasses.modalMessage}>{currentGuide.guideText}</p>
      <BlankArea />
      <div align="center" >
        <Button key="prevGuide" variant="contained" color="primary" size="small"
          disabled={currentGuide.guideNumber === 1}
          className={gClasses.modalbutton} onClick={handlePrevGuide}>Prev
        </Button>
        <Button key="nextGuide" variant="contained" color="primary" size="small"
          disabled={currentGuide.guideNumber === maxGuide}        
          className={gClasses.modalbutton} onClick={handleNextGuide}>Next
      </Button>
      <BlankArea />
      <FormControlLabel className={classes.modalCb}
        control={
          <BlueCheckbox
            checked={false}
            onChange={handleDisableGuide}
            name="checkedB"
            color="primary"
          />
        }
        label="Do not show Guide again"
      />
      </div>
    </form>  
    )
  }

  //if (localStorage.getItem("tournament").length > 0)
  return (
    <div className={gClasses.root}>
			{(localStorage.getItem("tournament").length > 0) &&
				<div>
					<DisplayPageHeader headerName="Statistics" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")}/>
					<ShowStatCard />
					<ShowStats/>
				</div>
			}
      <div className={gClasses.modalContainer} >
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={modalStyles}
          contentLabel="Example Modal"
          aria-labelledby="modalTitle"
          aria-describedby="modalDescription"
          ariaHideApp={false}
        >
          <ShowGuide />
        </Modal>
      </div>
    </div>
  );
};


