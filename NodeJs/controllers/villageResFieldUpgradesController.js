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

exports.find = function (req, res) {
    villageResFieldUpgradesModel.findOne({_id: req.params.upgradeId}, function (err, villageResFieldUpgrade) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: villageResFieldUpgrade
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

        let villageResFieldUpgradesApiUrl = 'http://localhost:8080/api/villageResFieldUpgrades/' + idVillage;
        let villageResFieldUpgradesCurrent = await(await(await fetch(villageResFieldUpgradesApiUrl)).json()).data;

        let requirementWood = resourceInfo[villageResourceFieldType]["wood"][villageResourceFieldLevel];
        let requirementClay = resourceInfo[villageResourceFieldType]["clay"][villageResourceFieldLevel];
        let requirementIron = resourceInfo[villageResourceFieldType]["iron"][villageResourceFieldLevel];
        let requirementCrop = resourceInfo[villageResourceFieldType]["crop"][villageResourceFieldLevel];
        let requirementConstructionTime = Math.floor(Number(resourceInfo[villageResourceFieldType]["constructionTime"][villageResourceFieldLevel])/100);

        if(villageResFieldUpgradesCurrent.length > 0){
            res.json({
                message: 'Another resource field is being upgraded',
                data: ""
            });
            return;
        }

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
        villageResFieldUpgrades.woodUsed = requirementWood;
        villageResFieldUpgrades.ironUsed = requirementIron;
        villageResFieldUpgrades.clayUsed = requirementClay;
        villageResFieldUpgrades.cropUsed = requirementCrop;
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

exports.delete = async function (req, res) {
    var upgradeData = await getUsedResources(req.params.upgradeId);

    villageResFieldUpgradesModel.deleteOne({_id: req.params.upgradeId}, function (err, villageResFieldUpgrades) {
        if (err){
            res.send(err);
        } else if (villageResFieldUpgrades.deletedCount > 0){
            (async () => {
                
                const currentUnixTime =  Math.round(new Date().getTime()/1000);
                const villageResourcesApiUrl = 'http://localhost:8080/api/villageResources/' + upgradeData['idVillage'];
                let villageResources = await(await(await fetch(villageResourcesApiUrl)).json()).data;

                villageResources.currentWood += upgradeData['woodUsed'];
                villageResources.currentClay += upgradeData['clayUsed'];
                villageResources.currentIron += upgradeData['ironUsed'];
                villageResources.currentCrop += upgradeData['cropUsed'];
                villageResources.lastUpdate = currentUnixTime;

                await fetch(villageResourcesApiUrl, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(villageResources),
                });

                res.json({
                    status: "success",
                    message: 'villageResFieldUpgrades deleted'
                });
                return;
            })();
        } else {
            res.json({
                status: "failed",
                message: 'villageResFieldUpgrades _id does not exist'
            });
        }
    });
};

async function getUsedResources(upgradeId){
    const villageResFieldUpgradesApiUrl = 'http://localhost:8080/api/villageResFieldUpgrade/' + upgradeId;
    let villageResFieldUpgrades = await(await(await fetch(villageResFieldUpgradesApiUrl)).json()).data;

    return villageResFieldUpgrades;
}