import React, { useEffect } from "react";
import { Redirect, Switch, Route, BrowserRouter } from "react-router-dom";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal,
  useAccount,
} from "@azure/msal-react";
import { ThemeProvider } from "@material-ui/styles";
import { createTheme } from "@material-ui/core";
import AdminLayout from "./layouts/Admin";
import Login from "./layouts/Login";

/* Theme Colours
$colour-dark-blue: #002E55;
$colour-light-blue: #06559B;
$colour-yellow: #F7C029;
$colour-white: #F4F4F6;
$colour-red: #D70824;
*/

const theme = createTheme({
  palette: {
    primary: {
      light: "#06559B",
      main: "#002E55",
    },
    secondary: {
      light: "#F4F4F6",
      main: "#F7C029",
      contrastText: "#002E55",
    },
  },
});

function App() {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  useEffect(() => {
    if (account) {
      instance
        .acquireTokenSilent({
          scopes: ["User.Read"],
          account: account,
        })
        .then((response) => {
          if (response) {
            console.log(response);
          }
        });
    }
  }, [account, instance]);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AuthenticatedTemplate>
          <Switch>
            <Route
              path="/admin"
              render={(props) => <AdminLayout {...props} />}
            />
            <Redirect from="/" to="admin/home" />
          </Switch>
        </AuthenticatedTemplate>
        <UnauthenticatedTemplate>
          <Switch>
            <Route path="/login" render={(props) => <Login {...props} />} />
            <Redirect from="/" to="login" />
          </Switch>
        </UnauthenticatedTemplate>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
