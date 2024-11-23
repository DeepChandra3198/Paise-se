const Joi = require("joi");

module.exports.PaiseseWebhook = Joi.object({
  externalId: Joi.string().optional().allow(""),
  deliveredTS: Joi.string().optional().allow(""),
  status: Joi.string().optional().allow(""),
  cause: Joi.string().optional().allow(""),
  phoneNo: Joi.string().required(),
  errCode: Joi.string().optional().allow(""),
  noOfFrags: Joi.string().optional().allow(""),
  mask: Joi.string().optional().allow(""),
});