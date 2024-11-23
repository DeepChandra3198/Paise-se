const Joi = require('joi');
const { validateAge } = require('../../Helpers/Functions');

module.exports.TwoWheelerLoanEnquiryRequest = Joi.object({
  productId: Joi.required(),
  employment: Joi.required(),
  city: Joi.string().required().min(1).max(100),
  email: Joi.string().email().min(1).max(100),
  dob: Joi.date().less('now').custom(validateAge, 'Date of birth validation'),
  pancard: Joi.string().optional().allow('').allow(null).min(10).max(10),
  name: Joi.string().required().min(1).max(100),
  tentativePurchaseMonth: Joi.required(),
  monthlyIncome: Joi.required(),
  twoWheelerBrand: Joi.required(),
  phone: Joi.string().optional().min(10).max(10).allow(''),
});
