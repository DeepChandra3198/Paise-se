const Joi = require('joi');

module.exports.CustomerInfoStepTwoRequest = Joi.object({
  id: Joi.required(),
  annualIncome: Joi.required(),
  tentativeCreditLimit: Joi.when('creditCardHolder', {
    is: '1',
    then: Joi.required(),
  }),
  creditCardHolder: Joi.required().valid('1', '0'),
  creditCardProvidedBy: Joi.when('creditCardHolder', {
    is: '1',
    then: Joi.string().required(),
  }),
  creditCardType: Joi.when('creditCardHolder', {
    is: '1',
    then: Joi.string().required(),
  }),
});
