const path = require('path');
const villageBuildingFieldsModel = require('../models/villageBuildingFieldsModel');

exports.view = function (req, res) {
    villageBuildingFieldsModel.findOne({idVillage: req.params.idVillage}, function (err, villageBuildingFields) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            message: 'Loading buildings data..',
            data: villageBuildingFields
        });
    });
};

// Handle create villageBuildingFields actions
exports.new = function (req, res) {
    var villageBuildingFields = new villageBuildingFieldsModel();
    villageBuildingFields.idVillage = req.body.idVillage;
    for(let l = 1; l < 20; l++){
        villageBuildingFields['field'+l+'Level'] = req.body['field'+l+'Level'];
        villageBuildingFields['field'+l+'Type']  = req.body['field'+l+'Type'];
    }

    villageBuildingFields.save(function (err) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        else{
            res.json({
                message: 'villageBuildingFields success',
                data: villageBuildingFields
            });
        }
    });
};

exports.update = function (req, res) {
    villageBuildingFieldsModel.findOne({idVillage: req.params.idVillage}, function (err, villageBuildingFields) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
            villageBuildingFields.idVillage = req.body.idVillage;
            for(let l = 1; l < 20; l++){
                villageBuildingFields['field'+l+'Level'] = req.body['field'+l+'Level'];
                villageBuildingFields['field'+l+'Type']  = req.body['field'+l+'Type'];
            }

            villageBuildingFields.save(function (err) {
            if (err) {
                res.status(500).json({
                    message: err.toString(),
                    data: ""
                });
                return;
            }
            res.json({
                message: 'villageBuildingFields Info updated',
                data: villageBuildingFields
            });
        });
    });
};

exports.delete = function (req, res) {
    villageBuildingFieldsModel.remove({idVillage: req.params.idVillage}, function (err, villageBuildingFields) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            status: "success",
            message: 'villageBuildingFields deleted'
        });
    });
};