import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useMsal } from "@azure/msal-react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import List from "@material-ui/core/List";
import MuiListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import QueuePlayNextIcon from "@material-ui/icons/QueuePlayNext";
import Drawer from "@material-ui/core/Drawer";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { drawerWidth } from "../definitions";

function handleLogout(instance) {
  instance.logoutRedirect().catch((e) => {
    console.error(e);
  });
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    color: theme.palette.secondary.light,
  },

  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    borderRight: "none",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.light,
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
  MuiListItemGutters: {
    paddingLeft: "22px",
  },
}));

const ListItem = withStyles({
  root: {
    "& .MuiListItemIcon-root": {
      color: "#c6ced7",
    },
    paddingLeft: "22px",
    "&$selected": {
      backgroundColor: "#F7C029",
      color: "#002E55",
      "& .MuiListItemIcon-root": {
        color: "#002E55",
      },
    },
    "&$selected:hover": {
      backgroundColor: "#F7C029",
      color: "#002E55",
      "& .MuiListItemIcon-root": {
        color: "#002E55",
      },
    },
    "&:hover": {
      backgroundColor: "rgba(247, 192, 41, 0.4)",
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white",
      },
    },
  },
  selected: {},
})(MuiListItem);

function Sidebar(props) {
  console.log(window.location.pathname);
  const { instance } = useMsal();

  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(props.selectedIndex);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: clsx(
          classes.drawerPaper,
          !props.open && classes.drawerPaperClose
        ),
      }}
      open={props.open}
      color="primary"
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={props.handleDrawerClose}>
          <ChevronLeftIcon style={{ color: "#fff" }} />
        </IconButton>
      </div>
      <List style={{ flexGrow: 1 }}>
        <ListItem
          button
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
          component={Link}
          to="/admin/home"
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="HOME" />
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 2}
          onClick={(event) => handleListItemClick(event, 2)}
          component={Link}
          to="/admin/loans"
        >
          <ListItemIcon>
            <QueuePlayNextIcon />
          </ListItemIcon>
          <ListItemText primary="LOANS" />
        </ListItem>
      </List>
      <Divider style={{ backgroundColor: "#fff" }} />
      <List>
        <ListItem button onClick={() => handleLogout(instance)}>
          <ListItemIcon>
            <ExitToAppIcon style={{ transform: "rotate(180deg)" }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;
