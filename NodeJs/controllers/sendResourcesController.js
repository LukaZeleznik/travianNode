const path = require('path');
const fetch = require('node-fetch');
const sendResourcesModel = require('../models/sendResourcesModel');
var tools = require('../tools/tools');
var config = require('../config.json');
var uuid = require('uuid-random');

exports.view = function (req, res) {
    sendResourcesModel.find({$or: [{idVillageFrom: req.params.idVillage}, {idVillageTo: req.params.idVillage}] }, function (err, sendResources) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            message: 'Loading sendResources..',
            data: sendResources
        });
    });
};

exports.new = async function (req, res) {
    const taskType = req.body.sendType;

    if (!checkValidIdVillageTo(req, res)) return;

    switch (taskType) {
        case 'sendResources': 
            DoSendResources(req, res);
            break;
        case 'sendResourcesReturn': 
            DoSendResourcesReturn(req, res);
            break;
    }
};

exports.update = function (req, res) {
    sendResourcesModel.findOne({_id: req.params.sendResourcesId}, function (err, sendResources) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        sendResources.idVillageFrom     = req.body.idVillageFrom;
        sendResources.idVillageTo       = req.body.idVillageTo;
        sendResources.villageFromName   = req.body.villageFromName;
        sendResources.villageToName     = req.body.villageToName;
        sendResources.timeSent          = req.body.timeSent;
        sendResources.timeArrived       = req.body.timeArrived;
        sendResources.wood              = req.body.wood;
        sendResources.clay              = req.body.clay;
        sendResources.iron              = req.body.iron;
        sendResources.crop              = req.body.crop;
        sendResources.return            = req.body.return;

        sendResources.save(function (err) {
            if (err) {
                res.status(500).json({
                    message: err.toString(),
                    data: ""
                });
                return;
            }
            res.json({
                message: 'sendResources Info updated',
                data: sendResources
            });
        });
    });
};

exports.delete = function (req, res) {
    sendResourcesModel.deleteOne({_id: req.params.sendResourcesId}, function (err, sendResources) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            status: 'success',
            message: 'sendResources deleted'
        });
    });
};

function checkSentAmount(req, res, villageFromResources){
    if (villageFromResources.currentWood < req.body.wood || villageFromResources.currentClay < req.body.clay ||
        villageFromResources.currentIron < req.body.iron || villageFromResources.currentCrop < req.body.crop){
        res.json({
            message: 'Not enough resources',
            data: ''
        });
        return false;
    }
    return true;
};

function checkValidIdVillageTo(req, res){
    if (req.body.idVillageFrom == req.body.idVillageTo){
        res.json({
            message: 'Cannot send resources to the same village',
            data: '',
        });
        return false;
    }
    return true;
};

function calculateMerchantArrival(idVillageToData, idVillageFromData, userTribe){
    const distance = Math.hypot(idVillageToData['xCoordinate']-idVillageFromData['xCoordinate'], idVillageToData['yCoordinate']-idVillageFromData['yCoordinate']);
    const merchantSpeed = tools.merchantInfoLookup[userTribe]['speed'];
    return Number((distance / merchantSpeed * 3600) / config.MERCHANT_SPEED)
};

