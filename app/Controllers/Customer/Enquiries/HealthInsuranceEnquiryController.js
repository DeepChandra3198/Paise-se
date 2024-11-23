const prisma = require('../../../../prisma/prisma');
const { getAndParseUtms } = require('../../../Helpers/Functions');

async function index(req, res) {
  const product = await prisma.products.findUnique({
    where: {
      id: +req.params.productId,
    },
  });
  return res.render('customer/enquiries/health-insurance-enquiry', { product });
}

async function store(req, res) {
  try {
    await prisma.HealthInsuranceEnquiries.create({
      data: {
        ...req.body,
        userId: +req.cookies.userId,
        productId: +req.body.productId,
        age: +req.body.age,
        utms: getAndParseUtms(req, res),
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Your enquiry has been sent and PaiseSe.com team will contact you soon',
      data: {},
    });
  } catch (error) {
    console.log(error);
    res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

module.exports = {
  index,
  store,
};
