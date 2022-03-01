const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const axios = require("axios");
const app_parser = require("./app_parser");
const samanage = require("./samanage_lookup");
const errors = require("./errors.js");
const hotswap = require("./hotswap.js");
const return_asset = require("./return_asset");
const loan_asset = require("./loan_asset");

const app = express();

const ads = [{ title: "Loan API Test" }];

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

function Authorization(msalToken) {
  return true;
  const bearer = `Bearer ${msalToken}`;

  axios({
    method: "get",
    url: "https://graph.microsoft.com/v1.0/users",
    headers: {
      Authorization: bearer,
    },
  })
    .then(function (response) {
      console.log(response);
      return true;
    })
    .catch(function (error) {
      return false;
    });
  console.log("request made to Graph API at: " + new Date().toString());
}

/**
 * @param {String} dateTimeString in Samanage format eg. -> Nov 05, 2021 -  5:33AM
 * @returns {String} formatted string in parsable form eg. -> Nov 05, 2021 16:21
 */
function formatDateTimeString(dateTimeString) {
  var tempDateTime = new String(dateTimeString).replace("-", "");
  // remove weird samanage white space in string
  var values = tempDateTime.split(" ").filter((value) => value !== "");
  var timeValues = values[3].split(":");
  var hours = new Number(timeValues[0]);
  var minutes = new Number(timeValues[1].slice(0, 2));
  var AMPM = timeValues[1].slice(2).toLowerCase();

  if (AMPM == "pm" && hours < 12) {
    hours = hours + 12;
  }
  if (AMPM == "am" && hours == 12) {
    hours = hours - 12;
  }

  var strHrs = hours < 10 ? "0" + hours.toString() : hours.toString();
  var strMins = minutes < 10 ? "0" + minutes.toString() : minutes.toString();

  var newDateTime =
    values[0] +
    " " +
    values[1] +
    " " +
    values[2] +
    " " +
    strHrs +
    ":" +
    strMins;

  return newDateTime;
}

app.get("/", (req, res) => {
  console.log(console.log(JSON.stringify(req.headers)));

  try {
    app_parser.HeadersCheck(req.headers, { msalToken: 1 });
    if (Authorization(req.headers.msaltoken) === true) {
      console.log(console.log(JSON.stringify(req.headers)));
      res.send(ads);
    } else {
      console.log("invalid token");
      res.sendStatus(401);
    }
  } catch (error) {
    res.send(errors.errorHandler(error));
  }
});

app.post("/", (req, res) => {
  // this is here just as a testing endpoint.
  console.log(console.log(JSON.stringify(req.headers)));

  var name = req.headers.userfullname;

  samanage
    .GetUserDataFromFullName(name)
    .then(function (response) {
      res.send(response.data[0]);
    })
    .catch(function (error) {
      console.error(error);
    });
});

app.post("/loans/staff", (req, res) => {
  console.log(console.log(JSON.stringify(req.headers)));

  try {
    app_parser.HeadersCheck(req.headers, {
      msalToken: 1,
      userFullName: 1,
      assetName: 1,
    });

    if (Authorization(req.headers.msaltoken) === true) {
      //console.log(console.log(JSON.stringify(req.headers)));
      app_parser
        .StaffLoan(req.headers)
        .then(function (result) {
          res.send(result);
        })
        .catch(function (error) {
          res.send(errors.errorHandler(error));
        });
    } else {
      console.log("invalid token");
      res.sendStatus(401);
    }
  } catch (error) {
    res.send(errors.errorHandler(error));
  }
});

app.post("/loans/students", (req, res) => {
  console.log(console.log(JSON.stringify(req.headers)));

  try {
    app_parser.HeadersCheck(req.headers, {
      msalToken: 1,
      userFullName: 1,
      assetName: 1,
    });

    if (Authorization(req.headers.msaltoken) === true) {
      console.log(console.log(JSON.stringify(req.headers)));
      app_parser
        .StudentLoan(req.headers)
        .then(function (result) {
          res.send(result);
        })
        .catch(function (error) {
          res.send(errors.errorHandler(error));
        });
    } else {
      console.log("invalid token");
      res.sendStatus(401);
    }
  } catch (error) {
    res.send(errors.errorHandler(error));
  }
});

