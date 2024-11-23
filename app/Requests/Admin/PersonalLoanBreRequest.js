const Joi = require('joi');

module.exports.PersonalLoanBreRequest = Joi.object({
  productId: Joi.required(),
  bankName: Joi.string().required(),
  age: Joi.number().greater(17).less(100).allow(null).allow(''),
  maxAge: Joi.number().greater(17).less(100).allow(null).allow(''),
  income: Joi.number().less(9999999999).allow(null).allow(''),
  city: Joi.optional(),
  maxLoanAmount: Joi.number().greater(0).less(999999999).allow(null).allow(''),
  otherIncome: Joi.number().less(9999999999).allow(null).allow(''),
});
