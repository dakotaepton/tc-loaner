// hotswap.js
const axios = require("axios");
const loan_asset = require('./loan_asset');
const return_asset = require('./return_asset');
const samanage = require('./samanage_lookup');
const errors = require('./errors.js');

async function HotSwap(headers){
    // get device names
    let incomingAssetName = headers.incomingassetname;
    let outgoingAssetName = headers.outgoingassetname;
    let damagedFlag = headers.damagedflag;
    let incomingAssetDictionary = await samanage.GetAssetDataFromName(incomingAssetName)[0];
    
    // await for data
    // Have to have it split up like this because we need to use some of this initial data later on
    Promise.all([incomingAssetDictionary]).then(async function (res) { // added async
        let returnAsset = return_asset.ReturnAsset(incomingAssetName, damagedFlag);
        let userName = res[0].user.name;
        let userDictionary = await samanage.GetUserDataFromFullName(userName)[0];

        // Honestly have a feeling this isn't going to work, it doesnt like doing variables but we'll see
        Promise.all([returnAsset, userDictionary]).then(async function (res) { // added async
            let outgoingAssetDictionary;
            
            // try outgoing device name
            try {
                outgoingAssetDictionary = await samanage.GetAssetDataFromName(outgoingAssetName)[0];
            } catch (error) {
                return new errors.AssetNotFoundError(outgoingAssetName);
            }
            
            // if all good, await data
            Promise.all([outgoingAssetDictionary]).then(async function (res) { // added async
                // loan outgoing asset
				try {
					let test = incomingAssetDictionary.custom_fields_values[0].value;
					console.log(test);
					// hoping this throws a keyerror
					if (incomingAssetDictionary.custom != '' || incomingAssetDictionary.custom_fields_values[0].value != '-1') {
						// If there's a ticket already associated with it, make a new ticket (ie if its a loan)
						return loan_asset.LoanAsset(outgoingAssetDictionary, userDictionary);
					} else {
						// otherwise, don't
						return loan_asset.AssignAsset(outgoingAssetDictionary, userDictionary, '');
					}
				} catch (error) {
                    // otherwise, don't
					console.log(error);
                    return loan_asset.AssignAsset(outgoingAssetDictionary, userDictionary, '');
                }
            }).catch(function (error){
                return error;
            })
        }).catch(function (error){
            return error;
        })
    }).catch(function (error){
        return error;
    })
}

//MainLoop();

module.exports = {
    HotSwap
}

