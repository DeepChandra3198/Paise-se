const Joi = require('joi');

module.exports.CarLoanEnquiryRequest = Joi.object({
  productId: Joi.required(),
  employment: Joi.required(),
  city: Joi.string().required().min(1).max(100),
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
  pancard: Joi.string().required().allow('').min(10).max(10),
  name: Joi.string().required().min(1).max(100),
  monthlyIncome: Joi.required(),
  carBrand: Joi.required(),
  productType: Joi.string().required().min(1).max(100),
  phone: Joi.string().optional().allow('').min(10).max(10),
  tentativePurchaseMonth: Joi.when('productType', {
    is: 'New Car Loan',
    then: Joi.string().required(),
  }),
  carModelYear: Joi.when('productType', {
    is: 'Car Re-finance',
    then: Joi.string().required(),
  }),
});
