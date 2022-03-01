import React from "react";

import { Alert, AlertTitle  } from "@material-ui/lab";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  alertBoxContainer: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    top: '10px',
    left: '0px',
    right: '0px',
    width: '100%',
    zIndex: 9999,
  },
  alertBox: {
    width: 'fit-content',
  }
}));

export default function AlertBox(props) {

  const { severity, alertContent } = props;
  const classes = useStyles();

  return (
  <div className={classes.alertBoxContainer}>
    <Alert severity={severity} className={classes.alertBox}>
      {severity === 'error' ? <AlertTitle>Error</AlertTitle> : null}
      {severity === 'success' ? <AlertTitle>Success</AlertTitle> : null}
        {alertContent.map((row, index) => {
          return(<p>{row}</p>);
        })}
    </Alert>
  </div>
  );
}