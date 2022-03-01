import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import LocalLibraryIcon from "@material-ui/icons/LocalLibrary";
import StaffLoan from "../components/StaffLoan";
import StudentLoan from "../components/StudentLoan";
import LoanTable from "../components/LoanTable";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.primary,
    fontSize: "1.5em",
    fontWeight: "bold",
  },
  loanHeader: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function Loans(props) {
  const classes = useStyles();

  const [allLoans, setAllLoans] = React.useState(null);
  const [studentLoans, setStudentLoans] = React.useState(null);
  const [staffLoans, setStaffLoans] = React.useState(null);

  function setStaffStudentLoans() {}

  function initAllLoans() {
    setAllLoans(props.allLoans);
    let staff = [];
    let students = [];
    props.allLoans.forEach((loan) => {
      console.log(loan);
      if (loan["deviceName"].includes("TC-LOAN")) {
        students.push(loan);
      } else if (loan["deviceName"].includes("TC-STFF")) {
        staff.push(loan);
      }
    });
    setStudentLoans(students);
    setStaffLoans(staff);
  }

  useEffect(() => {
    initAllLoans();
    console.log(props.allLoans);
  }, [allLoans]);

  return (
    <Grid container className={classes.root} spacing={3}>
      <Grid item xs={12} lg={6}>
        <Paper className={classes.paper}>
          <div className={classes.loanHeader}>
            <SupervisorAccountIcon
              className={classes.headerIcon}
              fontSize="large"
            />{" "}
            STAFF
          </div>
          <StaffLoan
            staffUsers={props.staffUsers}
            updateLoans={props.updateLoans}
          />
        </Paper>
        <br />
        {staffLoans === null ? (
          <CircularProgress />
        ) : (
          <LoanTable
            allLoans={staffLoans}
            updateLoans={props.updateLoans}
            title={"Staff Loans"}
          />
        )}
      </Grid>
      <Grid item xs={12} lg={6}>
        <Paper className={classes.paper}>
          <div className={classes.loanHeader}>
            <LocalLibraryIcon className={classes.headerIcon} fontSize="large" />{" "}
            STUDENTS
          </div>
          <StudentLoan
            studentUsers={props.studentUsers}
            updateLoans={props.updateLoans}
          />
        </Paper>
        <br />
        {studentLoans === null ? (
          <CircularProgress />
        ) : (
          <LoanTable
            allLoans={studentLoans}
            updateLoans={props.updateLoans}
            title={"Student Loans"}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default Loans;
