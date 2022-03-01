import React, { useEffect } from "react";
import { TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { baseURL } from "../definitions";
import AlertBox from "./AlertBox";
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

function StaffLoan(props) {
  const classes = useStyles();

  const [staffList, setStaffList] = React.useState(
    props.staffUsers ? props.staffUsers : null
  );

  const [staffInfo, setStaffInfo] = React.useState(null);
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

  function loanStaffAsset() {
    if (staffInfo != null) {
      const reqHeaders = {
        headers: {
          userfullname: staffInfo.name,
          assetname: assetName,
          msalToken: "faketoken",
        },
      };
      axios
        .post(baseURL + "/loans/staff", {}, reqHeaders)
        .then((response) => {
          console.log("LOAN RESPONSE !!!!");
          console.log(response);
          console.log(staffInfo);
          setSuccessAlertContent([
            String(
              "Successfully loaned: " + assetName + " to " + staffInfo.name
            ),
          ]);
          setSuccessAlert(true);
          setAssetName("");
          setStaffInfo(null);
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
                staffInfo +
                "          | Error: " +
                error.message
            ),
          ]);
          setErrorAlert(true);
          setAssetName("");
          setStaffInfo(null);
        });
    } else {
      setErrorAlert(true);
      setErrorAlertContent([
        String(
          "There was a problem parsing Staff ID, please check it is correct and try again."
        ),
      ]);
    }
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
            staffList !== null
              ? staffList
              : [{ label: "loading staff...", id: 1 }]
          }
          selectedValue={staffInfo}
          setSelectedValue={setStaffInfo}
          label="Staff ID"
        />
        <TextField
          id="staff-loan-device-field"
          label="Device ID"
          variant="outlined"
          color="secondary"
          value={assetName}
          onChange={handleAssetNameChange}
        />
        <Button
          id="staff-loan-submit-btn"
          color="primary"
          variant="contained"
          onClick={loanStaffAsset}
        >
          Submit
        </Button>
      </form>
    </div>
  );
}

export default StaffLoan;
