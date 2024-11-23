const Joi = require('joi');

module.exports.CompanyBankRequest = Joi.object({
  companyName: Joi.string().required().min(1).max(255),
  bankName: Joi.string().required().min(1).max(255),
  grade: Joi.string().required().min(1).max(50),
  foir: Joi.number().less(101).required(),
});
