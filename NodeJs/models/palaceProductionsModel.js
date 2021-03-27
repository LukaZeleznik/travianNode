const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const palaceProductionsSchema = new Schema ({
        idVillage:      { type: String, required: true },
        troopName:      { type: String, required: true },
        troopId:        { type: Number, required: true },
        troopCount:     { type: Number, required: true },
        troopProdTime:  { type: Number, required: true },
        timeStarted:    { type: Number, required: true },
        timeCompleted:  { type: Number, required: true },
        lastUpdate:     { type: Number, required: true },
        troopsDoneAlready: { type: Number, required: true }
    }, { timestamps: true });

var palaceProductions = module.exports = mongoose.model('palaceProductions', palaceProductionsSchema, 'palaceProductions');

module.exports.get = function (callback, limit) {
    palaceProductions.find(callback).limit(limit);
}