const path = require('path');
const fetch = require("node-fetch");
const villageMaxResourcesModel = require('../models/villageMaxResourcesModel');
const WAREHOUSE = 2;
const GRANARY = 3;  

exports.view = function (req, res) {
    villageMaxResourcesModel.findOne({idVillage: req.params.idVillage}, function (err, villageMaxResources) {
        if (err){
            res.send(err);
        }
        else{ 
            (async () => {  
                let buildingInfoLookup = require('/home/node/app/infoTables/buildingInfoLookup.json');
                let idVillage = req.params.idVillage;
                let warehouseCapacity = 0;
                let granaryCapacity = 0;
    

                let villageBuildingFieldsApiUrl = 'http://localhost:8080/api/villageBuildingFields/' + idVillage;
                let villageBuildingFields = await(await(await fetch(villageBuildingFieldsApiUrl)).json()).data;     
                
                for(let i = 1; i < 19; i++){
                    if(villageBuildingFields['field'+i+'Type'] == WAREHOUSE){
                        warehouseCapacity += buildingInfoLookup[WAREHOUSE]['buildingModifier'][villageBuildingFields['field'+i+'Level']]
                    }
                    else if (villageBuildingFields['field'+i+'Type'] == GRANARY){
                        granaryCapacity += buildingInfoLookup[GRANARY]['buildingModifier'][villageBuildingFields['field'+i+'Level']]
                    }
                }

                warehouseCapacity = warehouseCapacity < 800 ? 800 : warehouseCapacity;
                granaryCapacity = granaryCapacity < 800 ? 800 : granaryCapacity;

                villageMaxResources.maxWood = warehouseCapacity;
                villageMaxResources.maxClay = warehouseCapacity;
                villageMaxResources.maxIron = warehouseCapacity;
                villageMaxResources.maxCrop = granaryCapacity;
                
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
            res.json(err);
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
        if (err)
            res.send(err);
        
        villageMaxResources.idVillage = req.body.idVillage;
        villageMaxResources.maxWood = req.body.maxWood;
        villageMaxResources.maxClay = req.body.maxClay;
        villageMaxResources.maxIron = req.body.maxIron;
        villageMaxResources.maxCrop = req.body.maxCrop;

        villageMaxResources.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageMaxResources Info updated',
                data: villageMaxResources
            });
        });
    });
};

exports.delete = function (req, res) {
    villageMaxResourcesModel.remove({idVillage: req.params.idVillage}, function (err, villageMaxResources) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageMaxResources deleted'
        });
    });
};