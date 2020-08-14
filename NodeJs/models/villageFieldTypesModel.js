const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageFieldTypesSchema = new Schema ({
        idVillage: { type: Number, required: true, unique: true },
        resField1Type: { type: String, required: true },
        resField2Type: { type: String, required: true },
        resField3Type: { type: String, required: true },
        resField4Type: { type: String, required: true },
        resField5Type: { type: String, required: true },
        resField6Type: { type: String, required: true },
        resField7Type: { type: String, required: true },
        resField8Type: { type: String, required: true },
        resField9Type: { type: String, required: true },
        resField10Type: { type: String, required: true },
        resField11Type: { type: String, required: true },
        resField12Type: { type: String, required: true },
        resField13Type: { type: String, required: true },
        resField14Type: { type: String, required: true },
        resField15Type: { type: String, required: true },
        resField16Type: { type: String, required: true },
        resField17Type: { type: String, required: true },
        resField18Type: { type: String, required: true }
});

var villageFieldTypes = module.exports = mongoose.model('villageFieldTypes', villageFieldTypesSchema);

module.exports.get = function (callback, limit) {
        villageFieldTypes.find(callback).limit(limit);
}