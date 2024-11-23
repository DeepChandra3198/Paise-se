const Joi = require("joi");

module.exports.staffRequest = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
    loanType: Joi.string().required()
});
