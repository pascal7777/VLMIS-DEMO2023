const mongoose = require('mongoose');
const Product = require('./product');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const siteSchema = new Schema({
    site_code: {
        type: String
    },
    sc_level: {
        type: String
    },
    site_storecap: {
        type: String
    },
    site_fridgecap: {
        type: String
    },
    site_freezecap: {
        type: String
    },
    site_ulfreezecap: {
        type: String
    },
    site_name: {
        type: String,
        unique: true
    },
    site_district: {
        type: String
    },
    country: {
        type: String
    },
    parent_name: {
        type: String
    },
    parent_code: {
        type: String
    },
    children_store: {
        type: Number
    },
    children_facility: {
        type: Number
    },
    author: {
        type: Schema.Types.ObjectId, ref: 'User',
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    products: [
        {
            type: Schema.Types.ObjectId, ref: 'Product',
        }
    ]
}, 
opts,
    { timestamps: true }
);



// DELETE ALL ASSOCIATED PRODUCTS WHEN A SITE IS DELETED
siteSchema.post('findOneAndDelete', async function (site) {
    if (site.products.length) {
        await Product.deleteMany({ _id: { $in: site.products } })
    }
})


siteSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/sites/${this._id}">${this.site_name}</a></strong>
    <p>${this.sc_level}</p>`
});




siteSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Product.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model('Site', siteSchema);