import React from 'react';
import globalStyles from "assets/globalStyles";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';

export default function VsRadioGroup(props) {
const gClasses = globalStyles();
let _field = (props.radioField == null);
return (
	<FormControl component="fieldset">
		<RadioGroup row aria-label="rgrp" name="rgrp" value={props.value} onChange={props.onChange}>
	{(_field) &&
		props.radioList.map ( r =>
		<FormControlLabel key={r} className={gClasses.filterRadio} value={r} 
			control={<Radio color="primary"/>} label={r} />
		)
	}
	{(!_field) &&
		props.radioList.map ( r =>
		<FormControlLabel key={r[props.radioField]} className={gClasses.filterRadio} value={r[props.radioField]} 
			control={<Radio color="primary"/>} label={r[props.radioField]} />
		)
	}
	</RadioGroup>
	</FormControl>		
)
}

