const path = require('path');
const reportsModel = require('../models/reportsModel');
var tools = require('../tools/tools');

exports.view = function (req, res) {
    reportsModel.find({$or: [{idVillageAttacker: req.params.idVillage}, {idVillageDefender: req.params.idVillage}] }, function (err, reports) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading reports data..',
            data: reports
        });
    }).sort({createdAt:-1});
};

// Handle create reports actions
exports.new = function (req, res) {
    var reports = new reportsModel();
    reports.idVillageAttacker = req.body.idVillageAttacker;
    reports.idVillageDefender = req.body.idVillageDefender;
    reports.tribeAttacker = req.body.tribeAttacker;
    reports.tribeDefender = req.body.tribeDefender;
    reports.bountyWood = req.body.bountyWood;
    reports.bountyClay = req.body.bountyClay;
    reports.bountyIron = req.body.bountyIron;
    reports.bountyCrop = req.body.bountyCrop;
    reports.bountyTotal = req.body.bountyTotal;
    reports.bountyMax = req.body.bountyMax;
    for(let i = 1; i < 11; i++){
        reports['attTroop'+i] = req.body['attTroop'+i];
        reports['defTroop'+i] = req.body['defTroop'+i];
        reports['attTroop'+i+'Casualty'] = req.body['attTroop'+i+'Casualty'];
        reports['defTroop'+i+'Casualty'] = req.body['defTroop'+i+'Casualty'];
    }

    reports.save(function (err) {
        if (err){
            res.json(err);
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
        if (err)
            res.send(err);
        reports.idVillageAttacker = req.body.idVillageAttacker;
        reports.idVillageDefender = req.body.idVillageDefender;
        reports.tribeAttacker = req.body.tribeAttacker;
        reports.tribeDefender = req.body.tribeDefender;
        reports.bountyWood = req.body.bountyWood;
        reports.bountyClay = req.body.bountyClay;
        reports.bountyIron = req.body.bountyIron;
        reports.bountyCrop = req.body.bountyCrop;
        reports.bountyTotal = req.body.bountyTotal;
        reports.bountyMax = req.body.bountyMax;
        for(let i = 1; i < 11; i++){
            reports['attTroop'+i] = req.body['attTroop'+i];
            reports['defTroop'+i] = req.body['defTroop'+i];
            reports['attTroop'+i+'Casualty'] = req.body['attTroop'+i+'Casualty'];
            reports['defTroop'+i+'Casualty'] = req.body['defTroop'+i+'Casualty'];
        }

        reports.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'reports Info updated',
                data: reports
            });
        });
    });
};

exports.delete = function (req, res) {
    reportsModel.remove({idReport: req.params.idReport}, function (err, reports) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'reports deleted'
        });
    });
};