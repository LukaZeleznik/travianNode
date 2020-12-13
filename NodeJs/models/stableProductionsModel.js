const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stableProductionsSchema = new Schema ({
        idVillage:      { type: String, required: true },
        troopName:      { type: String, required: true },
        troopId:        { type: Number, required: true },
        troopCount:     { type: Number, required: true },
        troopProdTime:  { type: Number, required: true },
        timeStarted:    { type: Number, required: true },
        timeCompleted:  { type: Number, required: true },
        lastUpdate:     { type: Number, required: true },
        troopsDoneAlready: { type: Number, required: true }
});

var stableProductions = module.exports = mongoose.model('stableProductions', stableProductionsSchema, 'stableProductions');

module.exports.get = function (callback, limit) {
    stableProductions.find(callback).limit(limit);
}