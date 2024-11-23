const prisma = require('../../../../prisma/prisma');
const { citiesViaNames, master, getAndParseUtms } = require('../../../Helpers/Functions');

async function index(req, res) {
  const cities = citiesViaNames();
  const employmentTypes = await master('Business Loan Employment Type');
  const annualTurnOver = await master('Annual Turnover');
  const companyType = await master('Company Type');
  const yearsInCurrentBusiness = await master('Years in Current Business');
  const product = await prisma.products.findUnique({
    where: {
      id: +req.params.productId,
    },
  });

  return res.render('customer/enquiries/business-loan-enquiry', {
    cities,
    employmentTypes,
    annualTurnOver,
    companyType,
    yearsInCurrentBusiness,
    product,
  });
}

async function store(req, res) {
  try {
    await prisma.BusinessLoanEnquiries.create({
      data: {
        ...req.body,
        userId: +req.cookies.userId,
        loanAmount: +req.body.loanAmount,
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
