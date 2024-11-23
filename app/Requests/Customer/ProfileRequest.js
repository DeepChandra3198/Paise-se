const Joi = require('joi');

module.exports.ProfileRequest = Joi.object({
  name: Joi.string().required().min(1).max(100),
  email: Joi.string().email().min(1).max(100),
  phone: Joi.string().required().allow('').min(10).max(10),
  gender: Joi.string().optional(),
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
  address: Joi.string().required().max(100),
  pincode: Joi.string().required().length(6),
  city: Joi.string().required().max(100),
  state: Joi.string().required().max(100),
  profile: Joi.object().optional(),
  aadhar: Joi.string().required().min(12).max(12),
  pancard: Joi.string().required().min(10).max(10),
  aadharCardDocument: Joi.object().optional(),
  pancardDocument: Joi.object().optional(),
  bankChequeDocument: Joi.object().optional(),
});
