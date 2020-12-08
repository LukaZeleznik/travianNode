const path = require('path');
const villageReinforcementsModel = require('../models/villageReinforcementsModel');
var tools = require('../tools/tools');
var config = require('../config.json');

exports.view = function (req, res) {
    villageReinforcementsModel.find({$or: [{idVillageFrom: req.params.idVillage}, {idVillage: req.params.idVillage}] }, function (err, villageReinforcements) {
        if (err)
            res.send(err);
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
    for(let troop in tools.troopInfoLookup[req.body.tribe]){
        villageReinforcements['troop' + tools.troopInfoLookup[req.body.tribe][troop].id] = req.body['troop' + tools.troopInfoLookup[req.body.tribe][troop].id];
    }

    villageReinforcements.save(function (err) {
        if (err){
            res.json(err);
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
        if (err)
            res.send(err);
        
        villageReinforcements.reinforcementId = req.body.reinforcementId;
        villageReinforcements.idVillage = req.body.idVillage;
        villageReinforcements.idVillageFrom = req.body.idVillageFrom;
        villageReinforcements.tribe = req.body.tribe;
        for(let troop in tools.troopInfoLookup[req.body.tribe]){
            villageReinforcements['troop' + tools.troopInfoLookup[req.body.tribe][troop].id] = req.body['troop' + tools.troopInfoLookup[req.body.tribe][troop].id];
        }

        villageReinforcements.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageReinforcements Info updated',
                data: villageReinforcements
            });
        });
    });
};

exports.delete = function (req, res) {
    villageReinforcementsModel.remove({reinforcementId: req.params.reinforcementId  }, function (err, villageReinforcements) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageReinforcements deleted'
        });
    });
};