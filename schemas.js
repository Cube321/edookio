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
                    allowedTags: ['b','strong','i','p','span','ul','ol','li','h1','h2','h3','h4','h5','h6'],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.cardSchema = Joi.object({
    pageA: Joi.string().required(),
    pageB: Joi.string().required(),
    author: Joi.string().required().escapeHTML()
})

module.exports.userSchema = Joi.object({
    firstname: Joi.string().required().escapeHTML(),
    lastname: Joi.string().required().escapeHTML(),
    email: Joi.string().required().escapeHTML(),
    password: Joi.string().required().min(6).escapeHTML(),
    password_confirmation: Joi.string().required().min(6).escapeHTML(),
    key: Joi.string().escapeHTML(),
    billingId: Joi.string(),
    faculty: Joi.string().escapeHTML(),
    source: Joi.string().escapeHTML(),
})

module.exports.sectionSchema = Joi.object({
    name: Joi.string().required().escapeHTML(),
    category: Joi.string().required().escapeHTML(),
    isPremium: Joi.string().required().escapeHTML(),
    desc: Joi.string().escapeHTML(),
    nextSection: Joi.string().escapeHTML()
})