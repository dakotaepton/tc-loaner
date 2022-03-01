// Pretend user and asset already exist
// Clearly they must because we're using the system (samanage) identifier
// If they dont exist, that will be dealt with at a previous stage.

const axios = require("axios");
const errors = require("./errors.js");
const process_tickets = require("./process_tickets.js");

/**
 * Performs the API request to assign an asset
 * @param {object} assetDictionary Object that contains asset data from the service provider
 * @param {object} userDictionary Object that contains user data from the service provider
 * @param {number} ticketIdentifier Unique identifier of the ticket created by the service provider
 * @param {string} [useCase="User"] Whether the asset is going to be assigned as a User or as an Owner. User is the default.
 * @returns
 */
async function AssignAsset(
  assetDictionary,
  userDictionary,
  ticketIdentifier,
  useCase = "User"
) {
  try {
    if (useCase.toLowerCase == "owner") {
      return axios({
        method: "put",
        url:
          "https://api.samanage.com/other_assets/" +
          assetDictionary[0].id +
          ".json",
        responseType: "application/json",
        headers: {
          "X-Samanage-Authorization": "Bearer  ",
          accept: "application/vnd.samanage.v2.1+json",
          "content-type": "application/json",
        },
        data: {
          other_asset: {
            custom: "",
            owner: { email: userDictionary[0].email },
            user_id: -1,
            status: { id: 1, name: "Operational" },
            custom_fields_values: {
              custom_fields_value: [
                {
                  name: "Incident_Created_DateTime",
                  value: new Date().toLocaleString("en-AU", {
                    timeZone: "Australia/Perth",
                  }),
                },
                {
                  name: "Incident_ID",
                  value: ticketIdentifier,
                },
              ],
            },
          },
        },
      })
        .then((res) => res.data)
        .catch(function (error) {
          throw error;
        });
    } else {
      return axios({
        method: "put",
        url:
          "https://api.samanage.com/other_assets/" +
          assetDictionary[0].id +
          ".json",
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
            user: { email: userDictionary[0].email },
            status: { id: 1, name: "Operational" },
            custom_fields_values: {
              custom_fields_value: [
                {
                  name: "Incident_Created_DateTime",
                  value: new Date().toLocaleString("en-AU", {
                    timeZone: "Australia/Perth",
                  }),
                },
                {
                  name: "Incident_ID",
                  value: ticketIdentifier,
                },
              ],
            },
          },
        },
      })
        .then((res) => res.data)
        .catch(function (error) {
          throw error;
        });
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Actually interacts with the service provider to loan out an asset to a user
 * @param {Object} assetDictionary Object that contains asset data from the service provider
 * @param {Object} userDictionary Object that contains user data from the service provider
 */
async function LoanAsset(assetDictionary, userDictionary) {
  Promise.all([process_tickets.CreateTicket(assetDictionary, userDictionary)])
    .then(function ([ticketIdentifier]) {
      if (ticketIdentifier == []) {
        throw new errors.TicketNotFoundError(ticketIdentifier);
      } else {
        Promise.all([
          AssignAsset(
            assetDictionary.data,
            userDictionary.data,
            ticketIdentifier.data.id
          ),
        ])
          .then(function (res) {
            return "Something Useful";
          })
          .catch(function (error) {
            throw error;
          });
      }
    })
    .catch(function (error) {
      throw error;
    });
}

module.exports = {
  LoanAsset,
  AssignAsset,
};
