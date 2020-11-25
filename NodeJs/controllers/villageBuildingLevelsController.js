const path = require('path');
const villageBuildingLevelsModel = require('../models/villageBuildingLevelsModel');

exports.view = function (req, res) {
    villageBuildingLevelsModel.findOne({idVillage: req.params.idVillage}, function (err, villageBuildingLevels) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading building levels..',
            data: villageBuildingLevels
        });
    });
};

// Handle create villageBuildingLevels actions
exports.new = function (req, res) {
    var villageBuildingLevels = new villageBuildingLevelsModel();
    villageBuildingLevels.idVillage = req.body.idVillage;
    villageBuildingLevels.field1Level = req.body.field1Level;
    villageBuildingLevels.field2Level = req.body.field2Level;
    villageBuildingLevels.field3Level = req.body.field3Level;
    villageBuildingLevels.field4Level = req.body.field4Level;
    villageBuildingLevels.field5Level = req.body.field5Level;
    villageBuildingLevels.field6Level = req.body.field6Level;
    villageBuildingLevels.field7Level = req.body.field7Level;
    villageBuildingLevels.field8Level = req.body.field8Level;
    villageBuildingLevels.field9Level = req.body.field9Level;
    villageBuildingLevels.field10Level = req.body.field10Level;
    villageBuildingLevels.field11Level = req.body.field11Level;
    villageBuildingLevels.field12Level = req.body.field12Level;
    villageBuildingLevels.field13Level = req.body.field13Level;
    villageBuildingLevels.field14Level = req.body.field14Level;
    villageBuildingLevels.field15Level = req.body.field15Level;
    villageBuildingLevels.field16Level = req.body.field16Level;
    villageBuildingLevels.field17Level = req.body.field17Level;
    villageBuildingLevels.field18Level = req.body.field18Level;

    villageBuildingLevels.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New villageBuildingLevels created',
                data: villageBuildingLevels
            });
        }
    });
};

exports.update = function (req, res) {
    villageBuildingLevelsModel.findOne({idVillage: req.params.idVillage}, function (err, villageBuildingLevels) {
        if (err)
            res.send(err);
            villageBuildingLevels.idVillage = req.body.idVillage;
            villageBuildingLevels.field1Level = req.body.field1Level;
            villageBuildingLevels.field2Level = req.body.field2Level;
            villageBuildingLevels.field3Level = req.body.field3Level;
            villageBuildingLevels.field4Level = req.body.field4Level;
            villageBuildingLevels.field5Level = req.body.field5Level;
            villageBuildingLevels.field6Level = req.body.field6Level;
            villageBuildingLevels.field7Level = req.body.field7Level;
            villageBuildingLevels.field8Level = req.body.field8Level;
            villageBuildingLevels.field9Level = req.body.field9Level;
            villageBuildingLevels.field10Level = req.body.field10Level;
            villageBuildingLevels.field11Level = req.body.field11Level;
            villageBuildingLevels.field12Level = req.body.field12Level;
            villageBuildingLevels.field13Level = req.body.field13Level;
            villageBuildingLevels.field14Level = req.body.field14Level;
            villageBuildingLevels.field15Level = req.body.field15Level;
            villageBuildingLevels.field16Level = req.body.field16Level;
            villageBuildingLevels.field17Level = req.body.field17Level;
            villageBuildingLevels.field18Level = req.body.field18Level;

            villageBuildingLevels.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageBuildingLevels Info updated',
                data: villageBuildingLevels
            });
        });
    });
};

exports.delete = function (req, res) {
    villageBuildingLevelsModel.remove({idVillage: req.params.idVillage}, function (err, villageBuildingLevels) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageBuildingLevels deleted'
        });
    });
};