import React, { useEffect, useState ,useContext} from 'react';
import Select from "@material-ui/core/Select";
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles"
import Container from '@material-ui/core/Container';
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import { useHistory } from "react-router-dom";
import {DisplayPageHeader, ValidComp, BlankArea, CricDreamLogo} from "CustomComponents/CustomComponents.js"
import { SettingsCellOutlined } from '@material-ui/icons';
import axios from "axios";
import Avatar from "@material-ui/core/Avatar"
import Card from "components/Card/Card.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { red, blue, deepOrange } from '@material-ui/core/colors';

const NoBatting = {Mat: "-", Runs: "-", "100": "-", "50": "-", "6s": "-", "4s": "-", "Ave": "-", "SR": "-"}			
const NoBowling = {Mat: "-", Wkts: "-", "10": "-", "5w": "-", "4w": "-", "Econ": "-", "Ave": "-", "SR": "-" }


const useStyles = makeStyles((theme) => ({
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  playerInfo: {
    marginTop: theme.spacing(8),
  },
  value: {
    marginTop: theme.spacing(0),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(0),
    // fontWeight: theme.typography.fontWeightBold
  },
  td : {
    // border: 5,
    border: "1px solid black",
    align: "center",
    padding: "1px 10px",
  },
  th: { 
    backgroundColor: '#EEEEEE', 
    color: deepOrange[700], 
    border: "1px solid black",
    fontWeight: theme.typography.fontWeightBold,
    align: "center",
    padding: "1px 10px",
  },
}));


