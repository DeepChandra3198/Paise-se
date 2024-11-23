const Joi = require("joi");

module.exports.RegisterRequest = Joi.object({
  userType: Joi.string().required().messages({
    'string.empty': 'Please select the agent type',
    'any.required': 'Please select the agent type',
  }),
  name: Joi.string().required().min(1).max(100),
  email: Joi.string().email().min(1).max(100),
  phone: Joi.string().required().min(10).max(10),
  profile: Joi.object().optional(),
  aadhar: Joi.string().required().min(12).max(12),
  pancard: Joi.string().required().min(10).max(10),
  pincode: Joi.string().required().min(6).max(6),
  state: Joi.string().required(),
  city: Joi.string().required(),
  gstNumber: Joi.string().min(15).max(15).allow(""),
  aadharCardDocument: Joi.object().optional(),
  pancardDocument: Joi.object().optional(),
});