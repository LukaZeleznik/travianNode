const path = require('path');
const villageProductionsModel = require('../models/villageProductionsModel');
const fetch = require("node-fetch");
const WOOD = 0;
const CLAY = 1;
const IRON = 2;
const CROP = 3;

exports.view = function (req, res) {
    villageProductionsModel.findOne({idVillage: req.params.idVillage}, function (err, villageProductions) {
        if (err){
            res.send(err);
        }
        else{     
            (async () => {    
                let resourceInfo = require('/home/node/app/infoTables/resourceInfoLookup.json');
                let idVillage = req.params.idVillage;

                let villageResourceFieldsApiUrl = 'http://localhost:8080/api/villageResourceFields/' + idVillage;
                let villageResourceFields = await(await(await fetch(villageResourceFieldsApiUrl)).json()).data;

                villageProductions.productionWood = 0;
                villageProductions.productionClay = 0;
                villageProductions.productionIron = 0;
                villageProductions.productionCrop = 0;

                for(let i = 1; i < 19; i++){
                    switch (villageResourceFields['field'+i+'Type']) {
                        case WOOD: villageProductions.productionWood += resourceInfo[WOOD]['production'][villageResourceFields['field'+i+'Level']]; break;
                        case CLAY: villageProductions.productionClay += resourceInfo[CLAY]['production'][villageResourceFields['field'+i+'Level']]; break;
                        case IRON: villageProductions.productionIron += resourceInfo[IRON]['production'][villageResourceFields['field'+i+'Level']]; break;
                        case CROP: villageProductions.productionCrop += resourceInfo[CROP]['production'][villageResourceFields['field'+i+'Level']]; break;
                    }
                }          
                
                villageProductions.save(function (err) {
                    if (err)
                        res.json(err);
                    res.json({
                        message: 'Loading resources..',
                        data: villageProductions
                    });
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