import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import TimerIcon from "@material-ui/icons/Timer";
import HistoryIcon from "@material-ui/icons/History";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";

export const SidebarData = [
  {
    title: "Timer",
    icon: <TimerIcon />,
    link: "/",
  },
  {
    title: "History",
    icon: <HistoryIcon />,
    link: "/history",
  },
  {
    title: "Admin",
    icon: <SupervisorAccountIcon />,
    link: "/admin",
    require_admin: true,
  },
  {
    title: "Account",
    icon: <AccountCircleIcon />,
    link: "/account",
    login_free: true,
  },
];
