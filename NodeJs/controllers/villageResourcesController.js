const path = require('path');
const villageResourcesModel = require('../models/villageResourcesModel');

exports.view = function (req, res) {
    villageResourcesModel.findOne({idVillage: req.params.idVillage}, function (err, villageResources) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: villageResources
        });
    });
};

// Handle create villageResources actions
exports.new = function (req, res) {
    var villageResources = new villageResourcesModel();
    villageResources.idVillage = req.body.idVillage;
    villageResources.currentWood = req.body.currentWood;
    villageResources.currentClay = req.body.currentClay;
    villageResources.currentIron = req.body.currentIron;
    villageResources.currentCrop = req.body.currentCrop;
    villageResources.lastUpdate = req.body.lastUpdate;

    villageResources.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New villageResources created',
                data: villageResources
            });
        }
    });
};

exports.update = function (req, res) {
    villageResourcesModel.findOne({idVillage: req.params.idVillage}, function (err, villageResources) {
        if (err)
            res.send(err);
        
        villageResources.idVillage = req.body.idVillage;
        villageResources.currentWood = req.body.currentWood;
        villageResources.currentClay = req.body.currentClay;
        villageResources.currentIron = req.body.currentIron;
        villageResources.currentCrop = req.body.currentCrop;
        villageResources.lastUpdate = req.body.lastUpdate;

        villageResources.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageResources Info updated',
                data: villageResources
            });
        });
    });
};

exports.delete = function (req, res) {
    villageResourcesModel.remove({idVillage: req.params.idVillage}, function (err, villageResources) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageResources deleted'
        });
    });
};