const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema ({
        name: { type: String, required: true},
});

var user = module.exports = mongoose.model('user', userSchema);

module.exports.get = function (callback, limit) {
        user.find(callback).limit(limit);
}