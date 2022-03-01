// This file synchronises a internal database of users and staff (eg synergetic, maze)
// with the online service provider (eg solarwinds, zendesk) so that the autocomplete
// and lookup functions can work properly.
//
// It will disable all users on the service provider, then run a query (or set of queries)
// on the internal database, then create / re-enable all the users that show up.
//
// This can be configured to run on demand, along with automatically overnight.

const cron = require("node-cron");
const axios = require("axios");
const samanage_lookup = require("./samanage_lookup.js");

cron.schedule("0 3 * * *", function () {
  console.log("Performing an automatic sync at 3:00am each day");
  FullSync();
});

async function FullSync() {
  let disabled = DisableUsers();
  let userList = GetUsers();
  Promise.all([disabled, userList])
    .then((enabled = EnableUsers(userList)))
    .catch((error) => console.log(error));
}

async function QuickSync() {
  let userList = GetUsers(1);
  Promise.all([userList])
    .then(EnableUsers(userList))
    .catch((error) => console.log(error));
}

function DisableUsers() {
  // disable all users on samanage
  const axios = require("axios");
  //let users = [];
  // get first page
  let firstPage = GetPages(1);
  Promise.all([firstPage])
    .then(function (res) {
      // examine headers
      let num_pages = res.headers.x - total - pages;
      // get all subsequent pages
      for (let i = 1; i <= numPages; i++) {
        let currentUsers = await GetPages(i);
        for (let j = 0; (j = currentUsers.length); j++) {
          let jsonIndiv = JSON.parse(currentUsers[j]);
          await DisableIndividual(jsonIndiv.id);
        }
      }
    })
    .catch((error) => console.log(error));
}

function GetUsers(days = 0) {
  // Spits out an array of objects with the following data:
  //      Full Name
  //      Email
  //      Role (can be parsed into samanage specific role later)
  //      Database ID (for the Title)

  // Get all users that have been updated in the last number of days
  // if days = 0, get all users
  var sql = require("mssql");
  var config = {
    user: "guazzelli.oliver@trinity.wa.edu.au",
    password: "password1",
    server: "tcmaze01",
    database: "Trinity_College_TEST",
  };
  // connect to your database
  let total_results = [];
  sql.connect(config, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    if (days == 0) {
      // community.OccupEmail | community.NameExternal | community.id  where community.id = Staff.id
      request.query(
        'select CONCAT(ISNULL(PREFNAME, FIRSTNAME), " ", SURNAME) AS "Full Name", email, "Staff" as "Role", sfKEY as "ID" from SF WHERE FACULTY01 == "LEFT"',
        function (err, recordset) {
          if (err) console.log(err);
          // send records as a response
          total_results = recordset;
          //res.send(recordset);
        }
      );
      // community.OccupEmail | community.NameExternal | community.id  where community.id = Students.id
      request.query("another one for Students", function (err, results_2) {
        if (err) console.log(err);
        // send records as a response
        return concat(total_results, results_2);
        //res.send(recordset);
      });
    } else {
      // num days = -1 * days
      // community.OccupEmail | community.NameExternal | community.id  where community.id = Staff.id and Staff.modifiedDate > dateadd(dd,-1,cast(getdate() as date)) or community.communityModifiedDate > dateadd(dd,-1,cast(getdate() as date)) or community.communityCreatedDate > dateadd(dd,-1,cast(getdate() as date))
      // same for student
      request.query(
        'Figure out if theres a "last modified" field and utilise that',
        function (err, recordset) {
          if (err) console.log(err);
          // send records as a response
          res.send(recordset);
        }
      );
    }
  });
  // for each
}

async function EnableUsers(userList) {
  for (let i = 0; i < userList; i++) {
    let userData = samanage_lookup.GetUserDataFromEmail(userList[i].email);
    Promise.all([userData])
      .then(function (res) {
        await EnableIndividual(userData);
      })
      .catch(function (res) {
        await CreateIndividual(userData);
      });
  }
}

async function GetPages(pageNumber) {
  // these two roles are the Students and Staff roles for Trinity
  var options = {
    method: "GET",
    url: "https://api.samanage.com/users.json",
    params: {
      role: [260438, 260439],
      page: pageNumber,
    },
    headers: {
      "X-Samanage-Authorization": "Bearer ",
      accept: "application/vnd.samanage.v2.1+json",
    },
  };

  return await axios.request(options);
}

async function DisableIndividual(id) {
  var options = {
    method: "PUT",
    url: "https://api.samanage.com/users/" + id + ".json",
    responseType: "application/json",
    headers: {
      "X-Samanage-Authorization": "Bearer  ",
      accept: "application/vnd.samanage.v2.1+json",
      "content-type": "application/json",
    },
    data: {
      user: {
        disabled: "true",
      },
    },
  };

  return await axios.request(options);
}

async function EnableIndividual(individual) {
  var options = {
    method: "PUT",
    url: "https://api.samanage.com/users/" + individual.id + ".json",
    responseType: "application/json",
    headers: {
      "X-Samanage-Authorization": "Bearer  ",
      accept: "application/vnd.samanage.v2.1+json",
      "content-type": "application/json",
    },
    data: {
      user: {
        disabled: "false",
        name: "",
        email: "",
        title: "",
        role: { name: "" },
      },
    },
  };

  return await axios.request(options);
}

async function CreateIndividual(individual) {
  var options = {
    method: "POST",
    url: "https://api.samanage.com/users.json",
    responseType: "application/json",
    headers: {
      "X-Samanage-Authorization": "Bearer  ",
      accept: "application/vnd.samanage.v2.1+json",
      "content-type": "application/json",
    },
    data: {
      user: {
        disabled: "false",
        name: "",
        email: "",
        title: "",
        role: { name: "" },
      },
    },
  };
  return await axios.request(options);
}

module.exports = { FullSync, QuickSync };
