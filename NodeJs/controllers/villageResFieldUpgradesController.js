const path = require('path');
const fetch = require("node-fetch");
var uuid = require('uuid-random');
const schedule = require('node-schedule');
const villageResFieldUpgradesModel = require('../models/villageResFieldUpgradesModel');
var tools = require('../tools/tools');
var config = require('../config.json');


exports.view = function (req, res) {
    villageResFieldUpgradesModel.find({idVillage: req.params.idVillage}, function (err, villageResFieldUpgrades) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: villageResFieldUpgrades
        });
    });
};

exports.find = function (req, res) {
    villageResFieldUpgradesModel.findOne({_id: req.params.upgradeId}, function (err, villageResFieldUpgrade) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: villageResFieldUpgrade
        });
    });
};

exports.new = async function (req, res) {
    (async () => {
        const idVillage = req.body.idVillage;
        const resFieldId = req.body.rfid;
        const currentUnixTime =  Math.round(new Date().getTime()/1000);

        let villageResources = await(await(await tools.doApiRequest("villageResources/" + idVillage, "GET", "", false)).json()).data;
        let villageResourceFields = await(await(await tools.doApiRequest("villageResourceFields/" + idVillage, "GET", "", false)).json()).data;

        const villageResourceFieldLevel = Number(villageResourceFields["field"+resFieldId+"Level"]);
        const villageResourceFieldType = Number(villageResourceFields["field"+resFieldId+"Type"]);

        let requirementWood = tools.resourceInfoLookup[villageResourceFieldType]["wood"][villageResourceFieldLevel+1];
        let requirementClay = tools.resourceInfoLookup[villageResourceFieldType]["clay"][villageResourceFieldLevel+1];
        let requirementIron = tools.resourceInfoLookup[villageResourceFieldType]["iron"][villageResourceFieldLevel+1];
        let requirementCrop = tools.resourceInfoLookup[villageResourceFieldType]["crop"][villageResourceFieldLevel+1];
        let requirementConstructionTime = Math.floor(Number(tools.resourceInfoLookup[villageResourceFieldType]["constructionTime"][villageResourceFieldLevel+1]) / config.SERVER_SPEED);

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

        const timeCompleted = currentUnixTime + requirementConstructionTime;
        const taskId = uuid();
        
        var villageResFieldUpgrades = new villageResFieldUpgradesModel();
        villageResFieldUpgrades.idVillage = idVillage;
        villageResFieldUpgrades.rfid = resFieldId;
        villageResFieldUpgrades.taskId = taskId;
        villageResFieldUpgrades.fieldType = villageResourceFieldType;
        villageResFieldUpgrades.fieldLevel = villageResourceFieldLevel;
        villageResFieldUpgrades.woodUsed = requirementWood;
        villageResFieldUpgrades.ironUsed = requirementIron;
        villageResFieldUpgrades.clayUsed = requirementClay;
        villageResFieldUpgrades.cropUsed = requirementCrop;
        villageResFieldUpgrades.timeStarted = currentUnixTime;
        villageResFieldUpgrades.timeCompleted = timeCompleted;

        console.log("idVillage",idVillage);

        villageResFieldUpgrades.save(async function (err,villageResFieldUpgrade) {
            if (err){
                res.json(err);
            }
            else{
                console.log(timeCompleted);
                let scheduleData = {
                    "taskType": "upgradeResField",
                    "taskUnixTime": timeCompleted,
                    "taskData": {
                        "idVillage": idVillage,
                        "taskId": taskId,
                        "resFieldId": resFieldId,
                        "resFieldUpgradeId": villageResFieldUpgrade._id
                    }
                };
                await tools.doApiRequest("schedule", "POST", scheduleData, true);

                res.json({
                    message: 'villageResFieldUpgrade success',
                    data: villageResFieldUpgrade
                });
            }
        });
                
    })();
};

exports.update = function (req, res) {
    villageResFieldUpgradesModel.findOne({_id: req.params.upgradeId}, function (err, villageResFieldUpgrades) {
        if (err)
            res.send(err);
        
        villageResFieldUpgrades.idVillage = req.body.idVillage;
        villageResFieldUpgrades.rfid = req.body.rfid;
        villageResFieldUpgrades.fieldType = req.body.fieldType;
        villageResFieldUpgrades.fieldLevel = req.body.fieldLevel;
        villageResFieldUpgrades.timeStarted = req.body.timeStarted;
        villageResFieldUpgrades.timeCompleted = req.body.timeCompleted;

        villageResFieldUpgrades.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageResFieldUpgrades Info updated',
                data: villageResFieldUpgrades
            });
        });
    });
};

exports.delete = async function (req, res) {
    villageResFieldUpgradesModel.deleteOne({_id: req.params.upgradeId}, function (err, villageResFieldUpgrades) {
        if (err){
            res.send(err);
        } else {
            res.json({
                status: "success",
                message: 'villageResFieldUpgrades deleted'
            });
        }
    });
};

exports.cancel = async function (req, res) {
    var upgradeData = await(await(await tools.doApiRequest("villageResFieldUpgrade/" + req.params.upgradeId, "GET", "", false)).json()).data;

    villageResFieldUpgradesModel.deleteOne({_id: req.params.upgradeId}, function (err, villageResFieldUpgrades) {
        if (err){
            res.send(err);
        } else if (villageResFieldUpgrades.deletedCount > 0){
            (async () => {
                
                const currentUnixTime =  Math.round(new Date().getTime()/1000);
                let villageResources = await(await(await tools.doApiRequest("villageResources/" + upgradeData['idVillage'], "GET", "", false)).json()).data;

                villageResources.currentWood += upgradeData['woodUsed'];
                villageResources.currentClay += upgradeData['clayUsed'];
                villageResources.currentIron += upgradeData['ironUsed'];
                villageResources.currentCrop += upgradeData['cropUsed'];
                villageResources.lastUpdate = currentUnixTime;

                await tools.doApiRequest("villageResources/" + upgradeData['idVillage'], "PATCH", villageResources, true);

                schedule.scheduledJobs[upgradeData['taskId']].cancel();

                res.json({
                    status: "success",
                    message: 'villageResFieldUpgrades cancelled'
                });
                return;
            })();
        } else {
            res.json({
                status: "failed",
                message: 'villageResFieldUpgrades _id does not exist'
            });
        }
    });
};

async function queueFull(idVillage,res){
    let villageResFieldUpgradesCurrent = await(await(await tools.doApiRequest("villageResFieldUpgrades/" + idVillage, "GET", "", false)).json()).data;
    if(villageResFieldUpgradesCurrent.length > 0){
        res.json({
            message: 'Another resource field is being upgraded',
            data: ""
        });
        return true;
    }
    return false;
}