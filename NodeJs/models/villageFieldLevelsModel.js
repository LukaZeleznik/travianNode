const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageFieldLevelsSchema = new Schema ({
        idVillage: { type: Number, required: true, unique: true },
        resField1Level: { type: Number, required: true },
        resField2Level: { type: Number, required: true },
        resField3Level: { type: Number, required: true },
        resField4Level: { type: Number, required: true },
        resField5Level: { type: Number, required: true },
        resField6Level: { type: Number, required: true },
        resField7Level: { type: Number, required: true },
        resField8Level: { type: Number, required: true },
        resField9Level: { type: Number, required: true },
        resField10Level: { type: Number, required: true },
        resField11Level: { type: Number, required: true },
        resField12Level: { type: Number, required: true },
        resField13Level: { type: Number, required: true },
        resField14Level: { type: Number, required: true },
        resField15Level: { type: Number, required: true },
        resField16Level: { type: Number, required: true },
        resField17Level: { type: Number, required: true },
        resField18Level: { type: Number, required: true }
});

var villageFieldLevels = module.exports = mongoose.model('villageFieldLevels', villageFieldLevelsSchema);

module.exports.get = function (callback, limit) {
        villageFieldLevels.find(callback).limit(limit);
}