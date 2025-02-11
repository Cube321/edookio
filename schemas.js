const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");
const category = require("./models/category");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [
            "b",
            "strong",
            "i",
            "p",
            "span",
            "ul",
            "ol",
            "li",
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
          ],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

module.exports.cardSchema = Joi.object({
  pageA: Joi.string().required(),
  pageB: Joi.string().required(),
});

module.exports.userSchema = Joi.object({
  email: Joi.string().required().escapeHTML(),
  password: Joi.string().required().min(6).escapeHTML(),
  key: Joi.string().escapeHTML(),
  billingId: Joi.string(),
  source: Joi.string().escapeHTML(),
  school: Joi.string().allow("").escapeHTML(),
});

module.exports.sectionSchema = Joi.object({
  name: Joi.string().required().escapeHTML(),
});

module.exports.questionSchema = Joi.object({
  question: Joi.string().required().escapeHTML(),
  correctAnswer: Joi.string().required().escapeHTML(),
  wrongAnswer1: Joi.string().required().escapeHTML(),
  wrongAnswer2: Joi.string().required().escapeHTML(),
  wrongAnswer3: Joi.string().allow("").escapeHTML(),
});

module.exports.nameSchema = Joi.object({
  firstname: Joi.string().required().escapeHTML(),
  lastname: Joi.string().required().escapeHTML(),
});

module.exports.categorySchemaApi = Joi.object({
  text: Joi.string().required().escapeHTML(),
});

module.exports.sectionSchemaApi = Joi.object({
  name: Joi.string().required().escapeHTML(),
  categoryId: Joi.string().required().escapeHTML(),
});

module.exports.cardSchemaApi = Joi.object({
  pageA: Joi.string().required().escapeHTML(),
  pageB: Joi.string().required().escapeHTML(),
  sectionId: Joi.string().required().escapeHTML(),
});

module.exports.editUserSchemaApi = Joi.object({
  nickname: Joi.string().required().escapeHTML(),
  firstName: Joi.string().required().escapeHTML(),
  lastName: Joi.string().required().escapeHTML(),
  dailyGoal: Joi.number().required(),
});
