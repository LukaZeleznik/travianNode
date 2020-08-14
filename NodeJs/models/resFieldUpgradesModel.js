const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resFieldUpgradesSchema = new Schema ({
        idVillage: { type: Number, required: true },
        rfid: { type: Number, required: true },
        fieldType: { type: String, required: true },
        fieldLevel: { type: Number, required: true },
        timeStarted: { type: Number, required: true },
        timeCompleted: { type: Number, required: true }
});

var resFieldUpgrades = module.exports = mongoose.model('resFieldUpgrades', resFieldUpgradesSchema);

module.exports.get = function (callback, limit) {
        resFieldUpgrades.find(callback).limit(limit);
}