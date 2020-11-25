const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageBuildingLevelsSchema = new Schema ({
        idVillage: { type: Number, required: true, unique: true },
        field1Level: { type: Number, required: true },
        field2Level: { type: Number, required: true },
        field3Level: { type: Number, required: true },
        field4Level: { type: Number, required: true },
        field5Level: { type: Number, required: true },
        field6Level: { type: Number, required: true },
        field7Level: { type: Number, required: true },
        field8Level: { type: Number, required: true },
        field9Level: { type: Number, required: true },
        field10Level: { type: Number, required: true },
        field11Level: { type: Number, required: true },
        field12Level: { type: Number, required: true },
        field13Level: { type: Number, required: true },
        field14Level: { type: Number, required: true },
        field15Level: { type: Number, required: true },
        field16Level: { type: Number, required: true },
        field17Level: { type: Number, required: true },
        field18Level: { type: Number, required: true }
});

var villageBuildingLevels = module.exports = mongoose.model('villageBuildingLevels', villageBuildingLevelsSchema);

module.exports.get = function (callback, limit) {
        villageBuildingLevels.find(callback).limit(limit);
}