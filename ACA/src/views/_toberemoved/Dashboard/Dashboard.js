import React from "react";
import axios from "axios";
// react plugin for creating charts

// @material-ui/core
import { useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import SportsHandballIcon from '@material-ui/icons/SportsHandball';
import TimelineIcon from '@material-ui/icons/Timeline';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import Button from '@material-ui/core/Button';
import Update from "@material-ui/icons/Update";

import Accessibility from "@material-ui/icons/Accessibility";

import Typography from '@material-ui/core/Typography';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';

// core components
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
// import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import socketIOClient from "socket.io-client";
import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
import globalStyles from "assets/globalStyles";
import {hasGroup} from "views/functions.js";
import { NoGroup, BlankArea } from 'CustomComponents/CustomComponents.js';
import { blue, orange, deepOrange}  from '@material-ui/core/colors';
import { getTsBuildInfoEmitOutputFilePath } from "typescript";

import Modal from 'react-modal';

const CardColor = "#ff9800";
const currencyChar = '₹';

const modelStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    marginBottom          : '-50%',
    transform             : 'translate(-50%, -50%)',
    background            : '#000000',
    color                 : '#FFFFFF',
    transparent           : false,   
  }
};

const useStyles = makeStyles(styles);

const useDashStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
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
  cardContent: {
    // color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: '#18FFFF',   //deepOrange[500],
    margin: 0,
    padding: "none",
    //height: 20,
  },
  dashTitleWhite: {
    color: theme.palette.getContrastText(CardColor),
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      // color: grayColor[1],
      color: theme.palette.getContrastText(CardColor),
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  dashCategoryWhite: {
    color: theme.palette.getContrastText(CardColor),
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cc0: {
    color: theme.palette.getContrastText(CardColor),
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
  modalContainer: {
    content: "",
    opacity: 0.8,
    // background: rgb(26, 31, 41) url("your picture") no-repeat fixed top;
    // background-blend-mode: luminosity;
    /* also change the blend mode to what suits you, from darken, to other 
    many options as you deem fit*/
    // background-size: cover;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    // position: absolute;
    // z-index: -1;
    // height: 500px;
  },
  modalTitle: {
    color: blue[700],
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
  },
  modalMessage: {
    //color: blue[700],
    fontSize: theme.typography.pxToRem(14),
    //fontWeight: theme.typography.fontWeightBold,
  },
  modalbutton: {
    margin: theme.spacing(2, 2, 2),
  },
})); 

function leavingDashboard(myConn) {
  //console.log("Leaving Dashboard wah wah ");
  myConn.disconnect();
}


let first =  true;

