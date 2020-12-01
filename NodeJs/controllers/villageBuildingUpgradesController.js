const path = require('path');
const fetch = require("node-fetch");
const villageBuildingUpgradesModel = require('../models/villageBuildingUpgradesModel');
const EARTH_WALL = 5;
const CITY_WALL = 6;
const PALISADE = 7;


exports.view = function (req, res) {
    villageBuildingUpgradesModel.find({idVillage: req.params.idVillage}, function (err, villageBuildingUpgrades) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: villageBuildingUpgrades
        });
    });
};

exports.new = async function (req, res) {
    let buildingInfo = require('/home/node/app/infoTables/buildingInfoLookup.json');

    (async () => {
        let idVillage = req.body.idVillage;
        let buildingFieldId = req.body.vbid;
        let newBuildingType = req.body.type ? req.body.type : 0;
        let currentUnixTime =  Math.round(new Date().getTime()/1000);
        let villageBuildingTypes = [];
        let villageBuildingLevels = [];
        let allowf = true;
        let wallf = false; //maybe better name

        let villageResourcesApiUrl = 'http://localhost:8080/api/villageResources/' + idVillage;
        let villageResources = await(await(await fetch(villageResourcesApiUrl)).json()).data;

        let villageBuildingFieldsApiUrl = 'http://localhost:8080/api/villageBuildingFields/' + idVillage;
        let villageBuildingFields = await(await(await fetch(villageBuildingFieldsApiUrl)).json()).data;
        let villageBuildingLevel = Number(villageBuildingFields["field"+buildingFieldId+"Level"]);
        let villageBuildingType = 0;

        if(newBuildingType>0) {
            for(let i = 1; i < 20; i++){
                villageBuildingTypes.push(villageBuildingFields['field'+i+'Type']);
                villageBuildingLevels.push(villageBuildingFields['field'+i+'Level']);
            }

            // Check if user is trying to build a second instance of existing building
            if(villageBuildingTypes.includes(buildingInfo[newBuildingType]['id'])){
                for(let l = 0; l < villageBuildingTypes.length; l++){
                    if(villageBuildingTypes[l] == buildingInfo[newBuildingType]['id']) {
                        if((buildingInfo[newBuildingType]['allowMultiple'] && villageBuildingLevels[l] == 20)) {
                            allowf = true;
                            break;
                        } else {
                            allowf = false;
                        }
                    }
                }
                if(!allowf) {
                    res.json({
                        message: 'villageBuildingUpgrade failed',
                        data: ''
                    });
                    return;
                }
            }
            villageBuildingType = Number(newBuildingType);
            villageBuildingLevel++;
        } else {
            villageBuildingType = Number(villageBuildingFields["field"+buildingFieldId+"Type"]);
        }

        if(villageBuildingLevel == 0){
            villageBuildingLevel++;
            wallf = true;
        }
        
        let requirementWood = buildingInfo[villageBuildingType]["wood"][villageBuildingLevel];
        let requirementClay = buildingInfo[villageBuildingType]["clay"][villageBuildingLevel];
        let requirementIron = buildingInfo[villageBuildingType]["iron"][villageBuildingLevel];
        let requirementCrop = buildingInfo[villageBuildingType]["crop"][villageBuildingLevel];
        let requirementConstructionTime = Math.floor(Number(buildingInfo[villageBuildingType]["constructionTime"][villageBuildingLevel])/100);

        if(newBuildingType>0 || wallf) villageBuildingLevel--;

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
        
        var villageBuildingUpgrades = new villageBuildingUpgradesModel();
        villageBuildingUpgrades.idVillage = req.body.idVillage;
        villageBuildingUpgrades.vbid = req.body.vbid;
        villageBuildingUpgrades.buildingType = villageBuildingType;
        villageBuildingUpgrades.buildingLevel = villageBuildingLevel;
        villageBuildingUpgrades.woodUsed = requirementWood;
        villageBuildingUpgrades.ironUsed = requirementIron;
        villageBuildingUpgrades.clayUsed = requirementClay;
        villageBuildingUpgrades.cropUsed = requirementCrop;
        villageBuildingUpgrades.timeStarted = currentUnixTime;
        villageBuildingUpgrades.timeCompleted = timeCompleted;

        let buildingUpgrade = villageBuildingUpgrades.save(async function (err,buildingUpgrade) {
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
                        "buildingUpgradeId": buildingUpgrade._id,
                        "newBuildingType": newBuildingType
                    }
                };

                await fetch(scheduleApiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(scheduleData),
                });

                console.log("scheduled API");

                res.json({
                    message: 'villageBuildingUpgrade success',
                    data: villageBuildingUpgrades
                });
            }
        });
                
    })();
};

exports.update = function (req, res) {
    villageBuildingUpgradesModel.findOne({_id: req.params.upgradeId}, function (err, villageBuildingUpgrades) {
        if (err)
            res.send(err);
        
            villageBuildingUpgrades.idVillage = req.body.idVillage;
            villageBuildingUpgrades.vbid = req.body.vbid;
            villageBuildingUpgrades.buildingType = req.body.buildingType;
            villageBuildingUpgrades.buildingLevel = req.body.buildingLevel;
            villageBuildingUpgrades.timeStarted = req.body.timeStarted;
            villageBuildingUpgrades.timeCompleted = req.body.timeCompleted;

            villageBuildingUpgrades.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageBuildingUpgrades Info updated',
                data: villageBuildingUpgrades
            });
        });
    });
};

exports.delete = function (req, res) {
    villageBuildingUpgradesModel.deleteOne({_id: req.params.upgradeId}, function (err, villageBuildingUpgrades) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageBuildingUpgrades deleted'
        });
    });
};