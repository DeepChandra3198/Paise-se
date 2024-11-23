module.exports.TrimStringsMiddleware = (req, res, next) => {
  const traverse = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key].trim();
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
