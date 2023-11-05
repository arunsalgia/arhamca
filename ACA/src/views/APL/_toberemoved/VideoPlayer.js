import React, { useRef, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { blue, red } from '@material-ui/core/colors';
import Grid from "@material-ui/core/Grid";
import GridItem from "components/Grid/GridItem.js";
// import PlayCircleFilledWhiteOutlinedIcon from '@material-ui/icons/PlayCircleFilledWhiteOutlined';
// import PauseCircleOutlineOutlinedIcon from '@material-ui/icons/PauseCircleOutlineOutlined';
import PlayIcon from '@material-ui/icons/PlayCircleFilledWhiteOutlined';
import PauseIcon from '@material-ui/icons/PauseCircleOutlineOutlined';
import MuteIcon from '@material-ui/icons/VolumeOffOutlined';
import UnMuteIcon from '@material-ui/icons/VolumeMuteOutlined';
import { Typography } from "@material-ui/core";
import { NextWeekRounded } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  currentTime: {
    color: 'blue',
    marginLeft: '3px',
    marginTop: '0px',
    fontWeight: theme.typography.fontWeightBold,
  },
  duration: {
    color: 'blue',
    // marginLeft: '3px',
    marginTop: '0px',
    fontWeight: theme.typography.fontWeightBold,
  },
  range: {
    backgroundColor: blue[700],
  },
  playIcon: {
    color: 'primary',
  }
}));

const iconStyle = { color: "blue", paddingRight: "5px" };
const rangeStyle = { backgroundColor: "blue"};

export default function APLPlayer(props) {
  const videoPlayer = useRef();
  const classes = useStyles();

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState("");

  const [seekValue, setSeekValue] = useState(0);
  const [userPause, setPause] = useState(true);  
  
  const [mute, setMute] = useState(false);
  const [volume, setVolume] = useState(1);

  function handlePlay(newPause)  {
    if (newPause) videoPlayer.current.pause();
    else       videoPlayer.current.play();
    setPause((newPause));
  };

  function handleMute(newMute) {
    console.log(newMute);
    videoPlayer.current.muted = newMute;
    setMute(newMute);
  }

  const pause = () => {
    videoPlayer.current.pause();
    setPause(true);
  };

  const stop = () => {
    videoPlayer.current.pause();
    videoPlayer.current.currentTime = 0;
    setPause(true);
  };

  const setSpeed = (speed) => {
    videoPlayer.current.playbackRate = speed;
  };

  function timeString(timeInSeconds) { 
    let myStr = "";
    let hour = Math.floor(timeInSeconds / 3600);
    if (hour > 0) myStr = hour + ":";
    timeInSeconds = timeInSeconds % 3600;
    
    let minute = Math.floor(timeInSeconds / 60);
    if (((hour !== 0) || (minute !== 0))) 
      myStr += ("0" + minute).slice(-2) + ":"
    timeInSeconds = timeInSeconds % 3600;
  
    myStr += ("0" + timeInSeconds.toFixed(2)).slice(-5);

    return myStr;
  }

  const onPlaying = () => {
    // console.log(videoPlayer.current.currentTime, videoPlayer.current.duration);
    setCurrentTime(videoPlayer.current.currentTime);
    // setCurrentTimeString(timeString(videoPlayer.current.currentTime));
    setSeekValue(
      (videoPlayer.current.currentTime / videoPlayer.current.duration) * 100
    );
    setDuration(videoPlayer.current.duration.toFixed(2));
    if (videoPlayer.current.currentTime === videoPlayer.current.duration) {
      setPause(true);
      setSeekValue(0);
      setCurrentTime(0);
    }
  }; 


  function PlayPauseButton() {
    if (userPause)
      return <PlayIcon style={iconStyle} onClick={() => { handlePlay(false) }} />
    else
      return <PauseIcon style={iconStyle} onClick={() => { handlePlay(true) }} />
  }

  function MuteButton() {
    if (mute) 
      return <UnMuteIcon style={iconStyle} onClick={ () => { handleMute(false)} } />
    else
      return <MuteIcon style={iconStyle} onClick={ () => { handleMute(true)} } />
  }

  // let myVideo = `url(${process.env.PUBLIC_URL}/video/DEMO.MP4)`;
  console.log("Play video", props.video);
  return (
    <div className="App">
      <video
        // autoPlay
        width="320"
        height="240"
        ref={videoPlayer}
        volume={volume}
        onTimeUpdate={onPlaying} 
      >
        <source                
          // src="https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4"
          // src='https://www.youtube.com/watch?v=rnwlWn603g4'
          src={props.video}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <br />
      <div>
        <PlayPauseButton />
        <MuteButton />
        <label align="center" className={classes.currentTime}>{currentTime.toFixed(2)}</label>
        <input id="time" 
          type="range" min="0" max="100" step="1"
          // className={classes.range}
          style={rangeStyle} 
          // color="primary"
          // color='#0000FF'
          value={seekValue}
          onChange={(e) => {
            const seekto = videoPlayer.current.duration * (+e.target.value / 100);
            videoPlayer.current.currentTime = seekto;
            setSeekValue(e.target.value);
            // setDuration(videoPlayer.current.duration.toFixed(2));
          }}
        />
        <label align="center" className={classes.duration}>{duration}</label>
        {/* <button onClick={() => setSpeed(1)}>1x</button>
        <button onClick={() => setSpeed(1.5)}>1.5x</button>
        <button onClick={() => setSpeed(2)}>2x</button>  */}
      </div>
    </div>
  );
}