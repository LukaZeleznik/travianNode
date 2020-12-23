const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email:        {type: String, required: true, unique: true},
  password:     {type: String, required: true},
  nickname:     {type: String, required: true, unique: true},
  tribe:        {type: String, required: true},
  population:   {type: Number, required: true, default: 0},
  capital:      {type: String, required: true, unique: true},
  group:        {type: Number, required: true, default: 1},
  clan:         {type: String, default: ""}
});

UserSchema.pre(
    'save',
    async function(next) {
        const user = this;
        const salt = "$2b$10$R4TZHwzrSPIC0rKPP4Kd.u";
        const hash = await bcrypt.hash(this.password, process.env.BCRYPT_SALT);
        console.log(hash)
        this.password = hash;
        next();
    }
);

UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    console.log("password", password, "user.password", user.password);
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
}

const UserModel = mongoose.model('user', UserSchema, 'user');

module.exports = UserModel;