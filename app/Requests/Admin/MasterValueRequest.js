const Joi = require("joi");

module.exports.MasterValueRequest = Joi.object({
  masterId: Joi.required(),
  name: Joi.string().required().min(1).max(100),
});
