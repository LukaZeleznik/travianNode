const path = require('path');
const villageProductionsModel = require('../models/villageProductionsModel');

exports.view = function (req, res) {
    villageProductionsModel.findOne({idVillage: req.params.idVillage}, function (err, villageProductions) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: villageProductions
        });
    });
};

// Handle create villageProductions actions
exports.new = function (req, res) {
    var villageProductions = new villageProductionsModel();
    villageProductions.idVillage = req.body.idVillage;
    villageProductions.productionWood = req.body.productionWood;
    villageProductions.productionClay = req.body.productionClay;
    villageProductions.productionIron = req.body.productionIron;
    villageProductions.productionCrop = req.body.productionCrop;

    villageProductions.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New villageProductions created',
                data: villageProductions
            });
        }
    });
};

exports.update = function (req, res) {
    villageProductionsModel.findOne({idVillage: req.params.idVillage}, function (err, villageProductions) {
        if (err)
            res.send(err);
        
        villageProductions.idVillage = req.body.idVillage;
        villageProductions.productionWood = req.body.productionWood;
        villageProductions.productionClay = req.body.productionClay;
        villageProductions.productionIron = req.body.productionIron;
        villageProductions.productionCrop = req.body.productionCrop;

        villageProductions.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageProductions Info updated',
                data: villageProductions
            });
        });
    });
};

exports.delete = function (req, res) {
    villageProductionsModel.remove({idVillage: req.params.idVillage}, function (err, villageProductions) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageProductions deleted'
        });
    });
};