const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buildingUpgradesSchema = new Schema ({
        idVillage:      { type: Number, required: true },
        vbid:           { type: Number, required: true },
        buildingType:   { type: Number, required: true },
        buildingLevel:  { type: Number, required: true },
        timeStarted:    { type: Number, required: true },
        timeCompleted:  { type: Number, required: true }
});

var buildingUpgrades = module.exports = mongoose.model('buildingUpgrades', buildingUpgradesSchema);

module.exports.get = function (callback, limit) {
    buildingUpgrades.find(callback).limit(limit);
}