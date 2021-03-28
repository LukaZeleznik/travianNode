const path = require('path');
const villageProductionsModel = require('../models/villageProductionsModel');
const fetch = require("node-fetch");
var tools = require('../tools/tools');
var config = require('../config.json');

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
            res.status(400).send(err);
            return;
        }
        else{     
            (async () => {    
                const idVillage = req.params.idVillage;
                let baseWoodProd = 0;
                let baseClayProd = 0;
                let baseIronProd = 0;
                let baseCropProd = 0;

                const villageResourceFields = await(await(await tools.doApiRequest("villageResourceFields/" + idVillage, "GET", "", false)).json()).data;

                for(let i = 1; i < 19; i++){
                    switch (villageResourceFields['field'+i+'Type']) {
                        case WOODCUTTER: baseWoodProd += tools.resourceInfoLookup[WOODCUTTER]['production'][villageResourceFields['field'+i+'Level']]; break;
                        case CLAY_PIT:   baseClayProd += tools.resourceInfoLookup[CLAY_PIT]['production'][villageResourceFields['field'+i+'Level']]; break;
                        case IRON_MINE:  baseIronProd += tools.resourceInfoLookup[IRON_MINE]['production'][villageResourceFields['field'+i+'Level']]; break;
                        case CROPLAND:   baseCropProd += tools.resourceInfoLookup[CROPLAND]['production'][villageResourceFields['field'+i+'Level']]; break;
                    }
                }          

                let bonusProduction = await getBuildingBonusProductions(idVillage);
                villageProductions.productionWood = (baseWoodProd + (baseWoodProd*bonusProduction[0])) * config.SERVER_SPEED;
                villageProductions.productionClay = (baseClayProd + (baseClayProd*bonusProduction[1])) * config.SERVER_SPEED;
                villageProductions.productionIron = (baseIronProd + (baseIronProd*bonusProduction[2])) * config.SERVER_SPEED;
                villageProductions.productionCrop = (baseCropProd + (baseCropProd*bonusProduction[3])) * config.SERVER_SPEED;

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
            res.status(500).json(err);
            console.log(err);
            return;
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
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        
        villageProductions.idVillage = req.body.idVillage;
        villageProductions.productionWood = req.body.productionWood;
        villageProductions.productionClay = req.body.productionClay;
        villageProductions.productionIron = req.body.productionIron;
        villageProductions.productionCrop = req.body.productionCrop;

        villageProductions.save(function (err) {
            if (err) {
                res.status(500).json({
                    message: err.toString(),
                    data: ""
                });
                return;
            }
            res.json({
                message: 'villageProductions Info updated',
                data: villageProductions
            });
        });
    });
};

exports.delete = function (req, res) {
    villageProductionsModel.remove({idVillage: req.params.idVillage}, function (err, villageProductions) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
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
    
    var villageBuildingFields = await(await(await tools.doApiRequest("villageBuildingFields/" + idVillage, "GET", "", false)).json()).data;

    for(let i = 1; i < 20; i++){
        villageBuildingTypes.push(villageBuildingFields['field'+i+'Type']);
        villageBuildingLevels.push(villageBuildingFields['field'+i+'Level']);
    }

    for(let i = 0; i < villageBuildingTypes.length; i++){
        switch (villageBuildingTypes[i]) {
            case SAWMILL:       woodBonus += tools.buildingInfoLookup[SAWMILL]['buildingModifier'][villageBuildingLevels[i]]; break;
            case BRICKYARD:     clayBonus += tools.buildingInfoLookup[BRICKYARD]['buildingModifier'][villageBuildingLevels[i]]; break;
            case IRON_FOUNDRY:  ironBonus += tools.buildingInfoLookup[IRON_FOUNDRY]['buildingModifier'][villageBuildingLevels[i]]; break;
            case BAKERY:        cropBonus += tools.buildingInfoLookup[BAKERY]['buildingModifier'][villageBuildingLevels[i]]; break;
            case GRAIN_MILL:    cropBonus += tools.buildingInfoLookup[GRAIN_MILL]['buildingModifier'][villageBuildingLevels[i]]; break;
        }
    }

    return [woodBonus,clayBonus,ironBonus,cropBonus];
}