const Joi = require("joi");

module.exports.StaticPageRequest = Joi.object({
  name: Joi.string().required().min(1).max(100),
  description: Joi.string().required(),
});
