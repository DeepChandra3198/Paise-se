const prisma = require('../../../../prisma/prisma');
const { getAndParseUtms } = require('../../../Helpers/Functions');

async function index(req, res) {
  const product = await prisma.products.findUnique({
    where: {
      id: +req.params.productId,
    },
  });
  return res.render('customer/enquiries/family-doctor-enquiry', { product });
}

async function store(req, res) {
  try {
    await prisma.FamilyDoctorEnquiries.create({
      data: {
        ...req.body,
        userId: +req.cookies.userId,
        age: +req.body.age,
        productId: +req.body.productId,
        utms: getAndParseUtms(req, res),
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Your enquiry has been sent and PaiseSe.com team will contact you soon',
      data: {},
    });
  } catch (error) {
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
