const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const researchesSchema = new Schema ({
        idVillage:      { type: String, required: true },
        researchType:   { type: String, required: true },
        troopName:      { type: String, required: false },
        troopId:        { type: Number, required: true },
        timeStarted:    { type: Number, required: true },
        timeCompleted:  { type: Number, required: true }
});

var researches = module.exports = mongoose.model('researches', researchesSchema, 'researches');

module.exports.get = function (callback, limit) {
    researches.find(callback).limit(limit);
}