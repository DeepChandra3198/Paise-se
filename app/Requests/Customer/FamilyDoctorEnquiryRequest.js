const Joi = require('joi');

module.exports.FamilyDoctorEnquiryRequest = Joi.object({
  productId: Joi.required(),
  name: Joi.string().required().min(1).max(100),
  age: Joi.number().greater(17).less(99),
  city: Joi.string().required().min(1).max(100),
  pincode: Joi.string().required().min(6).max(6),
  email: Joi.string().email().min(1).max(100),
  phone: Joi.string().optional().allow('').min(10).max(10),
});
