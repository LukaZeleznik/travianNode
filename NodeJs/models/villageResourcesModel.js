const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageResourcesSchema = new Schema ({
        idVillage: { type: String, required: true, unique: true },
        currentWood: { type: Number, required: true },
        currentClay: { type: Number, required: true },
        currentIron: { type: Number, required: true },
        currentCrop: { type: Number, required: true },
        lastUpdate: { type: Number, required: true },
});

var VillageResources = module.exports = mongoose.model('villageResources', villageResourcesSchema);

module.exports.get = function (callback, limit) {
        VillageResources.find(callback).limit(limit);
}