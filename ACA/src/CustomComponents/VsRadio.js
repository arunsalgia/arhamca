import React from 'react';
import Typography from '@material-ui/core/Typography';
import globalStyles from "assets/globalStyles";
import FormControlLabel from '@material-ui/core/FormControlLabel';
//import Checkbox from '@material-ui/core//Checkbox';
import Radio from '@material-ui/core/Radio';

export default function VsRadio(props) {
const gClasses = globalStyles();
let _align = (props.align == null) ? 'center' : props.align;
let _label = (props.label == null) ? "" : props.label;
return (
	<div align={_align} >
	 <FormControlLabel 
		control={
		 <Radio checked={props.checked}  onClick={props.onClick} className={gClasses.blueCheckBox} />
		} 
		label={
		 <Typography className={gClasses.blackCheckBoxLabel}>
		 {_label} 
		 </Typography>
		 }
		/>
	</div>
	)
}

