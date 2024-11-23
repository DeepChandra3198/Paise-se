const Joi = require("joi");

module.exports.BreRequest = Joi.object({
  productId: Joi.required(),
  lender: Joi.required(),
  age: Joi.number().greater(17).less(100).allow(null).allow(""),
  income: Joi.number().less(9999999999).allow(null).allow(""),
  cardId: Joi.optional(),
  city: Joi.optional(),
  company: Joi.optional(),
});
