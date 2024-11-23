const prisma = require('../../../../prisma/prisma');
const { citiesViaNames, master } = require('../../../Helpers/Functions');

async function index(req, res) {
  const cities = citiesViaNames();
  const employmentTypes = await master('Employment Type');
  const primaryBankAccounts = await master('Primary Bank Account');
  const loanAmounts = await master('LAP Loan Amount');
  const propertyTypes = await master('LAP Property Type');
  const tentativePurchaseMonths = await master('Tentative Purchase Month');
  const product = await prisma.products.findUnique({
    where: {
      id: +req.params.productId,
    },
  });

  return res.render('customer/enquiries/lap-loan-enquiry', {
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
    await prisma.LapLoanEnquiries.create({
      data: {
        ...req.body,
        userId: +req.cookies.userId,
        dob: new Date(req.body.dob),
        productId: +req.body.productId,
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
