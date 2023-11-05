import React, { useEffect, useState } from 'react';
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
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

export default function MyTeam() {
    // const { user } = useContext(UserContext);
    // const theme = useTheme();

  //const classes = useStyles();
  const gClasses = globalStyles();

  const [teamArray, setTeamArray] = useState([]);
	
	const [groupAvaiable, setgroupAvaiable] = useState(hasGroup());
	
	const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    //console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };


  useEffect(() => {
    if (localStorage.getItem("team")) 
    setTeamArray(JSON.parse(localStorage.getItem("team")));

    const fetchTeam = async () => {
      try {
				var myTeamUrl = "";
				if (hasGroup())
				{
					var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/user/myteam/${localStorage.getItem("gid")}/${localStorage.getItem("uid")}`);
					setTeamArray(response.data);
					//console.log(response.data);
					localStorage.setItem("team", JSON.stringify(response.data));
				}
      } catch (e) {
          console.log(e)
      }
    }
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
		if (teamArray.length === 0) return null;
		
		let myPlayers = teamArray[0].players.filter(x => x.role === props.role);
		let pText = "";		//myPlayers.length + " Player" + ((myPlayers.length > 1) ? "s" : "");
		switch (myPlayers.length) {
			case 0: pText = 'No Players'; break;
			case 1: pText = '1 Player'; break;
			default: pText = myPlayers.length + ' Players';
		}
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
	

	return (
	<div>
	{(hasGroup) &&
		<div>
		<DisplayPageHeader headerName="My Team" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")}/>
		<BlankArea />
		<ShowPlayers role="Batsman" desc="Batsman"/>
		<ShowPlayers role="Bowler"  desc="Bowler" />
		<ShowPlayers role="AllRounder" desc="All Rounder" />
		<ShowPlayers role="Wk" desc="Wicket Keeper"/>	
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
	
	
	
	/*
  if (hasGroup())
    return (
      teamArray.map(team => 
      <div>
        <DisplayPageHeader headerName="My Team" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")}/>
				<BlankArea />
        <ShowPlayers role="Batsman" desc="Batsman"/>
				<ShowPlayers role="Bowler"  desc="Bowler" />
				<ShowPlayers role="AllRounder" desc="All Rounder" />
				<ShowPlayers role="Wk" desc="Wicket Keeper"/>
        <Divider />
        <ShowJumpButtons />
        <BlankArea />
      </div>
      )
    )
  else
    return (
      <div>
        <NoGroup/>
        <Divider />
        <ShowJumpButtons />
      </div>
    )
		
		*/
};


