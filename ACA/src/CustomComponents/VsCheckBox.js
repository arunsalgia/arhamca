import React from 'react';
import Typography from '@material-ui/core/Typography';
import globalStyles from "assets/globalStyles";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core//Checkbox';

export default function VsCheckBox(props) {
const gClasses = globalStyles();
let _align = (props.align == null) ? 'center' : props.align;
return (
	<div align={_align} >
	 <FormControlLabel 
		control={
		 <Checkbox checked={props.checked}  onClick={props.onClick} className={gClasses.blueCheckBox} />
		} 
		label={
		 <Typography className={gClasses.blueCheckBoxLabel}>
		 {props.label} 
		 </Typography>
		 }
		/>
	</div>
	)
}

