import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import CancelIcon from '@material-ui/icons/Cancel';

//colours 
import {  blue, yellow } from '@material-ui/core/colors';

function disabled() {
	//alert("disabled");
}

//var liStyle = {padding: "5px 10px", margin: "4px 2px", color: 'black', fontSize:'16px', borderRadius: 7, border: 2};

export default function VsCancel(props) {
let _align = (props.align == null) ? "center" : props.align;
let myDisabled=false;
if (props.disabled != null) {
	myDisabled = props.disabled;
}
//console.log(myDisabled);
return(	
<div align={props.align}>
	<IconButton color="secondary"  disabled={myDisabled} size="small" onClick={props.onClick} >
		<CancelIcon />
	</IconButton>
</div>
)}

