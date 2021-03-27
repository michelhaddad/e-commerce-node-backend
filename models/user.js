require('mongoose-type-email');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const addressSchema = require('./address');

const User = new Schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    admin:   {
        type: Boolean,
        default: false
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    profileUrl: {
        type: String
    },
    address: {
        type: addressSchema
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
