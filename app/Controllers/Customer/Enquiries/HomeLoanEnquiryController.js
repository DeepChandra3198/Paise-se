const prisma = require('../../../../prisma/prisma');
const { citiesViaNames, master, getAndParseUtms } = require('../../../Helpers/Functions');

async function index(req, res) {
  const cities = citiesViaNames();
  const employmentTypes = await master('Employment Type');
  const primaryBankAccounts = await master('Primary Bank Account');
  const loanAmounts = await master('Home Loan Amount');
  const propertyTypes = await master('Home Property Type');
  const tentativePurchaseMonths = await master('Tentative Purchase Month');
  const product = await prisma.products.findUnique({
    where: {
      id: +req.params.productId,
    },
  });

  return res.render('customer/enquiries/home-loan-enquiry', {
    cities,
    employmentTypes,
    primaryBankAccounts,
    loanAmounts,
    propertyTypes,
    tentativePurchaseMonths,
    product,
  });
}

async function store(req, res) {
  try {
    await prisma.HomeLoanEnquiries.create({
      data: {
        ...req.body,
        userId: +req.cookies.userId,
        dob: new Date(req.body.dob),
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
