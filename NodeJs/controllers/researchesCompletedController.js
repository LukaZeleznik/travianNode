const path = require('path');
const fetch = require("node-fetch");
const researchesCompletedModel = require('../models/researchesCompletedModel');
var tools = require('../tools/tools');
var config = require('../config.json');

exports.view = function (req, res) {
    researchesCompletedModel.findOne({idVillage: req.params.idVillage}, function (err, researchesCompleted) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            message: 'Loading researchesCompleted data..',
            data: researchesCompleted
        });
    });
};

exports.new = async function (req, res) {
    const userTribe = await tools.getTribeFromIdVillage(req.body.idVillage);

    var researchesCompleted = new researchesCompletedModel();
    researchesCompleted.idVillage = req.body.idVillage;
    researchesCompleted.tribe = userTribe;
    researchesCompleted.troop1 = true;
    researchesCompleted.troop10 = true;
    
    for(let troop of tools.researchesInfoLookup[userTribe]){
        researchesCompleted['troop' + troop['id']] = false;
    }

    researchesCompleted.save(function (err) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        else{
            res.json({
                message: 'researchesCompleted success',
                data: researchesCompleted
            });
        }
    });
};

exports.update = function (req, res) {
    researchesCompletedModel.findOne({idVillage: req.params.idVillage}, async function (err, researchesCompleted) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }

        let userTribe = await tools.getTribeFromIdVillage(req.body.idVillage);
        researchesCompleted.idVillage = req.body.idVillage;
        researchesCompleted.tribe = userTribe;
        
        for(let troop of tools.troopInfoLookup[userTribe]){
            researchesCompleted['troop' + troop['id']] = req.body['troop' + troop['id']];
        }

        researchesCompleted.save(function (err) {
            if (err) {
                res.status(500).json({
                    message: err.toString(),
                    data: ""
                });
                return;
            }
            res.json({
                status: 'success',
                message: 'researchesCompleted updated',
                data: researchesCompleted
            });
        });
    });
};

exports.delete = function (req, res) {
    researchesCompletedModel.deleteOne({idVillage: req.params.idVillage}, function (err, researchesCompleted) {
        if (err){
            res.status(500).json(err);
            console.log(err);
            return;
        }
        res.json({
            status: "success",
            message: 'researchesCompleted deleted'
        });
    });
};