export default function Dashboard() {
  const gClasses = globalStyles();

  const [rankArray, setRankArray] = useState([]);
  const [rank, setRank] = useState(0);
  const [prize, setPrize] = useState(0);
  const [score, setScore] = useState(0);
  const [mostRuns, setMostRuns] = useState({});
  const [mostWickets, setMostwickets] = useState({});
  const date = new Date().toDateString() + " " + new Date().toLocaleTimeString();
  const [iplovers, setIPLOvers] = useState("0");
  const [ipltitle, setIPLTitle] = useState("");
  const [iplmatch, setIPLMatch] = useState("");
  const [teamArray, setTeamArray] = useState([]);
  const [currentGuide, setCurrentGuide] = useState({guideNumber: 0});
  const [maxGuide, setMaxGuide] = useState(0);
	const [tournamentOver, setTournamentOver] = useState(false);
  const classes = useStyles();
  const dashClasses = useDashStyles();

  const tableData = (rankDetails) => {
    const arr = rankDetails.map(element => {
      const { displayName, userName, grandScore, rank } = element;
      //const {rank,displayName,userName,grandScore}=element;
      // return { data: Object.values({ rank, displayName, userName, displayName, grandScore }), collapse: [] }
      return { data: Object.values({ rank, displayName, userName, grandScore }), collapse: [] }
    });

    return arr;
  }

  useEffect(() => {
    var sendMessage = {page: "DASH", gid: localStorage.getItem("gid"), uid: localStorage.getItem("uid"), userName:  localStorage.getItem("userName")};

    if (localStorage.getItem("saveRank"))
      setRank(JSON.parse(localStorage.getItem("saveRank")));

		if (localStorage.getItem("savePrize"))
      setPrize(JSON.parse(localStorage.getItem("savePrize")));
  
    if (localStorage.getItem("saveScore"))
      setScore(JSON.parse(localStorage.getItem("saveScore")));

    if (localStorage.getItem("saveMaxRun"))
      setMostRuns(JSON.parse(localStorage.getItem("saveMaxRun")))

    if (localStorage.getItem("saveMaxWicket"))
      setMostwickets(JSON.parse(localStorage.getItem("saveMaxWicket")));

    if (localStorage.getItem("statData")) {
      let sData = JSON.parse(localStorage.getItem("statData"))
      setTeamArray(sData);
      // generatePlayerList(sData);
    }

    if (localStorage.getItem("saveRankArray"))
      setRankArray(JSON.parse(localStorage.getItem("saveRankArray")));

    const makeconnection = async () => {
      await sockConn.connect();
      // console.log("just after connect command");
      // console.log(`DASG gis ${sendMessage}`);
      sockConn.emit("page", sendMessage);
    }

    var sockConn = socketIOClient(process.env.REACT_APP_ENDPOINT);
    // console.log("in dashboard before make connection");
    makeconnection();
    // console.log("in dashboard after make connection");

    sockConn.on("connect", function() {
      sockConn.emit("page", sendMessage);
      sockConn.on("rank", (rank) => {
        // console.log(new Date());
        // console.log(localStorage.getItem("uid"))
				//console.log("Rank from server");
				//console.log(rank);
				// array = [{"adults":2,"children":3},{"adults":2,"children":1}];
				// var totalChild = this.array.reduce((accum,item) => accum + item.children, 0)
				var totprize = rank.reduce((accum, item) => accum + item.prize, 0)
				//console.log(totprize);
				setTournamentOver(totprize > 0);
				// console.log(totprize > 0);
				
        const allRank = rank.filter(x => x.gid == localStorage.getItem("gid"));
        const userDetails = allRank.filter(x => x.uid == localStorage.getItem("uid"));
        // console.log(allRank);

        if (userDetails.length > 0) {
          // if details of current user found (current user is a member of group 1)
          //console.log(userDetails[0]);
          setRank(userDetails[0].rank);
					setPrize(userDetails[0].prize);
          setScore(userDetails[0].grandScore)
          localStorage.setItem("saveRank", JSON.stringify(userDetails[0].rank));
					localStorage.setItem("savePrize", JSON.stringify(userDetails[0].prize));
          localStorage.setItem("saveScore", JSON.stringify(userDetails[0].grandScore));
		  //console.log(userDetails[0].rank);
		  
          // let myArray = tableData(allRank)
          let myArray = allRank;
          setRankArray(myArray);
          localStorage.setItem("saveRankArray", JSON.stringify(myArray));

        } else if (localStorage.getItem("admin") === "true") {
          // current user is not member of the group but is ADMIN. Thus show the rank details
          setRankArray(tableData(allRank));
        }

      });

      sockConn.on("maxRun", (maxRun) => {
        
        const allMaxRun = maxRun.filter(x => x.gid === parseInt(localStorage.getItem("gid")));
        const runDetails = allMaxRun.filter(x => x.uid === parseInt(localStorage.getItem("uid")));
        // console.log(runDetails)
        if (runDetails.length > 0) {
          setMostRuns(runDetails[0])
          localStorage.setItem("saveMaxRun", JSON.stringify(runDetails[0]));
        }

      });

      sockConn.on("maxWicket", (maxWicket) => {
        
        const allMaxWicket = maxWicket.filter(x => x.gid === parseInt(localStorage.getItem("gid")));
        const wicketDetails = allMaxWicket.filter(x => x.uid === parseInt(localStorage.getItem("uid")));
        // console.log(wicketDetails);
        if (wicketDetails.length > 0) {
          setMostwickets(wicketDetails[0]);
          localStorage.setItem("saveMaxWicket", JSON.stringify(wicketDetails[0]));
        }

      });

      sockConn.on("brief", (stat) => {
        var gStat = stat.filter(x => x.gid === parseInt(localStorage.getItem("gid")));
		//console.log(gStat);
        if (gStat.length > 0) {
          for(let rank=0; rank < gStat.length; ++rank) {
            gStat[rank]["rank"] = rank+1;
          }
          setTeamArray(gStat)
          localStorage.setItem("statData", JSON.stringify(gStat));
          if (first) {
            //console.log(gStat);
            first = false;
          }
        }
        // let myTime = new Date().toDateString() + " " + new Date().toLocaleTimeString();
        // setUpdTime(myTime);
      })

      sockConn.on("overs", (myOvers) => {
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
      });
    });

    async function getGuide() {
      try {
        let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/apl/getmaxguide`;
        // console.log(myURL);
        let response = await axios.get(myURL);
        console.log(response);
        setMaxGuide(parseInt(response.data));
        let tmp = await getNextGuide();
        if (tmp) {
          console.log(tmp);
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
      leavingDashboard(sockConn);
    }
   

  }, []);
// }, [rankArray]);

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
      console.log(e);
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
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    //subtitle.style.color = '#f00';
  }

  function closeModal(){
    setIsOpen(false);
  }


  function ShowUserBoard() {
    // if (localStorage.getItem("ismember") === "true")
      return(
      <GridContainer key="db_gc_ub">
        <GridItem key="db_gi_ub1" xs={12} sm={6} md={3}>
          <Card key="db_card_ub1">
            <CardHeader key="db_chdr_ub1" color="warning" stats icon>
              <CardIcon color="warning">
                <GroupIcon />
              </CardIcon>
              <h2 className={classes.cardCategory}>Rank</h2>
              <h3 className={classes.cardTitle}>
                {rank + ((prize >0) ? " (You won: ₹" + prize + ")" : "") }
              </h3>
            </CardHeader>
            <CardFooter key="db_cftr_ub1" stats>
              <div className={classes.stats}>
                <GroupIcon />
                <a href="#pablo" onClick={e => e.preventDefault()}>
                  {localStorage.getItem("groupName") + ((tournamentOver) ? " (Tournament Over)" : "")}
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem key="db_gi_ub2" xs={12} sm={6} md={3}>
          <Card key="db_card_ub2">
            <CardHeader key="db_chdr_ub2" color="success" stats icon>
              <CardIcon color="success">
                <TimelineIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Total Points</p>
              <h3 className={classes.cardTitle}>{score}</h3>
            </CardHeader>
            <CardFooter key="db_cftr_ub2" stats>
              <div className={classes.stats}>
                <Update />
                {localStorage.getItem("tournament")}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem key="db_gi_ub3" xs={12} sm={6} md={3}>
          <Card key="db_card_ub3">
            <CardHeader key="db_chdr_ub3" color="info" stats icon>
              <CardIcon color="info">
                <Accessibility />
              </CardIcon>
              <p className={classes.cardCategory}>Most Runs</p>
              <h3 className={classes.cardTitle}>{mostRuns ? mostRuns.maxRunPlayerName : ""}</h3>
            </CardHeader>
            <CardFooter key="db_cftr_ub3" stats>
              <div className={classes.stats}>
                <Accessibility />
                {mostRuns ? mostRuns.maxRun : ""}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem key="db_gi_ub4" xs={12} sm={6} md={3}>
          <Card key="db_card_ub4">
            <CardHeader key="db_chdr_ub4" color="danger" stats icon>
              <CardIcon color="danger">
                <SportsHandballIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Most Wickets</p>
              <h3 className={classes.cardTitle}>{mostWickets ? mostWickets.maxWicketPlayerName : ""}</h3>
            </CardHeader>
            <CardFooter key="db_cftr_ub4" stats>
              <div className={classes.stats}>
                <SportsHandballIcon />
                {mostWickets ? mostWickets.maxWicket : ""}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      )
    // else
    //     return(<div></div>);        // no display if not a member
  } 

  function OrgDisplayAllRank() {
    return (
      <Table
      tableHeaderColor="warning"
      tableHead={["Rank", "Franchise", "Owner", "Score"]}
      tableData={rankArray}
      />
    );
  }


  function DisplayAllRank() {
    return (
      // <Grid container justify="center" alignItems="center" >
      // <GridItem xs={12} sm={12} md={12} lg={12} >
      <Table>
        <TableHead p={0}>
        <TableRow align="center">
          <TableCell className={gClasses.th} p={0} align="center">Rank</TableCell>
          <TableCell className={gClasses.th} p={0} align="center">Franchise (Owner)</TableCell>
          {/* <TableCell className={dashClasses.th} p={0} align="center">Owner</TableCell> */}
          <TableCell className={gClasses.th} p={0} align="center">Score</TableCell>      
        </TableRow>
      </TableHead>
      < TableBody p={0}>
        {rankArray.map(item => {
          return (
            <TableRow key={item.userName}>
              <TableCell  className={gClasses.td} p={0} align="center" >
                {item.rank}
              </TableCell>
              <TableCell  className={gClasses.td} p={0} align="center" >
                {item.displayName+" ("+item.userName+")"}
              </TableCell>
              <TableCell className={gClasses.td} p={0} align="center" >
                {item.grandScore}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody> 
    </Table>
      // </GridItem>
      // </Grid>
    );
  }

  function ShowHeader() {
    if (iplovers > 0)
      return (
        <div>
          <h4 className={dashClasses.dashTitleWhite}>Franchise Score Board</h4>
          <p className={dashClasses.dashCategoryWhite}>{iplmatch}</p>
          <p className={dashClasses.dashCategoryWhite}>Points last updated after {iplovers} overs</p>
          <p className={dashClasses.dashCategoryWhite}>{`Updated as of ${date}`}</p>
        </div>
      )
    else
    return (
      <div>
        <h4 className={dashClasses.dashTitleWhite}>Franchise Score Board</h4>
        {/* <p className={classes.dashCategoryWhite}>{iplmatch}</p>
        <p className={classes.dashCategoryWhite}>Points last updated after {iplovers} overs</p> */}
        <p className={dashClasses.dashCategoryWhite}>{`Updated as of ${date}`}</p>
      </div>
    )
}

function DisplayFranchiseeDetails(props) {
  return (
    <Grid container justify="center" alignItems="center" >
    <GridItem xs={12} sm={12} md={12} lg={12} >
    <Table>
      <TableHead>
        <TableRow align="center">
          <TableCell className={dashClasses.th} align="center">Player Name</TableCell>
          <TableCell className={dashClasses.th} align="center">Score</TableCell>      
        </TableRow>
      </TableHead>
      <TableBody>
        {props.franchisee.map(item => {
          return (
            <TableRow key={item.playerName}>
              <TableCell  className={dashClasses.td} align="center" >
                {item.playerName}
              </TableCell>
              <TableCell className={dashClasses.td} align="center" >
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

const [expandedPanel, setExpandedPanel] = useState(false);
const handleAccordionChange = (panel) => (event, isExpanded) => {
  console.log({ event, isExpanded });
  setExpandedPanel(isExpanded ? panel : false);
};

function ShowStats() {  
  // console.log(teamArray);
  return (teamArray.map(team =>
  <Accordion key={"AC"+team.displayName} expanded={expandedPanel === team.displayName} onChange={handleAccordionChange(team.displayName)}>
      <AccordionSummary key={"AS"+team.displayName} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className={dashClasses.heading}>{team.rank}-{team.userName} </Typography>
          <Typography className={dashClasses.heading}>Rank-{team.rank} Score({team.userScore})</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <DisplayFranchiseeDetails franchisee={team.playerStat} />
      </AccordionDetails>
  </Accordion>
  ))
}

  function ShowUserRank() {
    return(
        <Card key="db_card">
          <CardHeader key="db_cheader" color="warning">
            <ShowHeader />
          </CardHeader>
          <CardBody key="db_cbody">
            <DisplayAllRank />
            {/* <ShowStats/> */}
          </CardBody>
        </Card>
    )
  }

  async function handleNextGuide() {
    let myNum = await getNextGuide();
    if (myNum === 0) closeModal();
  }

  async function handlePrevGuide() {
    let myNum = await getPrevGuide();
    if (myNum === 0) closeModal();
  }


  function ShowGuide() {
    return (
    <form>
      <Typography id="modalTitle" className={dashClasses.modalTitle} align="center">{currentGuide.guideTitle}</Typography>
      <BlankArea />
      <p align="ceter">{currentGuide.guideText}</p>
      <BlankArea />
      <div align="center">
        <Button key={"prevGuide"} variant="contained" color="primary" size="small"
          disabled={currentGuide.guideNumber === 1}
          className={classes.modalbutton} onClick={handlePrevGuide}>Prev
        </Button>
        <Button key="nextGuide" variant="contained" color="primary" size="small"
          disabled={currentGuide.guideNumber === maxGuide}        
          className={classes.modalbutton} onClick={handleNextGuide}>Next
      </Button>
      </div>
    </form>  
    )
  }

  if (hasGroup())
    return (
    <div>
      <ShowUserBoard />
      <ShowUserRank />
      <div className={dashClasses.modalContainer} >
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={modelStyles}
          contentLabel="Example Modal"
          aria-labelledby="modalTitle"
          aria-describedby="modalDescription"
        >
          <ShowGuide />
        </Modal>
      </div>
    </div>
    );
  else
    return (
    <NoGroup/>  
    )
}
