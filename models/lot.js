const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lotSchema = new Schema({
    number: {
        type: String
    },
    manufacturer: {
        type: String
    },
    country: {
        type: String
    },
    expiration: {
        type: Date
    },
},
    { timestamps: true }
);



module.exports = mongoose.model('Lot', lotSchema);