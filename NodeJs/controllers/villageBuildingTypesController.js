const path = require('path');
const villageBuildingTypesModel = require('../models/villageBuildingTypesModel');

exports.view = function (req, res) {
    villageBuildingTypesModel.findOne({idVillage: req.params.idVillage}, function (err, villageBuildingTypes) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading building types..',
            data: villageBuildingTypes
        });
    });
};

// Handle create villageBuildingTypes actions
exports.new = function (req, res) {
    var villageBuildingTypes = new villageBuildingTypesModel();
    villageBuildingTypes.idVillage = req.body.idVillage;
    villageBuildingTypes.field1Type = req.body.field1Type;
    villageBuildingTypes.field2Type = req.body.field2Type;
    villageBuildingTypes.field3Type = req.body.field3Type;
    villageBuildingTypes.field4Type = req.body.field4Type;
    villageBuildingTypes.field5Type = req.body.field5Type;
    villageBuildingTypes.field6Type = req.body.field6Type;
    villageBuildingTypes.field7Type = req.body.field7Type;
    villageBuildingTypes.field8Type = req.body.field8Type;
    villageBuildingTypes.field9Type = req.body.field9Type;
    villageBuildingTypes.field10Type = req.body.field10Type;
    villageBuildingTypes.field11Type = req.body.field11Type;
    villageBuildingTypes.field12Type = req.body.field12Type;
    villageBuildingTypes.field13Type = req.body.field13Type;
    villageBuildingTypes.field14Type = req.body.field14Type;
    villageBuildingTypes.field15Type = req.body.field15Type;
    villageBuildingTypes.field16Type = req.body.field16Type;
    villageBuildingTypes.field17Type = req.body.field17Type;
    villageBuildingTypes.field18Type = req.body.field18Type;

    villageBuildingTypes.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New villageBuildingTypes created',
                data: villageBuildingTypes
            });
        }
    });
};

exports.update = function (req, res) {
    villageBuildingTypesModel.findOne({idVillage: req.params.idVillage}, function (err, villageBuildingTypes) {
        if (err)
            res.send(err);
        
            villageBuildingTypes.idVillage = req.body.idVillage;
            villageBuildingTypes.field1Type = req.body.field1Type;
            villageBuildingTypes.field2Type = req.body.field2Type;
            villageBuildingTypes.field3Type = req.body.field3Type;
            villageBuildingTypes.field4Type = req.body.field4Type;
            villageBuildingTypes.field5Type = req.body.field5Type;
            villageBuildingTypes.field6Type = req.body.field6Type;
            villageBuildingTypes.field7Type = req.body.field7Type;
            villageBuildingTypes.field8Type = req.body.field8Type;
            villageBuildingTypes.field9Type = req.body.field9Type;
            villageBuildingTypes.field10Type = req.body.field10Type;
            villageBuildingTypes.field11Type = req.body.field11Type;
            villageBuildingTypes.field12Type = req.body.field12Type;
            villageBuildingTypes.field13Type = req.body.field13Type;
            villageBuildingTypes.field14Type = req.body.field14Type;
            villageBuildingTypes.field15Type = req.body.field15Type;
            villageBuildingTypes.field16Type = req.body.field16Type;
            villageBuildingTypes.field17Type = req.body.field17Type;
            villageBuildingTypes.field18Type = req.body.field18Type;

            villageBuildingTypes.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageBuildingTypes Info updated',
                data: villageBuildingTypes
            });
        });
    });
};

exports.delete = function (req, res) {
    villageBuildingTypesModel.remove({idVillage: req.params.idVillage}, function (err, villageBuildingTypes) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageBuildingTypes deleted'
        });
    });
};