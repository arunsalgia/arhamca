import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import axios from "axios";
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Grid from "@material-ui/core/Grid";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ScoreIcon from '@material-ui/icons/Info';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import VsCancel from "CustomComponents/VsCancel";


/*
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Avatar from "@material-ui/core/Avatar"
*/

// import { UserContext } from "../../UserContext";
// import { Typography } from '@material-ui/core';
// import CardAvatar from "components/Card/CardAvatar.js";
import { NoGroup, DisplayPageHeader, BlankArea, JumpButton, DisplayMyPlayers } from 'CustomComponents/CustomComponents.js';
import { hasGroup } from 'views/functions';
import { Divider } from '@material-ui/core';
import globalStyles from "assets/globalStyles";


//const playerRoles = ["Batsman", "Bowler", "AllRounder", "Wk"];
//const drawerWidth = 100;

/*
import {orange, deepOrange}  from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  margin: {
      margin: theme.spacing(1),
  },
  image: {
      height: "200px"
  },
  drawer: {
      width: drawerWidth,
      flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  medium: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
	heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

*/

const NoInit = "NOINIT"

export default function MyTeam() {
    // const { user } = useContext(UserContext);
    // const theme = useTheme();

  //const classes = useStyles();
  const gClasses = globalStyles();

  const [teamArray, setTeamArray] = useState([]);
	const [auctionStatus, setAuctionStatus] = useState(NoInit);
	const [groupMembers, setGroupMembers] = useState([]);
	const [groupAvaiable, setgroupAvaiable] = useState(hasGroup());
	const [teamDrawer, setTeamDrawer] = useState("");
	const [currentFranchiseName, setCurrentFranchiseName] = useState("");
	const [franchiseTeam, setFranchiseTeam] = useState([]);
	const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    //console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };


  useEffect(() => {
    if (localStorage.getItem("team")) 
    setTeamArray(JSON.parse(localStorage.getItem("team")));
		
		const getAuctionStatus = async ()  => {
			if (hasGroup())
			{
				var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/auction/status/${localStorage.getItem("gid")}`);
				setAuctionStatus(response.data);
				//console.log(response.data);	
			}
		}

		const getGroupMembers = async ()  => {
			if (hasGroup())
			{
				var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/groupmember/allmember/${localStorage.getItem("gid")}`);
				setGroupMembers(response.data);
				//console.log(response.data);	
			}
		}

    const fetchTeam = async () => {
      try {
				var myTeamUrl = "";
				if (hasGroup())
				{
					var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/myteam/${localStorage.getItem("gid")}/ALL`);
					setTeamArray(response.data);
					//console.log(response.data);
					localStorage.setItem("team", JSON.stringify(response.data));
				}
      } catch (e) {
          console.log(e)
      }
    }
    
		getGroupMembers();
		getAuctionStatus();
		fetchTeam();
  }, []);


  function ShowJumpButtons() {
    return (
      <div>
        <BlankArea />
        <JumpButton page={process.env.REACT_APP_HOME} text="Home" />
      </div>
    )
  }

	function ShowPlayers(props) {
    //console.log(props.role);
		let myPlayers = franchiseTeam.filter(x => x.role.toUpperCase() === props.role.toUpperCase());
		let pText = "";		//myPlayers.length + " Player" + ((myPlayers.length > 1) ? "s" : "");
		switch (myPlayers.length) {
			case 0: pText = 'No Players'; break;
			case 1: pText = '1 Player'; break;
			default: pText = myPlayers.length + ' Players';
		}
    //console.log(myPlayers);
		if (true) //(myPlayers.length > 0)
			return (
			<Accordion key={props.role} expanded={expandedPanel === props.role} onChange={handleAccordionChange(props.role)}>
			<AccordionSummary key={props.role} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
			<Typography className={gClasses.info2}>{props.desc} ( {pText} )</Typography>
			</AccordionSummary>
			<AccordionDetails>
			<DisplayMyPlayers players={myPlayers} />
			</AccordionDetails>
			</Accordion>
			)
		else
			return null;
	}

	
	function showFranchiseTeam(member) {
		setCurrentFranchiseName(member.displayName);
		var tmp = teamArray.filter(x => x.uid === member.uid);
    //console.log(tmp);
		setFranchiseTeam(tmp[0].players);
		setTeamDrawer("SHOWTEAM");
	}
	
	function ShowFranchise() {
		if (auctionStatus === NoInit) return null;
		var myMembers = (auctionStatus === "OVER" ) ? groupMembers : groupMembers.filter( x => x.uid == localStorage.getItem("uid"));
	return (
		<Box border={2} >
		<Table>
			<TableBody>
				{myMembers.map( (m, index) => {
				var myClass = gClasses.tableCellOdd;  //((index % 2) == 0) ? gClasses.tableCellEven : gClasses.tableCellOdd;
				return (
					<TableRow onClick={() => showFranchiseTeam(m) } className={gClasses.test}  key={m.displayName}>
						<TableCell align="left" className={myClass} ><Typography className={gClasses.info2}>{m.displayName} ( {m.userName} )</Typography></TableCell>
						<TableCell align="right" className={myClass} >
							<ArrowDropDownIcon style={{color: 'blue'}} size="small" onClick={() => showFranchiseTeam(m) } />
						</TableCell>
						</TableRow>
				)})}
			</TableBody>
		</Table>
		</Box>
	)}
	
	

	return (
	<div>
	{(hasGroup) &&
		/*<div>
		<DisplayPageHeader headerName="My Team" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")}/>
		<BlankArea />
		<ShowPlayers role="Batsman" desc="Batsman"/>
		<ShowPlayers role="Bowler"  desc="Bowler" />
		<ShowPlayers role="AllRounder" desc="All Rounder" />
		<ShowPlayers role="Wk" desc="Wicket Keeper"/>	
		</div>*/
		<div>
			<DisplayPageHeader headerName="Team Members" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")} />
			<br />
			<Container component="main" maxWidth="xs">
			<ShowFranchise />
			<Drawer key="Team" anchor="top" variant="temporary" open={teamDrawer != ""}>
        <Container component="main" maxWidth="xs">
				<Box className={gClasses.drawerStyle} borderColor="black" borderRadius={7} border={1} >
				<VsCancel align="right" onClick={() => { setTeamDrawer("")}} />	
				<Typography align="center" className={gClasses.patientInfo2}>Team of {currentFranchiseName}</Typography>
				<ShowPlayers role="Batsman" desc="Batsman"/>
				<ShowPlayers role="Bowler"  desc="Bowler" />
				<ShowPlayers role="AllRounder" desc="All Rounder" />
				<ShowPlayers role="Wk" desc="Wicket Keeper"/>	
				</Box>
        </Container>
			</Drawer>
			</Container>
		</div>
	}
	{(!hasGroup) && 
		<NoGroup/>
	}
	<Divider />
	<ShowJumpButtons />
	<BlankArea />	
	</div>
	)
	

};


