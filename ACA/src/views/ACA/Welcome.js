import React, { useState, useEffect } from 'react';
// import './App.css';
import axios from "axios";
import Grid from '@material-ui/core/Grid';
import GridItem from "components/Grid/GridItem.js";
import Avatar from "@material-ui/core/Avatar"
// import download from 'js-file-download';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import globalStyles from "assets/globalStyles";
// import modalStyles from "assets/modalStyles";

import { downloadApk } from "views/functions";
import { BlankArea } from 'CustomComponents/CustomComponents';
import { isMobile, cdRefresh } from "views/functions.js"
import { red, blue, deepOrange } from '@material-ui/core/colors';

// const APPNAME  = process.env.REACT_APP_NAME;
// const APLAXIOS = process.env.REACT_APP_APLAXIOS;
const BRHEIGHT = 8;

const useStyles = makeStyles((theme) => ({
	background: {
		backgroundImage:  `${process.env.PUBLIC_URL}/image/APLIMAGE.JPG`,
	},
	container: {
		backgroundImage: `${process.env.PUBLIC_URL}/image/APLIMAGE.JPG`,   //`url(${backgroundImage})`,
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		width: '100vw',
		height: '100vh'
	},
	buttonLeft: {
		position: "fixed",
		top: "1%",
		left: "2%"
	},
	buttonRight1: {
		position: "fixed",
		top: "1%",
		right: "26%"
	},
	buttonRight2: {
		position: "fixed",
		top: "1%",
		right: "1%"
	},
	dlm: {
		position: "fixed",
		top: "6%",
		left: "1%",
		//right: 'auto',
		color: blue[900],
		fontSize: '12px',
		fontWeight: theme.typography.fontWeightBold,
	},
	dlm2: {
		left: "1%",
		//right: 'auto',
		color: blue[900],
		fontSize: '12px',
		fontWeight: theme.typography.fontWeightBold,
	},
	left: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
		color: red[900],
		//align: "right",
	  },
	right: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
		color: blue[900]
	},
	oContainer: {
		display: "flex",
		alignItems: 'center',
		justifyContent: 'center',
	},
	oImage: {
		flexBasis: '40%',
	},
	oText1: {
		fontSize: "20px",
		fontWeight: theme.typography.fontWeightBold,
		paddingLeft: "0px",
		align: "center"
	},
	oText2: {
		fontSize: "16px",
		align: "left",
		fontWeight: theme.typography.fontWeightBold,
		paddingLeft: "0px",
	}
}));

