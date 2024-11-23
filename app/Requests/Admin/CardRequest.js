const Joi = require("joi");

module.exports.CardRequest = Joi.object({
  name: Joi.string().required().min(1).max(100),
  type: Joi.string().required(),
  fees: Joi.required(),
  info: Joi.string().required().min(1).max(100),
  description: Joi.required(),
  lender: Joi.required(),
  miles: Joi.string().required().min(1).max(100),
  points: Joi.string().required().min(1).max(100),
  loungeAccess: Joi.string().required().min(1).max(100),
  link: Joi.string().required().min(1).max(1000),
});
