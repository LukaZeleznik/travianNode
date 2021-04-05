const path = require('path');
const villageResourcesModel = require('../models/villageResourcesModel');
const villageMaxResourcesModel = require('../models/villageMaxResourcesModel');
const villageProductionsModel = require('../models/villageProductionsModel');
const fetch = require("node-fetch");
var tools = require('../tools/tools');
var config = require('../config.json');

exports.view = function (req, res) {
    villageResourcesModel.findOne({idVillage: req.params.idVillage}, function (err, villageResources) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        else{
            (async () => {
                const idVillage = req.params.idVillage;
                const currentTime = Math.round(+new Date()/1000);
                const timeDiff = (currentTime - villageResources.lastUpdate) / 3600;

                let villageMaxRes = await(await(await tools.doApiRequest("villageMaxResources/" + idVillage, "GET", "", false)).json()).data;
                let villageProd = await(await(await tools.doApiRequest("villageProductions/" + idVillage, "GET", "", false)).json()).data;
               
                let newWood = villageResources.currentWood + (timeDiff * villageProd.productionWood);
                let newClay = villageResources.currentClay + (timeDiff * villageProd.productionClay);
                let newIron = villageResources.currentIron + (timeDiff * villageProd.productionIron);
                let newCrop = villageResources.currentCrop + (timeDiff * villageProd.productionCrop);

                if(villageResources.currentWood == newWood && villageResources.currentClay == newClay && 
                   villageResources.currentIron == newIron && villageResources.currentCrop == newCrop){
                        res.json({
                            message: 'VillageResources not changed!',
                            data: villageResources
                        });
                        return;
                }
                
                if (newWood >= villageMaxRes.maxWood){ newWood = villageMaxRes.maxWood }
                if (newClay >= villageMaxRes.maxClay){ newClay = villageMaxRes.maxClay }
                if (newIron >= villageMaxRes.maxIron){ newIron = villageMaxRes.maxIron }
                if (newCrop >= villageMaxRes.maxCrop){ newCrop = villageMaxRes.maxCrop }
                

                villageResources.idVillage = idVillage;
                villageResources.currentWood = newWood;
                villageResources.currentClay = newClay;
                villageResources.currentIron = newIron;
                villageResources.currentCrop = newCrop;
                villageResources.lastUpdate = currentTime;
                
                villageResources.save(function (err) {
                    if (err){
                        res.json(err);
                    }
                    else{
                        res.json({
                            message: 'VillageResources received!',
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
            res.status(500).json(err);
            console.log(err);
            return;
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
    villageResourcesModel.findOne({idVillage: req.params.idVillage}, function (err, villageResources) {
        if (err){
            res.send(err);
            return;
        }
        const currentTime = Math.round(+new Date()/1000);

        villageResources.idVillage = req.body.idVillage;
        villageResources.currentWood = req.body.currentWood;
        villageResources.currentClay = req.body.currentClay;
        villageResources.currentIron = req.body.currentIron;
        villageResources.currentCrop = req.body.currentCrop;
        villageResources.lastUpdate = currentTime;

        villageResources.save(function (err) {
            if (err) {
                res.status(500).json({
                    message: err.toString(),
                    data: ""
                });
                return;
            }
            res.json({
                message: 'villageResources Info updated',
                data: villageResources
            });
        });
    });
};

exports.delete = function (req, res) {
    villageResourcesModel.deleteOne({idVillage: req.params.idVillage}, function (err, villageResources) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            status: "success",
            message: 'villageResources deleted'
        });
    });
};