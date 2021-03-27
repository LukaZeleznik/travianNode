const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const researchesCompletedSchema = new Schema ({
        idVillage:  { type: String, required: true, unique: true },
        tribe:      { type: String, required: true },
        troop1:     { type: Boolean, required: true, default: true },
        troop2:     { type: Boolean, required: true },
        troop3:     { type: Boolean, required: true },
        troop4:     { type: Boolean, required: true },
        troop5:     { type: Boolean, required: true },
        troop6:     { type: Boolean, required: true },
        troop7:     { type: Boolean, required: true },
        troop8:     { type: Boolean, required: true },
        troop9:     { type: Boolean, required: true },
        troop10:    { type: Boolean, required: true, default: true }
    }, { timestamps: true });

var researchesCompleted = module.exports = mongoose.model('researchesCompleted', researchesCompletedSchema, 'researchesCompleted');

module.exports.get = function (callback, limit) {
    researchesCompleted.find(callback).limit(limit);
}