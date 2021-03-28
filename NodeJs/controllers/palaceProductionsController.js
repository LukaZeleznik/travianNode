const path = require('path');
const fetch = require("node-fetch");
const palaceProductionsModel = require('../models/palaceProductionsModel');
var tools = require('../tools/tools');
var config = require('../config.json');
const PALACE = 13;

exports.view = function (req, res) {
    palaceProductionsModel.find({idVillage: req.params.idVillage}, function (err, palaceProductions) {
        if (err){
            res.status(400).send(err);
            return;
        }
        else{
            res.json({
                message: 'loading palaceProductions...',
                data: palaceProductions
            });

        }
    });
};

// Handle create palaceProductions actions
exports.new = async function (req, res) {
    const idVillage = req.body.idVillage;
    const userTribe = await tools.getTribeFromIdVillage(idVillage);
    const currentUnixTime = Math.round(new Date().getTime()/1000);

    const villageResources = await(await(await tools.doApiRequest('villageResources/' + idVillage, 'GET', '', false)).json()).data;
    const villageBuildingFields = await(await(await tools.doApiRequest('villageBuildingFields/' + idVillage, 'GET', '', false)).json()).data;
    const palaceProductionResponse = await(await(await tools.doApiRequest('palaceProductions/' + idVillage, 'GET', '', false)).json()).data;
    const researchesCompleted =   await(await(await tools.doApiRequest("researchesCompleted/" + idVillage, "GET", "", false)).json()).data;

    let villageBuildingLevel = 0;
    for(let i = 1; i <= Object.keys(villageBuildingFields).length; i++){
        if(villageBuildingFields['field'+i+'Type'] == PALACE){
            villageBuildingLevel = villageBuildingFields['field'+i+'Level'];
            break;
        }
    }

    if(villageBuildingLevel >= 10){
        var allowed = 1 + Math.floor((villageBuildingLevel - 10) / 5);
    } else {
        res.json({
            message: 'Building must be at least level 10',
            data: ""
        });
        return;
    }

    if (tools.troopInfoLookup[userTribe][req.body.troopId-1]['buildingId'] != PALACE || !researchesCompleted['troop' + req.body.troopId]){
        res.json({
            message: 'This troop cannot be trained',
            data: ""
        });
        return;
    }

    const existingTroops = await getExistingTroops(idVillage);
    const trained = existingTroops[0] + (existingTroops[1] / 3);
    const troop9avail = Math.floor(allowed - trained);
    const troop10avail = Math.floor((allowed - trained) * 3);

    if((req.body.troopId == 9  && req.body.troopCount > troop9avail) ||
       (req.body.troopId == 10 && req.body.troopCount > troop10avail)){
        res.json({
            message: 'You can\'t train that many troops',
            data: ""
        });
        return;
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
    villageResources.lastUpdate   = currentUnixTime;

    await tools.doApiRequest("villageResources/" + idVillage, "PATCH", villageResources, true);

    var palaceProductions = new palaceProductionsModel();
    palaceProductions.idVillage   = req.body.idVillage;
    palaceProductions.troopId     = req.body.troopId;
    palaceProductions.troopCount  = req.body.troopCount;

    let troopQueueTime = Object.keys(palaceProductionResponse).length > 0 ? palaceProductionResponse[Object.keys(palaceProductionResponse).length-1]['timeCompleted'] : currentUnixTime
    let troopTrainingTime = (tools.troopInfoLookup[userTribe][req.body.troopId-1]["time"] * tools.buildingInfoLookup[PALACE]['buildingModifier'][villageBuildingLevel]) / config.SERVER_SPEED;

    palaceProductions.troopName         = tools.troopInfoLookup[userTribe][req.body.troopId-1]["name"];
    palaceProductions.troopProdTime     = troopTrainingTime;
    palaceProductions.timeStarted       = troopQueueTime;
    palaceProductions.timeCompleted     = troopQueueTime + Math.floor(req.body.troopCount * troopTrainingTime);
    palaceProductions.lastUpdate        = currentUnixTime;
    palaceProductions.troopsDoneAlready = 0;

    palaceProductions.save(function (err) {
        if (err){
            res.status(500).json(err);
            return;
        }
        else{
            res.json({
                message: 'palaceProductions success',
                data: palaceProductions
            });
        }
    });
};

exports.update = function (req, res) {
    palaceProductionsModel.findOne({_id: req.params.palaceProdId}, function (err, palaceProductions) {
        if (err){
            res.status(500).json(err);
            return;
        }        
        
            palaceProductions.idVillage = req.body.idVillage;
            palaceProductions.troopName = req.body.troopName;
            palaceProductions.troopId = req.body.troopId;
            palaceProductions.troopCount = req.body.troopCount;
            palaceProductions.troopProdTime = req.body.troopProdTime;
            palaceProductions.timeStarted = req.body.timeStarted;
            palaceProductions.timeCompleted = req.body.timeCompleted;
            palaceProductions.lastUpdate = req.body.lastUpdate;
            palaceProductions.troopsDoneAlready = req.body.troopsDoneAlready;

            palaceProductions.save(function (err) {
            if (err) {
                res.status(500).json({
                    message: err.toString(),
                    data: ""
                });
                return;
            }
            res.json({
                message: 'palaceProductions Info updated',
                data: palaceProductions
            });
        });
    });
};

exports.delete = function (req, res) {
    palaceProductionsModel.remove({_id: req.params.palaceProdId}, function (err, palaceProductions) {
        if (err){
            res.status(500).json(err);
            return;
        }
        res.json({
            status: "success",
            message: 'palaceProductions deleted'
        });
    });
};

async function getExistingTroops(idVillage){
    let troop9 = 0;
    let troop10 = 0;

    const villageOwnTroops = await(await(await tools.doApiRequest("villageOwnTroops/" + idVillage,"GET", "", false)).json()).data
    troop9 += villageOwnTroops['troop9'];
    troop10 += villageOwnTroops['troop10'];

    const palaceProductions = await(await(await tools.doApiRequest("palaceProductions/" + idVillage,"GET", "", false)).json()).data
    palaceProductions.forEach(production =>{
        if(production['troopId'] == 9) troop9 += production['troopCount'];
        if(production['troopId'] == 10) troop10 += production['troopCount'];
    });

    // To be tested and check if it maybe picks up incomming attacks with such units
    const sendTroops = await(await(await tools.doApiRequest("sendTroops/" + idVillage,"GET", "", false)).json()).data
    sendTroops.forEach(troopMovement =>{
        troop9 += troopMovement['troop9num'];
        troop10 += troopMovement['troop10num'];
    });

    //TODO
    //const villageReinforcements = await(await(await this.doApiRequest("villageReinforcements/" + idVillage,"GET", "", false)).json()).data

    return [troop9, troop10];
}