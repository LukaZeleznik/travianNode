const path = require('path');
const fetch = require("node-fetch");
const stableProductionsModel = require('../models/stableProductionsModel');
var tools = require('../tools/tools');
var config = require('../config.json');
const STABLE = 4;

exports.view = function (req, res) {
    stableProductionsModel.find({idVillage: req.params.idVillage}, function (err, stableProductions) {
        if (err){
            res.send(err);
        }
        else{
            res.json({
                message: 'loading stableProductions...',
                data: stableProductions
            });

        }
    });
};

// Handle create stableProductions actions
exports.new = function (req, res) {
    (async () => {
        const idVillage = req.body.idVillage;
        var userTribe = await tools.getTribeFromIdVillage(req.body.idVillageFrom);
        const currentUnixTime = Math.round(new Date().getTime()/1000);

        const villageResources = await(await(await tools.doApiRequest('villageResources/' + idVillage, 'GET', '', false)).json()).data;
        const villageBuildingFields = await(await(await tools.doApiRequest('villageBuildingFields/' + idVillage, 'GET', '', false)).json()).data;
        const stableProductionResponse = await(await(await tools.doApiRequest('stableProductions/' + idVillage, 'GET', '', false)).json()).data;

        let villageBuildingLevel = 0;
        for(let i = 1; i <= Object.keys(villageBuildingFields).length; i++){
            if(villageBuildingFields['field'+i+'Type'] == STABLE){
                villageBuildingLevel = villageBuildingFields['field'+i+'Level'];
                break;
            }
        }

        let requirementWood = tools.troopInfoLookup.userTribe[req.body.troopId-1]["wood"] * req.body.troopCount;
        let requirementClay = tools.troopInfoLookup.userTribe[req.body.troopId-1]["clay"] * req.body.troopCount;
        let requirementIron = tools.troopInfoLookup.userTribe[req.body.troopId-1]["iron"] * req.body.troopCount;
        let requirementCrop = tools.troopInfoLookup.userTribe[req.body.troopId-1]["crop"] * req.body.troopCount;

        if(req.body.troopCount < 1){
            res.json({
                message: 'Insert troops to train',
                data: ""
            });
            return;
        }

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
        villageResources.lastUpdate   = currentUnixTime;

        await tools.doApiRequest("villageResources/" + idVillage, "PATCH", villageResources, true);

        var stableProductions = new stableProductionsModel();
        stableProductions.idVillage   = req.body.idVillage;
        stableProductions.troopId     = req.body.troopId;
        stableProductions.troopCount  = req.body.troopCount;

        let troopQueueTime = Object.keys(stableProductionResponse).length > 0 ? stableProductionResponse[Object.keys(stableProductionResponse).length-1]['timeCompleted'] : currentUnixTime
        let troopTrainingTime = (tools.troopInfoLookup.userTribe[req.body.troopId-1]["time"] * tools.buildingInfoLookup[STABLE]['buildingModifier'][villageBuildingLevel]) / config.SERVER_SPEED;

        stableProductions.troopName         = tools.troopInfoLookup.userTribe[req.body.troopId-1]["name"];
        stableProductions.troopProdTime     = troopTrainingTime;
        stableProductions.timeStarted       = troopQueueTime;
        stableProductions.timeCompleted     = troopQueueTime + Math.floor(req.body.troopCount * troopTrainingTime);
        stableProductions.lastUpdate        = currentUnixTime;
        stableProductions.troopsDoneAlready = 0;

        stableProductions.save(function (err) {
            if (err){
                res.json(err);
            }
            else{
                res.json({
                    message: 'stableProductions success',
                    data: stableProductions
                });
            }
        });
    })();
};

exports.update = function (req, res) {
    stableProductionsModel.findOne({_id: req.params.barrProdId}, function (err, stableProductions) {
        if (err)
            res.send(err);        
        
            stableProductions.idVillage = req.body.idVillage;
            stableProductions.troopName = req.body.troopName;
            stableProductions.troopId = req.body.troopId;
            stableProductions.troopCount = req.body.troopCount;
            stableProductions.troopProdTime = req.body.troopProdTime;
            stableProductions.timeStarted = req.body.timeStarted;
            stableProductions.timeCompleted = req.body.timeCompleted;
            stableProductions.barrProdId = req.body.barrProdId;
            stableProductions.lastUpdate = req.body.lastUpdate;
            stableProductions.troopsDoneAlready = req.body.troopsDoneAlready;

            stableProductions.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'stableProductions Info updated',
                data: stableProductions
            });
        });
    });
};

exports.delete = function (req, res) {
    stableProductionsModel.remove({_id: req.params.barrProdId}, function (err, stableProductions) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'stableProductions deleted'
        });
    });
};