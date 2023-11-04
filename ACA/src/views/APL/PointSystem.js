import React, { useEffect, useState } from 'react';
import Container from '@material-ui/core/Container';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from "@material-ui/core/Grid";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import GridItem from "components/Grid/GridItem.js";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import globalStyles from "assets/globalStyles";
import {BlankArea, JumpButtonOnly} from "CustomComponents/CustomComponents.js"
import { DisplayPageHeader, DisplayVersion } from 'CustomComponents/CustomComponents.js';//

import VsButton from "CustomComponents/VsButton";


export default function PointSystem() { 
	const gClasses = globalStyles();
  const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
	};
 const [matchType, setMatchType] = useState("T20");

	useEffect(() => {  
  }, []);

	function DisplayHeaderAndButtons() {
	return (
    <Grid align="center" container>
      <Grid item xs={2} sm={2} md={2} lg={2} >
        <VsButton align="center" name="T20" onClick={() => {setMatchType("T20")}} />
      </Grid>
      <Grid item xs={8} sm={8} md={8} lg={8} >
        <Typography className={gClasses.info18} >{matchType} Point System</Typography>
      </Grid>
      <Grid item xs={2} sm={2} md={2} lg={2} >
        <VsButton align="center" name="ODI" onClick={() => {setMatchType("ODI")}} />
      </Grid>
    </Grid>      
	)}
	
	
  function DisplayMatchType() {
  return(
    <Grid key="matchtype" align="center" container>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_t20" variant="contained" color="primary" size="small"
     onClick={() => {setMatchType("T20")}}>T20
    </Button>
    </Grid>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_odi" variant="contained" color="primary" size="small"
     onClick={() => {setMatchType("ODI")}}>ODI
    </Button>
    </Grid>
    <Grid item xs={4} sm={4} md={4} lg={4} >
    <Button key="mt_test" variant="contained" color="primary" size="small"
    onClick={() => {setMatchType("TEST")}}>TEST
    </Button>
    </Grid>
    </Grid>      
  )};

	function DisplayPoints(props) {
	var bgStyle = {background: '#D3D3D3' };
	return(
		<Typography className={gClasses.info16Bold} style={ bgStyle } >{matchType} - Role {props.role} </Typography>
	)};

	function DisplayPinfo(props) {
	return (
		<Grid style={ {paddingLeft: "15px", paddingRight: "15px" } } key={props.desc+props.value} container >
			<Grid  align="left" item xs={9} sm={9} md={9} lg={9} >
				<Typography className={gClasses.th} style={ {paddingLeft: "5px", fontWeight: 700 } }  >{props.desc}</Typography>
			</Grid>
			<Grid  align="center" item xs={3} sm={3} md={3} lg={3} >
				<Typography className={gClasses.td}  >{props.value}</Typography>
			</Grid>
		</Grid>
	)}


	function DisplayNotes(props) {
	return (
    <Grid container >
			<Grid align="center" item xs={1} sm={1} md={1} lg={1} >
				<span className={gClasses.info16Bold} style={{paddingLeft: "15px" }}>*</span>
			</Grid>
			<Grid align="left" item xs={11} sm={11} md={11} lg={11} >
				<span className={gClasses.info16} style={{paddingLeft: "5px" }} >{props.desc}</span>
			</Grid>
		</Grid>
	)}
	
	function DisplayPlayerType() {
	return (	
		<div>
		<Accordion key="Batting" expanded={expandedPanel === "Batting"} onChange={handleAccordionChange("Batting")}>
			<AccordionSummary key="BattingAS" expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Typography className={gClasses.info14Bold}>Batting</Typography>
			</AccordionSummary>
				{(matchType === "T20") && 
          <div style={{padding: "none" }}>
					<DisplayPinfo desc="Runs"  							value="1 pt" />
					<DisplayPinfo desc="Fours" 							value="1 pt" />
					<DisplayPinfo desc="Sixes"  						value="2 pts" />
					<DisplayPinfo desc="50"  								value="20 pts" />
					<DisplayPinfo desc="100"  							value="50 pts" />
					<DisplayPinfo desc="150"  							value="100 pts" />
					<DisplayPinfo desc="Duck (Batsman)"  						value="-10 pts" />
					<DisplayPinfo desc="Duck (AllRounder)"  				value="-10 pts" />
					<DisplayPinfo desc="Duck (WicketKeeper)"  			value="-10 pts" />
					<br />
					<DisplayNotes	desc="If Player scores 150 and above Bonus for 50 and 100 runs will not be awarded" />
					<DisplayNotes	desc="If Player scores 100 and 149 Bonus for 50 runs will not be awarded" />
          </div>
				}
				{(matchType === "ODI") &&
          <div style={{padding: "none" }}>
					<DisplayPinfo desc="Runs"  						value="1 pt" />
					<DisplayPinfo desc="Fours" 						value="1 pt" />
					<DisplayPinfo desc="Sixes"  					value="2 pts" />
					<DisplayPinfo desc="50"  							value="10 pts" />
					<DisplayPinfo desc="75"  							value="20 pts" />
					<DisplayPinfo desc="100"  						value="50 pts" />
					<DisplayPinfo desc="200"  						value="100 pts" />
					<DisplayPinfo desc="Duck (Batsman)"  						value="-10 pts" />
					<DisplayPinfo desc="Duck (AllRounder)"  				value="-10 pts" />
					<DisplayPinfo desc="Duck (WicketKeeper)"  			value="-10 pts" />
					<br />
					<DisplayNotes	desc="If Player scores 200 and above Bonus for 50, 75 and 100 runs will not be awarded" />
					<DisplayNotes	desc="If Player scores between 100 and 199 Bonus for 50 and 75 runs will not be awarded" />
					<DisplayNotes	desc="If Player scores between 75 and 99 Bonus for 50 runs will not be awarded" />
          </div>
				}
				<br />
		</Accordion>
		<Accordion key="StrikeRate" expanded={expandedPanel === "StrikeRate"} onChange={handleAccordionChange("StrikeRate")}>
			<AccordionSummary key="StrikeRateAS" expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Grid key="StrikerteGrid" align="left" container>
					<Grid item xs={12} sm={12} md={12} lg={12} >
						<Typography className={gClasses.info14Bold}>Strike Rate</Typography>
					</Grid>
					<Grid item xs={12} sm={12} md={12} lg={12} >
            {(matchType === "T20") && 
              <Typography className={gClasses.info12}>Minimum 10 balls to be played</Typography>
            }
            {(matchType === "ODI") &&
              <Typography className={gClasses.info12}>Minimum 20 balls to be played</Typography>
            }
					</Grid>
				</Grid>      
			</AccordionSummary>
				{(matchType === "T20") &&
          <div style={{padding: "none" }}>
					<DisplayPinfo desc="StrikeRate 200 and above"  						    value="6 pts" />
					<DisplayPinfo desc="StrikeRate b/w 170 & 199.99" 					value="4 pts" />
					<DisplayPinfo desc="StrikeRate b/w 150 & 169.99"  					value="2 pts" />
					<DisplayPinfo desc="StrikeRate b/w 100 & 149.99"  					value="0 pts" />
					<DisplayPinfo desc="StrikeRate b/w 90 & 99.99"  						value="-2 pts" />
					<DisplayPinfo desc="StrikeRate b/w 80 & 89.99"  						value="-4 pts" />
					<DisplayPinfo desc="StrikeRate less than 80"  						      value="-6 pts" />
          </div>
				}
				{(matchType === "ODI") &&
          <div style={{padding: "10px" }}>
					<DisplayPinfo desc="Strike Rate 150 and above"   									value="6 pts" />
					<DisplayPinfo desc="Strike Rate b/w 120 & 149.99"  						value="4 pts" />
					<DisplayPinfo desc="Strike Rate b/w 100 & 119.99"  						value="2 pts" />
					<DisplayPinfo desc="Strike Rate b/w 70 & 99.99"  					value="0 pts" />
					<DisplayPinfo desc="Strike Rate b/w 50 & 69.99"  							value="-2 pts" />
					<DisplayPinfo desc="Strike Rate b/w 30 & 49.99"  							value="-4 pts" />
					<DisplayPinfo desc="Strike Rate less than 30"  										value="-6 pts" />
          </div>
				}
				<br />
		</Accordion>
		<Accordion key="Bowling" expanded={expandedPanel === "Bowling"} onChange={handleAccordionChange("Bowling")}>
			<AccordionSummary key="BowlingAS" expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Typography className={gClasses.info14Bold}>Bowling</Typography>
			</AccordionSummary>
				{(matchType === "T20") &&
          <div style={{padding: "10px" }}>
					<DisplayPinfo desc="Wicket"  					value="25 pts" />
					<DisplayPinfo desc="3 Wickets" 				value="20 pts" />
					<DisplayPinfo desc="5 Wickets"  			value="50 pts" />
					<DisplayPinfo desc="Maiden"			  		value="20 pts" />
					<DisplayPinfo desc="Hat-trick"  			value="100 pts" />
					<br />
					<DisplayNotes	desc="If Player take 5 or more wickets, then Bonus of 3 Wickets will not be awarded" />
					<DisplayNotes	desc="If Player takes hat-trick then Bonus of 3 Wickets and 5 Wickets will not be awarded" />
          </div>
        }
				{(matchType === "ODI") &&
          <div style={{padding: "10px" }}>
					<DisplayPinfo desc="Wicket"  					value="25 pts" />
					<DisplayPinfo desc="3 Wickets" 				value="10 pts" />
					<DisplayPinfo desc="4 Wickets" 				value="20 pts" />
					<DisplayPinfo desc="5 Wickets"  			value="50 pts" />
					<DisplayPinfo desc="Maiden"			  		value="10 pts" />
					<DisplayPinfo desc="Hat-trick"  			value="100 pts" />
					<br />
					<DisplayNotes	desc="If Player take 5 or more wickets, then Bonus of 3 and 4 Wickets will not be awarded" />
					<DisplayNotes	desc="If Player take 4, then Bonus of 3 Wickets will not be awarded" />
					<DisplayNotes	desc="If Player takes hat-trick then Bonus of 3, 4 and 5 Wickets will not be awarded" />
          </div>
				}
				<br />
		</Accordion>
		<Accordion key="Economy" expanded={expandedPanel === "Economy"} onChange={handleAccordionChange("Economy")}>
			<AccordionSummary key="EconomyAS" expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
				<Grid  align="left" container>
					<Grid item xs={12} sm={12} md={12} lg={12} >
						<Typography className={gClasses.info14Bold}>Economy</Typography>
					</Grid>
					<Grid item xs={12} sm={12} md={12} lg={12} >
            {(matchType === "T20") &&
              <Typography className={gClasses.info12}>Minimum 2 overs to be bowled</Typography>
            }
            {(matchType === "ODI") &&
              <Typography className={gClasses.info12}>Minimum 5 overs to be bowled</Typography>
            }
					</Grid>
				</Grid>      
			</AccordionSummary>
				{(matchType === "T20") &&
          <div style={{padding: "10px" }}>
          <DisplayPinfo desc="Economy 5 and below "  		            value="6 pts" />
          <DisplayPinfo desc="Economy b/w 5.01 & 6"  						value="4 pts" />
          <DisplayPinfo desc="Economy b/w 6.01 & 7"  						value="2 pts" />
          <DisplayPinfo desc="Economy b/w 7.01 & 9"  						value="0 pts" />
          <DisplayPinfo desc="Economy b/w 9.01 & 10"  						value="-2 pts" />
          <DisplayPinfo desc="Economy b/w 10.01 & 12"  					value="-4 pts" />
          <DisplayPinfo desc="Economy above 12"  						      value="-6 pts" />
          </div>
        }
				{(matchType === "ODI") &&
          <div style={{padding: "10px" }}>
          <DisplayPinfo desc="Economy 3 and below "  		            value="6 pts" />
          <DisplayPinfo desc="Economy b/w 3.01 & 4"  						value="4 pts" />
          <DisplayPinfo desc="Economy b/w 4.01 & 5"  						value="2 pts" />
          <DisplayPinfo desc="Economy b/w 5.01 & 6"  						value="0 pts" />
          <DisplayPinfo desc="Economy b/w 6.01 & 7"  						value="-2 pts" />
          <DisplayPinfo desc="Economy b/w 7.01 & 8"  					value="-4 pts" />
          <DisplayPinfo desc="Economy above 8"  						      value="-6 pts" />
          </div>
        }
				<br />
		</Accordion>			
			<Accordion key="Fielding" expanded={expandedPanel === "Fielding"} onChange={handleAccordionChange("Fielding")}>
				<AccordionSummary key="FieldingAS" expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
					<Typography className={gClasses.info14Bold}>Fielding</Typography>
				</AccordionSummary>
				<div style={{padding: "10px" }}>
					<DisplayPinfo desc="Catch"  					  value="4 pts" />
					<DisplayPinfo desc="Run Out" 				    value="4 pts" />
					<DisplayPinfo desc="Stumping"  			    value="6 pts" />
					<DisplayPinfo desc="3 Catch"			  		value="5 pts" />
					<br />
				</div>
			</Accordion>
			<Accordion key="Captain" expanded={expandedPanel === "Captain"} onChange={handleAccordionChange("Captain")}>
				<AccordionSummary key="CaptainAS" expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
					<Typography className={gClasses.info14Bold}>Captain / ViceCaptain</Typography>
				</AccordionSummary>
				<div style={{padding: "10px" }}>
					<DisplayPinfo desc="Captain" value="2x" />
					<DisplayPinfo desc="Vice-Captain" value="1.5x" />
					<br />
					<DisplayNotes	desc="Only Runs and Wickets will be awarded 2x or 1.5x." />
					<br />
				</div>
			</Accordion>
			<Accordion key="Other Bonus" expanded={expandedPanel === "OtherBonus"} onChange={handleAccordionChange("OtherBonus")}>
				<AccordionSummary key="FieldingAS" expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
					<Typography className={gClasses.info14Bold}>Tournament Bonus</Typography>
				</AccordionSummary>
				<div style={{padding: "10px" }}>
					<DisplayPinfo desc="Man of the Match"  					value="20 pts" />
					<DisplayPinfo desc="Tournament Max. Runs" 				value="100 pts" />
					<DisplayPinfo desc="Tournament Max. Wickets" 				value="100 pts" />
					<br />
				</div>
			</Accordion>
		</div>
	)};

  return (
    <Container component="main">
			<BlankArea />
			<DisplayHeaderAndButtons />
			<BlankArea />
			<DisplayPlayerType />
    </Container>
  );
}

