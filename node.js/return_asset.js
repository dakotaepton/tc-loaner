// Check if asset exists
// If it doesn't, throw an error
// if it does, then pretend everything is fine, no need to lock program during this time
//
// if it fails later....???

const axios = require("axios");
const process_tickets = require("./process_tickets.js");
const samanage = require("./samanage_lookup.js");
const errors = require("./errors.js");

async function LoanAssetIn(assetIdentifier) {
  return axios({
    method: "put",
    url: "https://api.samanage.com/other_assets/" + assetIdentifier + ".json",
    responseType: "application/json",
    headers: {
      "X-Samanage-Authorization": "Bearer  ",
      accept: "application/vnd.samanage.v2.1+json",
      "content-type": "application/json",
    },
    data: {
      other_asset: {
        custom: "",
        owner_id: -1,
        user_id: -1,
        status: {
          id: 6,
          name: "Spare",
        },
        custom_fields_values: {
          custom_fields_value: [
            {
              name: "Incident_Created_DateTime",
              value: "1970-01-01T00:00:00.000Z",
            },
            {
              name: "Incident_ID",
              value: "-1",
            },
          ],
        },
      },
    },
  })
    .then(function (response) {
      console.log(response);
      return true;
    })
    .catch(function (error) {
      if (error.response) {
        throw new errors.ServiceError(error.response.status, error.response);
      }
    });
}

async function LoanDamagedAssetIn(assetIdentifier) {
  return axios({
    method: "put",
    url: "https://api.samanage.com/other_assets/" + assetIdentifier + ".json",
    responseType: "application/json",
    headers: {
      "X-Samanage-Authorization": "Bearer  ",
      accept: "application/vnd.samanage.v2.1+json",
      "content-type": "application/json",
    },
    data: {
      other_asset: {
        custom: "",
        owner_id: -1,
        user_id: -1,
        status: {
          id: 4,
          name: "Broken",
        },
        custom_fields_values: {
          custom_fields_value: [
            {
              name: "Incident_Created_DateTime",
              value: "1970-01-01T00:00:00.000Z",
            },
            {
              name: "Incident_ID",
              value: "-1",
            },
          ],
        },
      },
    },
  })
    .then(function (response) {
      console.log(response);
      return true;
    })
    .catch(function (error) {
      if (error.response) {
        throw new errors.ServiceError(error.response.status, error.response);
      }
    });
}

async function ReturnAsset(assetName, damagedFlag) {
  // get asset data
  try {
    samanage.GetAssetDataFromName(assetName);
  } catch (error) {
    throw error;
  }

  Promise.all([samanage.GetAssetDataFromName(assetName)])
    .then(function (assetDictionary) {
      if (assetDictionary[0].length === 0) {
        // I think this is useless but we'll see if it ever gets called
        throw new errors.AssetNotFoundError(assetName);
      } else {
        // The related incidents array is "sorted" by oldest to newest, so pick the newest incident to close
        let ticketIdentifier = "";
        let secondTicketIdentifier = "";
        try {
          ticketIdentifier =
            assetDictionary[0].data[0].incidents[
              assetDictionary[0].data[0].incidents.length - 1
            ].id;
          try {
            // Have it try to close the two most recent tickets
            // this might be dumb, could be better to just close all of them? Would have to check
            secondTicketIdentifier =
              assetDictionary[0].data[0].incidents[
                assetDictionary[0].data[0].incidents.length - 2
              ].id;
          } catch (error) {
            secondTicketIdentifier = "";
          }
        } catch (error) {
          ticketIdentifier = "";
        }

        // create promises for resolution
        //let loanIn = LoanAssetIn(assetDictionary[0][0].id);
        //let closedTicket = Promise.resolve(1);

        // wait for promises to resolve
        if (damagedFlag == 0) {
          Promise.all([
            LoanAssetIn(assetDictionary[0].data[0].id),
            process_tickets.CloseTicket(ticketIdentifier),
          ])
            .then(function (res) {
              console.log(res);
              return res;
            })
            .catch(function (error) {
              throw error;
            });
          console.log("done");
        } else {
          Promise.all([
            LoanDamagedAssetIn(assetDictionary[0].data[0].id),
            process_tickets.CloseTicket(ticketIdentifier),
          ])
            .then(function (res) {
              console.log(res);
              return res;
            })
            .catch(function (error) {
              throw error;
            });
          console.log("done");
        }
      }
    })
    .catch(function (error) {
      throw error;
    });
}

module.exports = {
  ReturnAsset,
};
