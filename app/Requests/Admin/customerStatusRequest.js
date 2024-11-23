const Joi = require("joi");

module.exports.customerStatusRequest = Joi.object({
  status: Joi.required(),
  remark: Joi.string().optional().allow(""),
  chanelCode: Joi.string().optional().allow(""),
  role: Joi.string().optional().allow(""),
  agentCategory: Joi.string().optional().allow("")
});
