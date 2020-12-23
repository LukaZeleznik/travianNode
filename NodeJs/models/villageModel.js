const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const villageSchema = new Schema({
    mapTileId:          {type: Number, required: true, unique: true},
    name:               {type: String, required: false},
    xCoordinate:        {type: Number, required: true},
    yCoordinate:        {type: Number, required: true},
    fieldVariation:     {type: Number, required: true},
    population:         {type: Number, required: true, default: 0},
    owner:              {type: String, required: false},
    merchantsAvailable: {type: Number, required: true},
});

var village = module.exports = mongoose.model('village', villageSchema, 'village');

module.exports.get = function (callback, limit) {
    village.find(callback).limit(limit);
}