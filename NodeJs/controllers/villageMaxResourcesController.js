const path = require('path');
const fetch = require("node-fetch");
const villageMaxResourcesModel = require('../models/villageMaxResourcesModel');
var tools = require('../tools/tools');
var config = require('../config.json');
const WAREHOUSE = 2;
const GRANARY = 3;  

exports.view = function (req, res) {
    villageMaxResourcesModel.findOne({idVillage: req.params.idVillage}, function (err, villageMaxResources) {
        if (err){
            res.status(400).send(err);
            return;
        }
        else{ 
            (async () => {  
                const idVillage = req.params.idVillage;
                let warehouseCapacity = 0;
                let granaryCapacity = 0;
    
                const villageBuildingFields = await(await(await tools.doApiRequest('villageBuildingFields/' + idVillage, 'GET', '', false)).json()).data;
                
                for(let i = 1; i < 19; i++){
                    if(villageBuildingFields['field'+i+'Type'] == WAREHOUSE){
                        warehouseCapacity += tools.buildingInfoLookup[WAREHOUSE]['buildingModifier'][villageBuildingFields['field'+i+'Level']]
                    }
                    else if (villageBuildingFields['field'+i+'Type'] == GRANARY){
                        granaryCapacity += tools.buildingInfoLookup[GRANARY]['buildingModifier'][villageBuildingFields['field'+i+'Level']]
                    }
                }

                warehouseCapacity = warehouseCapacity < 800 ? 800 : warehouseCapacity;
                granaryCapacity   = granaryCapacity < 800 ? 800 : granaryCapacity;

                villageMaxResources.maxWood = warehouseCapacity * config.STORAGE_MODIFIER;
                villageMaxResources.maxClay = warehouseCapacity * config.STORAGE_MODIFIER;
                villageMaxResources.maxIron = warehouseCapacity * config.STORAGE_MODIFIER;
                villageMaxResources.maxCrop = granaryCapacity * config.STORAGE_MODIFIER;

                villageMaxResources.save(function (err) {
                    if (err)
                        res.json(err);
                    res.json({
                        message: 'Loading max resources..',
                        data: villageMaxResources
                    });
                });
            })();
        }
    });
};


// Handle create villageMaxResources actions
exports.new = function (req, res) {
    var villageMaxResources = new villageMaxResourcesModel();
    villageMaxResources.idVillage = req.body.idVillage;
    villageMaxResources.maxWood = req.body.maxWood;
    villageMaxResources.maxClay = req.body.maxClay;
    villageMaxResources.maxIron = req.body.maxIron;
    villageMaxResources.maxCrop = req.body.maxCrop;

    villageMaxResources.save(function (err) {
        if (err){
            res.status(500).json(err);
            return;
        }
        else{
            res.json({
                message: 'villageMaxResources success',
                data: villageMaxResources
            });
        }
    });
};

exports.update = function (req, res) {
    villageMaxResourcesModel.findOne({idVillage: req.params.idVillage}, function (err, villageMaxResources) {
        if (err){
            res.status(500).json(err);
            return;
        }
        
        villageMaxResources.idVillage = req.body.idVillage;
        villageMaxResources.maxWood = req.body.maxWood;
        villageMaxResources.maxClay = req.body.maxClay;
        villageMaxResources.maxIron = req.body.maxIron;
        villageMaxResources.maxCrop = req.body.maxCrop;

        villageMaxResources.save(function (err) {
            if (err) {
                res.status(500).json({
                    message: err.toString(),
                    data: ""
                });
                return;
            }
            res.json({
                message: 'villageMaxResources Info updated',
                data: villageMaxResources
            });
        });
    });
};

exports.delete = function (req, res) {
    villageMaxResourcesModel.remove({idVillage: req.params.idVillage}, function (err, villageMaxResources) {
        if (err){
            res.status(500).json(err);
            return;
        }
        res.json({
            status: "success",
            message: 'villageMaxResources deleted'
        });
    });
};