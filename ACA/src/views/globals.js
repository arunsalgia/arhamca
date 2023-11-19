import React from 'react';

export const NOFRACTION = 'Fraction not allowed';

export const ALLSELECTIONS = ["All", "Enabled", "Disabled" ];
export const BLANKCHAR = "-";

export const dialogOptions={
  title: 'Title',
  message: 'Message',
  buttons: [
    {label: 'Yes', onClick: () => alert('Click Yes')},
    {label: 'No',  onClick: () => alert('Click No')}
  ],
  childrenElement: () => <div />,
  //customUI: ({ onClose }) => <div>Custom UI</div>,
  closeOnEscape: false,
  closeOnClickOutside: false,
  willUnmount: () => {},
  afterClose: () => {},
  onClickOutside: () => {},
  onKeypressEscape: () => {},
  overlayClassName: "overlay-custom-class-name"
};


/// Constants
export const ROLE_FACULTY = "Faculty";
export const ROLE_STUDENT = "Student";
export const ROLE_MANAGER = "Manager";
export const ROLE_ADMIN   = "Admin";

export const FILTER_NONE = "No filter applied";

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

export const PAYMENTMODE = ["Online", "Cash", "NetBanking", "Cheque"];

export const PAYMENTSTATUS = ["Received", "Pending" ];

export const INQUIRYSTATUS = ["Inquiry", "Demo", "Confirmed", "Cancel" ];

export const FREESTR = "";

export const DURATIONSTR = [
{name: "00:30", hour: 0, min: 30, block: 1},
{name: "01:00", hour: 1, min: 0,  block: 2},
{name: "01:30", hour: 1, min: 30, block: 3},
{name: "02:00", hour: 2, min: 0,  block: 4},
{name: "02:30", hour: 2, min: 30, block: 5},
{name: "03:00", hour: 3, min: 0,  block: 6},
{name: "03:30", hour: 4, min: 30, block: 7},
{name: "04:00", hour: 5, min: 0,  block: 8},
{name: "04:30", hour: 4, min: 30, block: 9},
{name: "05:00", hour: 0, min: 0,  block: 10}
];

export const BATCHTIMESTR = [
{name: "09:00 AM", hour: 9, min: 30,  block: 18	},
{name: "09:30 AM", hour: 9, min: 30,  block: 19	},
{name: "10:00 AM", hour: 10, min: 30,  block: 20	},
{name: "10:30 AM", hour: 10, min: 30,  block: 21	},
{name: "11:00 AM", hour: 11, min: 30,  block: 22	},
{name: "11:30 AM", hour: 11, min: 30,  block: 23	},
{name: "12:00 PM", hour: 12, min: 30,  block: 24	},
{name: "12:30 PM", hour: 12, min: 30,  block: 25	},
{name: "01:00 PM", hour: 13, min: 30,  block: 26	},
{name: "01:30 PM", hour: 13, min: 30,  block: 27	},
{name: "02:00 PM", hour: 14, min: 30,  block: 28	},
{name: "02:30 PM", hour: 14, min: 30,  block: 29	},
{name: "03:00 PM", hour: 15, min: 30,  block: 30	},
{name: "03:30 PM", hour: 15, min: 30,  block: 31	},
{name: "04:00 PM", hour: 16, min: 30,  block: 32	},
{name: "04:30 PM", hour: 16, min: 30,  block: 33	},
{name: "05:00 PM", hour: 17, min: 30,  block: 34	},
{name: "05:30 PM", hour: 17, min: 30,  block: 35	},
{name: "06:00 PM", hour: 17, min: 30,  block: 36	},
{name: "06:30 PM", hour: 17, min: 30,  block: 37	},
{name: "07:00 PM", hour: 17, min: 30,  block: 38	},
{name: "07:30 PM", hour: 17, min: 30,  block: 39	},
{name: "08:00 PM", hour: 17, min: 30,  block: 40	},
{name: "08:30 PM", hour: 17, min: 30,  block: 41	}
];

export const BLOCK_START = 18;
export const BLOCK_END = 41;

export const MAXDISPLAYTEXTROWS = 6;

export const MAXSTRINGLEN = 40;

export const STATUS_INFO = 
{
ERROR: -2,
FAILURE: -2,
CANCEL: -1,
OKAY: 1,
SUCCESS: 1,
ADD_BATCH: 2,
EDIT_BATCH: 3,
ADD_SESSION: 4,
EDIT_SESSION: 5,
FACULTYSCHEDULE: 6,

};

export const DUES_MF = -1;			// for ankit

