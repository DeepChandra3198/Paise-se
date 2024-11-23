const { name } = require('ejs');
const Joi = require('joi');

module.exports.PanDetailRequest = Joi.object({
  panNumber: Joi.string().required().min(10).max(10).label('Pan Number'),
});


module.exports.PanVerifyRequest = Joi.object({
  panNumber: Joi.string().required().min(10).max(10).label('Pan Number'),
  name: Joi.string().required(),
  dob: Joi.string().required()
});
