import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
// import { Switch, Route } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
//import Table from "components/Table/Table.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Grid from "@material-ui/core/Grid";
// import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
// import Accordion from '@material-ui/core/Accordion';
// import AccordionSummary from '@material-ui/core/AccordionSummary';
// import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from "react-router-dom";
import { UserContext } from "../../UserContext";
import { cdCurrent, cdDefault, hasGroup, clearBackupData} from "views/functions.js"
import {BlankArea, NothingToDisplay, DisplayBalance} from "CustomComponents/CustomComponents.js"
import {red, blue, green, deepOrange } from '@material-ui/core/colors';
import {setTab} from "CustomComponents/CricDreamTabs.js"
const rPrefix = "radio-";
const curr =  "Curr - Current Group  / Def - Default Group";
const clickmsg = "Click on group name for details";

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    }, 
    info: {
        color: blue[700],
    },     
    header: {
        color: '#D84315',
    },     
    messageText: {
        color: '#4CC417',
        fontSize: 12,
        // backgroundColor: green[700],
    },
    symbolText: {
        color: '#4CC417',
        // backgroundColor: green[700],
    },
    button: {
        margin: theme.spacing(0, 1, 0),
      },
        heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
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
  }));


export default function Group() {

    // window.onbeforeunload = () => setUser(null)
    // const { setUser } = useContext(UserContext);
    const classes = useStyles();
    const [myGroupTableData, setMyGroupTableData] = useState([]);
    const [newCurrentGroup, setNewCurrentGroup] = useState(localStorage.getItem("groupName"));
    const [newDefaultGroup, setNewDefaultGroup] = useState("");
    // const history = useHistory();
    const [balance, setBalance] = useState(0);
    const [originalDefaultGroup, setOriginalDefaultGroup] = useState("");
      
    useEffect(() => {
        const a = async () => {
            // let myBalance = await getUserBalance();
            // setBalance(myBalance);
            localStorage.setItem("groupMember", "");
            var myUrl = `${process.env.REACT_APP_AXIOS_BASEPATH}/group/memberof/${localStorage.getItem("uid")}`;
            const response = await axios.get(myUrl);
            // console.log(response.data[0].groups);
            let allGroups = response.data[0].groups;
            setMyGroupTableData(allGroups);
            if (allGroups.length > 0) {
                let tmp = allGroups.find(x => x.defaultGroup == true);
                if (tmp) {
                    setNewDefaultGroup(tmp.groupName);
                    setOriginalDefaultGroup(tmp.groupName);
                } else {
                    localStorage.setItem("gid", allGroups[0].gid.toString());
                    localStorage.setItem("groupName", allGroups[0].groupName);
                    localStorage.setItem("tournament", allGroups[0].tournament);
                    localStorage.setItem("admin", allGroups[0].admin);
                    setNewDefaultGroup(allGroups[0].groupName);
                }
            }
        }
        a();
    }, [])


    function handleGroupDetails(grpName) {
        // console.log(`Show group details of ${grpName}`)
        var ggg =   myGroupTableData.find(x => x.groupName === grpName);
        //console.log(ggg);
        window.localStorage.setItem("gdGid", ggg.gid.toString());
        // window.localStorage.setItem("gdName", ggg.groupName)
        // window.localStorage.setItem("gdDisplay", ggg.displayName)
        // window.localStorage.setItem("gdAdmin", ggg.admin);
        // window.localStorage.setItem("gdCurrent", (newCurrentGroup === ggg.groupName) ? "true" : "false");
        // window.localStorage.setItem("gdDefault", ggg.defaultGroup);
        // window.localStorage.setItem("gdTournament", ggg.tournament);
        setTab(process.env.REACT_APP_GROUPDETAILS);
    }



    function handleNewGroup() {
        setTab(process.env.REACT_APP_NEWGROUP);
    };

    function handleJoinGroup() {
        localStorage.setItem("joinGroupCode", "");       
        setTab(process.env.REACT_APP_JOINGROUP);
    };


    function DisplayGroupHeader() {
        return (
        <Grid key="gr-group" container justify="center" alignItems="center" >
            <Grid item key="gi-group" xs={11} sm={11} md={11} lg={11} >
            <Typography className={classes.header}>Group Name</Typography>
            </Grid>
            <Grid item key="gi-group" xs={1} sm={1} md={1} lg={1} >
            <Typography className={classes.header}></Typography>
            </Grid>
            {/* <Grid item key="gi-group" xs={2} sm={2} md={2} lg={2} >
            <Typography className={classes.header}>Def</Typography>
            </Grid> */}
        </Grid>
        );
    }

    // now Current and efault are same
    async function handleCommonCurrentGroup(grpName) {
        // console.log(grpName);
        let gRec = myGroupTableData.find( x => x.groupName === grpName);
        let newGid = gRec.gid;
        // console.log(newGid);
        try {
            await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setdefaultgroup/${localStorage.getItem("uid")}/${newGid}`);
            setNewDefaultGroup(grpName);
            setNewCurrentGroup(grpName);
            // console.log(gRec);
            localStorage.setItem("gid", gRec.gid);
            localStorage.setItem("groupName", gRec.groupName);
            localStorage.setItem("tournament", gRec.tournament);
            localStorage.setItem("admin", gRec.admin);

            clearBackupData();
        } catch (e) {
            console.log(e);
        } 
    };


    function handleNewCurrentGroup(grpName) {
        // console.log(grpName);
        setNewCurrentGroup(grpName);
        let gRec = myGroupTableData.find( x => x.groupName === grpName);
        // console.log(gRec);
        localStorage.setItem("gid", gRec.gid);
        localStorage.setItem("groupName", gRec.groupName);
        localStorage.setItem("tournament", gRec.tournament);
        localStorage.setItem("admin", gRec.admin);
    };
    

    async function handleNewDefaultGroup(grpName) {
        // console.log(grpName);
        let gRec = myGroupTableData.find( x => x.groupName === grpName);
        // console.log(gRec);
        let newGid = gRec.gid;
        // console.log(newGid);
        let sts = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/group/setdefaultgroup/${localStorage.getItem("uid")}/${newGid}`);
        setNewDefaultGroup(grpName);
    };

    function DisplayGroupData() {
        return (
            <Table>
            <TableHead p={0}>
                <TableRow align="center">
                <TableCell className={classes.th} p={0} align="center">Group Name</TableCell>
                <TableCell className={classes.th} p={0} align="center"></TableCell>
                </TableRow>
            </TableHead>
            <TableBody p={0}>
                {myGroupTableData.map(item => {
                return (
                    <TableRow key={item.groupName}>
                    <TableCell  className={classes.td} p={0} align="center" >
                        {item.groupName}
                    </TableCell>
                    <TableCell  className={classes.td} p={0} align="center" >
                        <FormControlLabel 
                        key={"Curr"+item.groupName}
                        id={"Curr"+item.groupName}
                        className={classes.td} 
                        control={<Radio color="primary" defaultChecked={item.playerName === newCurrentGroup}/>}
                        onClick={() => handleNewCurrentGroup(item.groupName)}
                        checked={newCurrentGroup === item.groupName}
                        />
                    </TableCell>
                    </TableRow>
                )
                })}
            </TableBody> 
            </Table>    
        )

        // console.log(myGroupTableData);
        return (
        myGroupTableData.map( (x, index) => {
        return (
            <Grid key={x.groupName} container justify="center" alignItems="center" >
            {/* <Grid item key={x.groupName} xs={9} sm={9} md={9} lg={9} >
                <Link href="#" onClick={() => handleGroupDetails(x.groupName)} variant="body2">
                <Typography>{x.groupName}</Typography>
                </Link>
            </Grid> */}
            <Grid item key={x.groupName} xs={11} sm={11} md={11} lg={1} >
                <Typography>{x.groupName}</Typography>
            </Grid>
            {/* <Grid item justify="center" alignContent="center" alignItems="center" key={x.groupName} xs={2} sm={2} md={2} lg={2} >
                <FormControlLabel 
                    key={"Curr"+x.groupName}
                    id={"Curr"+x.groupName}
                    className={classes.info} 
                    control={<Radio color="primary" defaultChecked={x.playerName === newCurrentGroup}/>}
                    onClick={() => handleNewCurrentGroup(x.groupName)}
                    checked={newCurrentGroup === x.groupName}
                />
            </Grid> */}
            <Grid item justify="center" alignContent="center" alignItems="center" xs={1} sm={1} md={1} lg={1} >
                <FormControlLabel 
                    key={"Def"+x.groupName}
                    id={"Def"+x.groupName}
                    className={classes.info} 
                    control={<Radio color="primary" defaultChecked={x.playerName === newDefaultGroup}/>}
                    onClick={() => handleCommonCurrentGroup(x.groupName)}
                    checked={newDefaultGroup === x.groupName}
                />
            </Grid>
        </Grid>
        )}))
    }

    function  ShowAllGroups() {
        return(
        <DisplayGroupData />
        );
    }

    function ShowPageHeader() {
        return(
            <div className={classes.root} align="center">
                <h3>My Groups</h3>
                {/* <Typography className={classes.messageText}>{curr}</Typography> */}
                {/* <Typography className={classes.messageText}>{clickmsg}</Typography> */}
            </div>
        );
    }


    // console.log(`currrent group ${localStorage.getItem("groupName")}`)
    return (
        <div className={classes.root} align="center" key="groupinfo">
            {/* <DisplayBalance balance={balance} /> */}
            <ShowPageHeader />
            {/* <ShowAllGroups /> */}
            <DisplayGroupData />
        </div>
        );
    
}

