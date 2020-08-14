const path = require('path');
const villageReinforcementsModel = require('../models/villageReinforcementsModel');

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
    villageReinforcements.troop1 = req.body.troop1;
    villageReinforcements.troop2 = req.body.troop2;
    villageReinforcements.troop3 = req.body.troop3;
    villageReinforcements.troop4 = req.body.troop4;
    villageReinforcements.troop5 = req.body.troop5;
    villageReinforcements.troop6 = req.body.troop6;
    villageReinforcements.troop7 = req.body.troop7;
    villageReinforcements.troop8 = req.body.troop8;
    villageReinforcements.troop9 = req.body.troop9;
    villageReinforcements.troop10 = req.body.troop10;

    villageReinforcements.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New villageReinforcements created',
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
        villageReinforcements.troop1 = req.body.troop1;
        villageReinforcements.troop2 = req.body.troop2;
        villageReinforcements.troop3 = req.body.troop3;
        villageReinforcements.troop4 = req.body.troop4;
        villageReinforcements.troop5 = req.body.troop5;
        villageReinforcements.troop6 = req.body.troop6;
        villageReinforcements.troop7 = req.body.troop7;
        villageReinforcements.troop8 = req.body.troop8;
        villageReinforcements.troop9 = req.body.troop9;
        villageReinforcements.troop10 = req.body.troop10;

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