import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import { Player } from 'video-react';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from "@material-ui/core/Grid";
import Table from "components/Table/Table.js";
import GridItem from "components/Grid/GridItem.js";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import {BlankArea, JumpButtonOnly} from "CustomComponents/CustomComponents.js"
// import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
//import socketIOClient from "socket.io-client";
import { DisplayPageHeader, DisplayVersion } from 'CustomComponents/CustomComponents.js';
import {currentAPLVersion, latestAPLVersion} from "views/functions.js";
import { blue, red } from '@material-ui/core/colors';



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  card: {
    backgroundColor: '#B3E5FC',
  },
  t20Card: {
    backgroundColor: '#D3D3D3',
  },
  odiCard: {
    backgroundColor: '#B3E5FC',
  },
  testCard: {
    backgroundColor: '#FFC0CB',
  },
  note: {
    fontWeight: theme.typography.fontWeightBold,
    fontStyle: "italic",
  },
  heading: {
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
    color: blue[800],
  },
  bold: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightBold,
  },
  media: {
    height: 0,
    //paddingTop: '56.25%', // 16:9
    paddingTop: '100%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));
  

export default function PsPage() { 
  const classes = useStyles();
   const [matchType, setMatchType] = useState("T20");


  useEffect(() => {  
  }, []);


  

  function Note() {
    return (
    <Typography className={classes.note}>Note:</Typography>
    )}

  function DisplayBold(props) {
  return (
    <Typography className={classes.bold} paragraph>{props.message}</Typography>  
  )}

  function DisplayHeader(props) {
  return(
    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
    <Typography className={classes.heading}>{props.header}</Typography>
    </AccordionSummary>   
  )}
  
  function DisplayPoint(props) {
  return (
  <div>
  <Grid key={props.akey} container>
  <Grid item xs={8} sm={8} md={8} lg={8} >
  <Typography>{props.akey}</Typography>
  {/* <Typography paragraph>{props.value}</Typography> */}
  </Grid>
  <Grid item xs={4} sm={4} md={4} lg={4} >
  <Typography>{props.value}</Typography>
  </Grid>
  </Grid>
  </div> 
  )}

  function DisplayMatchType() {
  //console.log(matchType);
  return(
    <Grid key="matchtype" align="center" container>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_t20" variant="contained" color="primary" size="small"
    className={classes.button} onClick={() => {setMatchType("T20")}}>T20
    </Button>
    </Grid>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_odi" variant="contained" color="primary" size="small"
    className={classes.button} onClick={() => {setMatchType("ODI")}}>ODI
    </Button>
    </Grid>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_test" variant="contained" color="primary" size="small"
    className={classes.button} onClick={() => {setMatchType("TEST")}}>TEST
    </Button>
    </Grid>
    </Grid>      
  )};

  function PS_Header(props) {
  return(<h4 align="center">{props.header}</h4>)
  }

  function T20_PointSystem() {
  return (
    <Card className={classes.t20Card}>
    <CardContent>
    <PS_Header header="T20 Point system" />
    <DisplayBold message="Batting Points:" />
    <DisplayPoint akey="● Run" value="1 point"/>
    <DisplayPoint akey="● Boundary bonus" value="1 point" />
    <DisplayPoint akey="● Six bonus" value="2 point" />
    <DisplayPoint akey="● Half century bonus" value="20 point" />
    <DisplayPoint akey="● Century bonus" value="50 point" />
    <DisplayPoint akey="● Double century bonus" value="100 point" />
    <DisplayPoint akey="● Duck Penalty" value="-2 point" />
    <Note/>
    <Typography paragraph>
    If any player scores century in a match will only 
    get bonus point of century no extra 
    bonus point for half-century.
    Same rule applies for Double century.
    </Typography>
    <DisplayBold message="Bowling Points:"/>
    <DisplayPoint akey="● Wicket (except runout)" value="25 point" />
    <DisplayPoint akey="● 3 wicket bonus" value="20 point" />
    <DisplayPoint akey="● 5 wicket bonus" value="50 point" />
    <DisplayPoint akey="● Maiden Over bonus" value="20 point" />
    <Note/>
    <Typography paragraph>
    If any player gets 5 wicket in a match only the bonus point of 5 wicket haul is awarded. No extra bonus points for 3 wicket haul. 
    </Typography>
    <DisplayBold message="Fielding Points:"/>
    <DisplayPoint akey="● Catch" value="4 point" />
    <DisplayPoint akey="● Run out" value="4 point" />
    <DisplayPoint akey="● Stumping" value="6 point" />
    <BlankArea/>
    <DisplayBold message="Economy Points:"/>
    <DisplayPoint akey="● Runs/over <= 6.0" value="2 point" />
    <DisplayPoint akey="● Runs/over >= 9.0" value="-2 point" />
    <Note/>
    <Typography paragraph>
    Minimum 2 over need to be bowled by player to check economy.
    </Typography>
    <DisplayBold message="Performance Points:"/>
    <DisplayPoint akey="● Man of the Match " value="20 point" />
    <DisplayPoint akey="● Tournament Max Runs" value="100 point" />
    <DisplayPoint akey="● Tournament Max Wickets" value="100 point" />
    <BlankArea/>
    <DisplayBold message="Captain and ViceCaptain:"/>
    <DisplayPoint akey="● Captain" value="2x point" />
    <DisplayPoint akey="● ViceCaptain" value="1.5x point" />
    <Note/>
    <Typography paragraph>
    Only points of runs and wickets will considered for 2x for Captain and 1.5x for ViceCaptain.
    </Typography>
    </CardContent>
    </Card>
  )}

  function ODI_PointSystem() {
  return(
    <Card className={classes.odiCard}>
    <CardContent>
    <PS_Header header="ODI Point system" />
    <DisplayBold message="Batting Points:" />
    <DisplayPoint akey="● Run" value="1 point"/>
    <DisplayPoint akey="● Boundary bonus" value="1 point" />
    <DisplayPoint akey="● Six bonus" value="2 point" />
    <DisplayPoint akey="● Half century bonus" value="20 point" />
    <DisplayPoint akey="● Century bonus" value="50 point" />
    <DisplayPoint akey="● Double century bonus" value="100 point" />
    <DisplayPoint akey="● Duck Penalty" value="-2 point" />
    <Note/>
    <Typography paragraph>
    If any player scores century in a match will only 
    get bonus point of century no extra 
    bonus point for half-century.
    Same rule applies for Double century.
    </Typography>
    <DisplayBold message="Bowling Points:"/>
    <DisplayPoint akey="● Wicket (except runout)" value="25 point" />
    <DisplayPoint akey="● 4 wicket bonus" value="20 point" />
    <DisplayPoint akey="● 5 wicket bonus" value="50 point" />
    <DisplayPoint akey="● Maiden Over bonus" value="10 point" />
    <Note/>
    <Typography paragraph>
    If any player gets 5 wicket in a match only the bonus point of 5 wicket haul is awarded. No extra bonus points for 4 wicket haul. 
    </Typography>
    <DisplayBold message="Fielding Points:"/>
    <DisplayPoint akey="● Catch" value="4 point" />
    <DisplayPoint akey="● Run out" value="4 point" />
    <DisplayPoint akey="● Stumping" value="6 point" />
    <BlankArea/>
    <DisplayBold message="Economy Points:"/>
    <DisplayPoint akey="● Runs/over <= 4.0" value="2 point" />
    <DisplayPoint akey="● Runs/over >= 7.0" value="-2 point" />
    <Note/>
    <Typography paragraph>
    Minimum 2 over need to be bowled by player to check economy.
    </Typography>
    <DisplayBold message="Performance Points:"/>
    <DisplayPoint akey="● Man of the Match " value="20 point" />
    <DisplayPoint akey="● Tournament Max Runs" value="100 point" />
    <DisplayPoint akey="● Tournament Max Wickets" value="100 point" />
    <BlankArea/>
    <DisplayBold message="Captain and ViceCaptain:"/>
    <DisplayPoint akey="● Captain" value="2x point" />
    <DisplayPoint akey="● ViceCaptain" value="1.5x point" />
    <Note/>
    <Typography paragraph>
    Only points of runs and wickets will considered for 2x for Captain and 1.5x for ViceCaptain.
    </Typography>
    </CardContent>
    </Card>
  )}

  function TEST_PointSystem() {
    return(
      <Card className={classes.testCard}>
      <CardContent>
      <PS_Header header="TEST Point system" />
      <DisplayBold message="Batting Points:" />
      <DisplayPoint akey="● Run" value="1 point"/>
      <DisplayPoint akey="● Boundary bonus" value="1 point" />
      <DisplayPoint akey="● Six bonus" value="2 point" />
      <DisplayPoint akey="● Half century bonus" value="10 point" />
      <DisplayPoint akey="● Century bonus" value="50 point" />
      <DisplayPoint akey="● Double century bonus" value="100 point" />
      <DisplayPoint akey="● Duck Penalty" value="-2 point" />
      <Note/>
      <Typography paragraph>
      If any player scores century in a match will only 
      get bonus point of century no extra 
      bonus point for half-century.
      Same rule applies for Double century.
      </Typography>
      <DisplayBold message="Bowling Points:"/>
      <DisplayPoint akey="● Wicket (except runout)" value="25 point" />
      <DisplayPoint akey="● 4 wicket bonus" value="20 point" />
      <DisplayPoint akey="● 5 wicket bonus" value="50 point" />
      <Note/>
      <Typography paragraph>
      If any player gets 5 wicket in a match only the bonus point of 5 wicket haul is awarded. No extra bonus points for 4 wicket haul. 
      </Typography>
      <DisplayBold message="Fielding Points:"/>
      <DisplayPoint akey="● Catch" value="4 point" />
      <DisplayPoint akey="● Run out" value="4 point" />
      <DisplayPoint akey="● Stumping" value="6 point" />
      <BlankArea/>
      <DisplayBold message="Performance Points:"/>
      <DisplayPoint akey="● Man of the Match " value="20 point" />
      <DisplayPoint akey="● Tournament Max Runs" value="100 point" />
      <DisplayPoint akey="● Tournament Max Wickets" value="100 point" />
      <BlankArea/>
      <DisplayBold message="Captain and ViceCaptain:"/>
      <DisplayPoint akey="● Captain" value="2x point" />
      <DisplayPoint akey="● ViceCaptain" value="1.5x point" />
      <Note/>
      <Typography paragraph>
      Only points of runs and wickets will considered for 2x for Captain and 1.5x for ViceCaptain.
      </Typography>
      </CardContent>
      </Card>
      )}
  
  function ShowPointSystem() {
  //console.log("In Point System");
  if (matchType === "TEST") {
    return (<div><TEST_PointSystem /></div>); 
  } else if (matchType === "ODI") {
    return (<div><ODI_PointSystem /></div>); 
  } else if (matchType === "T20") {
    return (<div><T20_PointSystem /></div>); 
  } else {
    return (<h5>Unknown match type</h5>); 
  }}
  
  
  return (
    <div>
    <DisplayMatchType />
    <ShowPointSystem />
    </div>
  );
}

