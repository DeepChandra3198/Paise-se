const Joi = require('joi');

module.exports.ProfessionalBankMasterImportRequest = Joi.object({
  bankName: Joi.string().required().min(1).max(255),
  foir: Joi.number().integer().less(101).required(),
});
