const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageMaxResourcesSchema = new Schema ({
        idVillage: { type: String, required: true, unique: true },
        maxWood: { type: Number, required: true },
        maxClay: { type: Number, required: true },
        maxIron: { type: Number, required: true },
        maxCrop: { type: Number, required: true }
}, { timestamps: true });

var villageMaxResources = module.exports = mongoose.model('villageMaxResources', villageMaxResourcesSchema, 'villageMaxResources');

module.exports.get = function (callback, limit) {
        villageMaxResources.find(callback).limit(limit);
}