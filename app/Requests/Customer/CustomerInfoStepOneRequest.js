const Joi = require('joi');

const customValidation = (value, helpers) => {
  const currentDate = new Date();
  const inputDate = new Date(value);

  // Calculate age in years
  const age = Math.floor((currentDate - inputDate) / (365 * 24 * 60 * 60 * 1000));

  if (age >= 21) {
    return value;
  } else {
    return helpers.error('date.invalid', { age });
  }
};

module.exports.CustomerInfoStepOneRequest = Joi.object({
  id: Joi.optional(),
  productId: Joi.required(),
  employment: Joi.required(),
  name: Joi.string().required().min(1).max(100),
  email: Joi.string().email().min(1).max(100),
  pincode: Joi.string().required().min(6).max(6),
  city: Joi.string().required().min(1).max(100),
  state: Joi.string().required().min(1).max(100),
  dob: Joi.date()
    .custom(customValidation, 'Custom validation')
    .when('employment', {
      is: 'Self Employed',
      then: Joi.date().custom((value, helpers) => {
        const currentDate = new Date();
        const inputDate = new Date(value);

        // Calculate age in years
        const age = Math.floor((currentDate - inputDate) / (365 * 24 * 60 * 60 * 1000));

        if (age >= 24) {
          return value;
        } else {
          return helpers.error('date.invalid', { age });
        }
      }),
    })
    .when('employment', {
      is: 'Self-Employed Professional',
      then: Joi.date().custom((value, helpers) => {
        const currentDate = new Date();
        const inputDate = new Date(value);

        // Calculate age in years
        const age = Math.floor((currentDate - inputDate) / (365 * 24 * 60 * 60 * 1000));

        if (age >= 24) {
          return value;
        } else {
          return helpers.error('date.invalid', { age });
        }
      }),
    })
    .messages({
      'date.invalid':
        'Date must be valid and meet the age requirements 21 for Salaried and 24 for Self Employed',
      'date.base': 'Invalid date format',
    }),
  pancard: Joi.string().optional().allow('').min(10).max(10),
});
