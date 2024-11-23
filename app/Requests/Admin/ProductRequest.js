const Joi = require("joi");

module.exports.ProductRequest = Joi.object({
  name: Joi.string().required().min(1).max(100),
  shortDescription: Joi.string().required().min(1).max(100),
  longDescription: Joi.string().required().min(1).max(1000),
  tagLineTitle: Joi.string().required().min(1).max(100),
  tagLineOne: Joi.string().required().min(1).max(100),
  tagLineTwo: Joi.string().required().min(1).max(100),
  tagLineThree: Joi.string().required().min(1).max(100),
  tagLineFour: Joi.string().required().min(1).max(100),
  tagLineFive: Joi.string().required().min(1).max(100),
  sort: Joi.number().less(999999999).required(),
  isVisibleOnHomePage: Joi.required().valid("1", "0"),
  buttonName: Joi.string().required().min(1).max(150),
});
