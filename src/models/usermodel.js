const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name:{type: String},
    last_name: {type: String},
    email: {type: String},
    age: {type: Number},
    password: { type: String }, 
},{ versionKey: false });

const userModel = mongoose.model('User', userSchema);

module.exports = { userModel };