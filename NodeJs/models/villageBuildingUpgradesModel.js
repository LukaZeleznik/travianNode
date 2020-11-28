const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageBuildingUpgradesSchema = new Schema ({
        idVillage:      { type: Number, required: true },
        vbid:           { type: Number, required: true },
        buildingType:   { type: Number, required: true },
        buildingLevel:  { type: Number, required: true },
        timeStarted:    { type: Number, required: true },
        timeCompleted:  { type: Number, required: true }
});

var villageBuildingUpgrades = module.exports = mongoose.model('villageBuildingUpgrades', villageBuildingUpgradesSchema);

module.exports.get = function (callback, limit) {
    villageBuildingUpgrades.find(callback).limit(limit);
}