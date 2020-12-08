const path = require('path');
const fetch = require("node-fetch");
const barracksProductionsModel = require('../models/barracksProductionsModel');
var tools = require('../tools/tools');
var config = require('../config.json');

const BARRACKS = 1;

exports.view = function (req, res) {
    barracksProductionsModel.find({idVillage: req.params.idVillage}, function (err, barracksProductions) {
        if (err){
            res.send(err);
        }
        else{
            res.json({
                message: 'loading barracksProductions...',
                data: barracksProductions
            });

        }
    });
};

// Handle create barracksProductions actions
exports.new = function (req, res) {
    (async () => {
        const idVillage = req.body.idVillage;
        const userTribe = await tools.getTribeFromIdVillage(idVillage);

        let currentUnixTime = Math.round(new Date().getTime()/1000);

        let villageResources =      await(await(await tools.doApiRequest("villageResources/" + idVillage, "GET", "", false)).json()).data;
        let villageBuildingFields = await(await(await tools.doApiRequest("villageBuildingFields/" + idVillage, "GET", "", false)).json()).data;
        let barracksProduction =    await(await(await tools.doApiRequest("barracksProductions/" + idVillage, "GET", "", false)).json()).data;

        let villageBuildingLevel = 0;
        for(let i = 1; i <= Object.keys(villageBuildingFields).length; i++){
            if(villageBuildingFields['field'+i+'Type'] == BARRACKS){
                villageBuildingLevel = villageBuildingFields['field'+i+'Level'];
                break;
            }
        }

        let requirementWood = tools.troopInfoLookup[userTribe][req.body.troopId-1]["wood"] * req.body.troopCount;
        let requirementClay = tools.troopInfoLookup[userTribe][req.body.troopId-1]["clay"] * req.body.troopCount;
        let requirementIron = tools.troopInfoLookup[userTribe][req.body.troopId-1]["iron"] * req.body.troopCount;
        let requirementCrop = tools.troopInfoLookup[userTribe][req.body.troopId-1]["crop"] * req.body.troopCount;

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
        villageResources.lastUpdate = currentUnixTime;

        await tools.doApiRequest("villageResources/" + idVillage, "PATCH", villageResources, true);

        var barracksProductions = new barracksProductionsModel();

        barracksProductions.idVillage   = req.body.idVillage;
        barracksProductions.troopId     = req.body.troopId;
        barracksProductions.troopCount  = req.body.troopCount;

        const troopQueueTime = Object.keys(barracksProduction).length > 0 ? barracksProduction[Object.keys(barracksProduction).length-1]['timeCompleted'] : currentUnixTime
        const troopTrainingTime = (tools.troopInfoLookup['teuton'][req.body.troopId-1]['time'] * tools.buildingInfoLookup[BARRACKS]['buildingModifier'][villageBuildingLevel]) / config.SERVER_SPEED;
        
        barracksProductions.troopName       = tools.troopInfoLookup.teuton[req.body.troopId-1]['name'];
        barracksProductions.troopProdTime   = troopTrainingTime;
        barracksProductions.timeStarted     = troopQueueTime;
        barracksProductions.timeCompleted   = troopQueueTime + Math.floor(req.body.troopCount * troopTrainingTime);
        barracksProductions.lastUpdate      = currentUnixTime;
        barracksProductions.troopsDoneAlready = 0;

        barracksProductions.save(function (err) {
            if (err){
                res.json(err);
            }
            else{
                res.json({
                    message: 'barracksProductions success',
                    data: barracksProductions
                });
            }
        });
    })();
};

exports.update = function (req, res) {
    barracksProductionsModel.findOne({_id: req.params.barrProdId}, function (err, barracksProductions) {
        if (err)
            res.send(err);        
        
        barracksProductions.idVillage = req.body.idVillage;
        barracksProductions.troopName = req.body.troopName;
        barracksProductions.troopId = req.body.troopId;
        barracksProductions.troopCount = req.body.troopCount;
        barracksProductions.troopProdTime = req.body.troopProdTime;
        barracksProductions.timeStarted = req.body.timeStarted;
        barracksProductions.timeCompleted = req.body.timeCompleted;
        barracksProductions.barrProdId = req.body.barrProdId;
        barracksProductions.lastUpdate = req.body.lastUpdate;
        barracksProductions.troopsDoneAlready = req.body.troopsDoneAlready;

        barracksProductions.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'barracksProductions Info updated',
                data: barracksProductions
            });
        });
    });
};

exports.delete = function (req, res) {
    barracksProductionsModel.remove({_id: req.params.barrProdId}, function (err, barracksProductions) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'barracksProductions deleted'
        });
    });
};