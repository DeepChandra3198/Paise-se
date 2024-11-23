const prisma = require('../../../../prisma/prisma');
const { WebPaginate } = require('../../../Helpers/WebPaginate');

async function ProductEnquiries(req, res) {
  const startDate = req.query.startDate?.length > 0 ? new Date(req.query.startDate) : undefined;
  const endDate = req.query.endDate?.length > 0 ? new Date(req.query.endDate) : new Date();

  const where = {};

  if (startDate !== undefined) {
    where.createdAt = {
      gte: startDate,
    };
  }

  if (endDate !== undefined) {
    where.createdAt = {
      ...where.createdAt,
      lte: endDate,
    };
  }
  
  const queries = await WebPaginate(req, res, 'UserInformation', {
    orderBy: [
      {
        id: 'desc',
      },
    ],
    include: {
      User: true,
      Product: true,
      UserCardClicks: {
        include: {
          Card: true,
        },
      },
    },
    where,
  });

  return res.render('admin/product/enquiries/enquiries', {
    queries,
    queryParams: req.query,
  });
}

module.exports = {
  ProductEnquiries,
};
