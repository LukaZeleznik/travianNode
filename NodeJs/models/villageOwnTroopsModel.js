const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageOwnTroopsSchema = new Schema ({
        idVillage: { type: String, required: true, unique: true },
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

var villageOwnTroops = module.exports = mongoose.model('villageOwnTroops', villageOwnTroopsSchema);

module.exports.get = function (callback, limit) {
        villageOwnTroops.find(callback).limit(limit);
}