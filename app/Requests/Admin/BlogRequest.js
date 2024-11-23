const Joi = require('joi');

module.exports.BlogRequest = Joi.object({
  title: Joi.string().required().min(1).max(100),
  content: Joi.string().optional().allow('').allow(null),
  author: Joi.string().optional().allow('').allow(null),
});
