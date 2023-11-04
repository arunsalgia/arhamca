import React, { useRef, useState, useContext, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import globalStyles from "assets/globalStyles";
import Container from '@material-ui/core/Container';
import axios from "axios";
import {setTab} from "CustomComponents/CricDreamTabs.js"
import { ACALogo } from 'CustomComponents/CustomComponents.js';
import { BlankArea } from 'CustomComponents/CustomComponents';

import { upGradeRequired } from 'views/functions';

const handleSubmit = e => {
  e.preventDefault();
};

export default function Update() {
  const gClasses = globalStyles();
  const [gotInfo, setGotInfo] = useState(false);
  const [upgReq, setUpgReq] = useState(false);
  const [latest, setLatest] = useState({});

  useEffect(() => {
    const checkVersion = async () => {

      let upg = await upGradeRequired();
      console.log(`Update required: ${upg.status}`);
      setUpgReq(upg.status);
      setLatest(upg.latest);
      console.log(upg);
      setGotInfo(true);
    }
    checkVersion();
  }, []);


  
  async function handleAndroid() {

    // opens the url in the default browser 
    var myURL = `${process.env.REACT_APP_APLSERVER}/viraag/binarylatest/APL`;
    try {
      await window.open(myURL, '_blank', 'noreferrer');
    }
    catch(e) {
     console.log(e); 
    }
    return;
    
  }

  function handleIos() {
    console.log("Download IOS app");
  }


  if (!gotInfo) return null;
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={gClasses.paper}>
        <ACALogo />        
        <Typography className={gClasses.info22}>{`Application ${process.env.REACT_APP_NAME}.${process.env.REACT_APP_DEVICE}`}</Typography>
        <Typography className={gClasses.info18}>{`Version ${process.env.REACT_APP_VERSION}`}</Typography>
        <BlankArea />
        {(upgReq) &&
          <div>
          <Typography className={gClasses.info18Brown}>{`Latest version ${latest.version} available.`}</Typography>        
          <BlankArea />
          <Button fullWidth variant="contained" color="primary" onClick={handleAndroid} >
            Update
          </Button>
          </div>
        }
        {(!upgReq) &&
          <Typography className={gClasses.info18Brown}>Latest version. No update required</Typography>
        }
      </div>
    </Container>
  );
}
