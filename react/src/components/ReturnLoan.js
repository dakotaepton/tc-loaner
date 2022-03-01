import React, { useEffect } from "react";
import {
  TextField,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import axios from "axios";
import AlertBox from "./AlertBox";

import { baseURL } from "../definitions";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "80%",
    },
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBoxContainer: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    top: "10px",
    left: "0px",
    right: "0px",
    width: "100%",
    zIndex: 9999,
  },
  alertBox: {
    width: "fit-content",
  },
  buttonLine: {
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    width: "80%",
  },
  hotSwapButton: {
    width: "20%",
  },
  submitButton: {
    width: "80%",
  },
}));

function ReturnLoan(props) {
  const classes = useStyles();

  const [hotSwapState, setHotSwapState] = React.useState(false);
  const [hotSwapInID, setHotSwapInID] = React.useState("");
  const [hotSwapOutID, setHotSwapOutID] = React.useState("");
  const [assetName, setAssetName] = React.useState("");
  const [successAlert, setSuccessAlert] = React.useState(false);
  const [successAlertContent, setSuccessAlertContent] = React.useState("");
  const [errorAlert, setErrorAlert] = React.useState(false);
  const [errorAlertContent, setErrorAlertContent] = React.useState("");
  const [damagedFlag, setDamagedFlag] = React.useState(false);

  const onAssetNameCHange = (event) => {
    setAssetName(event.target.value);
  };

  const onHotSwapInIDChange = (event) => {
    setHotSwapInID(event.target.value);
  };

  const onHotSwapOutIDChange = (event) => {
    setHotSwapOutID(event.target.value);
  };

  const handleHotSwapChange = (state) => {
    setHotSwapState(state);
    props.hotSwapListener(state);
  };

  const handleDamagedFlagChange = (event) => {
    setDamagedFlag(event.target.checked);
  };

  useEffect(() => {
    if (successAlert) {
      setTimeout(function () {
        setSuccessAlert(false);
        setSuccessAlertContent("");
      }, 2000);
    }
    if (errorAlert) {
      setTimeout(function () {
        setErrorAlert(false);
        setErrorAlertContent("");
      }, 5000);
    }
  });

  function hotSwapAssets() {
    const reqHeaders = {
      headers: {
        incomingassetname: hotSwapInID,
        outgoingassetname: hotSwapOutID,
        damagedFlag: damagedFlag,
        msalToken: "faketoken",
      },
    };
    axios
      .post(baseURL + "/loans/hotswap", {}, reqHeaders)
      .then((response) => {
        console.log(response.data);
        setSuccessAlertContent([
          String(
            "Successfully HotSwapped: " + hotSwapInID + " for " + hotSwapOutID
          ),
        ]);
        setSuccessAlert(true);
        setHotSwapInID("");
        setHotSwapOutID("");
        setTimeout(function () {
          props.updateLoans();
        }, 2000);
      })
      .catch((error) => {
        console.log(error.message);
        setErrorAlertContent([
          String(
            "Error HotSwapping: " +
              hotSwapInID +
              " and " +
              hotSwapOutID +
              "          | Error: " +
              error.message
          ),
        ]);
        setErrorAlert(true);
      });
  }

  function returnLoan() {
    const reqHeaders = {
      headers: {
        assetname: assetName,
        damagedFlag: damagedFlag,
        msalToken: "faketoken",
      },
    };
    axios
      .post(baseURL + "/returns", {}, reqHeaders)
      .then((response) => {
        console.log(response.data);
        setSuccessAlertContent([String("Successfully returned: " + assetName)]);
        setSuccessAlert(true);
        setAssetName("");
        setTimeout(function () {
          props.updateLoans();
        }, 2000);
      })
      .catch((error) => {
        console.log(error.message);
        setErrorAlertContent([
          String(
            "Error returning: " +
              assetName +
              "          | Error: " +
              error.message
          ),
        ]);
        setErrorAlert(true);
      });
  }

  return (
    <div>
      {successAlert ? (
        <AlertBox severity="success" alertContent={successAlertContent} />
      ) : (
        <div></div>
      )}
      {errorAlert ? (
        <AlertBox severity="error" alertContent={errorAlertContent} />
      ) : (
        <div></div>
      )}
      {hotSwapState ? (
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="hotswap-device-in-field"
            label="INCOMING Device ID"
            variant="outlined"
            color="secondary"
            value={hotSwapInID}
            onChange={onHotSwapInIDChange}
          />
          <TextField
            id="hotswap-device-out-field"
            label="OUTGOING Device ID"
            variant="outlined"
            color="secondary"
            value={hotSwapOutID}
            onChange={onHotSwapOutIDChange}
          />
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={damagedFlag}
                  onChange={handleDamagedFlagChange}
                  color="primary"
                />
              }
              label="Damaged"
            />
          </FormGroup>
          <div className={classes.buttonLine}>
            <Button
              id="hotswap-submit-btn"
              color="primary"
              variant="contained"
              onClick={hotSwapAssets}
              className={classes.submitButton}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.hotSwapButton}
              onClick={() => {
                handleHotSwapChange(false);
              }}
            >
              <SwapHorizIcon />
            </Button>
          </div>
        </form>
      ) : (
        <form className={classes.root} noValidate autoComplete="off">
          <TextField
            id="return-loan-device-field"
            label="Device ID"
            variant="outlined"
            color="secondary"
            value={assetName}
            onChange={onAssetNameCHange}
          />
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={damagedFlag}
                  onChange={handleDamagedFlagChange}
                  color="primary"
                />
              }
              label="Damaged"
            />
          </FormGroup>
          <div className={classes.buttonLine}>
            <Button
              id="staff-loan-submit-btn"
              color="primary"
              variant="contained"
              onClick={returnLoan}
              className={classes.submitButton}
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.hotSwapButton}
              onClick={() => {
                handleHotSwapChange(true);
              }}
            >
              <SwapHorizIcon />
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ReturnLoan;
