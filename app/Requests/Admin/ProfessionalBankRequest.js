const Joi = require("joi");

module.exports.ProfessionalBankRequest = Joi.object({
  bankName: Joi.string().required().min(1).max(255),
  foir: Joi.number().less(101).required(),
});
