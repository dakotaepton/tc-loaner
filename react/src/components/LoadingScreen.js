import React, { useEffect } from "react";
import { CircularProgress } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    height: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  bigLoading: {
    fontSize: "800",
  },
}));

export default function LoadingScreen() {
  const classes = useStyles();

  const [timerStarted, setTimerStarted] = React.useState(false);
  const [loadingMessage, setLoadingMessage] = React.useState("Loading");

  useEffect(() => {
    if (!timerStarted) {
      setTimerStarted(true);
      setTimeout(function () {
        setLoadingMessage(
          "It is taking longer than usual to connect to the Node server, please ensure it is active and reachable."
        );
      }, 7000);
    }
  });

  return (
    <div className={classes.root}>
      <h1 style={{ paddingBottom: "1em" }}>{loadingMessage}</h1>
      <CircularProgress style={{ fontSize: "800" }} />
    </div>
  );
}
