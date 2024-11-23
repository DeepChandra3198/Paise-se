const Joi = require('joi');

module.exports.CreditCardCitiesImportRequest = Joi.object({
  city: Joi.string().required().min(1).max(100),
  pincode: Joi.string().required().min(1).max(10),
});