export default function PlayerInfo() {
  const classes = useStyles();
  const gClasses = globalStyles();

  // const history = useHistory();
  const [registerStatus, setRegisterStatus] = useState(0);

  const [masterTeamList, setMasterTeamList] = useState([]);

  const [tournamentList, setTournamentList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [playerList, setPlayerList] = useState([]);

  const [currTournament, setCurrTournament] = useState("");
  const [currTeam, setCurrTeam] = useState("");
  const [currPlayer, setCurrPlayer] = useState("")

  const [currPid, setCurrPid] = useState(0);
  const [playerInfo, setPlayerInfo] = useState([]);
  const [battingStats, setBattingStats] = useState([]);
  const [bowlingStats, setBowlingStats] = useState([]);

  useEffect(() => {
    const getPlayers = async () => {

      var tourres = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/tournament/list/notstarted/`);
      setTournamentList(tourres.data);
      
      let myTournament = (tourres.data.length > 0) ? tourres.data[0].name : "";
      setCurrTournament(myTournament);
      if (myTournament === "") return;

      var teamres = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/team/list/`);
      //console.log(teamres.data);  
      setMasterTeamList(teamres.data);
      
      let tmp = teamres.data.filter(x => x.tournament === tourres.data[0].name);
      setTeamList(tmp);
      let myTeam = (tmp.length > 0) ? tmp[0].name : "";
      setCurrTeam(myTeam);
      if (myTeam === "") return;

      tmp = await getTeamPlayers(myTournament, myTeam);
      setPlayerList(tmp);
      let myPlayer = (tmp.length > 0) ? tmp[0].name : "";
      setCurrPlayer(myPlayer);
    }
    getPlayers();
}, [])

  async function getTeamPlayers(myTournament, myTeam) {
    let myURL = `${process.env.REACT_APP_AXIOS_BASEPATH}/player/tteam/${myTournament}/${myTeam}`
    let playres = await axios.get(myURL);
    let tmp = playres.data;
    return tmp;
  }

  function ShowResisterStatus() {
    let myMsg;
    switch (registerStatus) {
      case 0:
        myMsg = ``;
        break;
      default:
        myMsg = "Unknown Error";
        break;
  }
  return(
    <div>
      <Typography className={(registerStatus === 200) ? gClasses.nonerror : gClasses.error}>{myMsg}</Typography>
    </div>
  )}

  async function handleTournament(myTournament) {
    setCurrPid(0);
    setCurrTournament(myTournament);
    if (myTournament === "") {
      setTeamList([]);
      setCurrTeam("");

      setPlayerList([]);
      setCurrPlayer("");

      return;
    }

    let tmp = masterTeamList.filter(x => x.tournament === myTournament);
    setTeamList(tmp);
    let myTeam = (tmp.length > 0) ? tmp[0].name : "";
    setCurrTeam(myTeam);
    if (myTeam === "") {
      setPlayerList([]);
      setCurrPlayer("");
      return;
    }

    tmp = await getTeamPlayers(myTournament, myTeam);
    setPlayerList(tmp);
    let myPlayer = (tmp.length > 0) ? tmp[0].name : "";
    setCurrPlayer(myPlayer);
  }

  async function handleTeam(myTeam) {
    setCurrPid(0);
    setCurrTeam(myTeam);
    if (myTeam === "") {
      setPlayerList([]);
      setCurrPlayer("");
      return;
    }

    let tmp = await getTeamPlayers(currTournament, myTeam);
    setPlayerList(tmp);
    let myPlayer = (tmp.length > 0) ? tmp[0].name : "";
    setCurrPlayer(myPlayer);
  }

  async function handlePlayer(myPlayer) {
    setCurrPid(0);
    setCurrPlayer(myPlayer);
  }
  

  async function handleSubmit() {
    if (currPlayer === "") {
      setCurrPid(0);
      return;
    }

    let myRec = playerList.find( x => x.name === currPlayer);
    if (!myRec) {
      setCurrPid(0);
      return;
    }

    // if (myRec.pid == currPid) {
    //   // setCurrPid(0);
    //   return;
    // }

    setCurrPid(myRec.pid);
    try {
      var infores = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/stat/playerinfo/${myRec.pid}`);
      // console.log("read success");
      let  myInfo=[];
      // myInfo.push({item: "Date of Birth", value: infores.data.born});
      myInfo.push({item:"Role",  value: infores.data.playingRole});
      myInfo.push({item:"Batting Style",  value: infores.data.battingStyle});
      myInfo.push({item:"Bowling Style",  value: infores.data.bowlingStyle});
      // console.log(myInfo);
      setPlayerInfo(myInfo);

      let myBatting=[];
      // console.log(infores.data.data.batting);
      if (infores.data.data.batting.T20Is)
        myBatting.push({type: "T20", data: infores.data.data.batting.T20Is});
      else 
        myBatting.push({type: "T20", data: NoBatting});

      if (infores.data.data.batting.ODIs)
        myBatting.push({type: "ODI", data: infores.data.data.batting.ODIs})
      else 
        myBatting.push({type: "ODI", data: NoBatting});
      
      if (infores.data.data.batting.tests)
        myBatting.push({type: "TEST", data: infores.data.data.batting.tests})
      else 
        myBatting.push({type: "TEST", data: NoBatting});
      // console.log(myBatting);
      setBattingStats(myBatting);

      let myBowling=[];
      // console.log(infores.data.data.bowling);
      if (infores.data.data.bowling.T20Is)
        myBowling.push({type: "T20", data: infores.data.data.bowling.T20Is})
      else
        myBowling.push({type: "T20", data: NoBowling});

      if (infores.data.data.bowling.ODIs)
        myBowling.push({type: "ODI", data: infores.data.data.bowling.ODIs})
      else
        myBowling.push({type: "ODI", data: NoBowling});

      if (infores.data.data.bowling.tests)
        myBowling.push({type: "TEST", data: infores.data.data.bowling.tests})
      else
        myBowling.push({type: "TEST", data: NoBowling})
      // console.log(myBowling);
      setBowlingStats(myBowling);

      setRegisterStatus(0);
    } catch (err) {
      console.log("in error")
      setRegisterStatus(601);
    }

  }


  function ShowPlayerInfo() {
    if (currPid === 0) return null;

    return (
      <div align="center">
        <Typography>Player info</Typography>
        <Table>
        <TableBody p={0}>
        {playerInfo.map( (row) => {
          return (
            <TableRow key={row.item} >
            <TableCell className={classes.td}><Typography className={classes.value}>{row.item}</Typography></TableCell>
            <TableCell className={classes.td}><Typography className={classes.value}>{row.value}</Typography></TableCell>
            </TableRow>
          )
        })}
        </TableBody> 
        </Table>
      </div>
    )
  }

  function ShowPlayerBatting() {
    if (currPid === 0) return null;
    // console.log(battingStats);
    return (
      <div align="center">
        <Typography>Batting Stats</Typography>
        <Table>
        <TableHead p={0}>
        <TableRow key="battingheader" align="center">
          <TableCell align="center" className={classes.th}>Type</TableCell>
          <TableCell align="center" className={classes.th}>Match</TableCell>
          <TableCell align="center" className={classes.th}>Runs</TableCell>
          <TableCell align="center" className={classes.th}>SR</TableCell>
          <TableCell align="center" className={classes.th}>100</TableCell>
          <TableCell align="center" className={classes.th}>50</TableCell>
          {/* <TableCell align="center" className={classes.th}>6</TableCell>
          <TableCell align="center" className={classes.th}>4</TableCell> */}
          <TableCell align="center" className={classes.th}>Ave</TableCell>
        </TableRow>
        </TableHead>
        <TableBody p={0}>
        {battingStats.map( (row) => {
          // console.log(row);
          return (
            <TableRow key={row.type} >
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.type}</Typography></TableCell>
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data.Mat}</Typography></TableCell>
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data.Runs}</Typography></TableCell>
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data["SR"]}</Typography></TableCell>
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data["100"]}</Typography></TableCell>
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data["50"]}</Typography></TableCell>
            {/* <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data["6s"]}</Typography></TableCell>
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data["4s"]}</Typography></TableCell> */}
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data["Ave"]}</Typography></TableCell>
            </TableRow>
          )
        })}
        </TableBody> 
        </Table>
      </div>
    )
  }

  function ShowPlayerBowling() {
    if (currPid === 0) return null;
    // console.log(battingStats);
    return (
      <div align="center">
        <Typography>Bowling Stats</Typography>
        <Table>
        <TableHead p={0}>
        <TableRow key="bowlingheader" align="center">
          <TableCell align="center" className={classes.th}>Type</TableCell>
          <TableCell align="center" className={classes.th}>Match</TableCell>
          <TableCell align="center" className={classes.th}>Wickets</TableCell>
          <TableCell align="center" className={classes.th}>SR</TableCell>
          {/* <TableCell align="center" className={classes.th}>10W</TableCell> */}
          {/* <TableCell align="center" className={classes.th}>5W</TableCell> */}
          {/* <TableCell align="center" className={classes.th}>4W</TableCell> */}
          <TableCell align="center" className={classes.th}>Econ</TableCell>
          <TableCell align="center" className={classes.th}>Ave</TableCell>
        </TableRow>
        </TableHead>
        <TableBody p={0}>
        {bowlingStats.map( (row) => {
          // console.log(row);
          return (
            <TableRow key={row.type} >
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.type}</Typography></TableCell>
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data.Mat}</Typography></TableCell>
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data.Wkts}</Typography></TableCell>
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data["SR"]}</Typography></TableCell>
            {/* <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data["10"]}</Typography></TableCell> */}
            {/* <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data["5w"]}</Typography></TableCell> */}
            {/* <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data["4w"]}</Typography></TableCell> */}
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data["Econ"]}</Typography></TableCell>
            <TableCell align="center" className={classes.td}><Typography className={classes.value}>{row.data["Ave"]}</Typography></TableCell>
            </TableRow>
          )
        })}
        </TableBody> 
        </Table>
      </div>
    )
  }

  function ShowPlayerAvatar() {
    if (currPid === 0) return null;

    let playerImage = `https://www.cricapi.com/playerpic/${currPid}.JPG`
    return (
    <div className={classes.playerInfo} key="playerInfo">
      {/* <BlankArea /> */}
      <h3 align="center">{currPlayer}</h3>
      <Card className={classes.playerInfo} profile>                    
        <CardAvatar profile>
          <img src={playerImage} alt="..." />
        </CardAvatar>
        <CardBody profile>
          <ShowPlayerInfo />
          <BlankArea />
          <ShowPlayerBatting />
          <BlankArea />
          <ShowPlayerBowling />
        </CardBody>
      </Card>
    </div>
    );
}

  return (
    <div align="center">
      <DisplayPageHeader headerName="Player Info" groupName="" tournament=""/>
      <Select labelId='tournament' id='tournament'
        variant="outlined"
        required
        fullWidth
        label="Tournament Name"
        name="tournament"
        id="tournament"
        value={currTournament}
        inputProps={{
          name: 'Type',
          id: 'filled-age-native-simple',
        }}
        onChange={(event) => handleTournament(event.target.value)}
      >
        {tournamentList.map(x =>
        <MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>)}
      </Select>
      <Select labelId='team' id='team'
        variant="outlined"
        required
        fullWidth
        label="Team Name"
        name="team"
        id="team"
        value={currTeam}
        inputProps={{
          name: 'Type',
          id: 'filled-age-native-simple',
        }}
        onChange={(event) => handleTeam(event.target.value)}
      >
        {teamList.map(x =>
        <MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>)}
      </Select>
      <Select labelId='player' id='player'
        variant="outlined"
        required
        fullWidth
        label="Player Name"
        name="player"
        id="player"
        value={currPlayer}
        inputProps={{
          name: 'Type',
          id: 'filled-age-native-simple',
        }}
        onChange={(event) => handlePlayer(event.target.value)}
      >
        {playerList.map(x =>
        <MenuItem key={x.name} value={x.name}>{x.name}</MenuItem>)}
      </Select>
      <ShowResisterStatus/>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        className={gClasses.button}
        onClick={handleSubmit}
        disabled={currPlayer === ""}
      >
        Show Player Info
    </Button>
      <BlankArea />
      <ShowPlayerAvatar />
      {/* <Typography>This page is under development</Typography> */}
      {/* <ShowPlayerInfo />
      <BlankArea />
      <ShowPlayerBatting />
      <BlankArea />
      <ShowPlayerBowling /> */}
    </div>
  );
}
