import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
//import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import BlueRadio from 'components/Radio/BlueRadio';
import { UserContext } from "../../UserContext";
import { NoGroup, JumpButton, DisplayPageHeader, MessageToUser } from 'CustomComponents/CustomComponents.js';
import { hasGroup } from 'views/functions';
//import { red, blue, green, deepOrange, deepPurple } from '@material-ui/core/colors';
// import { updateLanguageServiceSourceFile } from 'typescript';
//import { BlankArea } from 'CustomComponents/CustomComponents';
import globalStyles from "assets/globalStyles";

const vcPrefix = "vicecaptain-"
const cPrefix = "captain-"


export default function Captain() {
    //const classes = useStyles();
    const gClasses = globalStyles();
		
		const [iHaveGroup, setIHaveGroup] = useState(false);
    const [selectedViceCaptain, SetSelectedViceCaptain] = useState("");
    const [selectedCaptain, SetSelectedCaptain] = useState("");
    const [teamArray, setTeamArray] = useState([]);
    const [tournamentStated, setTournamentStarted] = useState(false);
    const [registerStatus, setRegisterStatus] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [firstTime, setFirstTime] = useState(true);
		var myGid = localStorage.getItem("gid");
		var myUid = localStorage.getItem("uid");
		//console.log(myGid, myUid);
		var firsTime = true;

    useEffect(() => {
			async function getTeam(gid, uid) {
				try {
					var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/myteamwos/${gid}/${uid}`;
					const teamResponse = await axios.get(myUrl);
					setTeamArray(teamResponse.data[0].players);
					localStorage.setItem("captainList", JSON.stringify(teamResponse.data[0].players));
				} catch (e) {
					console.log(e);
				}
			}
			async function getCaptainNames(gid, uid) {
				try {
					let myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/getcaptain/${gid}/${uid}`;
					var response = await axios.get(myUrl);
					//console.log(response.data);
					if (response.data.length > 0) {
						SetSelectedCaptain(response.data[0].captainName);
						SetSelectedViceCaptain(response.data[0].viceCaptainName)
							//localStorage.setItem("captain", JSON.stringify(response.data[0].captainName));
							//localStorage.setItem("viceCaptain", JSON.stringify(response.data[0].viceCaptainName));
					}				
				} catch (e) {
					console.log(e);
				}
			}
			async function getBalanceTime(gid) {
				try {
					var response = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/gamestarted/${localStorage.getItem("gid")}`);
					if (response.data > 0) {
						// console.log("GT0");
						setTournamentStarted(false);
						setTimeLeft(response.data)
					} else {
						setTournamentStarted(true);
					}				
				} catch (e) {
					console.log(e);
				}
			}
			if (firsTime) {
				if (hasGroup()) {
					setIHaveGroup(true);
					try {
						let tmp = JSON.parse(localStorage.getItem("captainList"));
						if (tmp != null) setTeamArray(tmp);
					} catch {}
					getTeam(myGid, myUid);
					getCaptainNames(myGid, myUid);
					getBalanceTime(myGid);
				} else {
					setIHaveGroup(false);
				}
				firsTime = false;
			}
			if (timeLeft > 0)
				setTimeout(() => setTimeLeft(timeLeft-1), 1000);
			else
				setTournamentStarted(true);
    }, [timeLeft])

    // function handleTimer() {}

    function ShowResisterStatus() {
        // console.log(`Status is ${registerStatus}`);
        let myMsg;
        let errmsg = true;
        switch (registerStatus) {
          case 200:
            myMsg = "Successfully updated Captain / ViceCaptain details";
            errmsg = false;
            break;
          case 0:
            myMsg = "";
            break;
          default:
            myMsg = "Error updating Captain / ViceCaptain details";
            break;
        }
        let myClass = (errmsg) ? gClasses.error : gClasses.nonerror;
        return(
          <div>
            <Typography align="center" className={myClass}>{myMsg}</Typography>
          </div>
        );
      }



    function handleSelectedCaptain(newCap) {
        setRegisterStatus(0);
        if (!tournamentStated) {
            if (newCap === selectedViceCaptain)
                SetSelectedViceCaptain("");
            SetSelectedCaptain(newCap);
        }
    };

    function handleSelectedViceCaptain(newViceCap) {
        setRegisterStatus(0);
        if (!tournamentStated) {
            if (newViceCap === selectedCaptain)
                SetSelectedCaptain("");
            SetSelectedViceCaptain(newViceCap);
        }
    };


    async function updateCaptain() {
        // console.log("upd captin vc details");
        var tmp = teamArray.find(x => x.playerName === selectedCaptain);
        let capPid = (tmp) ?  tmp.pid : 0;
        tmp = teamArray.find(x => x.playerName === selectedViceCaptain);
        let vicecapPid = (tmp) ?  tmp.pid : 0;
        var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/user/captainvicecaptain/${localStorage.getItem("gid")}/${localStorage.getItem("uid")}/${capPid}/${vicecapPid}`;
        // console.log(myUrl);
        const resp = await  axios.get(myUrl);
        // console.log(resp.status)
        setRegisterStatus(resp.status);
       }



    function DisplayCaptainSelectButton() {
			return (
			<div align="center">
			{(!tournamentStated) &&
				<Button variant="contained" color="primary" size="small" className={gClasses.button} onClick={updateCaptain}>Update</Button>
			}
			</div>
			);
    }

    function ShowCaptainViceCaptain() {
			return(
				<Table>
				<TableHead p={0}>
				<TableRow key="header" align="center">
					<TableCell className={gClasses.th} p={0} align="center">Player Name</TableCell>
					<TableCell className={gClasses.th} p={0} align="center">Captain</TableCell>
					<TableCell className={gClasses.th} p={0} align="center">Vice Captain</TableCell>
				</TableRow>
				</TableHead>
				<TableBody p={0}>
					{teamArray.map(x => 
						<TableRow key={x.playerName} align="center">
							<TableCell  className={gClasses.td} p={0} align="center" >
								{x.playerName}
							</TableCell>
							<TableCell  className={gClasses.td} p={0} align="center" >
								<FormControlLabel
									key={cPrefix+x.playerName}
									value={x.playerName}
									control={<Radio color="primary" key={cPrefix+x.playerName} id={cPrefix+x.playerName} />}
									onClick={() => handleSelectedCaptain(x.playerName)}
									checked={selectedCaptain === x.playerName}
									disabled={tournamentStated}
								/>
							</TableCell>
							<TableCell className={gClasses.td} p={0} align="center" >
								<FormControlLabel
										key={vcPrefix+x.playerName}
										value={x.playerName}
										control={<Radio color="primary" key={vcPrefix+x.playerName} id={cPrefix+x.playerName} />}
										onClick={() => handleSelectedViceCaptain(x.playerName)}
										checked={selectedViceCaptain === x.playerName}
										disabled={tournamentStated}
								/>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
				</Table>
        );
    };

    function DisplayTournamentStarted() {
        if (tournamentStated) {
					return (
							<Typography className={gClasses.error} align="center">(cannot update after tournament has started.)</Typography>
					);
        } else {
            let x = timeLeft;
            let days = Math.trunc(x / 86400);
            // console.log(days);
            x = x % 86400;
            let h = Math.trunc(x / 3600);
            x = x % 3600;
            let m = Math.trunc( x / 60);
            let s = x % 60;
            let strD = (days > 0) ? `${days}d ` : "";
            let strH = ("0" + h).slice(-2);
            let strM = ("0" + m).slice(-2);
            let strS = ("0" + s).slice(-2);
            return (
                <Typography className={gClasses.nonerror} align="center">(Update will be disabled after {strD}{strH}:{strM}:{strS})</Typography>
            );
        }
    }

    function ShowJumpButtons() {
        return (
        <div>
            <br />
            <JumpButton page={process.env.REACT_APP_HOME} text="Home" />
        </div>
        )
    }

		return (
		<div>
		{(iHaveGroup) &&
		<div className={gClasses.root} key="cpataininfo">
			<DisplayPageHeader headerName="Captain/ViceCaptain" groupName={localStorage.getItem("groupName")} tournament={localStorage.getItem("tournament")}/>
			<DisplayTournamentStarted/>
			<ShowCaptainViceCaptain/>
			<br/>
			<ShowResisterStatus/>
			<br/>
			<DisplayCaptainSelectButton/>
			<ShowJumpButtons />
			<br />
		</div>
		}
		{(!iHaveGroup) &&
			<NoGroup/>
		}
		</div>
		)
}
