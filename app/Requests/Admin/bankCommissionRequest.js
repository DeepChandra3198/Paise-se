const Joi = require("joi");

module.exports.BankCommissionRequest = Joi.object({
  bank: Joi.string().required(),
  agentCategory: Joi.string().required(),
  loanType: Joi.string().required(),
  payoutPercent: Joi.number().required(),
});
