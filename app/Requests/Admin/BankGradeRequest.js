const Joi = require("joi");

module.exports.BankGradeRequest = Joi.object({
  bankName: Joi.string().required().min(1).max(255),
  grade: Joi.string().required().min(1).max(50),
  foir: Joi.number().less(101).required(),
});
