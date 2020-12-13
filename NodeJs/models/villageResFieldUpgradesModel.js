const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageResFieldUpgradesSchema = new Schema ({
        idVillage:      { type: String, required: true },
        rfid:           { type: Number, required: true },
        fieldType:      { type: Number, required: true },
        fieldLevel:     { type: Number, required: true },
        woodUsed:       { type: Number, required: true },
        clayUsed:       { type: Number, required: true },
        ironUsed:       { type: Number, required: true },
        cropUsed:       { type: Number, required: true },
        timeStarted:    { type: Number, required: true },
        timeCompleted:  { type: Number, required: true }
});

var villageResFieldUpgrades = module.exports = mongoose.model('villageResFieldUpgrades', villageResFieldUpgradesSchema, 'villageResFieldUpgrades');

module.exports.get = function (callback, limit) {
    villageResFieldUpgrades.find(callback).limit(limit);
}