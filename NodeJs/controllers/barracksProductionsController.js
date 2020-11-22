const path = require('path');
const fetch = require("node-fetch");
const barracksProductionsModel = require('../models/barracksProductionsModel');

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
        let troopInfo = require('/home/node/app/infoTables/troopInfoLookup.json');
        let idVillage = req.body.idVillage;
        let currentUnixTime = Math.round(new Date().getTime()/1000);

        let tribe = fetch 

        let villageResourcesApiUrl = 'http://localhost:8080/api/villageResources/' + idVillage;
        let villageResources = await(await(await fetch(villageResourcesApiUrl)).json()).data;

        let requirementWood = troopInfo["Teuton"][req.body.troopId-1]["wood"] * req.body.troopCount;
        let requirementClay = troopInfo["Teuton"][req.body.troopId-1]["clay"] * req.body.troopCount;
        let requirementIron = troopInfo["Teuton"][req.body.troopId-1]["iron"] * req.body.troopCount;
        let requirementCrop = troopInfo["Teuton"][req.body.troopId-1]["crop"] * req.body.troopCount;

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

        var barracksProductions = new barracksProductionsModel();

        barracksProductions.idVillage = req.body.idVillage;
        barracksProductions.troopId = req.body.troopId;
        barracksProductions.troopCount = req.body.troopCount;
        
        barracksProductions.troopName = troopInfo.Teuton[req.body.troopId-1]["name"];
        barracksProductions.troopProdTime = Math.floor(troopInfo.Teuton[req.body.troopId-1]["time"] / 100);
        barracksProductions.timeStarted = currentUnixTime;
        barracksProductions.timeCompleted = currentUnixTime + Math.floor(req.body.troopCount * troopInfo.Teuton[req.body.troopId-1]["time"] / 100);
        barracksProductions.lastUpdate = currentUnixTime;
        barracksProductions.troopsDoneAlready = 0;

        barracksProductions.save(function (err) {
            if (err){
                res.json(err);
            }
            else{
                res.json({
                    message: 'New barracksProductions created',
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