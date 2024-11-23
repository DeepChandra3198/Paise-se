function removeQueryString(url, param) {
  const urlObj = new URL(url);
  const searchParams = urlObj.searchParams;

  searchParams.delete(param);

  urlObj.search = searchParams.toString();
  return urlObj.toString();
}

module.exports.SetCurrentUrlAndPaginationData = (req, res, next) => {
  res.locals.currentUrl = removeQueryString(
    `${req.protocol}://${req.get("host")}${req.originalUrl}`,
    "page"
  );
  res.locals.currentPageNo = +req.query.page || 1;
  res.locals.resultsPerPage = 50;
  next();
};
