const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const villageBuildingTypesSchema = new Schema ({
        idVillage: { type: Number, required: true, unique: true },
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

var villageBuildingTypes = module.exports = mongoose.model('villageBuildingTypes', villageBuildingTypesSchema);

module.exports.get = function (callback, limit) {
        villageBuildingTypes.find(callback).limit(limit);
}