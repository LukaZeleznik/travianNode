const path = require('path');
const fetch = require('node-fetch');
const sendTroopsModel = require('../models/sendTroopsModel');
var tools = require('../tools/tools');
var config = require('../config.json');
var uuid = require('uuid-random');

exports.view = function (req, res) {
    sendTroopsModel.find({$or: [{idVillageFrom: req.params.idVillage}, {idVillageTo: req.params.idVillage}] }, function (err, sendTroops) {
        if (err){
            res.status(500).json(err);
            return;
        }
        res.json({
            message: 'Loading sendTroops..',
            data: sendTroops
        });
    });
};

exports.new = async function (req, res) {
    const villageToData = await tools.getVillageData(req.body.idVillageTo);
    const userTribe = await tools.getTribeFromIdVillage(req.body.idVillageFrom);
    const taskType = req.body.sendType;
    if (!checkValidIdVillageTo(req, res)) return;
    if (!checkSentAmount(req, res, userTribe, villageToData)) return;

    if (!await updateVillageOwnTroops(req, res, userTribe) && taskType != 'return') return;
    switch (taskType) {
        case 'attack':
        case 'raid':
        case 'reinf':
        case 'return':
        case 'settle':
        default: 
            await doSendTroops(req, res, userTribe); 
            break;
    }
};

exports.update = function (req, res) {
    sendTroopsModel.findOne({_id: req.params.sendTroopsId}, function (err, sendTroops) {
        if (err){
            res.status(500).json(err);
            return;
        }
        sendTroops.sendType = req.body.sendType;
        sendTroops.idVillageFrom = req.body.idVillageFrom;
        sendTroops.idVillageTo = req.body.idVillageTo;
        sendTroops.timeSent = req.body.timeSent;
        sendTroops.timeArrived = req.body.timeArrived;
        sendTroops.troopTribe = req.body.troopTribe;
        sendTroops.bountyWood = req.body.bountyWood ? req.body.bountyWood : 0;
        sendTroops.bountyClay = req.body.bountyClay ? req.body.bountyClay : 0;
        sendTroops.bountyIron = req.body.bountyIron ? req.body.bountyIron : 0;
        sendTroops.bountyCrop = req.body.bountyCrop ? req.body.bountyCrop : 0;
        for(let troop of tools.troopInfoLookup[req.body.troopTribe]){
            sendTroops['troop' + troop['id'] + 'num'] = req.body['troop' + troop['id'] + 'num'];
        }

        sendTroops.save(function (err) {
            if (err) {
                res.status(500).json({
                    message: err.toString(),
                    data: ""
                });
                return;
            }
            res.json({
                message: 'sendTroops Info updated',
                data: sendTroops
            });
        });
    });
};

exports.delete = function (req, res) {
    sendTroopsModel.deleteOne({_id: req.params.sendTroopsId}, function (err, sendTroops) {
        if (err){
            res.status(500).json(err);
            return;
        }
        res.json({
            status: 'success',
            message: 'sendTroops deleted'
        });
    });
};

function checkSentAmount(req, res, userTribe, villageToData){
    let totalTroops = 0;
    for(let troop of tools.troopInfoLookup[userTribe]){
        totalTroops += req.body['troop' + troop['id'] + 'num'];
    }
    if(totalTroops <= 0){
        res.json({
            message: 'You need to send at least one troop',
            data: ''
        });
        return false;
    }
    if (villageToData['owner'] == '') {
        for (let troop of tools.troopInfoLookup[userTribe]){
            if (troop['id'] != 10 && req.body['troop' + troop['id'] + 'num'] > 0){
                res.json({
                    message: 'Invalid troops selected',
                    data: ''
                });
                return false;
            } 
            if (req.body['troop' + troop['id'] + 'num'] != 3 && troop['id'] == 10){
                console.log(req.body['troop' + troop['id'] + 'num'], troop['id'])
                res.json({
                    message: 'Three settlers are required',
                    data: ''
                });
                return false;
            } 
        }
    }
    return true; 
}

