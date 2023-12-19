import React from "react";
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import TimerIcon from '@material-ui/icons/Timer';
export const SidebarData= [
    {
       title:"Home",
       icon :<HomeIcon/>,
       link:"/home",
    },
    {
        title:"timer",
        icon :<TimerIcon/>,
        link:"/timer",
     },
     {
        title:"account",
        icon :<AccountCircleIcon/>,
        link:"/account",
     },
]