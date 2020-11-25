const path = require('path');
const villageBuildingsDataModel = require('../models/villageBuildingsDataModel');

exports.view = function (req, res) {
    villageBuildingsDataModel.findOne({idVillage: req.params.idVillage}, function (err, villageBuildingsData) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading building data..',
            data: villageBuildingsData
        });
    });
};

// Handle create villageBuildingsData actions
exports.new = function (req, res) {
    var villageBuildingsData = new villageBuildingsDataModel();
    villageBuildingsData.idVillage      = req.body.idVillage;
    villageBuildingsData.field1Level    = req.body.field1Level;
    villageBuildingsData.field2Level    = req.body.field2Level;
    villageBuildingsData.field3Level    = req.body.field3Level;
    villageBuildingsData.field4Level    = req.body.field4Level;
    villageBuildingsData.field5Level    = req.body.field5Level;
    villageBuildingsData.field6Level    = req.body.field6Level;
    villageBuildingsData.field7Level    = req.body.field7Level;
    villageBuildingsData.field8Level    = req.body.field8Level;
    villageBuildingsData.field9Level    = req.body.field9Level;
    villageBuildingsData.field10Level   = req.body.field10Level;
    villageBuildingsData.field11Level   = req.body.field11Level;
    villageBuildingsData.field12Level   = req.body.field12Level;
    villageBuildingsData.field13Level   = req.body.field13Level;
    villageBuildingsData.field14Level   = req.body.field14Level;
    villageBuildingsData.field15Level   = req.body.field15Level;
    villageBuildingsData.field16Level   = req.body.field16Level;
    villageBuildingsData.field17Level   = req.body.field17Level;
    villageBuildingsData.field18Level   = req.body.field18Level;
    villageBuildingsData.field1Type     = req.body.field1Type;
    villageBuildingsData.field2Type     = req.body.field2Type;
    villageBuildingsData.field3Type     = req.body.field3Type;
    villageBuildingsData.field4Type     = req.body.field4Type;
    villageBuildingsData.field5Type     = req.body.field5Type;
    villageBuildingsData.field6Type     = req.body.field6Type;
    villageBuildingsData.field7Type     = req.body.field7Type;
    villageBuildingsData.field8Type     = req.body.field8Type;
    villageBuildingsData.field9Type     = req.body.field9Type;
    villageBuildingsData.field10Type    = req.body.field10Type;
    villageBuildingsData.field11Type    = req.body.field11Type;
    villageBuildingsData.field12Type    = req.body.field12Type;
    villageBuildingsData.field13Type    = req.body.field13Type;
    villageBuildingsData.field14Type    = req.body.field14Type;
    villageBuildingsData.field15Type    = req.body.field15Type;
    villageBuildingsData.field16Type    = req.body.field16Type;
    villageBuildingsData.field17Type    = req.body.field17Type;
    villageBuildingsData.field18Type    = req.body.field18Type;

    villageBuildingsData.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New villageBuildingsData created',
                data: villageBuildingsData
            });
        }
    });
};

exports.update = function (req, res) {
    villageBuildingsDataModel.findOne({idVillage: req.params.idVillage}, function (err, villageBuildingsData) {
        if (err)
            res.send(err);
            villageBuildingsData.idVillage      = req.body.idVillage;
            villageBuildingsData.field1Level    = req.body.field1Level;
            villageBuildingsData.field2Level    = req.body.field2Level;
            villageBuildingsData.field3Level    = req.body.field3Level;
            villageBuildingsData.field4Level    = req.body.field4Level;
            villageBuildingsData.field5Level    = req.body.field5Level;
            villageBuildingsData.field6Level    = req.body.field6Level;
            villageBuildingsData.field7Level    = req.body.field7Level;
            villageBuildingsData.field8Level    = req.body.field8Level;
            villageBuildingsData.field9Level    = req.body.field9Level;
            villageBuildingsData.field10Level   = req.body.field10Level;
            villageBuildingsData.field11Level   = req.body.field11Level;
            villageBuildingsData.field12Level   = req.body.field12Level;
            villageBuildingsData.field13Level   = req.body.field13Level;
            villageBuildingsData.field14Level   = req.body.field14Level;
            villageBuildingsData.field15Level   = req.body.field15Level;
            villageBuildingsData.field16Level   = req.body.field16Level;
            villageBuildingsData.field17Level   = req.body.field17Level;
            villageBuildingsData.field18Level   = req.body.field18Level;
            villageBuildingsData.field1Type     = req.body.field1Type;
            villageBuildingsData.field2Type     = req.body.field2Type;
            villageBuildingsData.field3Type     = req.body.field3Type;
            villageBuildingsData.field4Type     = req.body.field4Type;
            villageBuildingsData.field5Type     = req.body.field5Type;
            villageBuildingsData.field6Type     = req.body.field6Type;
            villageBuildingsData.field7Type     = req.body.field7Type;
            villageBuildingsData.field8Type     = req.body.field8Type;
            villageBuildingsData.field9Type     = req.body.field9Type;
            villageBuildingsData.field10Type    = req.body.field10Type;
            villageBuildingsData.field11Type    = req.body.field11Type;
            villageBuildingsData.field12Type    = req.body.field12Type;
            villageBuildingsData.field13Type    = req.body.field13Type;
            villageBuildingsData.field14Type    = req.body.field14Type;
            villageBuildingsData.field15Type    = req.body.field15Type;
            villageBuildingsData.field16Type    = req.body.field16Type;
            villageBuildingsData.field17Type    = req.body.field17Type;
            villageBuildingsData.field18Type    = req.body.field18Type;

            villageBuildingsData.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'villageBuildingsData Info updated',
                data: villageBuildingsData
            });
        });
    });
};

exports.delete = function (req, res) {
    villageBuildingsDataModel.remove({idVillage: req.params.idVillage}, function (err, villageBuildingsData) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'villageBuildingsData deleted'
        });
    });
};