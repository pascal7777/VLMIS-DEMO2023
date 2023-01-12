

const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)


module.exports.siteSchema = Joi.object({
    site: Joi.object({
        sc_level: Joi.string().required().escapeHTML(),
        site_name: Joi.string().required().escapeHTML(),
        site_code: Joi.string().required().escapeHTML(),
        site_district: Joi.string().trim().required().escapeHTML(),
        country: Joi.string().trim().required().escapeHTML(),
        site_telephone: Joi.string().required().escapeHTML(),
        site_email: Joi.string().required().escapeHTML(),
        parent_name: Joi.string().required(),
        parent_code: Joi.string().required().escapeHTML(),
        parent_location: Joi.string().required().escapeHTML(),
        site_cce: Joi.string().required().escapeHTML(),
        author: Joi.string().required(),
        editor: Joi.string().required()
    }).required()
});

module.exports.productSchema = Joi.object({
    product: Joi.object({
        cat: Joi.string().required().escapeHTML(),
        name: Joi.string().required().escapeHTML(),
        type: Joi.string().required().escapeHTML(),
        conversion: Joi.number().required(),
        date_open: Joi.date().required(),
        qty_open: Joi.number().required(),
        uom_open: Joi.string().required().escapeHTML(),
        qty_received: Joi.number().required(),
        uom_received: Joi.string().required().escapeHTML(),
        qty_issued: Joi.number().required(),
        uom_issued: Joi.string().required().escapeHTML(),
        qty_lost: Joi.number().required(),
        uom_lost: Joi.string().required().escapeHTML(),
        qty_transferred: Joi.number().required(),
        uom_transferred: Joi.string().required().escapeHTML(),
        qty_count: Joi.number().required(),
        uom_count: Joi.string().required().escapeHTML(),
        so_days: Joi.number().required(),
        nearexp: Joi.number().required(),
        author: Joi.number().required(),
        editor: Joi.number().required()
    }).required(),
    deleteImages: Joi.array()
});


module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required().escapeHTML(),
    }).required()
});
