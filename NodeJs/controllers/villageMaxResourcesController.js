const path = require('path');
const villageMaxResourcesModel = require('../models/villageMaxResourcesModel');

exports.view = function (req, res) {
    villageMaxResourcesModel.findOne({idVillage: req.params.idVillage}, function (err, villageMaxResources) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: villageMaxResources
        });
    });
};

// Handle create villageMaxResources actions
exports.new = function (req, res) {
    var villageMaxResources = new villageMaxResourcesModel();
    villageMaxResources.idVillage = req.body.idVillage;
    villageMaxResources.maxWood = req.body.maxWood;
    villageMaxResources.maxClay = req.body.maxClay;
    villageMaxResources.maxIron = req.body.maxIron;
    villageMaxResources.maxCrop = req.body.maxCrop;

    villageMaxResources.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New villageMaxResources created',
                data: villageMaxResources
            });
        }
    });
};

exports.update = function (req, res) {
    villageMaxResourcesModel.findOne({idVillage: req.params.idVillage}, function (err, villageMaxResources) {
        if (err)
            res.send(err);
        
        villageMaxResources.idVillage = req.body.idVillage;
        villageMaxResources.maxWood = req.body.maxWood;
        villageMaxResources.maxClay = req.body.maxClay;
        villageMaxResources.maxIron = req.body.maxIron;
        villageMaxResources.maxCrop = req.body.maxCrop;

        villageMaxResources.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageMaxResources Info updated',
                data: villageMaxResources
            });
        });
    });
};

exports.delete = function (req, res) {
    villageMaxResourcesModel.remove({idVillage: req.params.idVillage}, function (err, villageMaxResources) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageMaxResources deleted'
        });
    });
};