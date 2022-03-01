import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useMsal, useAccount } from "@azure/msal-react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import adminRoutes from "../adminRoutes";
import Dashboard from "../views/Dashboard";
import Loans from "../views/Loans";
import {
  getAllStudentUsers,
  getAllStudentUsersNextPage,
  getAllStaffUsers,
} from "../authConfig";
import axios from "axios";
import { baseURL } from "../definitions";
import LoadingScreen from "../components/LoadingScreen";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
    backgroundColor: theme.palette.secondary.light,
    padding: "2em",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
}));

function Admin(props) {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const location = useLocation();
  const classes = useStyles();
  const mainPanel = React.useRef(null);

  const [allLongTermLoans, setAllLongTermLoans] = React.useState(null);
  const [allLoans, setLoans] = React.useState(null);
  const [studentUsers, setStudentUsers] = React.useState(null);
  const [staffUsers, setStaffUsers] = React.useState(null);
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getLocationText = () => {
    for (let i = 0; i < adminRoutes.length; i++) {
      if (
        location.pathname.indexOf(
          adminRoutes[i].layout + adminRoutes[i].path
        ) !== -1
      ) {
        return adminRoutes[i].name;
      }
    }
  };

  const sortList = (list, key) => {
    function compare(a, b) {
      a = a[key];
      b = b[key];
      var type =
        typeof a === "string" || typeof b === "string" ? "string" : "number";
      var result;
      if (type === "string") result = a.localeCompare(b);
      else result = a - b;
      return result;
    }
    return list.sort(compare);
  };

  const createListOption = (name, email, surname) => {
    return {
      label: String(name),
      name: String(name),
      email: String(email),
      surname: String(surname),
    };
  };

  function getStudentUsers() {
    instance
      .acquireTokenSilent({
        scopes: ["User.Read"],
        account: account,
      })
      .then((response) => {
        try {
          const students = getAllStudentUsers(response.accessToken).then(
            (students) => {
              let nextPageNeeded = false;
              const tempList = [];
              for (let i = 0; i < students.value.length; i++) {
                tempList.push(
                  createListOption(
                    students.value[i].displayName,
                    students.value[i].mail,
                    students.value[i].surname
                  )
                );
              }
              if (students["@odata.nextLink"] != null) {
                nextPageNeeded = true;
              }
              if (nextPageNeeded) {
                const nextPageStudents = getAllStudentUsersNextPage(
                  response.accessToken,
                  students["@odata.nextLink"]
                ).then((nextPageStudents) => {
                  for (let j = 0; j < nextPageStudents.value.length; j++) {
                    tempList.push(
                      createListOption(
                        nextPageStudents.value[j].displayName,
                        nextPageStudents.value[j].mail,
                        nextPageStudents.value[j].surname
                      )
                    );
                  }
                  if (nextPageStudents["@odata.nextLink"] == null) {
                    nextPageNeeded = false;
                  }
                  setStudentUsers(sortList(tempList, "surname"));
                  console.log(tempList);
                });
              }
            }
          );
        } catch (err) {
          console.error(err);
        }
      });
  }

  function getStaffUsers() {
    instance
      .acquireTokenSilent({
        scopes: ["User.Read"],
        account: account,
      })
      .then((response) => {
        try {
          const staff = getAllStaffUsers(response.accessToken).then((staff) => {
            const tempList = [];
            for (let i = 0; i < staff.value.length; i++) {
              tempList[i] = createListOption(
                staff.value[i].displayName,
                staff.value[i].mail,
                staff.value[i].surname
              );
            }
            setStaffUsers(sortList(tempList, "surname"));
          });
        } catch (err) {
          console.error(err);
        }
      });
  }

  function createData(name, deviceName, dateLoanedString) {
    const dateLoaned = new Date(dateLoanedString);
    return { name, deviceName, dateLoaned };
  }

  function formatLoanData(loans) {
    let formattedLoans = [];
    loans.forEach((loan, index) => {
      formattedLoans[index] = createData(loan[1], loan[0], loan[2]);
    });
    return formattedLoans;
  }

  async function getAllLoans() {
    console.log("GET LOANS");
    const reqHeaders = {
      headers: {
        msalToken: "faketoken",
      },
    };
    return axios
      .get(baseURL + "/inventory", reqHeaders)
      .then((response) => {
        console.log(response.data);

        setLoans(formatLoanData(response.data[0]));
        setAllLongTermLoans(response.data[1]);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  const getSelectedIndex = () => {
    let currPage = window.location.pathname;
    switch (currPage) {
      case "/admin/home":
        return 1;
      case "/admin/loans":
        return 2;
      case "/admin/returns":
        return 3;
    }
  };

  useEffect(() => {
    getStaffUsers();
    getStudentUsers();
    getAllLoans();
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Navbar
        handleDrawerOpen={handleDrawerOpen}
        open={open}
        locationText={getLocationText()}
      />
      <Sidebar
        handleDrawerClose={handleDrawerClose}
        open={open}
        selectedIndex={getSelectedIndex()}
      />
      <main className={classes.content} ref={mainPanel}>
        <div className={classes.appBarSpacer} />
        {studentUsers !== null && staffUsers !== null && allLoans !== null ? (
          <Switch>
            <Route
              exact
              path="/admin/home"
              component={() => (
                <Dashboard
                  studentUsers={studentUsers}
                  staffUsers={staffUsers}
                  allLoans={allLoans}
                  updateLoans={getAllLoans}
                />
              )}
            />
            <Route
              exact
              path="/admin/loans"
              component={() => (
                <Loans
                  studentUsers={studentUsers}
                  staffUsers={staffUsers}
                  allLoans={allLoans}
                  updateLoans={getAllLoans}
                />
              )}
            />
          </Switch>
        ) : (
          <LoadingScreen />
        )}
      </main>
    </div>
  );
}

export default Admin;
