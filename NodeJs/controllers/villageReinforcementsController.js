const path = require('path');
const villageReinforcementsModel = require('../models/villageReinforcementsModel');
var tools = require('../tools/tools');
var config = require('../config.json');

exports.view = function (req, res) {
    villageReinforcementsModel.find({$or: [{idVillageFrom: req.params.idVillage}, {idVillage: req.params.idVillage}] }, function (err, villageReinforcements) {
        if (err){
            res.status(500).json(err);
            return;
        }
        res.json({
            message: 'Loading resources..',
            data: villageReinforcements
        });
    });
};

// Handle create villageReinforcements actions
exports.new = function (req, res) {
    var villageReinforcements = new villageReinforcementsModel();
    villageReinforcements.reinforcementId = req.body.reinforcementId;
    villageReinforcements.idVillage = req.body.idVillage;
    villageReinforcements.idVillageFrom = req.body.idVillageFrom;
    villageReinforcements.tribe = req.body.tribe;
    for(let troop of tools.troopInfoLookup[req.body.tribe]){
        villageReinforcements['troop' + troop['id']] = req.body['troop' + troop['id']];
    }

    villageReinforcements.save(function (err) {
        if (err){
            res.status(500).json(err);
            return;
        }
        else{
            res.json({
                message: 'villageReinforcements success',
                data: villageReinforcements
            });
        }
    });
};

exports.update = function (req, res) {
    villageReinforcementsModel.findOne({reinforcementId: req.params.reinforcementId}, function (err, villageReinforcements) {
        if (err){
            res.status(500).json(err);
            return;
        }
        
        villageReinforcements.reinforcementId = req.body.reinforcementId;
        villageReinforcements.idVillage = req.body.idVillage;
        villageReinforcements.idVillageFrom = req.body.idVillageFrom;
        villageReinforcements.tribe = req.body.tribe;
        for(let troop of tools.troopInfoLookup[req.body.tribe]){
            villageReinforcements['troop' + troop['id']] = req.body['troop' + troop['id']];
        }

        villageReinforcements.save(function (err) {
            if (err) {
                res.status(500).json({
                    message: err.toString(),
                    data: ""
                });
                return;
            }
            res.json({
                message: 'villageReinforcements Info updated',
                data: villageReinforcements
            });
        });
    });
};

exports.delete = function (req, res) {
    villageReinforcementsModel.remove({reinforcementId: req.params.reinforcementId}, function (err, villageReinforcements) {
        if (err){
            res.status(500).json(err);
            return;
        }
        res.json({
            status: "success",
            message: 'villageReinforcements deleted'
        });
    });
};