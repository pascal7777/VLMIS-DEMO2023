const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    name: {
        type: String,
        uppercase: true
    },
    job_position: {
        type: String
    },
    affiliation: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    isAdmin: { type: Boolean, default: false }
},
    { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);