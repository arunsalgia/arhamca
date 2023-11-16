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
import {BlankArea } from "CustomComponents/CustomComponents.js"
// import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";
//import socketIOClient from "socket.io-client";
import { DisplayPageHeader, DisplayVersion } from 'CustomComponents/CustomComponents.js';
import { blue, red } from '@material-ui/core/colors';
import APLPlayer from './VideoPlayer';



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
  

export default function DisplayDemo() { 
  const classes = useStyles();
  const [myVideo, setMyVideo] = useState(`${process.env.PUBLIC_URL}/video/NEWGROUP.MP4`);


  useEffect(() => {  
  }, []);


  function setDemo(name) {
    setMyVideo(`${process.env.PUBLIC_URL}/video/${name}.MP4`);
  }

  
  function DisplayDemoType() {
  return(
    <Grid key="matchtype" align="center" container>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_t20" variant="contained" color="primary" size="small"
    className={classes.button} onClick={() => {setDemo("NEWGROUP")}}>New Group
    </Button>
    </Grid>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_odi" variant="contained" color="primary" size="small"
    className={classes.button} onClick={() => {setDemo("JOINGROUP")}}>Join Group
    </Button>
    </Grid>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_test" variant="contained" color="primary" size="small"
    className={classes.button} onClick={() => {setDemo("AUCTION")}}>Auction
    </Button>
    </Grid>
    </Grid>      
  )};

  function PS_Header(props) {
  return(<h4 align="center">{props.header}</h4>)
  }

  // let myVideo = "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
  // let myVideo= "https://www.youtube.com/watch?v=GwFsx5F3dGk";
  // let myVideo = `${process.env.PUBLIC_URL}/video/CREATEGROUP.MP4`;
  console.log(myVideo);
  return (
    <div>
    <DisplayDemoType />
    {/* <ShowPointSystem /> */}
    <APLPlayer video={myVideo} />
    </div>
  );
}

