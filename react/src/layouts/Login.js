import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Button } from "@material-ui/core";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";

function handleLogin(instance) {
  instance.loginRedirect(loginRequest).catch(e => {
      console.error(e);
  });
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: theme.palette.primary.main,
  },
  brand: {
    color: theme.palette.secondary.main,
    fontFamily: 'lobster',
    fontWeight: 'normal',
    fontSize: '5em',
    paddingBottom: '20px',
  }
}));

function Login() {
    
  const classes = useStyles();
  const { instance } = useMsal();

  return (
    <div className={classes.root}>
      <h1 className={classes.brand}>Loaner</h1>
      <Button variant="contained" size="large" style={{width: 200, cursor: "pointer"}} onClick={() => { handleLogin(instance) } }>Sign In</Button>
    </div>
  );
}

export default Login;