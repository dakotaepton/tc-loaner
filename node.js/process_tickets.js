const axios = require("axios");
const samanage_lookup = require("./samanage_lookup.js");
const errors = require("./errors.js");

async function CloseTicket(ticketIdentifier) {
  if (ticketIdentifier == "") {
    return true;
  }
  console.log("&&&");
  console.log(ticketIdentifier);
  return axios({
    method: "put",
    url: "https://api.samanage.com/incidents/" + ticketIdentifier + ".json",
    responseType: "application/json",
    headers: {
      "X-Samanage-Authorization": "Bearer  ",
      accept: "application/vnd.samanage.v2.1+json",
      "content-type": "application/json",
    },
    data: {
      incident: {
        state: "Closed",
      },
    },
  })
    .then(function (response) {
      console.log("CLOSE TICKET RESPONSE");
      console.log(response);
      return true;
    })
    .catch(function (error) {
      console.log("CLOSE TICKET RESPONSE");
      console.log(error);
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        throw new Error(
          "(CloseTicket) Samanage Error: " +
            error.response.data +
            " - " +
            ticketIdentifier
        );
      }
    });
}

async function CreateTicket(assetDictionary, userDictionary, description = "") {
  // Going to start referring to asset tags as asset Names instead for use with other systems

  let assetName = assetDictionary.data[0].name;
  let userFullName = userDictionary.data[0].name;

  let incidentName = assetName + ": " + userFullName;

  return axios({
    method: "post",
    url: "https://api.samanage.com/incidents.json",
    responseType: "application/json",
    headers: {
      "X-Samanage-Authorization": "Bearer  ",
      accept: "application/vnd.samanage.v2.1+json",
      "content-type": "application/json",
    },
    data: {
      incident: {
        name: incidentName,
        priority: "Medium",
        requester: { email: "loans@trinity.wa.edu.au" },
        description: description,
        due_at: new Date().toISOString(),
        assignee_id: "3633862",
        other_asset_ids: [assetDictionary.data[0].id],
      },
    },
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      throw error;
    });
}

module.exports = {
  CloseTicket,
  CreateTicket,
};
