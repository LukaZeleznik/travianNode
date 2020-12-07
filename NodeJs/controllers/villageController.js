const path = require('path');
const villageModel = require('../models/villageModel');

exports.view = function (req, res) {
    if(isNaN(req.params.mapTileId)){
        villageModel.findOne({_id: req.params.mapTileId}, function (err, village) {
            if (err) res.send(err);
            res.json({
                message: 'Loading village..',
                data: village
            });
        });
    }
    else{
        villageModel.findOne({mapTileId: req.params.mapTileId}, function (err, village) {
            if (err)
                res.send(err);
            res.json({
                message: 'Loading village..',
                data: village
            });
        });
    }
};

// Handle create village actions
exports.new = function (req, res) {
    var village = new villageModel();
    village.mapTileId       = req.body.mapTileId;
    village.xCoordinate     = req.body.xCoordinate;
    village.yCoordinate     = req.body.yCoordinate;
    village.fieldVariation  = req.body.fieldVariation;
    village.population      = req.body.population;
    village.owner           = req.body.owner;
    village.name            = req.body.name;

    village.save(function (err) {
        if (err){
            res.json(err);
        }
        else{
            res.json({
                message: 'New village created',
                data: village
            });
        }
    });
};

exports.find = function (req, res) {
    villageModel.find(function (err, villages) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading village..',
            data: villages
        });
    });
};

exports.findByOwner = function (req, res) {
    villageModel.find({owner: req.params.uid},function (err, villages) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading village..',
            data: villages
        });
    });
};

exports.insertMany = function (req, res) {
    villageModel.insertMany(req.body, function (err, villages) {
        if (err)
            res.send(err);
        res.json({
            message: 'Villages inserted..',
            data: villages
        });
    });
};

exports.update = function (req, res) {
    villageModel.findOne({mapTileId: req.params.mapTileId}, function (err, village) {
        if (err)
            res.send(err);
        
        village.mapTileId       = req.body.mapTileId;
        village.xCoordinate     = req.body.xCoordinate;
        village.yCoordinate     = req.body.yCoordinate;
        village.fieldVariation  = req.body.fieldVariation;
        village.population      = req.body.population;
        village.owner           = req.body.owner;
        village.name            = req.body.name;

        village.save(function (err2) {
            if (err2)
                res.json(err2);
            res.json({
                message: 'Village info updated',
                data: village
            });
        });
    });
};

exports.delete = function (req, res) {
    villageModel.remove({mapTileId: req.params.mapTileId}, function (err, village) {
        if (err)
            res.send(err);
        res.json({
            message: 'Village deleted',
            data: village
        });
    });
};