async function updateVillageOwnTroops(req, res, userTribe){
    let villageOwnTroops = await(await(await tools.doApiRequest('villageOwnTroops/' + req.body.idVillageFrom, 'GET', '', false)).json()).data;

    for(let troop of tools.troopInfoLookup[userTribe]){
        villageOwnTroops['troop' + troop['id']] -= Number(req.body['troop' + troop['id'] + 'num']);
        if(villageOwnTroops['troop' + troop['id']] < 0){
            res.json({
                message: 'Not enough troops',
                data: ''
            });
            return false;
        }
    }

    const villageOwnTroopsResponse = await tools.doApiRequest('villageOwnTroops/' + req.body.idVillageFrom, 'PATCH', villageOwnTroops, true);
    if (villageOwnTroopsResponse.status == 200){
        return true;
    }
    return false;
};

function calculateTroopArrival(req, idVillageToData, idVillageFromData, userTribe){
    const distance = Math.hypot(idVillageToData['xCoordinate']-idVillageFromData['xCoordinate'], idVillageToData['yCoordinate']-idVillageFromData['yCoordinate']);
    let troopSpeed = 99;
    for(let troop of tools.troopInfoLookup[userTribe]){
        if(req.body['troop' + troop['id'] + 'num'] > 0){
            let tempSpeed = troop['speed'];
            if(tempSpeed < troopSpeed) troopSpeed = tempSpeed;
        }
    }

    return Number((distance / troopSpeed * 3600) / config.TROOP_SPEED)
};

function checkValidIdVillageTo(req, res){
    if (req.body.idVillageFrom == req.body.idVillageTo){
        res.json({
            message: 'Cannot send troops to the same village',
            data: ''
        });
        return false;
    }
    return true;
};

async function doSendTroops(req, res, userTribe){
    const currentUnixTime =  Math.round(new Date().getTime()/1000);
    const idVillageFromData = await(await(await tools.doApiRequest('villages/' + req.body.idVillageFrom, 'GET', '', false)).json()).data;
    const idVillageToData   = await(await(await tools.doApiRequest('villages/' + req.body.idVillageTo, 'GET', '', false)).json()).data;
    const timeArrived = (currentUnixTime + calculateTroopArrival(req, idVillageToData, idVillageFromData, userTribe)).toFixed(0);
    const taskId = uuid();

    let sendTroops = new sendTroopsModel();
    sendTroops.sendType = req.body.sendType;
    sendTroops.idVillageFrom = req.body.idVillageFrom;
    sendTroops.idVillageTo = req.body.idVillageTo;
    sendTroops.timeSent = currentUnixTime;
    sendTroops.timeArrived = timeArrived;
    sendTroops.troopTribe = userTribe;
    sendTroops.bountyWood = req.body.bountyWood ? req.body.bountyWood : 0;
    sendTroops.bountyClay = req.body.bountyClay ? req.body.bountyClay : 0;
    sendTroops.bountyIron = req.body.bountyIron ? req.body.bountyIron : 0;
    sendTroops.bountyCrop = req.body.bountyCrop ? req.body.bountyCrop : 0;
    for(let troop of tools.troopInfoLookup[userTribe]){
        sendTroops['troop' + troop['id'] + 'num'] = req.body['troop' + troop['id'] + 'num'];
    }

    console.log("sendTroops",sendTroops);

    sendTroops.save(async function (err, sendTroopsId) {
        if (err){
            res.status(500).json(err);
            return;
        }
        else{
            let scheduleData = {
                'taskType': req.body.sendType,
                'taskUnixTime': timeArrived,
                'taskData': {
                    "taskId": taskId,
                    'sendTroopsId': sendTroopsId._id,
                    'idVillageFrom': req.body.idVillageFrom,
                    'idVillageTo': req.body.idVillageTo,
                    'troopTribe': userTribe,
                    'bountyWood': req.body.bountyWood,
                    'bountyClay': req.body.bountyClay,
                    'bountyIron': req.body.bountyIron,
                    'bountyCrop': req.body.bountyCrop
                }
            };

            for(let troop of tools.troopInfoLookup[userTribe]){
                scheduleData['taskData']['troop' + troop['id'] + 'num'] = req.body['troop' + troop['id'] + 'num'];
            }

            const scheduleApiUrlResponse = await tools.doApiRequest('schedule', 'POST', scheduleData, true);
            if(scheduleApiUrlResponse.status == 200) {
                res.json({
                    message: 'sendTroops success',
                    data: sendTroops
                }); 
            } else {
                res.json({
                    message: 'sendTroops schedule failed',
                    data: ''
                }); 
            }
        }
    });
}