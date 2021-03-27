const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageProductionsSchema = new Schema ({
        idVillage:      { type: String, required: true, unique: true },
        productionWood: { type: Number, required: true },
        productionClay: { type: Number, required: true },
        productionIron: { type: Number, required: true },
        productionCrop: { type: Number, required: true }
}, { timestamps: true });

var villageProductions = module.exports = mongoose.model('villageProductions', villageProductionsSchema, 'villageProductions');

module.exports.get = function (callback, limit) {
        villageProductions.find(callback).limit(limit);
}