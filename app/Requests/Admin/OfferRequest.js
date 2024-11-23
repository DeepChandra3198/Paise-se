const Joi = require("joi");

module.exports.OfferRequest = Joi.object({
  offer: Joi.string().required().min(1).max(255)
});
