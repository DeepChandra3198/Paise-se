const Joi = require("joi");

module.exports.leadStatusRequest = Joi.object({
    status: Joi.required(),
    disbursedAmount: Joi.optional(),
    payoutPercent: Joi.optional(),
    bankName: Joi.optional(),
    loanType: Joi.optional(),
    leadRemark: Joi.optional()
});
