const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const villageSchema = new Schema({
    mapTileId:          {type: Number, required: true, unique: true},
    xCoordinate:        {type: Number, required: true},
    yCoordinate:        {type: Number, required: true},
    fieldVariation:     {type: Number, required: true},
    population:         {type: Number, required: true, default: 0},
    owner:              {type: String, required: false}
});

var village = module.exports = mongoose.model('village', villageSchema);

module.exports.get = function (callback, limit) {
    village.find(callback).limit(limit);
}