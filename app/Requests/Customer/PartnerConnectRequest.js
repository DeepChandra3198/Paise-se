const Joi = require("joi");

module.exports.PartnerConnectRequest = Joi.object({
  name: Joi.string().required().min(1).max(100),
  email: Joi.string().email().min(1).max(100),
  phone: Joi.string().required().min(10).max(10),
  subject: Joi.string().required().min(1).max(100),
  pincode: Joi.string().required().min(6).max(6),
  city: Joi.string().required().min(1).max(100),
  state: Joi.string().required().min(1).max(100),
  message: Joi.string().required().min(1).max(1000),
});
