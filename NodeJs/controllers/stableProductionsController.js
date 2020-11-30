const path = require('path');
const fetch = require("node-fetch");
const stableProductionsModel = require('../models/stableProductionsModel');

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
        const STABLE = 4;
        let troopInfo = require('/home/node/app/infoTables/troopInfoLookup.json');
        let buildingInfo = require('/home/node/app/infoTables/buildingInfoLookup.json');
        let idVillage = req.body.idVillage;
        let currentUnixTime = Math.round(new Date().getTime()/1000);

        let villageResourcesApiUrl = 'http://localhost:8080/api/villageResources/' + idVillage;
        let villageResources = await(await(await fetch(villageResourcesApiUrl)).json()).data;

        let villageBuildingFieldsApiUrl = 'http://localhost:8080/api/villageBuildingFields/' + idVillage;
        let villageBuildingFields = await(await(await fetch(villageBuildingFieldsApiUrl)).json()).data;

        let stableProductionsApiUrl = 'http://localhost:8080/api/stableProductions/' + idVillage;
        let stableProductionResponse = await(await(await fetch(stableProductionsApiUrl)).json()).data;

        let villageBuildingLevel = 0;
        for(let i = 1; i <= Object.keys(villageBuildingFields).length; i++){
            if(villageBuildingFields['field'+i+'Type'] == STABLE){
                villageBuildingLevel = villageBuildingFields['field'+i+'Level'];
                break;
            }
        }

        let requirementWood = troopInfo["Teuton"][req.body.troopId-1]["wood"] * req.body.troopCount;
        let requirementClay = troopInfo["Teuton"][req.body.troopId-1]["clay"] * req.body.troopCount;
        let requirementIron = troopInfo["Teuton"][req.body.troopId-1]["iron"] * req.body.troopCount;
        let requirementCrop = troopInfo["Teuton"][req.body.troopId-1]["crop"] * req.body.troopCount;

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
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(villageResources),
        });

        console.log("resources deducted");

        var stableProductions = new stableProductionsModel();

        stableProductions.idVillage   = req.body.idVillage;
        stableProductions.troopId     = req.body.troopId;
        stableProductions.troopCount  = req.body.troopCount;

        let stableProductionResponseLength = Object.keys(stableProductionResponse).length;
        let troopQueueTime = stableProductionResponseLength > 0 ? stableProductionResponse[stableProductionResponseLength-1]['timeCompleted'] : currentUnixTime
        let troopTrainingTime = troopInfo.Teuton[req.body.troopId-1]["time"] * buildingInfo[STABLE]['buildingModifier'][villageBuildingLevel];

        stableProductions.troopName       = troopInfo.Teuton[req.body.troopId-1]["name"];
        stableProductions.troopProdTime   = troopTrainingTime;
        stableProductions.timeStarted     = troopQueueTime;
        stableProductions.timeCompleted   = troopQueueTime + Math.floor(req.body.troopCount * troopTrainingTime);
        stableProductions.lastUpdate      = currentUnixTime;
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