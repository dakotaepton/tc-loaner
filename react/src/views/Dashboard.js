import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import StudentLoan from "../components/StudentLoan";
import StaffLoan from "../components/StaffLoan";
import ReturnLoan from "../components/ReturnLoan";
import LoanTable from "../components/LoanTable";
import clsx from "clsx";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    color: theme.palette.text.primary,
    fontSize: "1.5em",
    fontWeight: "bold",
  },
  paperPadding: {
    padding: theme.spacing(2),
  },
  textCenter: {
    textAlign: "center",
  },
}));

function Dashboard(props) {
  console.log(props);
  const classes = useStyles();
  const [hotSwapActive, setHotSwapState] = React.useState(false);
  const [allLoans, setAllLoans] = React.useState(null);

  const hotSwapListener = (state) => {
    setHotSwapState(state);
  };

  useEffect(() => {
    setAllLoans(props.allLoans);
    console.log(allLoans);
  }, [allLoans]);

  return (
    <div>
      <Grid container className={classes.root} spacing={3}>
        <Grid container item xs={12} lg={6} spacing={3}>
          <Grid item xs={12}>
            <Paper
              className={clsx(
                classes.paper,
                classes.paperPadding,
                classes.textCenter
              )}
            >
              Staff Loan
              <StaffLoan
                staffUsers={props.staffUsers}
                updateLoans={props.updateLoans}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              className={clsx(
                classes.paper,
                classes.paperPadding,
                classes.textCenter
              )}
            >
              Student Loan
              <StudentLoan
                studentUsers={props.studentUsers}
                updateLoans={props.updateLoans}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              className={clsx(
                classes.paper,
                classes.paperPadding,
                classes.textCenter
              )}
            >
              {hotSwapActive ? <div>HotSwap</div> : <div>Return Loan</div>}
              <ReturnLoan
                hotSwapListener={hotSwapListener}
                updateLoans={props.updateLoans}
              />
            </Paper>
          </Grid>
        </Grid>
        <Grid container item xs={12} lg={6}>
          <Grid item lg={12}>
            <Paper className={classes.paper}>
              {allLoans === null ? (
                <CircularProgress />
              ) : (
                <LoanTable
                  allLoans={allLoans}
                  updateLoans={props.updateLoans}
                />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard;
