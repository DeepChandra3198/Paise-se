const Joi = require('joi');

module.exports.OtherBankRequest = Joi.object({
  bankName: Joi.string().required().min(1).max(255),
  grade: Joi.string().required().min(1).max(50),
  foir: Joi.number().less(101).required(),
  maxLoanAmount: Joi.number().greater(0).less(999999999).allow(null).allow(''),
});
