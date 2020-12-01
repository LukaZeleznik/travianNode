const path = require('path');
const villageProductionsModel = require('../models/villageProductionsModel');
const fetch = require("node-fetch");
//Resources
const WOODCUTTER = 0;
const CLAY_PIT = 1;
const IRON_MINE = 2;
const CROPLAND = 3;
//Buildings
const BAKERY = 8;
const BRICKYARD = 9;
const GRAIN_MILL = 10;
const IRON_FOUNDRY = 11;
const SAWMILL = 12;


exports.view = function (req, res) {
    villageProductionsModel.findOne({idVillage: req.params.idVillage}, function (err, villageProductions) {
        if (err){
            res.send(err);
        }
        else{     
            (async () => {    
                let resourceInfo = require('/home/node/app/infoTables/resourceInfoLookup.json');
                let idVillage = req.params.idVillage;
                let baseWoodProd = 0;
                let baseClayProd = 0;
                let baseIronProd = 0;
                let baseCropProd = 0;

                let villageResourceFieldsApiUrl = 'http://localhost:8080/api/villageResourceFields/' + idVillage;
                let villageResourceFields = await(await(await fetch(villageResourceFieldsApiUrl)).json()).data;

                for(let i = 1; i < 19; i++){
                    switch (villageResourceFields['field'+i+'Type']) {
                        case WOODCUTTER: baseWoodProd += resourceInfo[WOODCUTTER]['production'][villageResourceFields['field'+i+'Level']]; break;
                        case CLAY_PIT:   baseClayProd += resourceInfo[CLAY_PIT]['production'][villageResourceFields['field'+i+'Level']]; break;
                        case IRON_MINE:  baseIronProd += resourceInfo[IRON_MINE]['production'][villageResourceFields['field'+i+'Level']]; break;
                        case CROPLAND:   baseCropProd += resourceInfo[CROPLAND]['production'][villageResourceFields['field'+i+'Level']]; break;
                    }
                }          
                
                bonusProduction = await getBuildingBonusProductions(idVillage);

                villageProductions.productionWood = baseWoodProd + (baseWoodProd*bonusProduction[0]);
                villageProductions.productionClay = baseClayProd + (baseClayProd*bonusProduction[1]);
                villageProductions.productionIron = baseIronProd + (baseIronProd*bonusProduction[2]);
                villageProductions.productionCrop = baseCropProd + (baseCropProd*bonusProduction[3]);

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

async function getBuildingBonusProductions(idVillage){
    let villageBuildingTypes = [];
    let villageBuildingLevels = [];
    let woodBonus = 0;
    let clayBonus = 0;
    let ironBonus = 0;
    let cropBonus = 0;

    let villageBuildingFieldsApiUrl = 'http://localhost:8080/api/villageBuildingFields/' + idVillage;
    let villageBuildingFields = await(await(await fetch(villageBuildingFieldsApiUrl)).json()).data;

    let buildingInfo = require('/home/node/app/infoTables/buildingInfoLookup.json');
    
    for(let i = 1; i < 20; i++){
        villageBuildingTypes.push(villageBuildingFields['field'+i+'Type']);
        villageBuildingLevels.push(villageBuildingFields['field'+i+'Level']);
    }

    for(let i = 0; i < villageBuildingTypes.length; i++){
        switch (villageBuildingTypes[i]) {
            case SAWMILL:       woodBonus += buildingInfo[SAWMILL]['buildingModifier'][villageBuildingLevels[i]];
            case BRICKYARD:     clayBonus += buildingInfo[BRICKYARD]['buildingModifier'][villageBuildingLevels[i]];
            case IRON_FOUNDRY:  ironBonus += buildingInfo[IRON_FOUNDRY]['buildingModifier'][villageBuildingLevels[i]];
            case BAKERY:        cropBonus += buildingInfo[BAKERY]['buildingModifier'][villageBuildingLevels[i]];
            case GRAIN_MILL:    cropBonus += buildingInfo[GRAIN_MILL]['buildingModifier'][villageBuildingLevels[i]];
        }
    }

    return [woodBonus,clayBonus,ironBonus,cropBonus];
}