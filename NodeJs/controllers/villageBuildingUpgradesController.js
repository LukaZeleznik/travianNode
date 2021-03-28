const path = require('path');
const fetch = require("node-fetch");
var uuid = require('uuid-random');
const schedule = require('node-schedule');
const villageBuildingUpgradesModel = require('../models/villageBuildingUpgradesModel');
var tools = require('../tools/tools');
var config = require('../config.json');

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
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            message: 'Loading resources..',
            data: villageBuildingUpgrades
        });
    });
};

exports.find = function (req, res) {
    villageBuildingUpgradesModel.findOne({_id: req.params.upgradeId}, function (err, villageBuildingUpgrade) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            message: 'Loading resources..',
            data: villageBuildingUpgrade
        });
    });
};

exports.new = async function (req, res) {
    (async () => {
        var idVillage = req.body.idVillage;
        const buildingFieldId = req.body.vbid;
        const newBuildingType = req.body.type ? req.body.type : 0;
        const currentUnixTime =  Math.round(new Date().getTime()/1000);
        let villageBuildingTypes = [];
        let villageBuildingLevels = [];
        let allowf = true;
        let wallf = false; //maybe better name

        let villageResources = await(await(await tools.doApiRequest('villageResources/' + idVillage, 'GET', '', false)).json()).data;
        let villageBuildingFields = await(await(await tools.doApiRequest('villageBuildingFields/' + idVillage, 'GET', '', false)).json()).data;
        let villageBuildingLevel = Number(villageBuildingFields["field"+buildingFieldId+"Level"]);
        let villageBuildingType = 0;
   
        if(queueFull(idVillage,res)==true) return;
        
        if(newBuildingType > 0) {
            for(let i = 1; i < 20; i++){
                villageBuildingTypes.push(villageBuildingFields['field'+i+'Type']);
                villageBuildingLevels.push(villageBuildingFields['field'+i+'Level']);
            }

            // Check if user is trying to build a second instance of existing building
            if(villageBuildingTypes.includes(tools.buildingInfoLookup[newBuildingType]['id'])){
                for(let l = 0; l < villageBuildingTypes.length; l++){
                    if(villageBuildingTypes[l] == tools.buildingInfoLookup[newBuildingType]['id']) {
                        if((tools.buildingInfoLookup[newBuildingType]['allowMultiple'] && villageBuildingLevels[l] == 20)) {
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
                            if(await hasRequiredResFieldLevel(idVillage,CROPLAND,10)){
                                for(let l = 0; l < villageBuildingTypes.length; l++){
                                    if(villageBuildingTypes[l] == GRAIN_MILL || villageBuildingLevels[l] == 5) {
                                        allowf = true;
                                    }
                                }
                            }
                            break;
                        case BRICKYARD:     if(await hasRequiredResFieldLevel(idVillage,CLAY_PIT,10))    allowf = true; break;
                        case GRAIN_MILL:    if(await hasRequiredResFieldLevel(idVillage,CROPLAND,5))     allowf = true; break;
                        case IRON_FOUNDRY:  if(await hasRequiredResFieldLevel(idVillage,IRON_MINE,10))   allowf = true; break;
                        case SAWMILL:       if(await hasRequiredResFieldLevel(idVillage,WOODCUTTER,10))  allowf = true; break;
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
        } else {
            villageBuildingType = Number(villageBuildingFields["field"+buildingFieldId+"Type"]);
            
            if(villageBuildingLevel > tools.buildingInfoLookup[villageBuildingType]['wood'].length-1){
                res.json({
                    message: 'villageBuildingUpgrade failed',
                    data: ''
                });
                return;
            }
        }

        const requirementWood = tools.buildingInfoLookup[villageBuildingType]["wood"][villageBuildingLevel+1];
        const requirementClay = tools.buildingInfoLookup[villageBuildingType]["clay"][villageBuildingLevel+1];
        const requirementIron = tools.buildingInfoLookup[villageBuildingType]["iron"][villageBuildingLevel+1];
        const requirementCrop = tools.buildingInfoLookup[villageBuildingType]["crop"][villageBuildingLevel+1];
        const requirementConstructionTime = Math.floor(Number(tools.buildingInfoLookup[villageBuildingType]["constructionTime"][villageBuildingLevel+1]) / config.SERVER_SPEED);

        if(villageResources.currentWood < requirementWood || villageResources.currentClay < requirementClay || 
           villageResources.currentIron < requirementIron || villageResources.currentCrop < requirementCrop ){
            res.json({
                message: 'Not enough resources',
                data: ""
            });
            return;
        }
        
        villageResources.currentWood -= requirementWood;
        villageResources.currentClay -= requirementClay;
        villageResources.currentIron -= requirementIron;
        villageResources.currentCrop -= requirementCrop;
        villageResources.lastUpdate = currentUnixTime;

        await tools.doApiRequest("villageResources/" + idVillage, "PATCH", villageResources, true);

        const timeCompleted = currentUnixTime + requirementConstructionTime;
        const taskId = uuid();
        
        var villageBuildingUpgrades = new villageBuildingUpgradesModel();
        villageBuildingUpgrades.idVillage = idVillage;
        villageBuildingUpgrades.vbid = buildingFieldId;
        villageBuildingUpgrades.taskId = taskId;
        villageBuildingUpgrades.buildingType = villageBuildingType;
        villageBuildingUpgrades.buildingLevel = villageBuildingLevel;
        villageBuildingUpgrades.woodUsed = requirementWood;
        villageBuildingUpgrades.ironUsed = requirementIron;
        villageBuildingUpgrades.clayUsed = requirementClay;
        villageBuildingUpgrades.cropUsed = requirementCrop;
        villageBuildingUpgrades.timeStarted = currentUnixTime;
        villageBuildingUpgrades.timeCompleted = timeCompleted;

        villageBuildingUpgrades.save(async function (err,buildingUpgrade) {
            if (err){
                res.json(err);
            }
            else{
                let scheduleData = {
                    "taskType": "upgradeBuilding",
                    "taskUnixTime": timeCompleted,
                    "taskData": {
                        "idVillage": idVillage,
                        "taskId": taskId,
                        "buildingId": buildingFieldId,
                        "buildingUpgradeId": buildingUpgrade._id,
                        "newBuildingType": newBuildingType
                    }
                };
                await tools.doApiRequest("schedule", "POST", scheduleData, true);

                if(newBuildingType > 0) {
                    villageBuildingFields["field"+buildingFieldId+"Type"] = newBuildingType;
                    await tools.doApiRequest("villageBuildingFields/" + idVillage, "PATCH", villageBuildingFields, true);
                }
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
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        
            villageBuildingUpgrades.idVillage = req.body.idVillage;
            villageBuildingUpgrades.vbid = req.body.vbid;
            villageBuildingUpgrades.buildingType = req.body.buildingType;
            villageBuildingUpgrades.buildingLevel = req.body.buildingLevel;
            villageBuildingUpgrades.timeStarted = req.body.timeStarted;
            villageBuildingUpgrades.timeCompleted = req.body.timeCompleted;

            villageBuildingUpgrades.save(function (err) {
            if (err) {
                res.status(500).json({
                    message: err.toString(),
                    data: ""
                });
                return;
            }
            res.json({
                message: 'villageBuildingUpgrades Info updated',
                data: villageBuildingUpgrades
            });
        });
    });
};

exports.delete = async function (req, res) { 
    villageBuildingUpgradesModel.deleteOne({_id: req.params.upgradeId}, function (err, villageBuildingUpgrades) {
        if (err){
            res.status(400).send(err);
            return;
        } else {
            res.json({
                status: "success",
                message: 'villageBuildingUpgrades deleted'
            });
        }
    });
};

exports.cancel = async function (req, res) { 
    var upgradeData = await(await(await tools.doApiRequest('villageBuildingUpgrade/' + req.params.upgradeId, 'GET', '', false)).json()).data;

    villageBuildingUpgradesModel.deleteOne({_id: req.params.upgradeId}, function (err, villageBuildingUpgrades) {
        if (err){
            res.status(400).send(err);
            return;
        } else if (villageBuildingUpgrades.deletedCount > 0){
            (async () => {
                const currentUnixTime =  Math.round(new Date().getTime()/1000);
                
                if(upgradeData['buildingLevel'] == 0 && upgradeData['vbid'] != 19){
                    let currentVillageFields = await(await(await tools.doApiRequest('villageBuildingFields/' + upgradeData['idVillage'], 'GET', '', false)).json()).data;
                    currentVillageFields['field'+upgradeData['vbid']+'Type'] = 0;
                    await tools.doApiRequest("villageBuildingFields/" + upgradeData['idVillage'], "PATCH", currentVillageFields, true);
                }                
                
                let villageResources = await(await(await tools.doApiRequest('villageResources/' + upgradeData['idVillage'], 'GET', '', false)).json()).data;

                villageResources.currentWood += upgradeData['woodUsed'];
                villageResources.currentClay += upgradeData['clayUsed'];
                villageResources.currentIron += upgradeData['ironUsed'];
                villageResources.currentCrop += upgradeData['cropUsed'];
                villageResources.lastUpdate = currentUnixTime;

                await tools.doApiRequest("villageResources/" + upgradeData['idVillage'], "PATCH", villageResources, true);

                schedule.scheduledJobs[upgradeData['taskId']].cancel();

                res.json({
                    status: "success",
                    message: 'villageBuildingUpgrades cancelled'
                });
                return;
            })();
        } else {
            res.json({
                status: "failed",
                message: 'villageBuildingUpgrades _id does not exist'
            });
        }
    });
};

async function hasRequiredResFieldLevel(idVillage,type,level){
    let villageResourceFields = await(await(await tools.doApiRequest('villageResourceFields/' + idVillage, 'GET', '', false)).json()).data;
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

async function queueFull(idVillage,res){
    let villageBuildingUpgrades = await(await(await tools.doApiRequest('villageBuildingUpgrades/' + idVillage, 'GET', '', false)).json()).data;
    if(villageBuildingUpgrades.length > 0){
        res.json({
            message: 'Another building is already being upgraded',
            data: ""
        });
        return true;
    }
    return false;
};