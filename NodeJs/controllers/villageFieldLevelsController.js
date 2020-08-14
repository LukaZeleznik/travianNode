const path = require('path');
const villageFieldLevelsModel = require('../models/villageFieldLevelsModel');

exports.view = function (req, res) {
    villageFieldLevelsModel.findOne({idVillage: req.params.idVillage}, function (err, villageFieldLevels) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: villageFieldLevels
        });
    });
};

// Handle create villageFieldLevels actions
exports.new = function (req, res) {
    var villageFieldLevels = new villageFieldLevelsModel();
    villageFieldLevels.idVillage = req.body.idVillage;
    villageFieldLevels.resField1Level = req.body.resField1Level;
    villageFieldLevels.resField2Level = req.body.resField2Level;
    villageFieldLevels.resField3Level = req.body.resField3Level;
    villageFieldLevels.resField4Level = req.body.resField4Level;
    villageFieldLevels.resField5Level = req.body.resField5Level;
    villageFieldLevels.resField6Level = req.body.resField6Level;
    villageFieldLevels.resField7Level = req.body.resField7Level;
    villageFieldLevels.resField8Level = req.body.resField8Level;
    villageFieldLevels.resField9Level = req.body.resField9Level;
    villageFieldLevels.resField10Level = req.body.resField10Level;
    villageFieldLevels.resField11Level = req.body.resField11Level;
    villageFieldLevels.resField12Level = req.body.resField12Level;
    villageFieldLevels.resField13Level = req.body.resField13Level;
    villageFieldLevels.resField14Level = req.body.resField14Level;
    villageFieldLevels.resField15Level = req.body.resField15Level;
    villageFieldLevels.resField16Level = req.body.resField16Level;
    villageFieldLevels.resField17Level = req.body.resField17Level;
    villageFieldLevels.resField18Level = req.body.resField18Level;

    villageFieldLevels.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New villageFieldLevels created',
                data: villageFieldLevels
            });
        }
    });
};

exports.update = function (req, res) {
    villageFieldLevelsModel.findOne({idVillage: req.params.idVillage}, function (err, villageFieldLevels) {
        if (err)
            res.send(err);
        
        villageFieldLevels.idVillage = req.body.idVillage;
        villageFieldLevels.resField1Level = req.body.resField1Level;
        villageFieldLevels.resField2Level = req.body.resField2Level;
        villageFieldLevels.resField3Level = req.body.resField3Level;
        villageFieldLevels.resField4Level = req.body.resField4Level;
        villageFieldLevels.resField5Level = req.body.resField5Level;
        villageFieldLevels.resField6Level = req.body.resField6Level;
        villageFieldLevels.resField7Level = req.body.resField7Level;
        villageFieldLevels.resField8Level = req.body.resField8Level;
        villageFieldLevels.resField9Level = req.body.resField9Level;
        villageFieldLevels.resField10Level = req.body.resField10Level;
        villageFieldLevels.resField11Level = req.body.resField11Level;
        villageFieldLevels.resField12Level = req.body.resField12Level;
        villageFieldLevels.resField13Level = req.body.resField13Level;
        villageFieldLevels.resField14Level = req.body.resField14Level;
        villageFieldLevels.resField15Level = req.body.resField15Level;
        villageFieldLevels.resField16Level = req.body.resField16Level;
        villageFieldLevels.resField17Level = req.body.resField17Level;
        villageFieldLevels.resField18Level = req.body.resField18Level;

        villageFieldLevels.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageFieldLevels Info updated',
                data: villageFieldLevels
            });
        });
    });
};

exports.delete = function (req, res) {
    villageFieldLevelsModel.remove({idVillage: req.params.idVillage}, function (err, villageFieldLevels) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageFieldLevels deleted'
        });
    });
};