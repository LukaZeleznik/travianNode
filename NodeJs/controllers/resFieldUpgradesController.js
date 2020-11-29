const path = require('path');
const fetch = require("node-fetch");
const resFieldUpgradesModel = require('../models/resFieldUpgradesModel');


exports.view = function (req, res) {
    resFieldUpgradesModel.find({idVillage: req.params.idVillage}, function (err, resFieldUpgrades) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: resFieldUpgrades
        });
    });
};

// Handle create resFieldUpgrades actions
exports.new = async function (req, res) {
    let resourceInfo = require('/home/node/app/infoTables/resourceInfoLookup.json');

    (async () => {
        let idVillage = req.body.idVillage;
        let resFieldId = req.body.rfid;

        let currentUnixTime =  Math.round(new Date().getTime()/1000);

        let villageResourcesApiUrl = 'http://localhost:8080/api/villageResources/' + idVillage;
        let villageResources = await(await(await fetch(villageResourcesApiUrl)).json()).data;

        let villageResFieldLevelsApiUrl = 'http://localhost:8080/api/villageFieldLevels/' + idVillage;
        let villageResFieldLevels = await(await(await fetch(villageResFieldLevelsApiUrl)).json()).data;
        let villageResFieldLevel = Number(villageResFieldLevels["resField"+resFieldId+"Level"] );
        //let villageResFieldLevelNext = villageResFieldLevel + 1;

        let villageResFieldTypesApiUrl = 'http://localhost:8080/api/villageFieldTypes/' + idVillage;
        let villageResFieldTypes = await(await(await fetch(villageResFieldTypesApiUrl)).json()).data;
        let villageResFieldType = villageResFieldTypes["resField"+resFieldId+"Type"];

        if(villageResFieldType == "wood"){villageResFieldType = "Woodcutter"}
        else if(villageResFieldType == "clay"){villageResFieldType = "Claypit"}
        else if(villageResFieldType == "iron"){villageResFieldType = "Ironmine"}
        else if(villageResFieldType == "crop"){villageResFieldType = "Cropland"}
        else{
            res.json({
                message: 'Invalid resFieldType name',
                data: ""
            });
            return;
        }

        let requirementWood = resourceInfo[villageResFieldType]["wood"][villageResFieldLevel];
        let requirementClay = resourceInfo[villageResFieldType]["clay"][villageResFieldLevel];
        let requirementIron = resourceInfo[villageResFieldType]["iron"][villageResFieldLevel];
        let requirementCrop = resourceInfo[villageResFieldType]["crop"][villageResFieldLevel];
        let requirementConstructionTime = Math.floor(Number(resourceInfo[villageResFieldType]["constructionTime"][villageResFieldLevel])/100);

        if( villageResources.currentWood < requirementWood || villageResources.currentClay < requirementClay || 
          villageResources.currentIron < requirementIron || villageResources.currentCrop < requirementCrop ){
            res.json({
                message: 'Not enough resources',
                data: ""
            });
            return;
        }

        console.log("enough resources");

        villageResources.currentWood -= requirementWood;
        villageResources.currentClay -= requirementClay;
        villageResources.currentIron -= requirementIron;
        villageResources.currentCrop -= requirementCrop;
        villageResources.lastUpdate = currentUnixTime;

        await fetch(villageResourcesApiUrl, {
            method: 'PATCH', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(villageResources),
        });

        console.log("resources deducted");

        let timeCompleted = currentUnixTime + requirementConstructionTime;

        console.log("currentTime :" + currentUnixTime);
        console.log("requirementConstructionTime :" + requirementConstructionTime);
        console.log("timeCompleted :" + timeCompleted);
        
        var resFieldUpgrades = new resFieldUpgradesModel();
        resFieldUpgrades.idVillage = req.body.idVillage;
        resFieldUpgrades.rfid = req.body.rfid;
        resFieldUpgrades.fieldType = villageResFieldType;
        resFieldUpgrades.fieldLevel = villageResFieldLevel;
        resFieldUpgrades.timeStarted = currentUnixTime;
        resFieldUpgrades.timeCompleted = timeCompleted;

        let resFieldUpgrade = resFieldUpgrades.save(async function (err,resFieldUpgrade) {
            if (err){
                res.json(err);
            }
            else{
                let scheduleApiUrl = 'http://localhost:8080/api/schedule/';
                let scheduleData = {
                    "taskType": "upgradeResField",
                    "taskUnixTime": timeCompleted,
                    "taskData": {
                        "idVillage": idVillage,
                        "resFieldId": resFieldId,
                        "resFieldUpgradeId": resFieldUpgrade._id
                    }
                };

                await fetch(scheduleApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(scheduleData),
                });

                console.log("scheduled");

                res.json({
                    message: 'resFieldUpgrade success',
                    data: resFieldUpgrades
                });
            }
        });
                
    })();
};

exports.update = function (req, res) {
    resFieldUpgradesModel.findOne({_id: req.params.upgradeId}, function (err, resFieldUpgrades) {
        if (err)
            res.send(err);
        
        resFieldUpgrades.idVillage = req.body.idVillage;
        resFieldUpgrades.rfid = req.body.rfid;
        resFieldUpgrades.fieldType = req.body.fieldType;
        resFieldUpgrades.fieldLevel = req.body.fieldLevel;
        resFieldUpgrades.timeStarted = req.body.timeStarted;
        resFieldUpgrades.timeCompleted = req.body.timeCompleted;

        resFieldUpgrades.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'resFieldUpgrades Info updated',
                data: resFieldUpgrades
            });
        });
    });
};

exports.delete = function (req, res) {
    resFieldUpgradesModel.deleteOne({_id: req.params.upgradeId}, function (err, resFieldUpgrades) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'resFieldUpgrades deleted'
        });
    });
};