const path = require('path');
const userModel = require('../models/userModel');

exports.view = function (req, res) {
    userModel.findOne({_id: req.params.idUser}, function (err, user) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: user
        });
    });
};

// Handle create user actions
exports.new = function (req, res) {
    var user = new userModel();
    user.name = req.body.name;

    user.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'user success',
                data: user
            });
        }
    });
};
/*
exports.update = function (req, res) {
    userModel.findOne({idVillage: req.params.idVillage}, function (err, user) {
        if (err)
            res.send(err);
        
        user.idVillage = req.body.idVillage;
        user.currentWood = req.body.currentWood;
        user.currentClay = req.body.currentClay;
        user.currentIron = req.body.currentIron;
        user.currentCrop = req.body.currentCrop;
        user.lastUpdate = req.body.lastUpdate;

        user.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'user Info updated',
                data: user
            });
        });
    });
};

exports.delete = function (req, res) {
    userModel.remove({idVillage: req.params.idVillage}, function (err, user) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'user deleted'
        });
    });
};
*/