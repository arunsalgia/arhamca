import React, { useEffect, useState, useRef } from 'react';
import globalStyles from "assets/globalStyles";
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
// import { Player } from 'video-react';
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
import {BlankArea} from "CustomComponents/CustomComponents.js"
// import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
//import socketIOClient from "socket.io-client";
import { DisplayPageHeader, DisplayVersion } from 'CustomComponents/CustomComponents.js';
import {currentAPLVersion, latestAPLVersion} from "views/functions.js";
import { blue, red } from '@material-ui/core/colors';


const ImageStyle = {paddingTop: '56.25%' };

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
    //height: 0,
    paddingTop: '56.25%', // 16:9
    //paddingTop: '100%', // 16:9
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
  
var MSG1="You need a Group to play along with your friends and / or family. One amongst you will create the Group and others will join the Group using GroupCode shared by group creator. The member who has created the group will be the Group Admin."
var MSG2="To create new Group, the first step is to go to the Home page and select the tournament in which you want to participate."
var MSG3='Once tournament is selected click on "Create Group" button. You will be redirected to the page to provide Group details.'
var MSG3_1='1. Select the Group Name of your choice.'
var MSG3_2='2. Select the number of members required for the group.'
var MSG3_3='3. Select the members fee. This member fee times the total number of members will be the total prize money.'
var MSG3_4='4. One of the best feature of playing in APL is member will be enjoy the process of Auction to purchase the players. Select the number of maximum players each member can purchase during the auction.'
var MSG3_5='5. Select the number of coins that will be available to each member for purchasing players during the auction.'
var MSG3_6='6. Finally select the number of prizes for the winners.'
var MSG3_FINAL1='Once all the selection is complete press on "Create" button. This will create the group with the given name and provide the Group Code.'
var MSG3_FINAL2='Share the Group Code with your friends for them to join the group.'
var MSG4='Once the Group code is shared with you, just go to home page and click on "Join Group", enter Group Code and join.'

var MULTIPLEGROUP_1="APL allows users to play in multiple groups. e.g. for the same tournament you can play along with your friends, play along with family, play along with office colleagues in office simultaneously."
var MULTIPLEGROUP_2="If you are playing in multiple groups, go to Home page and select any of your group as Current Group to the its details."

var AUCTION_1='Once all the member have joined the group, the next step is to purchase the players in Auction. Go to home page and click on Auction button';
var AUCTION_2='Ideally it is expected that all the members should go for Auction together so that nobody misses the chance to purchase the players.'
var AUCTION_3='Note that auction has to be done before the tournament has started.'
var AUCTION_4='In Auction page "Start Auction" button will be visible to group owner while others will have the message "Auction has not been started".'
var AUCTION_5='Once all are ready, Group Admin will click on "Start Auction" button.'

var CAPTAIN_1='Once the Auction is complete, member need go to home page and click on "Captain" button and select the Captain and Vice-Captain from the players purchased by them.'

var TEAM_1='Member can click on TEAM button to find out the players purchased by all the members.'

export default function HowToPlay() { 
  const classes = useStyles();
  const gClasses = globalStyles();
  const [currentVersion, setCurrentVersion] = useState(9.9);
  const [latestVersion, setLatestVersion] = useState(8.8);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };


  useEffect(() => {  
    const getVersion = async () => { 
      let v1 = await currentAPLVersion();
      let v2 = await latestAPLVersion();
      setCurrentVersion(v1);
      setLatestVersion(v2);   
    }
    getVersion()
  }, []);


  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // console.log({ event, isExpanded });
    setExpandedPanel(isExpanded ? panel : false);
  };
  
  function DisplayImage(props) {
    let imageName = `${process.env.PUBLIC_URL}/howtoplay/${props.image}`
    return (
    <div>
    <CardMedia style={ImageStyle} image={imageName} title={props.title} />
    <BlankArea/>
    </div>
    )
  }



  function WriteParagraph(props) {
  return(
    <Typography className={gClasses.info14} style={ {textAlign: "justify", paddingLeft: "20px", paddingRight: "20px", paddingBottom: "5px" } }>{props.para}</Typography>
  )}
  
  function WriteTitle(props) {
  return(
    <div align="left">
      <Typography className={gClasses.info18} style={ {paddingLeft: "20px", paddingRight: "20px", paddingBottom: "5px", paddingTop: "5px" } } >{props.title}</Typography>
    </div>
  )}
    
    return (
    <div className={gClasses.root} >
      <DisplayPageHeader headerName="Welcome to Auction Premier League" groupName="" tournament=""/>
      <BlankArea />
      <Accordion expanded={expandedPanel === "step1"} onChange={handleAccordionChange("step1")}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className={gClasses.info14Bold}>How to Play</Typography>
        </AccordionSummary>
        <WriteParagraph para={MSG1} />
        <h4 />
      </Accordion>
		<Accordion expanded={expandedPanel === "Select Tournament"} onChange={handleAccordionChange("Select Tournament")}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Typography className={gClasses.info14Bold}>Create Group</Typography>
			</AccordionSummary>
      <WriteParagraph para={MSG2} />				
        {/*<DisplayImage image="SelectTournament.JPG" />*/}
      <WriteParagraph para={MSG3} />				
      <WriteParagraph para={MSG3_1} />				
      <WriteParagraph para={MSG3_2} />				
      <WriteParagraph para={MSG3_3} />				
      <WriteParagraph para={MSG3_4} />				
      <WriteParagraph para={MSG3_5} />				
      <WriteParagraph para={MSG3_6} />				
      <WriteParagraph para={MSG3_FINAL1} />				
      <WriteParagraph para={MSG3_FINAL2} />				
      <h4 />
		</Accordion>
		<Accordion expanded={expandedPanel === "Join Group"} onChange={handleAccordionChange("Join Group")}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Typography className={gClasses.info14Bold}>Join Group</Typography>
			</AccordionSummary>
      <WriteParagraph para={MSG4} />				
      <h4 />
		</Accordion>
		<Accordion expanded={expandedPanel === "Multiple Group"} onChange={handleAccordionChange("Multiple Group")}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Typography className={gClasses.info14Bold}>Multiple Groups</Typography>
			</AccordionSummary>
      <WriteParagraph para={MULTIPLEGROUP_1} />				
      <WriteParagraph para={MULTIPLEGROUP_2} />				
      <h4 />
		</Accordion>
		<Accordion expanded={expandedPanel === "Auction"} onChange={handleAccordionChange("Auction")}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Typography className={gClasses.info14Bold}>Auction</Typography>
			</AccordionSummary>
      <WriteParagraph para={AUCTION_1} />
      <WriteParagraph para={AUCTION_2} />
      <WriteParagraph para={AUCTION_3} />
      <WriteParagraph para={AUCTION_4} />
      <WriteParagraph para={AUCTION_5} />
      <h4 />
		</Accordion>
		<Accordion expanded={expandedPanel === "Captain"} onChange={handleAccordionChange("Captain")}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Typography className={gClasses.info14Bold}>Captain & Vice-Captain</Typography>
			</AccordionSummary>
      <WriteParagraph para={CAPTAIN_1} />
      <h4 />
		</Accordion>
    </div>
  );
}

