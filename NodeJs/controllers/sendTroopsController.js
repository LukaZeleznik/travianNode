const path = require('path');
const sendTroopsModel = require('../models/sendTroopsModel');
const fetch = require("node-fetch");

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

// Handle create sendTroops actions
exports.new = function (req, res) {
    let idVillage = req.body.idVillageFrom;
    let idVillageTo = req.body.idVillageTo;
    let currentUnixTime =  Math.round(new Date().getTime()/1000);
    let currentUnixTimePlus10 =  Math.round(new Date().getTime()/1000)+10;

    let totalTroops = 0;
    for(let i = 1; i < 11; i++){
        let name = "troop"+i+"num";
        totalTroops += req.body[name];        
    }

    if(totalTroops <= 0){
        res.json({
            message: 'No troops sent!',
            data: ""
        });
        return;
    }

    (async () => {
        if(req.body.sendType == "full"){

            let villageOwnTroopsApiUrl = 'http://localhost:8080/api/villageOwnTroops/' + idVillage;
            let villageOwnTroops = await(await(await fetch(villageOwnTroopsApiUrl)).json()).data;

            for(let i = 1; i < 11; i++){
                villageOwnTroops["troop"+i] -= Number(req.body["troop"+i+"num"]);
                if(villageOwnTroops["troop"+i] < 0){
                    res.json({
                        message: 'Not enough troops!',
                        data: ""
                    });
                    return;
                }
            }
            
            await fetch(villageOwnTroopsApiUrl, {
                method: 'PATCH', // or 'PUT'
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(villageOwnTroops)
            });

            var sendTroops = new sendTroopsModel();
            sendTroops.sendType = req.body.sendType;
            sendTroops.idVillageFrom = req.body.idVillageFrom;
            sendTroops.idVillageTo = req.body.idVillageTo;
            sendTroops.timeSent = currentUnixTime;
            sendTroops.timeArrived = currentUnixTimePlus10;
            sendTroops.troopTribe = req.body.troopTribe;
            sendTroops.troop1num = req.body.troop1num;
            sendTroops.troop2num = req.body.troop2num;
            sendTroops.troop3num = req.body.troop3num;
            sendTroops.troop4num = req.body.troop4num;
            sendTroops.troop5num = req.body.troop5num;
            sendTroops.troop6num = req.body.troop6num;
            sendTroops.troop7num = req.body.troop7num;
            sendTroops.troop8num = req.body.troop8num;
            sendTroops.troop9num = req.body.troop9num;
            sendTroops.troop10num = req.body.troop10num;

            sendTroops.save(async function (err, sendTroopsId) {
                if (err){
                    res.json(err);
                }
                else{

                    let scheduleApiUrl = 'http://localhost:8080/api/schedule/';
                    let scheduleData = {
                        "taskType": "attack",
                        "taskUnixTime": currentUnixTimePlus10,
                        "taskData": {
                            "sendTroopsId": sendTroopsId._id,
                            "idVillageFrom": idVillage,
                            "idVillageTo": idVillageTo,
                            "troopTribe": req.body.troopTribe,
                            "troop1num" : req.body.troop1num,
                            "troop2num" : req.body.troop2num,
                            "troop3num" : req.body.troop3num,
                            "troop4num" : req.body.troop4num,
                            "troop5num" : req.body.troop5num,
                            "troop6num" : req.body.troop6num,
                            "troop7num" : req.body.troop7num,
                            "troop8num" : req.body.troop8num,
                            "troop9num" : req.body.troop9num,
                            "troop10num" : req.body.troop10num
                        }
                    };
                    
                    await fetch(scheduleApiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(scheduleData),
                    });
                    
                    res.json({
                        message: 'New sendTroops created',
                        data: sendTroops
                    });                    
                }
            });
        }
        else if(req.body.sendType == "reinf"){

        }
        else if(req.body.sendType == "return"){

            var sendTroops = new sendTroopsModel();
            sendTroops.sendType = req.body.sendType;
            sendTroops.idVillageFrom = req.body.idVillageFrom;
            sendTroops.idVillageTo = req.body.idVillageTo;
            sendTroops.timeSent = currentUnixTime;
            sendTroops.timeArrived = currentUnixTimePlus10;
            sendTroops.troopTribe = req.body.troopTribe;
            sendTroops.troop1num = req.body.troop1num;
            sendTroops.troop2num = req.body.troop2num;
            sendTroops.troop3num = req.body.troop3num;
            sendTroops.troop4num = req.body.troop4num;
            sendTroops.troop5num = req.body.troop5num;
            sendTroops.troop6num = req.body.troop6num;
            sendTroops.troop7num = req.body.troop7num;
            sendTroops.troop8num = req.body.troop8num;
            sendTroops.troop9num = req.body.troop9num;
            sendTroops.troop10num = req.body.troop10num;

            sendTroops.save(async function (err, sendTroopsId) {
                if (err){
                    res.json(err);
                }
                else{
                    let scheduleApiUrl = 'http://localhost:8080/api/schedule/';
                    let scheduleData = {
                        "taskType": "return",
                        "taskUnixTime": currentUnixTimePlus10,
                        "taskData": {
                            "sendTroopsId": sendTroopsId._id,
                            "idVillageFrom": req.body.idVillageFrom,
                            "idVillageTo": req.body.idVillageTo,
                            "troopTribe": req.body.troopTribe,
                            "troop1num" : req.body.troop1num,
                            "troop2num" : req.body.troop2num,
                            "troop3num" : req.body.troop3num,
                            "troop4num" : req.body.troop4num,
                            "troop5num" : req.body.troop5num,
                            "troop6num" : req.body.troop6num,
                            "troop7num" : req.body.troop7num,
                            "troop8num" : req.body.troop8num,
                            "troop9num" : req.body.troop9num,
                            "troop10num" : req.body.troop10num
                        }
                    };

                    await fetch(scheduleApiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(scheduleData),
                    });

                    res.json({
                        message: 'New sendTroops created',
                        data: sendTroops
                    });
                }
            });

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
        sendTroops.troop1num = req.body.troop1num;
        sendTroops.troop2num = req.body.troop2num;
        sendTroops.troop3num = req.body.troop3num;
        sendTroops.troop4num = req.body.troop4num;
        sendTroops.troop5num = req.body.troop5num;
        sendTroops.troop6num = req.body.troop6num;
        sendTroops.troop7num = req.body.troop7num;
        sendTroops.troop8num = req.body.troop8num;
        sendTroops.troop9num = req.body.troop9num;
        sendTroops.troop10num = req.body.troop10num;

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