const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageOwnReinforcementsSchema = new Schema ({
        reinforcementId: { type: Number, required: true, unique: true},
        idVillage: { type: Number, required: true},
        idVillageFrom: { type: Number, required: true},
        tribe: { type: String, required: true },
        troop1: { type: Number, required: true },
        troop2: { type: Number, required: true },
        troop3: { type: Number, required: true },
        troop4: { type: Number, required: true },
        troop5: { type: Number, required: true },
        troop6: { type: Number, required: true },
        troop7: { type: Number, required: true },
        troop8: { type: Number, required: true },
        troop9: { type: Number, required: true },
        troop10: { type: Number, required: true }
});

var villageOwnReinforcements = module.exports = mongoose.model('villageOwnReinforcements', villageOwnReinforcementsSchema);

module.exports.get = function (callback, limit) {
        villageOwnReinforcements.find(callback).limit(limit);
}