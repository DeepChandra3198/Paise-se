const Joi = require('joi');

module.exports.TeamMemberRequest = Joi.object({
  name: Joi.string().required().min(1).max(100),
  designation: Joi.string().optional().max(100).allow('').allow(null),
  about: Joi.string().optional().allow('').allow(null),
  linkedIn: Joi.string().optional().allow('').allow(null),
});
