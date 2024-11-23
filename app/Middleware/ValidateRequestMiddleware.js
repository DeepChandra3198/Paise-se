const Joi = require("joi");

module.exports.ValidateRequestMiddleware = (schema) => {
  return async (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      console.log(details,'here=======>>>>>>>>') 
      const message = details.map((i) => (i.context.value==='' || i.message.includes('is required') ? 'Oops you missed out sharing your '+i.context.key : i.message)).join(",");
      res.status(422).json({ status: "error", message, data: {} });
    } 
  };
};
