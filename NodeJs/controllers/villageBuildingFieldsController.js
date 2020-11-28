const path = require('path');
const villageBuildingFieldsModel = require('../models/villageBuildingFieldsModel');

exports.view = function (req, res) {
    villageBuildingFieldsModel.findOne({idVillage: req.params.idVillage}, function (err, villageBuildingFields) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading buildings data..',
            data: villageBuildingFields
        });
    });
};

// Handle create villageBuildingFields actions
exports.new = function (req, res) {
    var villageBuildingFields = new villageBuildingFieldsModel();
    villageBuildingFields.idVillage      = req.body.idVillage;
    villageBuildingFields.field1Level    = req.body.field1Level;
    villageBuildingFields.field2Level    = req.body.field2Level;
    villageBuildingFields.field3Level    = req.body.field3Level;
    villageBuildingFields.field4Level    = req.body.field4Level;
    villageBuildingFields.field5Level    = req.body.field5Level;
    villageBuildingFields.field6Level    = req.body.field6Level;
    villageBuildingFields.field7Level    = req.body.field7Level;
    villageBuildingFields.field8Level    = req.body.field8Level;
    villageBuildingFields.field9Level    = req.body.field9Level;
    villageBuildingFields.field10Level   = req.body.field10Level;
    villageBuildingFields.field11Level   = req.body.field11Level;
    villageBuildingFields.field12Level   = req.body.field12Level;
    villageBuildingFields.field13Level   = req.body.field13Level;
    villageBuildingFields.field14Level   = req.body.field14Level;
    villageBuildingFields.field15Level   = req.body.field15Level;
    villageBuildingFields.field16Level   = req.body.field16Level;
    villageBuildingFields.field17Level   = req.body.field17Level;
    villageBuildingFields.field18Level   = req.body.field18Level;
    villageBuildingFields.field1Type     = req.body.field1Type;
    villageBuildingFields.field2Type     = req.body.field2Type;
    villageBuildingFields.field3Type     = req.body.field3Type;
    villageBuildingFields.field4Type     = req.body.field4Type;
    villageBuildingFields.field5Type     = req.body.field5Type;
    villageBuildingFields.field6Type     = req.body.field6Type;
    villageBuildingFields.field7Type     = req.body.field7Type;
    villageBuildingFields.field8Type     = req.body.field8Type;
    villageBuildingFields.field9Type     = req.body.field9Type;
    villageBuildingFields.field10Type    = req.body.field10Type;
    villageBuildingFields.field11Type    = req.body.field11Type;
    villageBuildingFields.field12Type    = req.body.field12Type;
    villageBuildingFields.field13Type    = req.body.field13Type;
    villageBuildingFields.field14Type    = req.body.field14Type;
    villageBuildingFields.field15Type    = req.body.field15Type;
    villageBuildingFields.field16Type    = req.body.field16Type;
    villageBuildingFields.field17Type    = req.body.field17Type;
    villageBuildingFields.field18Type    = req.body.field18Type;

    villageBuildingFields.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New villageBuildingFields created',
                data: villageBuildingFields
            });
        }
    });
};

exports.update = function (req, res) {
    villageBuildingFieldsModel.findOne({idVillage: req.params.idVillage}, function (err, villageBuildingFields) {
        if (err)
            res.send(err);
            villageBuildingFields.idVillage      = req.body.idVillage;
            villageBuildingFields.field1Level    = req.body.field1Level;
            villageBuildingFields.field2Level    = req.body.field2Level;
            villageBuildingFields.field3Level    = req.body.field3Level;
            villageBuildingFields.field4Level    = req.body.field4Level;
            villageBuildingFields.field5Level    = req.body.field5Level;
            villageBuildingFields.field6Level    = req.body.field6Level;
            villageBuildingFields.field7Level    = req.body.field7Level;
            villageBuildingFields.field8Level    = req.body.field8Level;
            villageBuildingFields.field9Level    = req.body.field9Level;
            villageBuildingFields.field10Level   = req.body.field10Level;
            villageBuildingFields.field11Level   = req.body.field11Level;
            villageBuildingFields.field12Level   = req.body.field12Level;
            villageBuildingFields.field13Level   = req.body.field13Level;
            villageBuildingFields.field14Level   = req.body.field14Level;
            villageBuildingFields.field15Level   = req.body.field15Level;
            villageBuildingFields.field16Level   = req.body.field16Level;
            villageBuildingFields.field17Level   = req.body.field17Level;
            villageBuildingFields.field18Level   = req.body.field18Level;
            villageBuildingFields.field1Type     = req.body.field1Type;
            villageBuildingFields.field2Type     = req.body.field2Type;
            villageBuildingFields.field3Type     = req.body.field3Type;
            villageBuildingFields.field4Type     = req.body.field4Type;
            villageBuildingFields.field5Type     = req.body.field5Type;
            villageBuildingFields.field6Type     = req.body.field6Type;
            villageBuildingFields.field7Type     = req.body.field7Type;
            villageBuildingFields.field8Type     = req.body.field8Type;
            villageBuildingFields.field9Type     = req.body.field9Type;
            villageBuildingFields.field10Type    = req.body.field10Type;
            villageBuildingFields.field11Type    = req.body.field11Type;
            villageBuildingFields.field12Type    = req.body.field12Type;
            villageBuildingFields.field13Type    = req.body.field13Type;
            villageBuildingFields.field14Type    = req.body.field14Type;
            villageBuildingFields.field15Type    = req.body.field15Type;
            villageBuildingFields.field16Type    = req.body.field16Type;
            villageBuildingFields.field17Type    = req.body.field17Type;
            villageBuildingFields.field18Type    = req.body.field18Type;

            villageBuildingFields.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageBuildingFields Info updated',
                data: villageBuildingFields
            });
        });
    });
};

exports.delete = function (req, res) {
    villageBuildingFieldsModel.remove({idVillage: req.params.idVillage}, function (err, villageBuildingFields) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageBuildingFields deleted'
        });
    });
};