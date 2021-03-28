const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageReinforcementsSchema = new Schema ({
        idVillage:              { type: String, required: true},
        idVillageFrom:          { type: String, required: true},
        troopTribe:             { type: String, required: true },
        troop1:                 { type: Number, required: true },
        troop2:                 { type: Number, required: true },
        troop3:                 { type: Number, required: true },
        troop4:                 { type: Number, required: true },
        troop5:                 { type: Number, required: true },
        troop6:                 { type: Number, required: true },
        troop7:                 { type: Number, required: true },
        troop8:                 { type: Number, required: true },
        troop9:                 { type: Number, required: true },
        troop10:                { type: Number, required: true }
}, { timestamps: true });

var villageReinforcements = module.exports = mongoose.model('villageReinforcements', villageReinforcementsSchema, 'villageReinforcements');

module.exports.get = function (callback, limit) {
        villageReinforcements.find(callback).limit(limit);
}