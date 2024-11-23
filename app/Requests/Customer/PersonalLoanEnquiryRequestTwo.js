const Joi = require('joi');

module.exports.PersonalLoanEnquiryRequestTwo = Joi.object({
  id: Joi.required(),
  salary: Joi.number().greater(1000).less(99999999),
  loanAmount: Joi.number().greater(10000).less(999999999),
  emiAmount: Joi.number().min(0).less(99999999),
  companyName: Joi.string().required().min(2).max(100),
  companyType: Joi.string().optional().allow('').allow(null).min(2).max(10),
  type: Joi.string().optional().allow("").allow(null),
});
