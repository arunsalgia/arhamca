import { ThemeProvider } from "@material-ui/styles";


const modalStyles = {
	content : {
		top                   : '50%',
		left                  : '50%',
		right                 : 'auto',
		bottom                : 'auto',
		marginRight           : '-50%',
		marginBottom          : '-50%',
		transform             : 'translate(-50%, -50%)',
		background            : '#FFFFFF',        //'#E0E0E0',
		color                 : '#000000',
		transparent           : false,  
		borderColor: 'black',
		borderStyle: 'solid',
		borderRadius: 7,
		borderWidth: 2,
	}
};
  
export default modalStyles;
