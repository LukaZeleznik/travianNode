const path = require('path');
const reportsModel = require('../models/reportsModel');
var tools = require('../tools/tools');

exports.view = function (req, res) {
    reportsModel.find({mailboxUserId: req.params.mailboxUserId}, function (err, reports) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            message: 'Loading reports data..',
            data: reports
        });
    }).sort({createdAt:-1});
};


exports.viewByReadFlag = function (req, res) {
    reportsModel.find({
        $and: [
            { mailboxUserId: req.params.mailboxUserId },
            { readFlag: req.params.readFlag }
        ] }, function (err, reports) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            message: 'Loading reports data..',
            data: reports
        });
    }).sort({createdAt:-1});
};

// Handle create reports actions
exports.new = function (req, res) {
    var reports = new reportsModel();
    reports.time = req.body.time;
    reports.type = req.body.type;
    reports.senderUserId = req.body.senderUserId;
    reports.receiverUserId = req.body.receiverUserId;
    reports.idVillageSender = req.body.idVillageSender;
    reports.idVillageReceiver = req.body.idVillageReceiver;
    reports.tribeSender = req.body.tribeSender;
    reports.tribeReceiver = req.body.tribeReceiver;
    reports.mailboxUserId = req.body.mailboxUserId;
    reports.readFlag = req.body.readFlag ? req.body.readFlag : false;
    reports.bountyWood = req.body.bountyWood ? req.body.bountyWood : 0;
    reports.bountyClay = req.body.bountyClay ? req.body.bountyClay : 0;
    reports.bountyIron = req.body.bountyIron ? req.body.bountyIron : 0;
    reports.bountyCrop = req.body.bountyCrop ? req.body.bountyCrop : 0;
    reports.bountyTotal = req.body.bountyTotal ? req.body.bountyTotal : 0;
    reports.bountyMax = req.body.bountyMax ? req.body.bountyMax : 0;
    for(let i = 1; i < 11; i++){ //TODO change to look at InfoTable
        reports['attTroop'+i] = req.body['attTroop'+i] ? req.body['attTroop'+i] : 0;
        reports['defTroop'+i] = req.body['defTroop'+i] ? req.body['defTroop'+i] : 0;
        reports['attTroop'+i+'Casualty'] = req.body['attTroop'+i+'Casualty'] ? req.body['attTroop'+i+'Casualty'] : 0;
        reports['defTroop'+i+'Casualty'] = req.body['defTroop'+i+'Casualty'] ? req.body['defTroop'+i+'Casualty'] : 0;
    }

    reports.save(function (err) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        else{
            res.json({
                message: 'reports success',
                data: reports
            });
        }
    });
};

exports.update = function (req, res) {
    reportsModel.findOne({_id: req.params.reportId}, function (err, reports) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        reports.time = req.body.time;
        reports.type = req.body.type;
        reports.senderUserId = req.body.senderUserId;
        reports.receiverUserId = req.body.receiverUserId;
        reports.idVillageReceiver = req.body.idVillageReceiver;
        reports.tribeSender = req.body.tribeSender;
        reports.tribeReceiver = req.body.tribeReceiver;
        reports.readFlag = req.body.readFlag ? req.body.readFlag : false;
        reports.mailboxUserId = req.body.mailboxUserId;
        reports.bountyWood = req.body.bountyWood ? req.body.bountyWood : 0;
        reports.bountyClay = req.body.bountyClay ? req.body.bountyClay : 0;
        reports.bountyIron = req.body.bountyIron ? req.body.bountyIron : 0;
        reports.bountyCrop = req.body.bountyCrop ? req.body.bountyCrop : 0;
        reports.bountyTotal = req.body.bountyTotal ? req.body.bountyTotal : 0;
        reports.bountyMax = req.body.bountyMax ? req.body.bountyMax : 0;
        for(let i = 1; i < 11; i++){
            reports['attTroop'+i] = req.body['attTroop'+i] ? req.body['attTroop'+i] : 0;
            reports['defTroop'+i] = req.body['defTroop'+i] ? req.body['defTroop'+i] : 0;
            reports['attTroop'+i+'Casualty'] = req.body['attTroop'+i+'Casualty'] ? req.body['attTroop'+i+'Casualty'] : 0;
            reports['defTroop'+i+'Casualty'] = req.body['defTroop'+i+'Casualty'] ? req.body['defTroop'+i+'Casualty'] : 0;
        }

        reports.save(function (err) {
            if (err) {
                res.status(500).json({
                    message: err.toString(),
                    data: ""
                });
                return;
            }
            res.json({
                message: 'reports Info updated',
                data: reports
            });
        });
    });
};

exports.delete = function (req, res) {
    reportsModel.deleteOne({reportId: req.params.reportId}, function (err, reports) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            status: "success",
            message: 'reports deleted'
        });
    });
};