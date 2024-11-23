module.exports.LowerCaseEmailMiddleware = (req, res, next) => {
  const traverse = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        if (key === "email") {
          obj[key] = obj[key].toLowerCase();
        }
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        traverse(obj[key]);
      }
    }
  };
  if (req.body) {
    traverse(req.body);
  }
  next();
};
