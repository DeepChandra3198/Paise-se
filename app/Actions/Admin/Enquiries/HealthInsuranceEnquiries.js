const prisma = require('../../../../prisma/prisma');
const { WebPaginate } = require('../../../Helpers/WebPaginate');

async function HealthInsuranceEnquiries(req, res) {
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
  
  const queries = await WebPaginate(req, res, 'HealthInsuranceEnquiries', {
    orderBy: [
      {
        id: 'desc',
      },
    ],
    include: { Product: true, User: true },
    where,
  });
  
  return res.render('admin/product/enquiries/health-insurance-enquiry', {
    queries,
    queryParams: req.query,
  });
}

module.exports = {
  HealthInsuranceEnquiries,
};
