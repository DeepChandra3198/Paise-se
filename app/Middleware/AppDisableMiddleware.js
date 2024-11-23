module.exports.AppDisableMiddleware = (req, res, next) => {
  return res.status(200).render("errors/coming-soon");
};
