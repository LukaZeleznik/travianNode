const path = require('path');
const fetch = require("node-fetch");
const villageResFieldUpgradesModel = require('../models/villageResFieldUpgradesModel');


exports.view = function (req, res) {
    villageResFieldUpgradesModel.find({idVillage: req.params.idVillage}, function (err, villageResFieldUpgrades) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: villageResFieldUpgrades
        });
    });
};

exports.new = async function (req, res) {
    let resourceInfo = require('/home/node/app/infoTables/resourceInfoLookup.json');

    (async () => {
        let idVillage = req.body.idVillage;
        let resFieldId = req.body.rfid;
        let currentUnixTime =  Math.round(new Date().getTime()/1000);

        let villageResourcesApiUrl = 'http://localhost:8080/api/villageResources/' + idVillage;
        let villageResources = await(await(await fetch(villageResourcesApiUrl)).json()).data;

        let villageResourceFieldsApiUrl = 'http://localhost:8080/api/villageResourceFields/' + idVillage;
        let villageResourceFields = await(await(await fetch(villageResourceFieldsApiUrl)).json()).data;
        let villageResourceFieldLevel = Number(villageResourceFields["field"+resFieldId+"Level"]);
        let villageResourceFieldType = Number(villageResourceFields["field"+resFieldId+"Type"]);

        let requirementWood = resourceInfo[villageResourceFieldType]["wood"][villageResourceFieldLevel];
        let requirementClay = resourceInfo[villageResourceFieldType]["clay"][villageResourceFieldLevel];
        let requirementIron = resourceInfo[villageResourceFieldType]["iron"][villageResourceFieldLevel];
        let requirementCrop = resourceInfo[villageResourceFieldType]["crop"][villageResourceFieldLevel];
        let requirementConstructionTime = Math.floor(Number(resourceInfo[villageResourceFieldType]["constructionTime"][villageResourceFieldLevel])/100);

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
        
        var villageResFieldUpgrades = new villageResFieldUpgradesModel();
        villageResFieldUpgrades.idVillage = req.body.idVillage;
        villageResFieldUpgrades.rfid = req.body.rfid;
        villageResFieldUpgrades.fieldType = villageResourceFieldType;
        villageResFieldUpgrades.fieldLevel = villageResourceFieldLevel;
        villageResFieldUpgrades.timeStarted = currentUnixTime;
        villageResFieldUpgrades.timeCompleted = timeCompleted;

        let villageResFieldUpgrade = villageResFieldUpgrades.save(async function (err,villageResFieldUpgrade) {
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
                        "resFieldUpgradeId": villageResFieldUpgrade._id
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
                    message: 'villageResFieldUpgrade success',
                    data: villageResFieldUpgrades
                });
            }
        });
                
    })();
};

exports.update = function (req, res) {
    villageResFieldUpgradesModel.findOne({_id: req.params.upgradeId}, function (err, villageResFieldUpgrades) {
        if (err)
            res.send(err);
        
            villageResFieldUpgrades.idVillage = req.body.idVillage;
            villageResFieldUpgrades.rfid = req.body.rfid;
            villageResFieldUpgrades.fieldType = req.body.fieldType;
            villageResFieldUpgrades.fieldLevel = req.body.fieldLevel;
            villageResFieldUpgrades.timeStarted = req.body.timeStarted;
            villageResFieldUpgrades.timeCompleted = req.body.timeCompleted;

            villageResFieldUpgrades.save(function (err) {
                if (err)
                    res.json(err);
                res.json({
                    message: 'villageResFieldUpgrades Info updated',
                    data: villageResFieldUpgrades
            });
        });
    });
};

exports.delete = function (req, res) {
    villageResFieldUpgradesModel.deleteOne({_id: req.params.upgradeId}, function (err, villageResFieldUpgrades) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageResFieldUpgrades deleted'
        });
    });
};