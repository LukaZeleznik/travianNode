const path = require('path');
const villageReinforcementsModel = require('../models/villageReinforcementsModel');
var tools = require('../tools/tools');
var config = require('../config.json');

exports.view = function (req, res) {
    villageReinforcementsModel.find({idVillage: req.params.idVillage}, function (err, villageReinforcements) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        let reinforcements = {};
        for (let tribe of Object.keys(tools.troopInfoLookup)){
            reinforcements[tribe] = {};
            for (let troop of tools.troopInfoLookup[tribe]){
                reinforcements[tribe]['troop'+troop['id']] = 0;
            }
        }
        for (let villageReinforcement of villageReinforcements) {
            for (let troop of tools.troopInfoLookup[villageReinforcement.troopTribe]){
                reinforcements[villageReinforcement.troopTribe]['troop'+troop['id']] += villageReinforcement['troop' + troop['id']];
            }
        }
        res.json({
            message: 'Loading village reinforcements..',
            data: reinforcements
        });
    });
};

exports.viewExact = function (req, res) {
    villageReinforcementsModel.findOne({idVillageFrom: req.params.idVillageFrom, idVillage: req.params.idVillage}, function (err, villageReinforcements) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            message: 'Loading exact village reinforcements..',
            data: villageReinforcements
        });
    });
};

// Handle create villageReinforcements actions
exports.new = function (req, res) {
    var villageReinforcements = new villageReinforcementsModel();
    villageReinforcements.idVillage     = req.body.idVillage;
    villageReinforcements.idVillageFrom = req.body.idVillageFrom;
    villageReinforcements.troopTribe    = req.body.troopTribe;
    for(let troop of tools.troopInfoLookup[req.body.troopTribe]){
        villageReinforcements['troop' + troop['id']] = req.body['troop' + troop['id']];
    }

    villageReinforcements.save(function (err) {
        if (err){
            res.status(500).json(err);
            console.log(err);
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
    villageReinforcementsModel.findOne({_id: req.params.reinforcementId}, function (err, villageReinforcements) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        villageReinforcements.idVillage     = req.body.idVillage;
        villageReinforcements.idVillageFrom = req.body.idVillageFrom;
        villageReinforcements.troopTribe    = req.body.troopTribe;
        for(let troop of tools.troopInfoLookup[req.body.troopTribe]){
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
    villageReinforcementsModel.deleteOne({_id: req.params.reinforcementId}, function (err, villageReinforcements) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            status: "success",
            message: 'villageReinforcements deleted'
        });
    });
};