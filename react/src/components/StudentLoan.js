import React, { useEffect } from "react";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import AlertBox from "./AlertBox";

import { baseURL } from "../definitions";
import VirtualizedAutocomplete from "./VirtualizedAutocomplete";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "80%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
}));

function StudentLoan(props) {
  const classes = useStyles();

  const [studentList, setStudentList] = React.useState(props.studentUsers);

  const [studentInfo, setStudentInfo] = React.useState(null);
  const [assetName, setAssetName] = React.useState("");
  const [successAlert, setSuccessAlert] = React.useState(false);
  const [successAlertContent, setSuccessAlertContent] = React.useState("");
  const [errorAlert, setErrorAlert] = React.useState(false);
  const [errorAlertContent, setErrorAlertContent] = React.useState("");

  const handleAssetNameChange = (event) => {
    setAssetName(event.target.value);
  };

  useEffect(() => {
    if (successAlert) {
      setTimeout(function () {
        setSuccessAlert(false);
        setSuccessAlertContent("");
      }, 3000);
    }
    if (errorAlert) {
      setTimeout(function () {
        setErrorAlert(false);
        setErrorAlertContent("");
      }, 4000);
    }
  });

  function loanStudentAsset() {
    const reqHeaders = {
      headers: {
        userfullname: studentInfo.name,
        assetname: assetName,
        msalToken: "faketoken",
      },
    };
    axios
      .post(baseURL + "/loans/students", {}, reqHeaders)
      .then((response) => {
        console.log(response.data);
        setSuccessAlertContent([
          String(
            "Successfully loaned: " + assetName + " to " + studentInfo.name
          ),
        ]);
        setSuccessAlert(true);
        setStudentInfo(null);
        setAssetName("");
        setTimeout(function () {
          props.updateLoans();
        }, 3000);
      })
      .catch((error) => {
        console.log(error.message);
        setErrorAlertContent([
          String(
            "Error loaning: " +
              assetName +
              " to " +
              studentInfo.name +
              "          | Error: " +
              error.message
          ),
        ]);
        setErrorAlert(true);
        setStudentInfo(null);
        setAssetName("");
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
      <form className={classes.root} noValidate autoComplete="off">
        <VirtualizedAutocomplete
          options={
            studentList !== null
              ? studentList
              : [{ label: "loading staff...", id: 1 }]
          }
          selectedValue={studentInfo}
          setSelectedValue={setStudentInfo}
          label="Student ID"
        />
        <TextField
          id="student-loan-device-field"
          label="Device ID"
          variant="outlined"
          color="secondary"
          value={assetName}
          onChange={handleAssetNameChange}
        />
        <Button
          id="student-loan-submit-btn"
          color="primary"
          variant="contained"
          onClick={loanStudentAsset}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default StudentLoan;
