const path = require('path');
const fetch = require("node-fetch");
const buildingUpgradesModel = require('../models/buildingUpgradesModel');


exports.view = function (req, res) {
    buildingUpgradesModel.find({idVillage: req.params.idVillage}, function (err, buildingUpgrades) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: buildingUpgrades
        });
    });
};

exports.new = async function (req, res) {
    let buildingInfo = require('/home/node/app/infoTables/buildingInfoLookup.json');

    (async () => {
        console.log("DEBUG3");
        let idVillage = req.body.idVillage;
        let buildingFieldId = req.body.vbid;

        let currentUnixTime =  Math.round(new Date().getTime()/1000);

        let villageResourcesApiUrl = 'http://localhost:8080/api/villageResources/' + idVillage;
        let villageResources = await(await(await fetch(villageResourcesApiUrl)).json()).data;

        let villageBuildingsDataApiUrl = 'http://localhost:8080/api/villageBuildingsData/' + idVillage;
        let villageBuildingsData = await(await(await fetch(villageBuildingsDataApiUrl)).json()).data;
        let villageBuildingLevel = Number(villageBuildingsData["field"+buildingFieldId+"Level"]);
        let villageBuildingType = Number(villageBuildingsData["field"+buildingFieldId+"Type"]);

        let requirementWood = buildingInfo[villageBuildingType]["wood"][villageBuildingLevel];
        let requirementClay = buildingInfo[villageBuildingType]["clay"][villageBuildingLevel];
        let requirementIron = buildingInfo[villageBuildingType]["iron"][villageBuildingLevel];
        let requirementCrop = buildingInfo[villageBuildingType]["crop"][villageBuildingLevel];
        let requirementConstructionTime = Math.floor(Number(buildingInfo[villageBuildingType]["constructionTime"][villageBuildingLevel])/100);

        if(villageResources.currentWood < requirementWood || villageResources.currentClay < requirementClay || 
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
        
        var buildingUpgrades = new buildingUpgradesModel();
        buildingUpgrades.idVillage = req.body.idVillage;
        buildingUpgrades.vbid = req.body.vbid;
        buildingUpgrades.buildingType = villageBuildingType;
        buildingUpgrades.buildingLevel = villageBuildingLevel;
        buildingUpgrades.timeStarted = currentUnixTime;
        buildingUpgrades.timeCompleted = timeCompleted;

        let buildingUpgrade = buildingUpgrades.save(async function (err,buildingUpgrade) {
            if (err){
                res.json(err);
            }
            else{
                let scheduleApiUrl = 'http://localhost:8080/api/schedule/';
                let scheduleData = {
                    "taskType": "upgradeBuilding",
                    "taskUnixTime": timeCompleted,
                    "taskData": {
                        "idVillage": idVillage,
                        "buildingId": buildingFieldId,
                        "buildingUpgradeId": buildingUpgrade._id
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
                    message: 'New buildingdUpgrade created',
                    data: buildingUpgrades
                });
            }
        });
                
    })();
};

exports.update = function (req, res) {
    buildingUpgradesModel.findOne({_id: req.params.upgradeId}, function (err, buildingUpgrades) {
        if (err)
            res.send(err);
        
            buildingUpgrades.idVillage = req.body.idVillage;
            buildingUpgrades.vbid = req.body.vbid;
            buildingUpgrades.buildingType = req.body.buildingType;
            buildingUpgrades.buildingLevel = req.body.buildingLevel;
            buildingUpgrades.timeStarted = req.body.timeStarted;
            buildingUpgrades.timeCompleted = req.body.timeCompleted;

            buildingUpgrades.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'buildingUpgrades Info updated',
                data: buildingUpgrades
            });
        });
    });
};

exports.delete = function (req, res) {
    buildingUpgradesModel.deleteOne({_id: req.params.upgradeId}, function (err, buildingUpgrades) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'buildingUpgrades deleted'
        });
    });
};