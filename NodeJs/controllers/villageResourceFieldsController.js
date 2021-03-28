const path = require('path');
const villageResourceFieldsModel = require('../models/villageResourceFieldsModel');
var tools = require('../tools/tools');
var config = require('../config.json');

exports.view = function (req, res) {
    villageResourceFieldsModel.findOne({idVillage: req.params.idVillage}, function (err, villageResourceFields) {
        if (err){
            res.status(500).json(err);
            return;
        }
        res.json({
            message: 'Loading resources..',
            data: villageResourceFields
        });
    });
};

exports.new = function (req, res) {
    var villageResourceFields = new villageResourceFieldsModel();
    villageResourceFields.idVillage = req.body.idVillage;
    for(let l = 1; l < 19; l++){
        villageResourceFields['field'+l+'Level'] = req.body['field'+l+'Level'];
        villageResourceFields['field'+l+'Type']  = req.body['field'+l+'Type'];
    }

    villageResourceFields.save(function (err) {
        if (err){
            res.status(500).json(err);
            return;
        }
        else{
            res.json({
                message: 'villageResourceFields success',
                data: villageResourceFields
            });
        }
    });
};

exports.update = function (req, res) {
    villageResourceFieldsModel.findOne({idVillage: req.params.idVillage}, function (err, villageResourceFields) {
        if (err){
            res.status(500).json(err);
            return;
        }
        
        villageResourceFields.idVillage = req.body.idVillage;
        for(let l = 1; l < 19; l++){
            villageResourceFields['field'+l+'Level'] = req.body['field'+l+'Level'];
            villageResourceFields['field'+l+'Type']  = req.body['field'+l+'Type'];
        }

        villageResourceFields.save(function (err) {
            if (err) {
                res.status(500).json({
                    message: err.toString(),
                    data: ""
                });
                return;
            }
            res.json({
                message: 'villageResourceFields Info updated',
                data: villageResourceFields
            });
        });
    });
};

exports.delete = function (req, res) {
    villageResourceFieldsModel.remove({idVillage: req.params.idVillage}, function (err, villageResourceFields) {
        if (err){
            res.status(500).json(err);
            return;
        }
        res.json({
            status: "success",
            message: 'villageResourceFields deleted'
        });
    });
};