const path = require('path');
const villageResourcesModel = require('../models/villageResourcesModel');
const villageMaxResourcesModel = require('../models/villageMaxResourcesModel');
const villageProductionsModel = require('../models/villageProductionsModel');
const fetch = require("node-fetch");

exports.view = function (req, res) {
    villageResourcesModel.findOne({idVillage: req.params.idVillage}, function (err, villageResources) {
        if (err)
            res.send(err);
        else{
            (async () => {                
                let idVillage = req.params.idVillage;

                let villageMaxRes = await(await(await fetch('http://localhost:8080/api/villageMaxResources/' + idVillage)).json()).data;
                let villageProd = await(await(await fetch('http://localhost:8080/api/villageProductions/' + idVillage)).json()).data;
               
                let currentTime = Math.round(+new Date()/1000);
                let timeDiff = (currentTime - villageResources.lastUpdate) / 3600;
                
                let newWood = villageResources.currentWood + (timeDiff * villageProd.productionWood);
                let newClay = villageResources.currentClay + (timeDiff * villageProd.productionClay);
                let newIron = villageResources.currentIron + (timeDiff * villageProd.productionIron);
                let newCrop = villageResources.currentCrop + (timeDiff * villageProd.productionCrop);

                if(villageResources.currentWood == newWood && villageResources.currentClay == newClay && 
                    villageResources.currentIron == newIron && villageResources.currentCrop == newCrop){
                        res.json({
                            message: 'VillageResources updated!',
                            data: villageResources
                        });
                        return;
                }
                
                if (newWood >= villageMaxRes.maxWood){ newWood = villageMaxRes.maxWood }
                if (newClay >= villageMaxRes.maxClay){ newClay = villageMaxRes.maxClay }
                if (newIron >= villageMaxRes.maxIron){ newIron = villageMaxRes.maxIron }
                if (newCrop >= villageMaxRes.maxCrop){ newCrop = villageMaxRes.maxCrop }
                

                villageResources.idVillage = req.params.idVillage;
                villageResources.currentWood = newWood;
                villageResources.currentClay = newClay;
                villageResources.currentIron = newIron;
                villageResources.currentCrop = newCrop;
                villageResources.lastUpdate = currentTime;
                
                villageResources.save(function (err2) {
                    if (err2){
                        res.json(err2);
                    }
                    else{
                        res.json({
                            message: 'VillageResources updated!',
                            data: villageResources
                        });
                    }
                });
            })();
        }
    });
};

// Handle create villageResources actions
exports.new = function (req, res) {
    var villageResources = new villageResourcesModel();
    villageResources.idVillage = req.body.idVillage;
    villageResources.currentWood = req.body.currentWood;
    villageResources.currentClay = req.body.currentClay;
    villageResources.currentIron = req.body.currentIron;
    villageResources.currentCrop = req.body.currentCrop;
    villageResources.lastUpdate = req.body.lastUpdate;

    villageResources.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'villageResources success',
                data: villageResources
            });
        }
    });
};

exports.update = function (req, res) {
    console.log('req.params', req.params);
    villageResourcesModel.findOne({idVillage: req.params.idVillage}, function (err, villageResources) {
        if (err){
            res.send(err);
            return;
        }
        let currentTime = Math.round(+new Date()/1000);
        console.log('villageResources', villageResources);

        villageResources.idVillage = req.body.idVillage;
        villageResources.currentWood = req.body.currentWood;
        villageResources.currentClay = req.body.currentClay;
        villageResources.currentIron = req.body.currentIron;
        villageResources.currentCrop = req.body.currentCrop;
        villageResources.lastUpdate = currentTime;

        villageResources.save(function (err2) {
            if (err2)
                res.json(err2);
            res.json({
                message: 'villageResources Info updated',
                data: villageResources
            });
        });
    });
};

exports.delete = function (req, res) {
    villageResourcesModel.remove({idVillage: req.params.idVillage}, function (err, villageResources) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageResources deleted'
        });
    });
};