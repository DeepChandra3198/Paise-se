const prisma = require('../../prisma/prisma');

const WebPaginate = async (req, res, model, options) => {
  let countOptions = { ...options };
  delete countOptions.include;

  const totalCount = await prisma[model]?.count(countOptions);
  const totalPages = Math.ceil(totalCount / res.locals.resultsPerPage);
  const skip = (res.locals.currentPageNo - 1) * res.locals.resultsPerPage;
  options = { ...options, skip, take: res.locals.resultsPerPage };
  const startIndex = (res.locals.currentPageNo - 1) * res.locals.resultsPerPage;

  const endIndex = (res.locals.endIndex = Math.min(
    startIndex + res.locals.resultsPerPage - 1,
    totalCount - 1
  ));

  const results = await prisma[model]?.findMany(options);

  res.locals.startIndex = startIndex;
  res.locals.endIndex = endIndex;
  res.locals.totalCount = totalCount;
  res.locals.totalPages = totalPages;

  return results;
};

module.exports = {
  WebPaginate,
};
