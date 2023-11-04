import React from 'react';
import Box from '@material-ui/core/Box';
import globalStyles from "assets/globalStyles";
import TextField from '@material-ui/core/TextField';
import { InputAdornment } from '@material-ui/core';

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

//function arunSelect(x) { console.log("sel", x) };

export default function VsTextSearch(props) {
const gClasses = globalStyles();
let _type = (props.type == null) ? 'text' : props.type;
	return (
		<TextField type={_type} className={gClasses.vgSpacing} padding={5} fullWidth 
			label={props.label} onChange={props.onChange} value={props.value}
			InputProps={
				{
					endAdornment: (
						<div>
						<InputAdornment position="end">
						<ClearIcon onClick={props.onClear} />
						<SearchIcon />
						</InputAdornment>
						</div>
						)
				}
			}
		/>
	)
}

