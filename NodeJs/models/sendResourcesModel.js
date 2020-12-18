const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sendResourcesSchema = new Schema ({
        idVillageFrom:  { type: String, required: true },
        idVillageTo:    { type: String, required: true },
        timeSent:       { type: Number, required: true },
        timeArrived:    { type: Number, required: true },
        wood:           { type: Number, required: true, default: 0 },
        clay:           { type: Number, required: true, default: 0 },
        iron:           { type: Number, required: true, default: 0 },
        crop:           { type: Number, required: true, default: 0 },
});

var sendResources = module.exports = mongoose.model('sendResources', sendResourcesSchema, 'sendResources');

module.exports.get = function (callback, limit) {
    sendResources.find(callback).limit(limit);
}