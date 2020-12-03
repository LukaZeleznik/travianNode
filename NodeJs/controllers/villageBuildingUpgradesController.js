const path = require('path');
const fetch = require("node-fetch");
const villageBuildingUpgradesModel = require('../models/villageBuildingUpgradesModel');
//Buildings
const EARTH_WALL = 5;
const CITY_WALL = 6;
const PALISADE = 7;
const BAKERY = 8;
const BRICKYARD = 9;
const GRAIN_MILL = 10;
const IRON_FOUNDRY = 11;
const SAWMILL = 12;

//Resources
const WOODCUTTER = 0;
const CLAY_PIT = 1;
const IRON_MINE = 2;
const CROPLAND = 3;


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

        let villageBuildingUpgradesApiUrl = 'http://localhost:8080/api/villageBuildingUpgrades/' + idVillage;
        let villageBuildingUpgradesCurrent = await(await(await fetch(villageBuildingUpgradesApiUrl)).json()).data;

        if(villageBuildingUpgradesCurrent.length > 0){
            res.json({
                message: 'Another building is already being upgraded',
                data: ""
            });
            return;
        }

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
            } else {
                if ([BAKERY,BRICKYARD,GRAIN_MILL,IRON_FOUNDRY,SAWMILL].includes(newBuildingType)){
                    allowf = false;
                    switch (newBuildingType) {
                        case BAKERY:
                            if(await hasRequiredResFieldLevel(CROPLAND,10,idVillage)){
                                for(let l = 0; l < villageBuildingTypes.length; l++){
                                    if(villageBuildingTypes[l] == GRAIN_MILL || villageBuildingLevels[l] == 5) {
                                        allowf = true;
                                    }
                                }
                            }
                            break;
                        case BRICKYARD:     if(await hasRequiredResFieldLevel(CLAY_PIT,10,idVillage))    allowf = true; break;
                        case GRAIN_MILL:    if(await hasRequiredResFieldLevel(CROPLAND,5,idVillage))     allowf = true; break;
                        case IRON_FOUNDRY:  if(await hasRequiredResFieldLevel(IRON_MINE,10,idVillage))   allowf = true; break;
                        case SAWMILL:       if(await hasRequiredResFieldLevel(WOODCUTTER,10,idVillage))  allowf = true; break;
                    }
                } else {  
                    //todo add other buildings
                    allowf = true;
                }
            }
            if(!allowf) {
                res.json({
                    message: 'villageBuildingUpgrade failed',
                    data: ''
                });
                return;
            }
            villageBuildingType = Number(newBuildingType);
            villageBuildingLevel++;
        } else {
            villageBuildingType = Number(villageBuildingFields["field"+buildingFieldId+"Type"]);

             // CHECK IF BUILDING IS ALREADY AT MAX LEVEL
            if(villageBuildingLevel > buildingInfo[villageBuildingType]['wood'].length-1){
                res.json({
                    message: 'villageBuildingUpgrade failed',
                    data: ''
                });
                return;
            }
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

                if(newBuildingType>0) {
                    villageBuildingFields["field"+buildingFieldId+"Type"] = newBuildingType;
                    fetch(villageBuildingFieldsApiUrl, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(villageBuildingFields),
                    });
                }

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

async function hasRequiredResFieldLevel(type,level,idVillage){
    let villageResourceFieldsApiUrl = 'http://localhost:8080/api/villageResourceFields/' + idVillage;
    let villageResourceFields = await(await(await fetch(villageResourceFieldsApiUrl)).json()).data;
    let villageResourceFieldTypes = [];
    let villageResourceFieldLevels = [];

    for(let i = 1; i < 20; i++){
        villageResourceFieldTypes.push(villageResourceFields['field'+i+'Type']);
        villageResourceFieldLevels.push(villageResourceFields['field'+i+'Level']);
    }
    for(let l = 0; l < villageResourceFieldTypes.length; l++){
        if(villageResourceFieldTypes[l] == type && villageResourceFieldLevels[l] >= level) {
            return true;
        }
    }
    return false;
};