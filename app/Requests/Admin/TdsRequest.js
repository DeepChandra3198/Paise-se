const Joi = require("joi");

module.exports.TdsRequest = Joi.object({
  role: Joi.string().required().min(1).max(20),
  percent: Joi.string().required(),
});
