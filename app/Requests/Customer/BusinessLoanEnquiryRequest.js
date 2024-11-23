const Joi = require('joi');

module.exports.BusinessLoanEnquiryRequest = Joi.object({
  productId: Joi.required(),
  loanAmount: Joi.number().less(9999999999),
  employment: Joi.required(),
  annualTurnover: Joi.required(),
  city: Joi.string().required().min(1).max(100),
  phone: Joi.string().required().min(10).max(10),
  companyType: Joi.required(),
  currentBusinessYears: Joi.required(),
  email: Joi.string().email().min(1).max(100),
  dob: Joi.date()
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 21)))
    .iso()
    .required()
    .messages({
      'date.base': 'Date of birth must be a valid date',
      'date.iso': 'Date of birth must be in ISO format',
      'date.max': 'You must be at least 21 years old',
      'any.required': 'Date of birth is required',
    }),
  pancard: Joi.string().optional().allow('').allow(null).min(10).max(10),
  name: Joi.string().required().min(1).max(100),
  businessName: Joi.string().required().min(1).max(100),
});
