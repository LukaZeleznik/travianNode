const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email:        {type: String, required: true, unique: true},
  password:     {type: String, required: true},
  nickname:     {type: String, required: true},
  tribe:        {type: String, required: true},
  idVillage:    {type: Number, required: true},
  population:   {type: Number, required: true, default: 0}
});

UserSchema.pre(
    'save',
    async function(next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);  
        this.password = hash;
        next();
    }
);

UserSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
}

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;