async function DoSendResources(req, res){
    const currentUnixTime = Math.round(new Date().getTime()/1000);
    const userTribe = await tools.getTribeFromIdVillage(req.body.idVillageFrom);
    const villageToData = await tools.getVillageData(req.body.idVillageTo);
    const totalResources = req.body.wood + req.body.clay + req.body.iron + req.body.crop;
    const merchantsRequired = Math.ceil(totalResources / tools.merchantInfoLookup[userTribe]['capacity']);
    let villageFromData = await tools.getVillageData(req.body.idVillageFrom);
    const timeArrived = (currentUnixTime + calculateMerchantArrival(villageToData, villageFromData, userTribe)).toFixed(0);

    let villageFromResources = await(await(await tools.doApiRequest("villageResources/" + villageFromData._id, "GET", "", false)).json()).data;

    if (!checkSentAmount(req, res, villageFromResources)) return;
    
    if (merchantsRequired > villageFromData['merchantsAvailable']){
        res.json({
            message: 'Not enough available merchants',
            data: '',
        });
        return;
    }

    villageFromResources.currentWood -= req.body.wood;
    villageFromResources.currentClay -= req.body.clay;
    villageFromResources.currentIron -= req.body.iron;
    villageFromResources.currentCrop -= req.body.crop;
    villageFromResources.lastUpdate = currentUnixTime;

    await tools.doApiRequest("villageResources/" + villageFromData._id, "PATCH", villageFromResources, true);

    var sendResources = new sendResourcesModel();
    sendResources.idVillageFrom     = req.body.idVillageFrom;
    sendResources.idVillageTo       = req.body.idVillageTo;
    sendResources.villageFromName   = villageFromData.name;
    sendResources.villageToName     = villageToData.name;
    sendResources.timeSent          = currentUnixTime;
    sendResources.timeArrived       = timeArrived;
    sendResources.merchantAmount    = merchantsRequired;
    sendResources.wood              = req.body.wood;
    sendResources.clay              = req.body.clay;
    sendResources.iron              = req.body.iron;
    sendResources.crop              = req.body.crop;
    sendResources.return            = false;

    sendResources.save(async function (err) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        else{
            villageFromData['merchantsAvailable'] -= merchantsRequired;
            await tools.doApiRequest("villages/" + villageFromData['mapTileId'], "PATCH", villageFromData, true);

            let scheduleData = {
                'taskType': 'sendResources',
                'taskUnixTime': timeArrived,
                'taskData': {
                    "taskId": uuid(),
                    'sendResourcesId': sendResources._id,
                    'idVillageFrom': req.body.idVillageFrom,
                    'idVillageTo': req.body.idVillageTo,
                    'userTribe': userTribe,
                    'wood': req.body.wood,
                    'clay': req.body.clay,
                    'iron': req.body.iron,
                    'crop': req.body.crop
                }
            };

            const scheduleApiUrlResponse = await tools.doApiRequest('schedule', 'POST', scheduleData, true);
            if(scheduleApiUrlResponse.status == 200) {
                res.json({
                    message: 'sendResources success',
                    data: sendResources
                }); 
            } else {
                res.json({
                    message: 'sendResources schedule failed',
                    data: ''
                }); 
            }
        }
    });
}

async function DoSendResourcesReturn(req, res){
    const currentUnixTime = Math.round(new Date().getTime()/1000);
    const userTribe = await tools.getTribeFromIdVillage(req.body.idVillageFrom);
    const villageToData = await tools.getVillageData(req.body.idVillageTo);
    const totalResources = req.body.wood + req.body.clay + req.body.iron + req.body.crop;
    const merchantsRequired = Math.ceil(totalResources / tools.merchantInfoLookup[userTribe]['capacity']);
    let villageFromData = await tools.getVillageData(req.body.idVillageFrom);
    const timeArrived = (currentUnixTime + calculateMerchantArrival(villageToData, villageFromData, userTribe)).toFixed(0);

    var sendResources = new sendResourcesModel();
    sendResources.idVillageFrom     = req.body.idVillageFrom;
    sendResources.idVillageTo       = req.body.idVillageTo;
    sendResources.villageFromName   = villageFromData.name;
    sendResources.villageToName     = villageToData.name;
    sendResources.timeSent          = currentUnixTime;
    sendResources.timeArrived       = timeArrived;
    sendResources.merchantAmount    = merchantsRequired;
    sendResources.wood              = req.body.wood;
    sendResources.clay              = req.body.clay;
    sendResources.iron              = req.body.iron;
    sendResources.crop              = req.body.crop;
    sendResources.return            = true;

    sendResources.save(async function (err) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        else{
            let scheduleData = {
                'taskType': 'sendResourcesReturn',
                'taskUnixTime': timeArrived,
                'taskData': {
                    "taskId": uuid(),
                    'sendResourcesId': sendResources._id,
                    'idVillageFrom': req.body.idVillageFrom,
                    'idVillageTo': req.body.idVillageTo,
                    'userTribe': userTribe,
                    'merchantAmount': merchantsRequired,
                    'wood': req.body.wood,
                    'clay': req.body.clay,
                    'iron': req.body.iron,
                    'crop': req.body.crop
                }
            };

            const scheduleApiUrlResponse = await tools.doApiRequest('schedule', 'POST', scheduleData, true);
            if(scheduleApiUrlResponse.status == 200) {
                res.json({
                    message: 'sendResources success',
                    data: sendResources
                }); 
            } else {
                res.json({
                    message: 'sendResources schedule failed',
                    data: ''
                }); 
            }
        }
    });
}