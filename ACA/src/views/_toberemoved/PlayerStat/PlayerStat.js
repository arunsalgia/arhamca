import React, { useEffect, useState ,useContext} from 'react';
import Container from '@material-ui/core/Container';
import globalStyles from "assets/globalStyles"
import axios from "axios";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';

import VsCancel from "CustomComponents/VsCancel";

//import ScoreIcon from '@material-ui/icons/Score';
//import ScoreIcon from '@material-ui/icons/KeyboardArrowDown';
import ScoreIcon from '@material-ui/icons/Info';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


import lodashSumBy from 'lodash/sumBy';
import lodashSortBy from 'lodash/sortBy';
import {DisplayPageHeader, ShowTeamImage } from "CustomComponents/CustomComponents.js"


import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';


export default function PlayerStat() {
  const gClasses = globalStyles();

	const [playerListDrawer, setplayerListDrawer] = useState("");
	const [playerScoreDrawer, setplayerScoreDrawer] = useState("");

	const [members, setmembers] = useState([]);
	const [allData, setallData] = useState({stat: [], members: []})
	const [currentPlayerScore, setcurrentPlayerScore] = useState({});
	const [currentFranchiseName, setcurrentFranchiseName] = useState("");
	const [currentFranchiseScore, setcurrentFranchiseScore] = useState(0);
	const [playerStat, setplayerStat] = useState([]);
	
	const [expandedPanel, setExpandedPanel] = useState(false);
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    //console.log("Main", event, isExpanded, panel );
    setExpandedPanel(isExpanded ? panel : false);
		setExpandedPanel100("");
  };

	const [expandedPanel100, setExpandedPanel100] = useState(false);
  const handleAccordionChange100 = (panel) => (event, isExpanded) => {
    //console.log("100", event, isExpanded, panel );
    setExpandedPanel100(isExpanded ? panel : false);
  };


  useEffect(() => {
    const getPlayerStats = async () => {

      var res = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/stat/${localStorage.getItem("gid")}`);
			//setgroupName(res.data.groupName);
			//setplayerStat(res.data.stat);
			//setmembers(res.data.members);
			//console.log(res.data.teams);
			//console.log(res.data);
			setallData(res.data);
			setcurrentFranchiseName(res.data.members[0].displayName);
    }
    getPlayerStats();
}, [])

	function AddHeader(props) {
	return (
	<TableRow align="center" key={props.title}>
		<TableCell colSpan={2} align="center" ><Typography className={gClasses.patientInfo2Blue}>{props.title}</Typography></TableCell>
	</TableRow>
	)}
	
	function AddRow(props) {
  if (props.score == null) return null;    
	if (props.score == 0) return null;
	let myText = "";
  if (!props.title.includes("max") ) {
    if  (props.score < 0)
      myText = "- " + Math.abs(props.score);
    else
      myText = props.score;
  }
  
	return (
	<TableRow key={props.title}>
		<TableCell align="center" className={gClasses.tableCellOdd} ><Typography className={gClasses.patientInfo2}>{props.title}</Typography></TableCell>
		<TableCell align="center" className={gClasses.tableCellOdd} ><Typography className={gClasses.patientInfo2}>{myText}</Typography></TableCell>
	</TableRow>
	)}
	
	function DisplayPlayers(props) {
  //console.log(props.players);
	return (	
	<div className={gClasses.fullWidth} >
	<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
	{props.players.map(p => {
		console.log(p.catch3);
		return (
			<Accordion className={gClasses.fullWidth} key={"ACS"+p.playerName} expanded={expandedPanel100 === p.playerName} onChange={handleAccordionChange100(p.playerName)}>
				<AccordionSummary className={(expandedPanel100 === p.playerName) ? gClasses.selectedAccordian : gClasses.whiteAccordian} key={"ASS"+p.playerName} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
					<Typography className={gClasses.patientInfo2}>{p.playerName} ({p.score})</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{/*  start of players scores ------------------- */}
					<div className={gClasses.fullWidth} >
					<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
					<Table>
					<TableBody>
					{((p.run != 0) || (p.four != 0) || (p.six != 0) || (p.fifty != 0) || (p.hundred != 0) || (p.duck != 0) ) &&
						<AddHeader title="Batting" />
					}
					<AddRow title="Run" score={p.run} />
          <AddRow title="SR" score={p.strikeRateValue} />
					<AddRow title="Duck" score={p.duck} />
					<AddRow title="Four" score={p.four} />
					<AddRow title="Six" score={p.six} />
					<AddRow title="Fifty" score={p.fifty} />
					<AddRow title="Hundred" score={p.hundred} />
					{((p.wicket != 0) || (p.wicket3 != 0) || (p.wicket5 != 0) || (p.maiden != 0) || (p.bowled != 0) || (p.lbw != 0)  || (p.economy != 0) ) &&
						<AddHeader title="Bowling" />
					}
					<AddRow title="Wicket" score={p.wicket} />
					<AddRow title="3 Wicket" score={p.wicket3} />
					<AddRow title="5 WIcket" score={p.wicket5} />
					<AddRow title="Maiden" score={p.maiden} />
					<AddRow title="Bowled" score={p.bowled} />
					<AddRow title="LBW" score={p.lbw} />
					<AddRow title="Economy" score={p.economy} />
					{((p.stumped != 0) || (p.runout != 0) || (p.catch != 0) ) &&
						<AddHeader title="Fielding" />
					}
					<AddRow title="Stumped" score={p.stumped} />
					<AddRow title="RunOut" score={p.runout} />
					<AddRow title="Catch" score={p.catch} />
					<AddRow title="3 Catch" score={p.catch3} />
					{((p.inning != 0) || (p.manOfTheMatch != 0) || (p.maxTouramentRun != 0) || (p.maxTouramentRun != 0) ) &&
					<AddHeader title="Overall" />
					}
					<AddRow title="Matches Played" score={p.inning} />
					<AddRow title="Man of the Match" score={p.manOfTheMatch} />
					<AddRow title="Max. Run" score={p.maxTouramentRun} />
					<AddRow title="Max. Wicket" score={p.maxTouramentRun} />
					</TableBody>
					</Table>
					</Box>
					</div>
					{/*  end of players scores ----------------------*/}
				</AccordionDetails>
			</Accordion>
		)
	})}
	</Box>
	</div>
	)}

	function showPlayerDetails(member) {
		setcurrentFranchiseName(member.displayName)
		setcurrentFranchiseScore(member.totalScore)
		setplayerStat(lodashSortBy(allData.stat.filter(x => member.pidList.includes(x.pid)), 'score').reverse());
		setplayerListDrawer("Player");
	}
	
	function DisplayStats() {
	if (allData.members.length == 0) return null;
  
  //console.log(allData.members); 
	return (
		<Box border={2} >
		<Table>
			<TableBody>
				{allData.members.map( (m, index) => {
				//var myPlayers = allData.stat.filter(x => m.pidList.includes(x.pid));
				//var totalScore = lodashSumBy(myPlayers, 'score');
				//if (!m) console.log("m is undefined");
				var myClass = gClasses.tableCellOdd;  //((index % 2) == 0) ? gClasses.tableCellEven : gClasses.tableCellOdd;
				return (
					<TableRow onClick={() => showPlayerDetails(m) } className={gClasses.test}  key={m.displayName}>
							<TableCell align="center" className={myClass} ><Typography className={gClasses.info2}>{m.displayName}</Typography></TableCell>
							<TableCell align="center" className={myClass} ><Typography className={gClasses.info2}>{m.totalScore}</Typography></TableCell>
							<TableCell align="center" className={myClass} >
								<ArrowDropDownIcon style={{color: 'blue'}} size="small" onClick={() => showPlayerDetails(m) } />
							</TableCell>
						</TableRow>
				)})}
			</TableBody>
		</Table>
		</Box>
	)}
  

	function org_DisplayStats() {
	return (
		<div>
		{allData.members.map(m => {
			var myPlayers = allData.stat.filter(x => m.pidList.includes(x.pid));
			//var totalScore = lodashSumBy(myPlayers, 'score');
			//if (!m) console.log("m is undefined");
			return (
				<Accordion key={"AC"+m.displayName} expanded={expandedPanel === m.displayName} onChange={handleAccordionChange(m.displayName)}>
					<AccordionSummary className={(expandedPanel === m.displayName) ? gClasses.selectedAccordian : gClasses.whiteAccordian} key={"AS"+m.displayName} expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
						<Typography className={gClasses.patientInfo2}>{m.displayName} ({m.totalScore})</Typography>
					</AccordionSummary>
					<AccordionDetails>
						{(m.totalScore != 0) &&
							<DisplayPlayers players={myPlayers} />
						}
					</AccordionDetails>
				</Accordion>
				)
		})}
		</div>
	)}
  
	function handlePlayerSelect(playerScore) {
		setcurrentPlayerScore(playerScore);
		setplayerScoreDrawer("Score");
	}
	
	function DisplayPlayersDetails() {
		var p =currentPlayerScore;
		console.log("Catch3 "+p.catch3);
	return (
		<Box className={gClasses.boxStyle} borderColor="black" borderRadius={7} border={1} >
		<Table>
		<TableBody>
		{((p.run != 0) || (p.four != 0) || (p.six != 0) || (p.fifty != 0) || (p.hundred != 0) || (p.duck != 0) ) &&
			<AddHeader myClass={gClasses.tableCellOdd} title="Batting" />
		}
		<AddRow myClass={gClasses.tableCellOdd} title="Run" score={p.run} />
		<AddRow myClass={gClasses.tableCellOdd} title="StrikeRate" score={p.strikeRate} />
		<AddRow myClass={gClasses.tableCellOdd} title="Duck" score={p.duck} />
		<AddRow myClass={gClasses.tableCellOdd} title="Four" score={p.four} />
		<AddRow myClass={gClasses.tableCellOdd} title="Six" score={p.six} />
		<AddRow myClass={gClasses.tableCellOdd} title="Fifty" score={p.fifty} />
		<AddRow myClass={gClasses.tableCellOdd} title="Runs 75" score={p.run75} />
		<AddRow myClass={gClasses.tableCellOdd} title="Hundred" score={p.hundred} />
		<AddRow myClass={gClasses.tableCellOdd} title="Runs 150" score={p.run150} />
		<AddRow myClass={gClasses.tableCellOdd} title="Double Century" score={p.run200} />
		{((p.wicket != 0) || (p.wicket3 != 0) || (p.wicket5 != 0) || (p.maiden != 0) || (p.bowled != 0) || (p.lbw != 0)  || (p.economy != 0) ) &&
			<AddHeader myClass={gClasses.tableCellEven} title="Bowling" />
		}
		<AddRow myClass={gClasses.tableCellEven} title="Wicket" score={p.wicket} />
		<AddRow myClass={gClasses.tableCellEven} title="3 Wicket" score={p.wicket3} />
		<AddRow myClass={gClasses.tableCellEven} title="4 Wicket" score={p.wicket4} />
		<AddRow myClass={gClasses.tableCellEven} title="5 WIcket" score={p.wicket5} />
    <AddRow myClass={gClasses.tableCellEven} title="Hat-trick" score={p.hattrick} />
		<AddRow myClass={gClasses.tableCellEven} title="Maiden" score={p.maiden} />
		<AddRow myClass={gClasses.tableCellEven} title="Bowled" score={p.bowled} />
		<AddRow myClass={gClasses.tableCellEven} title="LBW" score={p.lbw} />
		<AddRow myClass={gClasses.tableCellEven} title="Economy" score={p.economy} />
		{((p.stumped != 0) || (p.runout != 0) || (p.catch != 0) ) &&
			<AddHeader myClass={gClasses.tableCellOdd} title="Fielding" />
		}
		<AddRow myClass={gClasses.tableCellOdd} title="Stumped" score={p.stumped} />
		<AddRow myClass={gClasses.tableCellOdd} title="RunOut" score={p.runout} />
		<AddRow myClass={gClasses.tableCellOdd} title="Catch" score={p.catch} />
		<AddRow myClass={gClasses.tableCellOdd} title="3 Catch" score={p.catch3} />
		{((p.inning != 0) || (p.manOfTheMatch != 0) || (p.maxTouramentRun != 0) || (p.maxTouramentRun != 0) ) &&
		<AddHeader myClass={gClasses.tableCellEven} title="Overall" />
		}
		<AddRow myClass={gClasses.tableCellEven} title="Matches played" score={p.inning} />
		<AddRow myClass={gClasses.tableCellEven} title="Man of the Match" score={p.manOfTheMatch} />
		<AddRow myClass={gClasses.tableCellEven} title="Scored tournament max. runs" score={p.maxTouramentRun} />
		<AddRow myClass={gClasses.tableCellEven} title="Taken tournament max. wickets" score={p.maxTouramentWicket} />
		</TableBody>
		</Table>
		</Box>
	
	)
	}
	
	function DisplayPlayersScores() {
		//console.log(playerStat);
		//console.log("in DisplayPlayersScores");
	return (
		<Box border={2} >
		<Table>
			<TableBody>
				{playerStat.map( (p, index) => {
				var myClass = gClasses.tableCellOdd;  //((index % 2) == 0) ? gClasses.tableCellEven : gClasses.tableCellOdd;
				//console.log(p.pid);
				var myTeamRec = allData.teams.find( x => x.pid === p.pid);
				//console.log(myTeamRec);
				return (
					<TableRow onClick={() => handlePlayerSelect(p) } className={gClasses.test}  key={p.playerName}>
							<TableCell align="center" className={myClass} ><Typography className={gClasses.info2}>{p.playerName}</Typography></TableCell>
							<TableCell align="center" className={myClass} ><ShowTeamImage teamName={myTeamRec.team} /></TableCell>
							<TableCell align="center" className={myClass} ><Typography className={gClasses.info2}>{p.score}</Typography></TableCell>
							<TableCell align="center" className={myClass} >
								<ArrowDropDownIcon style={{color: 'blue'}} size="small" onClick={() => handlePlayerSelect(p) } />
							</TableCell>					
					</TableRow>
				)})}
			</TableBody>
		</Table>
		</Box>
	)}
	
	return (
    <div align="center">
      <DisplayPageHeader headerName="Player Stats" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")} />
			<br />
			<Container component="main" maxWidth="xs">
			<DisplayStats />
			</Container>
			<Drawer key="PlayerNames" anchor="top" variant="temporary" open={playerListDrawer != ""}>
			<Box className={gClasses.drawerStyle} borderColor="black" borderRadius={7} border={1} >
				<Container component="main" maxWidth="xs">
				<VsCancel align="right" onClick={() => { setplayerListDrawer("")}} />	
				<Typography align="center" className={gClasses.patientInfo2}>{`${currentFranchiseName} (Score: ${currentFranchiseScore})`}</Typography>
				<DisplayPlayersScores />
				<br />
				</Container>
			</Box>
			</Drawer>
			<Drawer key="PlayerScores" anchor="top" variant="temporary" open={playerScoreDrawer != ""}>
			<Box className={gClasses.drawerStyle} borderColor="black" borderRadius={7} border={1} >
				<Container component="main" maxWidth="xs">
				<VsCancel align="right" onClick={() => { setplayerScoreDrawer("")}} />	
				<Typography align="center" className={gClasses.patientInfo2}>{`${currentPlayerScore.playerName} (Score: ${currentPlayerScore.score})`}</Typography>
				<DisplayPlayersDetails />
				<br />
				</Container>
			</Box>
			</Drawer>
    </div>
  );
}
