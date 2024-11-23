const Joi = require("joi");

module.exports.PartnerRequest = Joi.object({
  name: Joi.string().required().min(1).max(100),
  sort: Joi.number().less(999999999).required(),
});
