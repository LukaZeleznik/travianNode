const path = require('path');
const villageFieldTypesModel = require('../models/villageFieldTypesModel');

exports.view = function (req, res) {
    villageFieldTypesModel.findOne({idVillage: req.params.idVillage}, function (err, villageFieldTypes) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: villageFieldTypes
        });
    });
};

// Handle create villageFieldTypes actions
exports.new = function (req, res) {
    var villageFieldTypes = new villageFieldTypesModel();
    villageFieldTypes.idVillage = req.body.idVillage;
    villageFieldTypes.resField1Type = req.body.resField1Type;
    villageFieldTypes.resField2Type = req.body.resField2Type;
    villageFieldTypes.resField3Type = req.body.resField3Type;
    villageFieldTypes.resField4Type = req.body.resField4Type;
    villageFieldTypes.resField5Type = req.body.resField5Type;
    villageFieldTypes.resField6Type = req.body.resField6Type;
    villageFieldTypes.resField7Type = req.body.resField7Type;
    villageFieldTypes.resField8Type = req.body.resField8Type;
    villageFieldTypes.resField9Type = req.body.resField9Type;
    villageFieldTypes.resField10Type = req.body.resField10Type;
    villageFieldTypes.resField11Type = req.body.resField11Type;
    villageFieldTypes.resField12Type = req.body.resField12Type;
    villageFieldTypes.resField13Type = req.body.resField13Type;
    villageFieldTypes.resField14Type = req.body.resField14Type;
    villageFieldTypes.resField15Type = req.body.resField15Type;
    villageFieldTypes.resField16Type = req.body.resField16Type;
    villageFieldTypes.resField17Type = req.body.resField17Type;
    villageFieldTypes.resField18Type = req.body.resField18Type;

    villageFieldTypes.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New villageFieldTypes created',
                data: villageFieldTypes
            });
        }
    });
};

exports.update = function (req, res) {
    villageFieldTypesModel.findOne({idVillage: req.params.idVillage}, function (err, villageFieldTypes) {
        if (err)
            res.send(err);
        
        villageFieldTypes.idVillage = req.body.idVillage;
        villageFieldTypes.resField1Type = req.body.resField1Type;
        villageFieldTypes.resField2Type = req.body.resField2Type;
        villageFieldTypes.resField3Type = req.body.resField3Type;
        villageFieldTypes.resField4Type = req.body.resField4Type;
        villageFieldTypes.resField5Type = req.body.resField5Type;
        villageFieldTypes.resField6Type = req.body.resField6Type;
        villageFieldTypes.resField7Type = req.body.resField7Type;
        villageFieldTypes.resField8Type = req.body.resField8Type;
        villageFieldTypes.resField9Type = req.body.resField9Type;
        villageFieldTypes.resField10Type = req.body.resField10Type;
        villageFieldTypes.resField11Type = req.body.resField11Type;
        villageFieldTypes.resField12Type = req.body.resField12Type;
        villageFieldTypes.resField13Type = req.body.resField13Type;
        villageFieldTypes.resField14Type = req.body.resField14Type;
        villageFieldTypes.resField15Type = req.body.resField15Type;
        villageFieldTypes.resField16Type = req.body.resField16Type;
        villageFieldTypes.resField17Type = req.body.resField17Type;
        villageFieldTypes.resField18Type = req.body.resField18Type;

        villageFieldTypes.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageFieldTypes Info updated',
                data: villageFieldTypes
            });
        });
    });
};

exports.delete = function (req, res) {
    villageFieldTypesModel.remove({idVillage: req.params.idVillage}, function (err, villageFieldTypes) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageFieldTypes deleted'
        });
    });
};