const path = require('path');
const villageModel = require('../models/villageModel');

exports.view = function (req, res) {
    villageModel.findOne({mapTileId: req.params.mapTileId}, function (err, village) {
        if (err)
            res.send(err);
        res.json({
            message: 'Loading village..',
            data: village
        });
    });
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