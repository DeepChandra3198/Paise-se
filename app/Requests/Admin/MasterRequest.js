const Joi = require("joi");

module.exports.MasterRequest = Joi.object({
  name: Joi.string().required().min(1).max(100),
});
