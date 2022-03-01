import axios from "axios";

// Drawer width size for nav and sidebar
export const drawerWidth = 240;

// baseURL for API Requests
export const baseURL = "http://localhost:3001";
export const returnLoanURL = baseURL + "/returns";

export async function returnDamagedLoan(assetName) {
  const reqHeaders = {
    headers: {
      assetname: assetName,
      msalToken: "faketoken",
      damagedFlag: 1,
    },
  };

  const promise = axios.post(returnLoanURL, {}, reqHeaders);

  const promiseResult = promise
    .then((response) => {
      console.log(response);
      let success = true;
      let message = "Successfully returned: " + assetName;
      return { success, message };
    })
    .catch((error) => {
      console.log(error.message);
      let success = false;
      let message = "Error returning: " + assetName + " | " + error.message;
      return { success, message };
    });

  return promiseResult;
}

export async function returnLoan(assetName) {
  const reqHeaders = {
    headers: {
      assetname: assetName,
      msalToken: "faketoken",
      damagedFlag: 0,
    },
  };

  const promise = axios.post(returnLoanURL, {}, reqHeaders);

  const promiseResult = promise
    .then((response) => {
      console.log(response);
      let success = true;
      let message = "Successfully returned: " + assetName;
      return { success, message };
    })
    .catch((error) => {
      console.log(error.message);
      let success = false;
      let message = "Error returning: " + assetName + " | " + error.message;
      return { success, message };
    });

  return promiseResult;
}

export async function bulkReturnDamagedLoans(loans) {
  return new Promise((resolve, reject) => {
    let returnResults = [];

    var index = 0;
    function nextLoan() {
      if (index < loans.length) {
        returnDamagedLoan(loans[index]).then((results) => {
          returnResults.push(results);
          index++;
          nextLoan();
        }, reject);
      } else {
        resolve(returnResults);
      }
    }
    nextLoan();
  });
}

export async function bulkReturnLoans(loans) {
  return new Promise((resolve, reject) => {
    let returnResults = [];

    var index = 0;
    function nextLoan() {
      console.log(returnResults);
      if (index < loans.length) {
        returnLoan(loans[index++]).then((results) => {
          returnResults.push(results);
          nextLoan();
        }, reject);
      } else {
        resolve(returnResults);
      }
    }
    nextLoan();
  });
}

export async function bulkReturn(loans) {
  var damagedPromise = Promise.resolve(bulkReturnDamagedLoans(loans.damaged));
  var notDamagedPromise = Promise.resolve(bulkReturnLoans(loans.notDamaged));

  return Promise.all([damagedPromise, notDamagedPromise]);
}
