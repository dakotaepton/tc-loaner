const axios = require('axios');
const loan_asset = require('./loan_asset.js');
const samanage = require('./samanage_lookup.js');
const errors = require('./errors.js');
const return_asset = require('./return_asset.js');

/**
 * Controls the flow of logic when doing a staff loan
 * @param {Object} headers The headers sent through with the request
 */
async function StaffLoan(headers) {
    console.log("****\nStaffLoan\n\n\n\n\n")
    let userFullName = headers.userfullname;
    let assetName = headers.assetname;
    
    Promise.all([samanage.GetUserDataFromFullName(userFullName), samanage.GetAssetDataFromName(assetName), return_asset.ReturnAsset(assetName, 0)]).then(function ([userDictionary, assetDictionary, nothing]) {
        loan_asset.LoanAsset(assetDictionary, userDictionary).then(function (res){
            return res;
        }).catch(function (error) {
            throw error;
        });
    }).catch(function (error){
        throw error;
    })
}

/**
 * Checks if a student is currently allowed to have another loan
 * @param {Object} userDictionary Object of user data
 * @returns {Promise<boolean>} Whether it can or can't have another loan
 */
async function StudentAllowedLoan(userDictionary) {
    return true;
}

/**
 * Controls the flow of logic when doing a student loan
 * @param {Object} headers The headers sent through with the request
 */
async function StudentLoan(headers) {
    console.log("****\nStudentLoan\n\n\n\n\n")
    let userFullName = headers.userfullname;
    let assetName = headers.assetname;
    let userOverride = false;

    // Check for override header
    userOverride = HeadersCheck(headers, {userOverride:1})

    Promise.all([samanage.GetUserDataFromFullName(userFullName), samanage.GetAssetDataFromName(assetName), return_asset.ReturnAsset(assetName, 0)]).then(function ([userDictionary, assetDictionary, nothing]) {
        if(userOverride){
            loan_asset.LoanAsset(assetDictionary, userDictionary).then(function(res){
                return res;
            }).catch( function(error) {
                throw error;
            });
        } else {
            StudentAllowedLoan(userDictionary).then(function (res) {
                loan_asset.LoanAsset(assetDictionary, userDictionary).then(function (res){
                    return res;
                }).catch(function (error) {
                    throw error;
                });
            }).catch(function (error) {
                throw error;
            });
        }
    }).catch(function (error){
        throw error;
    })

}

/**
 * Controls the flow of logic when assigning an asset to a user
 * @param {Object} headers The headers sent through with the request
 */
async function UserAssign(headers) {
    let userFullName = headers.userfullname;
    let assetName = headers.assetname;


    try {
        userDictionary = samanage.GetUserDataFromFullName(userFullName)[0];
    } catch (error) {
        throw new errors.UserNotFoundError(userFullName);
    }
    try {
        assetDictionary = samanage.GetAssetDataFromName(assetName)[0];
    } catch (error) {
        throw new errors.AssetNotFoundError(assetName);
    }

    // If you have all the data you need, then try to loan the asset
    Promise.all([samanage.GetUserDataFromFullName(userFullName), samanage.GetAssetDataFromName(assetName), return_asset.ReturnAsset(assetName, 0)]).then(function ([userDictionary, assetDictionary, nothing]) {
        // If you're allowing the loan anyway, just proceed
        //console.log(assetDictionary);
        loan_asset.AssignAsset(assetDictionary.data, userDictionary.data, '', 'user').then(function(resp) {
            //console.log(".then AssignAsset")
            return resp;
        }).catch(function(error_two){
            //console.log(".catch AssignAsset")
            throw error_two;
        })
    }).catch(function (error){
        //console.log(".catch Promise.all")
        throw error;
    })
}

function HeadersCheck(headers, {msalToken=0, userFullName=0, assetName=0, incomingAssetName=0, outgoingAssetName=0, userOverride=0, damagedFlag=0} = {}) {
    // This function just checks that the specified headers aren't null
    if(msalToken != 0 && headers.msaltoken == null){ throw new errors.TokenError(401); }
    if(userFullName != 0 && headers.userfullname == null){ throw new errors.UserNotFoundError("null"); }
    if(assetName != 0 && headers.assetname == null){ throw new errors.AssetNotFoundError("null"); }
    if(incomingAssetName != 0 && headers.incomingassetname == null){ throw new errors.AssetNotFoundError("null"); }
    if(outgoingAssetName != 0 && headers.outgoingassetname == null){ throw new errors.AssetNotFoundError("null"); }
    if(damagedFlag != 0 && headers.damagedflag == null){ throw new errors.HeaderError("damagedFlag"); }
    if(userOverride != 0){if(headers.useroverride == null){ return true; } else { return false; }};
    
}


module.exports = {
    HeadersCheck,
    StaffLoan,
    StudentLoan,
    UserAssign
}
