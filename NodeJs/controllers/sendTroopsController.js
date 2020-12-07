const path = require('path');
const fetch = require("node-fetch");
const sendTroopsModel = require('../models/sendTroopsModel');
const troopInfoLookup = require('../infoTables/troopInfoLookup');
var tools = require('../tools/tools')

exports.view = function (req, res) {
    sendTroopsModel.find({$or: [{idVillageFrom: req.params.idVillage}, {idVillageTo: req.params.idVillage}] }, function (err, sendTroops) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading sendTroops..',
            data: sendTroops
        });
    });
};

exports.new = function (req, res) {
    if (!checkValidIdVillageTo(req.body.idVillageFrom,req.body.idVillageTo,res)) return;
    if (!checkSentAmount(req,res)) return;

    (async () => {
        if (!await updateVillageOwnTroops(req.body.idVillageFrom,req,res)) return;
        switch (req.body.sendType) {
            case "full":    doSendTroops(req.body.sendType,req,res); break;
            case "raid":    doSendTroops(req.body.sendType,req,res); break;
            case "reinf":   doSendTroops(req.body.sendType,req,res); break;
            case "return":  doSendTroops(req.body.sendType,req,res); break;
        }
    })();
};

exports.update = function (req, res) {
    sendTroopsModel.findOne({_id: req.params.sendTroopsId}, function (err, sendTroops) {
        if (err)
            res.send(err);
        
        sendTroops.sendType = req.body.sendType;
        sendTroops.idVillageFrom = req.body.idVillageFrom;
        sendTroops.idVillageTo = req.body.idVillageTo;
        sendTroops.timeSent = req.body.timeSent;
        sendTroops.timeArrived = req.body.timeArrived;
        sendTroops.troopTribe = req.body.troopTribe;
        for(let troop of troopInfoLookup[req.body.troopTribe]){
            sendTroops['troop' + troop['id'] + 'num'] = req.body['troop' + troop['id'] + 'num'];
        }

        sendTroops.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'sendTroops Info updated',
                data: sendTroops
            });
        });
    });
};

exports.delete = function (req, res) {
    sendTroopsModel.deleteOne({_id: req.params.sendTroopsId}, function (err, sendTroops) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'sendTroops deleted'
        });
    });
};

function checkValidIdVillageTo(idVillage,idVillageTo,res){
    if(idVillage == idVillageTo){
        res.json({
            message: 'Cannot send troops to the same village',
            data: ""
        });
        return false;
    }
    return true;
}

function checkSentAmount(req,res){
    let totalTroops = 0;
    for(let troop of troopInfoLookup[req.body.troopTribe]){
        totalTroops += req.body['troop' + troop['id'] + 'num'];
    }
    if(totalTroops <= 0){
        res.json({
            message: 'You need to send at least one troop',
            data: ""
        });
        return false;
    }
    return true; 
}

async function updateVillageOwnTroops(idVillage,req,res){
    let villageOwnTroops = await(await(await tools.doApiRequest("villageOwnTroops/" + idVillage, "GET", "", false)).json()).data;

    for(let troop of troopInfoLookup[req.body.troopTribe]){
        villageOwnTroops["troop" + troop['id']] -= Number(req.body["troop" + troop['id'] + "num"]);
        if(villageOwnTroops["troop" + troop['id']] < 0){
            res.json({
                message: 'Not enough troops',
                data: ""
            });
            return false;
        }
    }

    const villageOwnTroopsResponse = await tools.doApiRequest("villageOwnTroops/" + idVillage, "PATCH", villageOwnTroops, true);
    if (villageOwnTroopsResponse.status == 200){
        return true;
    }
    return false;
}

async function doSendTroops(taskType,req,res){
    let currentUnixTime =  Math.round(new Date().getTime()/1000);
    let currentUnixTimePlus10 =  Math.round(new Date().getTime()/1000)+10;

    let sendTroops = new sendTroopsModel();
    sendTroops.sendType = req.body.sendType;
    sendTroops.idVillageFrom = req.body.idVillageFrom;
    sendTroops.idVillageTo = req.body.idVillageTo;
    sendTroops.timeSent = currentUnixTime;
    sendTroops.timeArrived = currentUnixTimePlus10;
    sendTroops.troopTribe = req.body.troopTribe;
    for(let troop of troopInfoLookup[req.body.troopTribe]){
        sendTroops['troop' + troop['id'] + 'num'] = req.body['troop' + troop['id'] + 'num'];
    }

    sendTroops.save(async function (err, sendTroopsId) {
        if (err){
            res.json(err);
        }
        else{
            let scheduleData = {
                "taskType": taskType,
                "taskUnixTime": currentUnixTimePlus10,
                "taskData": {
                    "sendTroopsId": sendTroopsId._id,
                    "idVillageFrom": req.body.idVillageFrom,
                    "idVillageTo": req.body.idVillageTo,
                    "troopTribe": req.body.troopTribe,
                }
            };

            for(let troop of troopInfoLookup[req.body.troopTribe]){
                scheduleData['taskData']['troop' + troop['id'] + 'num'] = req.body['troop' + troop['id'] + 'num'];
            }

            const scheduleApiUrlResponse = await tools.doApiRequest("schedule", "POST", scheduleData, true);
            if(scheduleApiUrlResponse.status == 200) {
                res.json({
                    message: 'sendTroops success',
                    data: sendTroops
                }); 
            } else {
                res.json({
                    message: 'sendTroops schedule failed',
                    data: ""
                }); 
            }
        }
    });
}