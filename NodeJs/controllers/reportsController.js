const path = require('path');
const reportModel = require('../models/reportModel');

exports.view = function (req, res) {
    reportModel.findOne({idVillage: req.params.idVillage}, function (err, report) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading buildings data..',
            data: report
        });
    });
};

// Handle create report actions
exports.new = function (req, res) {
    var report = new reportModel();
    report.idVillage = req.body.idVillage;
    for(let l = 1; l < 20; l++){
        report['field'+l+'Level'] = req.body['field'+l+'Level'];
        report['field'+l+'Type']  = req.body['field'+l+'Type'];
    }

    report.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'report success',
                data: report
            });
        }
    });
};

exports.update = function (req, res) {
    reportModel.findOne({idVillage: req.params.idVillage}, function (err, report) {
        if (err)
            res.send(err);
            report.idVillage = req.body.idVillage;
            for(let l = 1; l < 20; l++){
                report['field'+l+'Level'] = req.body['field'+l+'Level'];
                report['field'+l+'Type']  = req.body['field'+l+'Type'];
            }

            report.save(function (err) {
            if (err)
                res.json(err);
            res.json({
                message: 'report Info updated',
                data: report
            });
        });
    });
};

exports.delete = function (req, res) {
    reportModel.remove({idVillage: req.params.idVillage}, function (err, report) {
        if (err)
            res.send(err);
        res.json({
            status: "success",
            message: 'report deleted'
        });
    });
};