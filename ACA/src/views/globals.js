import React from 'react';

export const NOFRACTION = 'Fraction not allowed';

export const ALLSELECTIONS = ["All", "Enabled", "Disabled" ];
export const BLANKCHAR = "-";

/// Constants
export const ROLE_FACULTY = "Faculty";
export const ROLE_STUDENT = "Student";
export const ROLE_MANAGER = "Manager";
export const ROLE_ADMIN   = "Admin";

export const GENDER = ["Male", "Female", "Other"];

export const WEEKSTR = ["Dummy", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


export const MONTHSTR = ["January", "February", "March", "April", "May", "June",
							"July", "August", "September", "October", "November", "December"];	
export const SHORTMONTHSTR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oc", "Nov", "Dec"];	

export const SESSIONHOURSTR = [
"01", "02", "03", "04", "05", "06", "07", "08", "09", "10"
];

export const MINUTESTR = [
"00", "01", "02", "03", "04", "05", "06", "07", "08", "09",
"10", "11", "12", "13", "14", "15", "16", "17", "18", "19",
"20", "21", "22", "23", "24", "25", "26", "27", "28", "29", 
"30", "31", "32", "33", "34", "35", "36", "37", "38", "39", 
"40", "41", "42", "43", "44", "45", "46", "47", "48", "49", 
"50", "51", "52", "53", "54", "55", "56", "57", "58", "59"
];

export const MINUTEBLOCK=[0, 30];
export const MINUTEBLOCKSTR=["00", "30"];
export const HOURBLOCKSTR = [
"09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"
];
export const SHORTWEEKSTR = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];


export const DATESTR = [
"00",
"01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
"31"							
];

//in date function 0 represents JAN I.e. month number 1
export const MONTHNUMBERSTR = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"]



export const STATUS_INFO = 
{
ERROR: -2,
CANCEL: -1,
OKAY: 1,
ADD_BATCH: 2,
EDIT_BATCH: 3,
ADD_SESSION: 4,
EDIT_SESSION: 5,

};
