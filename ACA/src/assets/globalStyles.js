import {
  successColor,
  whiteColor,
  grayColor,
  hexToRgb
} from "assets/jss/material-dashboard-react.js";
import { red, blue, green, yellow, deepOrange, deepPurple } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';


const globalStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    // backgroundColor: '#FAF5E9',
  },
	textAreaFixed: {
		display: "flex-root",
    width: "100%",
    fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
    resize: 'none',
	},
	dateTimeNormal: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
		align: 'center',
		//width: (isMobile()) ? '60%' : '20%',
	}, 
	dateTimeBlock: {
		color: 'blue',
		//fontSize: theme.typography.pxToRem(28),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: pink[100],
	}, 
	error:  {
      // right: 0,
      fontSize: '12px',
      color: red[700],
      // position: 'absolute',
      alignItems: 'center',
      marginTop: '0px',
  },
	select: {
		'&:before': {
				borderColor: 'blue',
				borderStyle: 'solid',  
				padding: '5px',
		},
		'&:after': {
				borderColor: 'blue',
				borderStyle: 'solid',  
				padding: '5px',
		}
},
	filter: {
		padding: "2px",
		margin: "3px", 
		borderRadius: "25%",
		borderColor: 'blue',
		border: 'solid',
		
	},
	boxStyleOdd: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		backgroundColor: '#FFF3E0',
		//backgroundColor: 'green',
		//backgroundColor: blue[300] 
	},
	boxStyleEven: {
		padding: "5px 10px", 
		margin: "4px 2px", 
		backgroundColor: '#EEEEEE',
		//backgroundColor: 'green',
		//backgroundColor: blue[300] 
	},
	tableCellOdd: {
		padding: '4px',
		backgroundColor: '#F0F8FF',		// aliceblue
	},
	tableCellEven: {
		padding: '4px',
		backgroundColor: '#FFDAB9',	//			peachpuff,
	},
	fullWidth: {
		display: "flex-root",
    width: "100%",
		backgroundColor: 'inherit',
		padding: "none", 
	},
	noPadding: {
		padding: "none", 
  },
	patientInfo: {
		//marginLeft: theme.spacing(3),
		fontSize: theme.typography.pxToRem(16),
	},
	info22: {
		fontSize: theme.typography.pxToRem(22),
	},
	info22Bold: {
		fontSize: theme.typography.pxToRem(22),
		fontWeight: theme.typography.fontWeightBold,
	},
	info18: {
		fontSize: theme.typography.pxToRem(18),
	},
	info18Bold: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,
	},
	info20Bold: {
		fontSize: theme.typography.pxToRem(20),
		fontWeight: theme.typography.fontWeightBold,
	},
	info16: {
		fontSize: theme.typography.pxToRem(16),
	},
	info16Bold: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
	},
	info18Brown: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,
		color: 'brown',
	},
  info18Blue: {
		fontSize: theme.typography.pxToRem(18),
		fontWeight: theme.typography.fontWeightBold,
		color: 'blue',
	},
	info2: {
		fontSize: theme.typography.pxToRem(16),
	},
	info12: {
		fontSize: theme.typography.pxToRem(12),
	},
  info10: {
		fontSize: theme.typography.pxToRem(10),
	},
	info12Blue: {
		fontSize: theme.typography.pxToRem(12),
		color: 'blue',
	},
	info14: {
		fontSize: theme.typography.pxToRem(14),
	},
	info14Bold: {
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	},
	info14Blue: {
		fontSize: theme.typography.pxToRem(14),
		color: 'blue',
	},
	patientInfo2: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
	},
	patientInfo2Blue: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
		color: 'blue',
	},
	patientInfo2Brown: {
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
		color: 'brown',
	},
	normalAccordian: {
    backgroundColor: '#FFCCBC',
    borderRadius: 25,
  },
  selectedAccordian: {
    backgroundColor: '#B2EBF2',
    borderRadius: 25,
  },
	whiteAccordian: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
  },
	blueCheckBox: {
		color: 'blue',
		marginLeft: "5px",
	},
	blackCheckBoxLabel: {
		color: 'black',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	},
	blueCheckBoxLabel: {
		color: 'blue',
		fontSize: theme.typography.pxToRem(14),
		fontWeight: theme.typography.fontWeightBold,
	},
	th: { 
    border: 5,
    align: "center",
    paddingBottom: "1px",
    paddingTop: "1px",
		fontSize: theme.typography.pxToRem(16),
		fontWeight: theme.typography.fontWeightBold,
		//backgroundColor: '#FFA726',
		backgroundColor: deepOrange[200],
		borderWidth: 1,
		borderColor: 'black',
		borderStyle: 'solid',
  },
  td : {
    border: 5,
    align: "center",
    paddingBottom: "1px",
    paddingTop: "1px",
		fontSize: theme.typography.pxToRem(16),
		//fontWeight: theme.typography.fontWeightBold,
    backgroundColor: blue[100],
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',    
  },
	tdrounded : {
    border: 5,
		//borderRadius: 25,
    align: "center",
    paddingBottom: "1px",
    paddingTop: "1px",
		fontSize: theme.typography.pxToRem(16),
		//fontWeight: theme.typography.fontWeightBold,
    backgroundColor: blue[100],
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',    
  },
  disabledtd : {
    border: 5,
    align: "center",
    paddingBottom: "1px",
    paddingTop: "1px",
		fontSize: theme.typography.pxToRem(16),
		//fontWeight: theme.typography.fontWeightBold,
    backgroundColor: yellow[100],
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',    
  },
  disabledtdrounded : {
    border: 5,
		//borderRadius: 25,
    align: "center",
    paddingBottom: "1px",
    paddingTop: "1px",
		fontSize: theme.typography.pxToRem(16),
		//fontWeight: theme.typography.fontWeightBold,
    //backgroundColor: yellow[100],
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',    
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  page: {
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor: '#FAF5E9',
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
  message18: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  message16: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  message14: {
    fontSize: theme.typography.pxToRem(14),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  message12: {
    fontSize: theme.typography.pxToRem(12),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  message10: {
    fontSize: theme.typography.pxToRem(10),
    fontWeight: theme.typography.fontWeightBold,
    // color: yellow[900]
  },
  button: {
    margin: theme.spacing(0, 1, 0),
  },
  error:  {
    fontSize: '12px',
    color: red[700],
    alignItems: 'center',
    marginTop: '0px',
    fontWeight: theme.typography.fontWeightBold,
  },
  nonerror:  {
    fontSize: '12px',
    color: blue[700],
    alignItems: 'center',
    marginTop: '0px',
    fontWeight: theme.typography.fontWeightBold,
  },
	/*
  th: { 
    spacing: 0,
    align: "center",
    padding: "none",
    backgroundColor: '#EEEEEE',
    color: deepOrange[700],
    fontWeight: theme.typography.fontWeightBold,
  },
	*/
  upArrowCardCategory: {
    width: "16px",
    height: "16px"
  },
  stats: {
    color: grayColor[0],
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "10px",
      height: "10px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    }
  },
  cardCategory: {
    color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0"
  },
  cardCategoryWhite: {
    color: "rgba(" + hexToRgb(whiteColor) + ",.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardTitleWhite: {
    color: whiteColor,
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  modalContainer: {
    content: "",
    opacity: 0.8,
    // background: rgb(26, 31, 41) url("your picture") no-repeat fixed top;
    // background-blend-mode: luminosity;
    /* also change the blend mode to what suits you, from darken, to other 
    many options as you deem fit*/
    // background-size: cover;
    // top: 0;
    // left: 0;
    // right: 0;
    // bottom: 0;
    // position: absolute;
    // z-index: -1;
    // height: 500px;
  },
  modalTitle: {
    color: blue[700],
    fontSize: theme.typography.pxToRem(20),
    fontWeight: theme.typography.fontWeightBold,
  },
  modalMessage: {
    //color: blue[700],
    fontSize: theme.typography.pxToRem(14),
    //fontWeight: theme.typography.fontWeightBold,
  },
  modalbutton: {
    margin: theme.spacing(2, 2, 2),
  },
  jumpButton: {
    // margin: theme.spacing(0, 1, 0),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    color: '#1A237E',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '16px',
    width: theme.spacing(20),
  },
  jumpButtonFull: {
    // margin: theme.spacing(0, 1, 0),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: '#FFFFFF',
    color: '#1A237E',
    fontWeight: theme.typography.fontWeightBold,
    fontSize: '16px',
    width: theme.spacing(40),
  },
  noSpace: {
    // margin: theme.spacing(0, 1, 0),
    marginTop: theme.spacing(0),
    marginRight: theme.spacing(0),
    marginBottom: theme.spacing(0),
    marginLeft: theme.spacing(0),
  },
  show: {
    display: 'block',
  },
  hide: {
    display: 'none',
  },
}));

export default globalStyles;
