const Joi = require('joi');

module.exports.CreditCardCompaniesImportRequest = Joi.object({
  company: Joi.string().required().min(1).max(150),
});
