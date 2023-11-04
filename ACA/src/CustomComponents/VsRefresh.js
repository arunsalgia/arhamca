import React from 'react';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';
import RefreshIcon from '@material-ui/icons/Refresh';
//colours 
import {  blue, yellow } from '@material-ui/core/colors';

function disabled() {
	//alert("disabled");
}

//var liStyle = {padding: "5px 10px", margin: "4px 2px", color: 'black', fontSize:'16px', borderRadius: 7, border: 2};

export default function VsCancel(props) {
let _align = (props.align == null) ? "left" : props.align;
let _nameColor = (props.nameColor == null) ? "green" : props.nameColor;
let _name = (props.name == null) ? "" : props.name;

let myDisabled=false;
if (props.disabled != null) {
	myDisabled = props.disabled;
}
//console.log(myDisabled);
return(	
<div align={_align}>
	<Typography>
	<RefreshIcon style={{ color: "green" }} size="small" onClick={props.onClick} />
	</Typography>
</div>
)}

