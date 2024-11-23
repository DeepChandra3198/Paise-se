const Joi = require("joi");

module.exports.FaqRequest = Joi.object({
  productId: Joi.required(),
  question: Joi.string().required().min(1).max(255),
  answer: Joi.string().required().min(1).max(1500),
});
