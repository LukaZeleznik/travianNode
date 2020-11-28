const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageBuildingFieldsSchema = new Schema ({
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
        field18Level: { type: Number, required: true },
        field1Type: { type: Number, required: true },
        field2Type: { type: Number, required: true },
        field3Type: { type: Number, required: true },
        field4Type: { type: Number, required: true },
        field5Type: { type: Number, required: true },
        field6Type: { type: Number, required: true },
        field7Type: { type: Number, required: true },
        field8Type: { type: Number, required: true },
        field9Type: { type: Number, required: true },
        field10Type: { type: Number, required: true },
        field11Type: { type: Number, required: true },
        field12Type: { type: Number, required: true },
        field13Type: { type: Number, required: true },
        field14Type: { type: Number, required: true },
        field15Type: { type: Number, required: true },
        field16Type: { type: Number, required: true },
        field17Type: { type: Number, required: true },
        field18Type: { type: Number, required: true }
});

var villageBuildingFields = module.exports = mongoose.model('villageBuildingFields', villageBuildingFieldsSchema);

module.exports.get = function (callback, limit) {
    villageBuildingFields.find(callback).limit(limit);
}