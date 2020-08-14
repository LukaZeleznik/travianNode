const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sendTroopsSchema = new Schema ({
        sendType: { type: String, required: true },
        idVillageFrom: { type: Number, required: true },
        idVillageTo: { type: Number, required: true },
        timeSent: { type: Number, required: true },
        timeArrived: { type: Number, required: true },
        troopTribe: { type: String, required: true },
        troop1num: { type: Number, required: true },
        troop2num: { type: Number, required: true },
        troop3num: { type: Number, required: true },
        troop4num: { type: Number, required: true },
        troop5num: { type: Number, required: true },
        troop6num: { type: Number, required: true },
        troop7num: { type: Number, required: true },
        troop8num: { type: Number, required: true },
        troop9num: { type: Number, required: true },
        troop10num: { type: Number, required: true }
});

var sendTroops = module.exports = mongoose.model('sendTroops', sendTroopsSchema);

module.exports.get = function (callback, limit) {
        sendTroops.find(callback).limit(limit);
}