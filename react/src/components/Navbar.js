import React from "react";
import { useMsal } from "@azure/msal-react";
import { alpha, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import { drawerWidth } from "../definitions";

const useStyles = makeStyles((theme) => ({
  toolbar: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 24, // keep right padding when drawer closed
  },
  brandText: {
    color: theme.palette.secondary.main,
    fontFamily: "lobster",
    fontSize: "2em",
    textAlign: "center",
    width: "100%",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  titleMenuWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    flexGrow: 0.5,
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
    width: "100%",
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
  userNotificationsWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function Navbar(props) {
  const { instance, accounts } = useMsal();
  const name = accounts[0] && accounts[0].name;

  const classes = useStyles();

  return (
    <AppBar
      position="absolute"
      className={clsx(classes.appBar, props.open && classes.appBarShift)}
    >
      <Toolbar className={classes.toolbar}>
        <div className={classes.titleMenuWrapper}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={props.handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              props.open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.brandText}>Loaner</div>
        </div>
        <div className={classes.userNotificationsWrapper}>
          <h3>{name}</h3>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