const Welcome = () => {
	let classes = useStyles();
	let gClasses = globalStyles();
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [windowHeight, setWindowHeight] = useState(window.innerHeight);
	const [bgImage, setBgImage] = useState("APLIMAGE")
	const [ downloadMessage, setDownloadMessage ] = useState("");
	const [allOffer, setAllOffer] = useState([]);

	// const imageUrl =  ? desktopImage : mobileImage;
	// const [breakCount, setBreakCount] = useState(0);
	// const [dummyArray, setDummyArray] = useState([]);
	// const [ downloadMessage, setDownloadMessage ] = useState("");

	function calculateBR() {
		// console.log(window.innerHeight, BRHEIGHT);
		// let myCount = Math.floor(window.innerHeight / BRHEIGHT) - 10;
		// if (myCount < 1) myCount = 1;
		// if (myCount > (200-1)) myCount = (200-1);
		// setBreakCount(myCount);
		// console.log(breakCount);
		// let tmp = (window.innerWidth >= 650) ? "WELCOME" : "MOBILE";
		// console.log("Imgae is", tmp);
		// setBgImage(tmp);
	}

	useEffect(() => {
		const handleWindowResize = () => {
			console.log(window.innerHeight, window.innerWidth);
			calculateBR();
			setWindowWidth(window.innerWidth);
			setWindowHeight(window.innerHeight);
			// console.log()
		};

		const getOffer = async () => {
			try {
				let resp = await axios.get(`${process.env.REACT_APP_AXIOS_BASEPATH}/apl/getoffer/ALL`); 
				setAllOffer(resp.data);
			} catch (e) {
				console.log(e);
			}
		}

		setWindowWidth(window.innerWidth);
		setWindowHeight(window.innerHeight);
		window.addEventListener('resize', handleWindowResize);
		calculateBR();
		getOffer();
		
		return () => {
				window.removeEventListener('resize', handleWindowResize);
		}
	}, []);
    
    
	function handleSignin() {
		sessionStorage.setItem("currentLogin", "SIGNIN");
		cdRefresh();
	}
	
	function handleSignup() {
		sessionStorage.setItem("currentLogin", "SIGNUP");
		cdRefresh();
	}

	function DisplayEasy() {
	return(
		<p>
		<span className={classes.left}>Auction Premier League</span>
		<span className={classes.right}> is easy to play with.</span>
		</p>
	)};


	async function handleAndroid() {
		try {
			setDownloadMessage("APL Android app download started. Please wait...")
			// console.log("Download Android app");
			await downloadApk();
			setDownloadMessage("APL Android app download complete.")
			// console.log("APK has to be downloaded");
		} catch (e) {
			setDownloadMessage("Error encountred while downloading APL Android app", true)
		}
		setTimeout(() => setDownloadMessage(""), 5000);    
	}

	function DisplayTopButtons() {
	return (
	<div>
		<Button type="submit" variant="contained" color="primary" 
		onClick={handleSignin}
		className={classes.buttonRight1}
		>
		Login
		</Button>
		<Button type="submit" variant="contained" color="primary" 
		onClick={handleSignup}
		className={classes.buttonRight2}
		>
		Register
		</Button>
		{ /* <Typography className={classes.dlm} align="center">{downloadMessage}</Typography> */ }
	</div>
	)};
			

	function DisplayStep(props) {
	return(
		// <Box borderColor="primary.main" border={2}>
		<img src={`${process.env.PUBLIC_URL}/image/S${props.step}.JPG`} alt="ARUN" />
		// </Box>
	)}

	function DisplayOffer(props) {
	// console.log(props.offer);
	return (
		<Box key={props.offer.header} borderColor="primary.main" border={2}>
			<Grid key={props.offer.header} container justify="center" alignItems="center" >
			<GridItem key={props.offer.header+"1"}  xs={2} sm={2} md={2} lg={2} >
				<Avatar variant="square" 
				src={`${process.env.PUBLIC_URL}/image/OFFER2.JPG`}
				className={classes.medium} />   
			</GridItem>
			<GridItem key={props.offer.header+"2"} xs={10} sm={10} md={10} lg={10} >
			<Typography className={classes.oText1}>{props.offer.header}</Typography>
			<Typography className={classes.oText2}>{props.offer.message}</Typography>
			</GridItem>
			</Grid>
		</Box>
	)}

	let image1= `${process.env.PUBLIC_URL}/image/APLWELCOME1.JPG`;
	let image2= `${process.env.PUBLIC_URL}/image/APLWELCOME2.JPG`;
	// console.log(image1, image2);
	return (
	<div align="center">
		<DisplayTopButtons />
		<img src={image1} alt="ARUN" height={windowHeight} width={windowWidth}/>
		<DisplayEasy />
		<BlankArea />
		<DisplayStep step="1" />
		<DisplayStep step="2" />
		<DisplayStep step="3" />
		<DisplayStep step="4" />
		<DisplayStep step="5" />
		<DisplayStep step="6" />
		{allOffer.map((item) => {
			// console.log(item);
			return (
			<DisplayOffer key={item.header} offer={item} />
		)})}
		<Typography className={classes.dlm2} align="center">{downloadMessage}</Typography>
		<Button onClick={handleAndroid} >
		<img src={image2} alt="ARUN" />
		</Button>
	</div>
	);
};

export default Welcome;
