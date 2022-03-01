const axios = require("axios");

/**
 * Gets asset data from the service provider based on the unique asset identifier
 * @param {number} assetIdentifier - Unique identifier of the asset according to the service provider
 * @returns {Promise<Object>}
 */
async function GetAssetDataFromIdentifier(assetIdentifier) {
    var options = {
        method: 'GET',
        url: 'https://api.samanage.com/other_assets/' + assetIdentifier + '.json',
        headers: {
            'X-Samanage-Authorization': 'Bearer ',
            'accept': 'application/vnd.samanage.v2.1+json'
        }
    };
    return axios.request(options);
}

/**
 * Gets user data from the service provider based on the unique user identifier
 * @param {number} userIdentifier - Unique identifier of the user according to the service provider
 * @returns {Promise<Object>}
 */
async function GetUserDataFromIdentifier(userIdentifier) {
    var options = {
        method: 'GET',
        url: 'https://api.samanage.com/users/' + userIdentifier + '.json',
        headers: {
            'X-Samanage-Authorization': 'Bearer ',
            'accept': 'application/vnd.samanage.v2.1+json'
        }
    };
    return axios.request(options);
}

/**
 * Gets asset data from the service provider based on the asset tag
 * @param {string} assetTag - Human readable name of the asset
 * @returns {Promise<Object>}
 */
async function GetAssetDataFromName(assetTag) {
    var options = {
        method: 'GET',
        url: 'https://api.samanage.com/other_assets.json',
        params: {name: assetTag},
        responseType: 'application/json',
        headers: {
            'X-Samanage-Authorization': 'Bearer '
        }
    };
    return axios.request(options);
}

/**
 * Gets user data from the service provider based on the user's full name
 * @param {string} userFullName - Full name of the user
 * @returns {Promise<Object>}
 */
async function GetUserDataFromFullName(userFullName) {
    var options = {
        method: 'GET',
        url: 'https://api.samanage.com/users.json',
        params: {name: userFullName},
        headers: {
            'X-Samanage-Authorization': 'Bearer '
        }
    };
    return axios.request(options);
}

/**
 * 
 * @returns Array of all staff and student loans
 */
async function GetNotReturnedAssets() {
    var options = {
        method: 'GET',
        url: 'https://api.samanage.com/other_assets.json?name%5B%5D=tc-loan*&name%5B%5D=tc-stff*',
        headers: {
            'X-Samanage-Authorization': 'Bearer '
        }
    };
    return axios.request(options);
}


module.exports = {
    GetAssetDataFromIdentifier,
    GetUserDataFromIdentifier,
    GetAssetDataFromName,
    GetUserDataFromFullName,
    GetNotReturnedAssets
}

// const {AssetNameLookup,LookupAssetIdentifier,UserEmailLookup,UserFullNameLookup} = require('./samanage_lookup');
