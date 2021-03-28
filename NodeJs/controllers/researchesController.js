const path = require('path');
const fetch = require("node-fetch");
var uuid = require('uuid-random');
const researchesModel = require('../models/researchesModel');
var tools = require('../tools/tools');
var config = require('../config.json');


exports.view = function (req, res) {
    researchesModel.find({idVillage: req.params.idVillage}, function (err, researches) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            message: 'Loading researches..',
            data: researches
        });
    });
};


exports.new = async function (req, res) {
    const idVillage = req.body.idVillage;
    const troopId = req.body.troopId;
    const currentUnixTime =  Math.round(new Date().getTime()/1000);
    const userTribe = await tools.getTribeFromIdVillage(idVillage);

    let villageResources = await(await(await tools.doApiRequest("villageResources/" + idVillage, "GET", "", false)).json()).data;

    switch (req.body.researchType) {
        case 'troopResearch':
            let troopInfo = {};
            for (let troop of tools.researchesInfoLookup[userTribe]){
                if (troop['id'] == troopId) {
                    troopInfo = troop;
                }
            }
            const requirementWood = troopInfo['wood'];
            const requirementClay = troopInfo['clay'];
            const requirementIron = troopInfo['iron'];
            const requirementCrop = troopInfo['crop'];
            const requirementResearchTime = Math.floor(Number(troopInfo['time']) / config.SERVER_SPEED);
            const timeCompleted = currentUnixTime + requirementResearchTime;

            if(queueFull(idVillage,res) == true) return;

            if( villageResources.currentWood < requirementWood || villageResources.currentClay < requirementClay || 
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
            villageResources.lastUpdate = currentUnixTime;

            await tools.doApiRequest("villageResources/" + idVillage, "PATCH", villageResources, true);

            const taskId = uuid();

            var researches = new researchesModel();
            researches.idVillage = idVillage;
            researches.taskId = taskId;
            researches.researchType = 'troopResearch';
            researches.troopName = troopInfo['name'];
            researches.troopId = troopId;
            researches.timeStarted = currentUnixTime;
            researches.timeCompleted = timeCompleted;

            researches.save(async function (err, researches) {
                if (err){
                    res.json(err);
                }
                else{
                    let scheduleData = {
                        "taskType": "troopResearch",
                        "taskUnixTime": timeCompleted,
                        "taskData": {
                            "researchId": researches._id,
                            "taskId": taskId,
                            "idVillage": idVillage,
                            "troopTribe": userTribe,
                            "troopId": troopId,
                        }
                    };
                    await tools.doApiRequest("schedule", "POST", scheduleData, true);

                    res.json({
                        message: 'researches success',
                        data: researches
                    });
                }
            });
            break;
        case 'troopUpgrade': 
            //TODO
            break;
    }
};

exports.update = function (req, res) {
    researchesModel.findOne({_id: req.params.researchId}, function (err, researches) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        
            researches.idVillage = req.body.idVillage;
            researches.researchType = req.body.researchType;
            researches.troopName = req.body.troopName;
            researches.troopId = req.body.troopId;
            researches.timeStarted = req.body.timeStarted;
            researches.timeCompleted = req.body.timeCompleted;

            researches.save(function (err) {
                if (err)
                    res.json(err);
                res.json({
                    message: 'researches Info updated',
                    data: researches
            });
        });
    });
};

exports.delete = async function (req, res) {
    researchesModel.deleteOne({_id: req.params.researchId}, function (err, researches) {
        if (err){
            res.status(400).send(err);
            return;
        } else {
            res.json({
                status: "success",
                message: 'researches deleted'
            });
        }
    });
};

async function queueFull(idVillage,res){
    const researches = await(await(await tools.doApiRequest("researches/" + idVillage, "GET", "", false)).json()).data;
    if(researches.length > 0){
        res.json({
            message: 'Another research is already in progress',
            data: ""
        });
        return true;
    }
    return false;
};