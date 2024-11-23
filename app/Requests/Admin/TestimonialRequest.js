const Joi = require("joi");

module.exports.TestimonialRequest = Joi.object({
  name: Joi.string().required().min(1).max(100),
  designation: Joi.string().required().min(1).max(100),
  content: Joi.string().required().min(1).max(1000),
});
