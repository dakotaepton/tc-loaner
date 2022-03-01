export const msalConfig = {
  auth: {
    clientId: "",
    authority:
      "",
    redirectUri: "http://localhost:3000/admin/home",
    postLogoutRedirectUri: "http://localhost:3000/login",
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
  scopes: ["User.ReadBasic.All", "Group.Read.All"],
};

export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  graphAllUsersEndpoint: "https://graph.microsoft.com/v1.0/users?$top=999",
  graphAllStaffUsersEndpoint:
    "",
  graphAllStudentUsersEndpoint:
    "",
};

export async function getAllStaffUsers(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(graphConfig.graphAllStaffUsersEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function getAllStudentUsersNextPage(accessToken, nextLink) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(nextLink, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

export async function getAllStudentUsers(accessToken) {
  const headers = new Headers();
  const bearer = `Bearer ${accessToken}`;

  headers.append("Authorization", bearer);

  const options = {
    method: "GET",
    headers: headers,
  };

  return fetch(graphConfig.graphAllStudentUsersEndpoint, options)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}
