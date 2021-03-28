const path = require('path');
const reportsModel = require('../models/reportsModel');
var tools = require('../tools/tools');

exports.view = function (req, res) {
    reportsModel.find({$or: [{idVillageAttacker: req.params.idVillage}, {idVillageDefender: req.params.idVillage}] }, function (err, reports) {
        if (err){
            res.status(500).json(err);
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
    reports.idVillageAttacker = req.body.idVillageAttacker;
    reports.idVillageDefender = req.body.idVillageDefender;
    reports.tribeAttacker = req.body.tribeAttacker;
    reports.tribeDefender = req.body.tribeDefender;
    reports.bountyWood = req.body.bountyWood ? req.body.bountyWood : 0;
    reports.bountyClay = req.body.bountyClay ? req.body.bountyClay : 0;
    reports.bountyIron = req.body.bountyIron ? req.body.bountyIron : 0;
    reports.bountyCrop = req.body.bountyCrop ? req.body.bountyCrop : 0;
    reports.bountyTotal = req.body.bountyTotal ? req.body.bountyTotal : 0;
    reports.bountyMax = req.body.bountyMax ? req.body.bountyMax : 0;
    for(let i = 1; i < 11; i++){
        reports['attTroop'+i] = req.body['attTroop'+i];
        reports['defTroop'+i] = req.body['defTroop'+i];
        reports['attTroop'+i+'Casualty'] = req.body['attTroop'+i+'Casualty'];
        reports['defTroop'+i+'Casualty'] = req.body['defTroop'+i+'Casualty'];
    }

    reports.save(function (err) {
        if (err){
            res.status(500).json(err);
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
    reportsModel.findOne({_id: req.params.idReport}, function (err, reports) {
        if (err){
            res.status(500).json(err);
            return;
        }
        reports.time = req.body.time;
        reports.idVillageAttacker = req.body.idVillageAttacker;
        reports.idVillageDefender = req.body.idVillageDefender;
        reports.tribeAttacker = req.body.tribeAttacker;
        reports.tribeDefender = req.body.tribeDefender;
        reports.bountyWood = req.body.bountyWood ? req.body.bountyWood : 0;
        reports.bountyClay = req.body.bountyClay ? req.body.bountyClay : 0;
        reports.bountyIron = req.body.bountyIron ? req.body.bountyIron : 0;
        reports.bountyCrop = req.body.bountyCrop ? req.body.bountyCrop : 0;
        reports.bountyTotal = req.body.bountyTotal ? req.body.bountyTotal : 0;
        reports.bountyMax = req.body.bountyMax ? req.body.bountyMax : 0;
        for(let i = 1; i < 11; i++){
            reports['attTroop'+i] = req.body['attTroop'+i];
            reports['defTroop'+i] = req.body['defTroop'+i];
            reports['attTroop'+i+'Casualty'] = req.body['attTroop'+i+'Casualty'];
            reports['defTroop'+i+'Casualty'] = req.body['defTroop'+i+'Casualty'];
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
    reportsModel.remove({idReport: req.params.idReport}, function (err, reports) {
        if (err){
            res.status(500).json(err);
            return;
        }
        res.json({
            status: "success",
            message: 'reports deleted'
        });
    });
};