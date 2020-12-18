const path = require('path');
const fetch = require('node-fetch');
const sendResourcesModel = require('../models/sendResourcesModel');
var tools = require('../tools/tools');
var config = require('../config.json');

exports.view = function (req, res) {
    sendResourcesModel.find({$or: [{idVillageFrom: req.params.idVillage}, {idVillageTo: req.params.idVillage}] }, function (err, sendResources) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading sendResources..',
            data: sendResources
        });
    });
};

exports.new = async function (req, res) {
    const currentUnixTime = Math.round(new Date().getTime()/1000);
    let villageFromData = await tools.getVillageData(req.body.idVillageFrom);
    const villageToData = await tools.getVillageData(req.body.idVillageTo);
    let villageFromResources = await tools.doApiRequest("villageResources/" + villageFromData._id, "GET", "", false);
    if (!checkValidIdVillageTo(req, res)) return;
    if (!checkSentAmount(req, res, villageFromResources)) return;

    villageResources.currentWood -= req.body.wood;
    villageResources.currentClay -= req.body.clay;
    villageResources.currentIron -= req.body.iron;
    villageResources.currentCrop -= req.body.crop;
    villageResources.lastUpdate = currentUnixTime;

    await tools.doApiRequest("villageResources/" + villageFromData._id, "PATCH", villageFromResources, true);

    var sendResources = new sendResourcesModel();
    sendResources.idVillageFrom = req.body.idVillageFrom;
    sendResources.idVillageTo   = req.body.idVillageTo;
    sendResources.timeSent      = req.body.timeSent;
    sendResources.timeArrived   = req.body.timeArrived;
    sendResources.wood          = req.body.wood;
    sendResources.clay          = req.body.clay;
    sendResources.iron          = req.body.iron;
    sendResources.crop          = req.body.crop;

    sendResources.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New sendResources created',
                data: sendResources
            });
        }
    });
};

exports.update = function (req, res) {
    sendResourcesModel.findOne({_id: req.params.sendResourcesId}, function (err, sendResources) {
        if (err)
            res.send(err);
        sendResources.idVillageFrom = req.body.idVillageFrom;
        sendResources.idVillageTo   = req.body.idVillageTo;
        sendResources.timeSent      = req.body.timeSent;
        sendResources.timeArrived   = req.body.timeArrived;
        sendResources.wood          = req.body.wood;
        sendResources.clay          = req.body.clay;
        sendResources.iron          = req.body.iron;
        sendResources.crop          = req.body.crop;

        sendResources.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'sendResources Info updated',
                data: sendResources
            });
        });
    });
};

exports.delete = function (req, res) {
    sendResourcesModel.deleteOne({_id: req.params.sendResourcesId}, function (err, sendResources) {
        if (err)
            res.send(err);
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