app.post("/loans/hotswap", (req, res) => {
  console.log(console.log(JSON.stringify(req.headers)));

  try {
    app_parser.HeadersCheck(req.headers, {
      msalToken: 1,
      incomingAssetName: 1,
      outgoingAssetName: 1,
      damagedFlag: 1,
    });

    if (Authorization(req.headers.msaltoken) === true) {
      console.log(console.log(JSON.stringify(req.headers)));
      hotswap
        .HotSwap(req.headers)
        .then(function (result) {
          res.send(result);
        })
        .catch(function (error) {
          res.send(errors.errorHandler(error));
        });
    } else {
      console.log("invalid token");
      res.sendStatus(401);
    }
  } catch (error) {
    res.send(errors.errorHandler(error));
  }
});

app.post("/assign", (req, res) => {
  console.log(console.log(JSON.stringify(req.headers)));

  try {
    app_parser.HeadersCheck(req.headers, {
      msalToken: 1,
      userFullName: 1,
      assetName: 1,
    });

    if (Authorization(req.headers.msaltoken) === true) {
      console.log(console.log(JSON.stringify(req.headers)));
      app_parser
        .UserAssign(req.headers)
        .then(function (result) {
          res.send(result);
        })
        .catch(function (error) {
          res.send(errors.errorHandler(error));
        });
    } else {
      console.log("invalid token");
      res.sendStatus(401);
    }
  } catch (error) {
    res.send(errors.errorHandler(error));
  }
});

app.post("/returns", (req, res) => {
  console.log(console.log(JSON.stringify(req.headers)));

  try {
    app_parser.HeadersCheck(req.headers, {
      msalToken: 1,
      assetName: 1,
      damagedFlag: 1,
    });

    if (Authorization(req.headers.msaltoken) === true) {
      console.log(console.log(JSON.stringify(req.headers)));
      return_asset
        .ReturnAsset(req.headers.assetname, req.headers.damagedflag)
        .then(function (result) {
          res.send(result);
        })
        .catch(function (error) {
          res.send(errors.errorHandler(error));
        });
    } else {
      console.log("invalid token");
      res.sendStatus(401);
    }
  } catch (error) {
    res.send(errors.errorHandler(error));
  }
});

app.get("/lookup/staff/:str", (req, res) => {
  console.log(console.log(JSON.stringify(req.headers)));

  try {
    app_parser.HeadersCheck(req.headers, { msalToken: 1 });

    if (Authorization(req.headers.msaltoken) === true) {
      // call the function
      if (req.params.str.length == 0) {
        res.send([""]);
      }
    } else {
      console.log("invalid token");
      res.sendStatus(401);
    }
  } catch (error) {
    res.send(errors.errorHandler(error));
  }
});

app.get("/inventory", (req, res) => {
  console.log(console.log(JSON.stringify(req.headers)));
  try {
    app_parser.HeadersCheck(req.headers, { msalToken: 1 });
    if (Authorization(req.headers.msaltoken) === true) {
      samanage
        .GetNotReturnedAssets()
        .then(function (result) {
          let values = [[], []];
          console.log("LENGTH: " + result.data.length);
          for (i = 0; i < result.data.length; i++) {
            if (result.data[i].user != null) {
              console.log(
                "=============\nUSER: " +
                  result.data[i].name +
                  "\n" +
                  result.data[i].user.name
              );
              try {
                var formattedDateTime = formatDateTimeString(
                  result.data[i].custom_fields_values[0].value
                );
                values[0].push([
                  result.data[i].name,
                  result.data[i].user.name,
                  formattedDateTime,
                ]);
              } catch (error) {
                console.log("No Custom Fields Value");
              }
            }
            if (result.data[i].owner != null) {
              try {
                var formattedDateTime = formatDateTimeString(
                  result.data[i].custom_fields_values[0].value
                );
                values[1].push([
                  result.data[i].name,
                  result.data[i].owner.name,
                  formattedDateTime,
                ]);
              } catch (error) {
                console.log("No Custom Fields Value");
              }
            }
          }
          console.log(values);
          res.send(values);
        })
        .catch(function (error) {
          res.send(errors.errorHandler(error));
        });
    } else {
      console.log("invalid token");
      res.sendStatus(401);
    }
  } catch (error) {
    res.send(errors.errorHandler(error));
  }
});

app.listen(3001, () => {
  console.log("listen on 3001");
});
