const Joi = require("joi");

module.exports.LoginRequest = Joi.object({
  phone: Joi.string().required().min(10).max(10),
});
