const path = require('path');
const villageResourceFieldsModel = require('../models/villageResourceFieldsModel');

exports.view = function (req, res) {
    villageResourceFieldsModel.findOne({idVillage: req.params.idVillage}, function (err, villageResourceFields) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading resources..',
            data: villageResourceFields
        });
    });
};

exports.new = function (req, res) {
    var villageResourceFields = new villageResourceFieldsModel();
    villageResourceFields.idVillage = req.body.idVillage;
    villageResourceFields.field1Level = req.body.field1Level;
    villageResourceFields.field2Level = req.body.field2Level;
    villageResourceFields.field3Level = req.body.field3Level;
    villageResourceFields.field4Level = req.body.field4Level;
    villageResourceFields.field5Level = req.body.field5Level;
    villageResourceFields.field6Level = req.body.field6Level;
    villageResourceFields.field7Level = req.body.field7Level;
    villageResourceFields.field8Level = req.body.field8Level;
    villageResourceFields.field9Level = req.body.field9Level;
    villageResourceFields.field10Level = req.body.field10Level;
    villageResourceFields.field11Level = req.body.field11Level;
    villageResourceFields.field12Level = req.body.field12Level;
    villageResourceFields.field13Level = req.body.field13Level;
    villageResourceFields.field14Level = req.body.field14Level;
    villageResourceFields.field15Level = req.body.field15Level;
    villageResourceFields.field16Level = req.body.field16Level;
    villageResourceFields.field17Level = req.body.field17Level;
    villageResourceFields.field18Level = req.body.field18Level;
    villageResourceFields.field1Type = req.body.field1Type;
    villageResourceFields.field2Type = req.body.field2Type;
    villageResourceFields.field3Type = req.body.field3Type;
    villageResourceFields.field4Type = req.body.field4Type;
    villageResourceFields.field5Type = req.body.field5Type;
    villageResourceFields.field6Type = req.body.field6Type;
    villageResourceFields.field7Type = req.body.field7Type;
    villageResourceFields.field8Type = req.body.field8Type;
    villageResourceFields.field9Type = req.body.field9Type;
    villageResourceFields.field10Type = req.body.field10Type;
    villageResourceFields.field11Type = req.body.field11Type;
    villageResourceFields.field12Type = req.body.field12Type;
    villageResourceFields.field13Type = req.body.field13Type;
    villageResourceFields.field14Type = req.body.field14Type;
    villageResourceFields.field15Type = req.body.field15Type;
    villageResourceFields.field16Type = req.body.field16Type;
    villageResourceFields.field17Type = req.body.field17Type;
    villageResourceFields.field18Type = req.body.field18Type;

    villageResourceFields.save(function (err) {
        if (err){
            res.json(err);
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
        if (err)
            res.send(err);
        
        villageResourceFields.idVillage = req.body.idVillage;
        villageResourceFields.field1Level = req.body.field1Level;
        villageResourceFields.field2Level = req.body.field2Level;
        villageResourceFields.field3Level = req.body.field3Level;
        villageResourceFields.field4Level = req.body.field4Level;
        villageResourceFields.field5Level = req.body.field5Level;
        villageResourceFields.field6Level = req.body.field6Level;
        villageResourceFields.field7Level = req.body.field7Level;
        villageResourceFields.field8Level = req.body.field8Level;
        villageResourceFields.field9Level = req.body.field9Level;
        villageResourceFields.field10Level = req.body.field10Level;
        villageResourceFields.field11Level = req.body.field11Level;
        villageResourceFields.field12Level = req.body.field12Level;
        villageResourceFields.field13Level = req.body.field13Level;
        villageResourceFields.field14Level = req.body.field14Level;
        villageResourceFields.field15Level = req.body.field15Level;
        villageResourceFields.field16Level = req.body.field16Level;
        villageResourceFields.field17Level = req.body.field17Level;
        villageResourceFields.field18Level = req.body.field18Level;

        villageResourceFields.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageResourceFields Info updated',
                data: villageResourceFields
            });
        });
    });
};

exports.delete = function (req, res) {
    villageResourceFieldsModel.remove({idVillage: req.params.idVillage}, function (err, villageResourceFields) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageResourceFields deleted'
        });
    });
};