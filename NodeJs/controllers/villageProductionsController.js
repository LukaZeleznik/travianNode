const path = require('path');
const villageProductionsModel = require('../models/villageProductionsModel');
const fetch = require("node-fetch");

exports.view = function (req, res) {
    villageProductionsModel.findOne({idVillage: req.params.idVillage}, function (err, villageProductions) {
        if (err){
            res.send(err);
        }
        else{     
            (async () => {    
                let resourceInfo = require('/home/node/app/infoTables/resourceInfoLookup.json');
                let idVillage = req.params.idVillage;

                let villageFieldTypesApiUrl = 'http://localhost:8080/api/villageFieldTypes/' + idVillage;
                let villageFieldTypes = await(await(await fetch(villageFieldTypesApiUrl)).json()).data;

                let villageFieldLevelsApiUrl = 'http://localhost:8080/api/villageFieldLevels/' + idVillage;
                let villageFieldLevels = await(await(await fetch(villageFieldLevelsApiUrl)).json()).data;

                villageProductions.productionWood = 0;
                villageProductions.productionClay = 0;
                villageProductions.productionIron = 0;
                villageProductions.productionCrop = 0;

                for (const villageFieldType in villageFieldTypes){
                    let index = Object.keys(villageFieldTypes).indexOf(villageFieldType) - 1;

                    if(villageFieldTypes[villageFieldType] == "wood"){
                        villageProductions.productionWood += resourceInfo["Woodcutter"]["production"][villageFieldLevels["resField"+index+"Level"]] * 10;
                    }
                    else if(villageFieldTypes[villageFieldType] == "clay"){
                        villageProductions.productionClay += resourceInfo["Claypit"]["production"][villageFieldLevels["resField"+index+"Level"]] * 10;
                    }
                    else if(villageFieldTypes[villageFieldType] == "iron"){
                        villageProductions.productionIron += resourceInfo["Ironmine"]["production"][villageFieldLevels["resField"+index+"Level"]] * 10;
                    }
                    else if(villageFieldTypes[villageFieldType] == "crop"){
                        villageProductions.productionCrop += resourceInfo["Cropland"]["production"][villageFieldLevels["resField"+index+"Level"]] * 10;
                    }
                };

                let villageProductionsApiUrl = 'http://localhost:8080/api/villageProductions/' + idVillage;

                await fetch(villageProductionsApiUrl, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(villageProductions),
                });

                res.json({

                    message: 'Loading resources..',
                    data: villageProductions
                });
            })();
        }
    });
};

// Handle create villageProductions actions
exports.new = function (req, res) {
    var villageProductions = new villageProductionsModel();
    villageProductions.idVillage = req.body.idVillage;
    villageProductions.productionWood = req.body.productionWood;
    villageProductions.productionClay = req.body.productionClay;
    villageProductions.productionIron = req.body.productionIron;
    villageProductions.productionCrop = req.body.productionCrop;

    villageProductions.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'villageProductions success',
                data: villageProductions
            });
        }
    });
};

exports.update = function (req, res) {
    villageProductionsModel.findOne({idVillage: req.params.idVillage}, function (err, villageProductions) {
        if (err)
            res.send(err);
        
        villageProductions.idVillage = req.body.idVillage;
        villageProductions.productionWood = req.body.productionWood;
        villageProductions.productionClay = req.body.productionClay;
        villageProductions.productionIron = req.body.productionIron;
        villageProductions.productionCrop = req.body.productionCrop;

        villageProductions.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageProductions Info updated',
                data: villageProductions
            });
        });
    });
};

exports.delete = function (req, res) {
    villageProductionsModel.remove({idVillage: req.params.idVillage}, function (err, villageProductions) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageProductions deleted'
        });
    });
};