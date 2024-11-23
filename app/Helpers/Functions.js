const bcrypt = require('bcryptjs');
const prisma = require('../../prisma/prisma');

const maxTokenAge = 12 * 60 * 60 * 1000; // 2hours

function calculatePercentage(number, percentage) {
  return (percentage / 100) * number;
}

function hash(string) {
  return bcrypt.hashSync(string, bcrypt.genSaltSync(10));
}

async function getCityViaPincode(req, res) {
  try {
    res.status(200).json({
      status: 'success',
      message: '',
      data: await prisma.cities.findFirst({
        where: {
          pincode: req.params.pincode,
        },
      }),
    });
  } catch (error) {
    res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function getBankViaIfsc(req, res) {
  try {
    res.status(200).json({
      status: 'success',
      message: '',
      data: await prisma.bankifsc.findFirst({
        where: {
          ifsc: req.params.ifsc,
        },
      }),
    });
  } catch (error) {
    res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function getCardViaLender(req, res) {
  try {
    res.status(200).json({
      status: 'success',
      message: '',
      data: await prisma.cards.findMany({
        where: {
          lender: req.params.lenderName,
        },
      }),
    });
  } catch (error) {
    res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function master(name) {
  return await prisma.masters.findFirst({
    where: { name, status: true },
    include: { MasterValues: true },
  });
}

async function cities() {
  let cities = await prisma.cities.findMany({
    orderBy: [
      {
        name: 'asc',
      },
    ],
  });
  cities = new Map(cities.map((city) => [city.name, city]));
  cities = [...cities.values()];
  return cities;
}

function citiesViaNames() {
  return [
    'Delhi',
    'Mumbai',
    'Calcullta',
    'Madras',
    'Chennai',
    'Hyderabad',
    'Jaipur',
    'Pune',
    'Chandigarh',
    'others',
  ];
}

function yearsDiff(d1, d2) {
  let date1 = new Date(d1);
  let date2 = new Date(d2);
  let yearsDiff = date2.getFullYear() - date1.getFullYear();
  return yearsDiff;
}

function slugify(str, addExtraNumber = false) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function updateUserInfoIfEmpty(id, name, email, dob, pancard) {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (user.name === null) {
    await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: name,
        email: email,
        dob: new Date(dob),
        pancard: pancard,
      },
    });
  }
}

function calculateLoanOffered(personalLoanInformation, foir, maxLoanAmount) {
  let actualSalary = calculatePercentage(personalLoanInformation.salary, foir);
  const calculatedSalary = actualSalary - personalLoanInformation.emiAmount;
  const emiPerLakh = 2300.0;
  let amount = calculatedSalary / emiPerLakh;
  amount = amount * 100000;
  console.log(actualSalary, calculatedSalary, amount, maxLoanAmount);
  if (amount > maxLoanAmount) return parseFloat(maxLoanAmount.toFixed(0)).toLocaleString('en-US');
  if (amount <= 0) return parseInt(0);
  return parseInt(amount.toFixed(0)).toLocaleString('en-US');
}

function calculateProfessionalLoanOffered(personalLoanInformation, foir) {
  let actualSalary = personalLoanInformation.itr * 4;
  actualSalary = actualSalary / 12;
  console.log(actualSalary, foir);
  actualSalary = calculatePercentage(actualSalary, foir);
  const calculatedSalary = actualSalary - personalLoanInformation.emiAmount;
  const emiPerLakh = 2100.0;
  let amount = calculatedSalary / emiPerLakh;
  amount = amount * 100000;
  if (amount <= 0) return parseInt(0);
  return parseInt(amount.toFixed(2));
}

async function getCompanies(req, res) {
  if (req.query.companyName?.trim().length > 1) {
    const companies = await prisma.CompanyBankMasters.groupBy({
      by: ['companyName'],
      where: {
        companyName: {
          contains: req.query.companyName,
        },
        status: true,
      },
    });
    return res.status(200).json({
      status: 'success',
      message: 'Companies fetched!',
      data: companies,
    });
  }
  return res.status(200).json({
    status: 'success',
    message: 'Companies fetched!',
    data: [],
  });
}

async function getBanks(req, res) {
  const name = req.query.bankName?.trim();
  if (name.length > 1) {
    const banks = prisma.masters.findFirst({
      // where: { name:, status: true },
      include: { MasterValues: true },
    });
    return res.status(200).json({
      status: 'success',
      message: 'Banks fetched!',
      data: banks,
    });
  }
  return res.status(200).json({
    status: 'success',
    message: 'Banks fetched!',
    data: [],
  });
}

function validateAge(value, helpers) {
  const currentDate = new Date();
  const inputDate = new Date(value);
  const age = currentDate.getFullYear() - inputDate.getFullYear();
  if (age < 18) return helpers.message({ custom: 'Age must be 18 years or older' });
  return value;
}

function getAndSetUtms(req, res) {
  const utms = {
    utmSource: req.query?.utm_source,
    utmMedium: req.query?.utm_medium,
    utmCampaign: req.query?.utm_campaign,
    utmContent: req.query?.utm_content,
    utmTerm: req.query?.utm_term,
  };
  res.cookie('utms', JSON.stringify(utms), { httpOnly: true, maxAge: maxTokenAge * 1000 });
}

function getAndParseUtms(req, res) {
  const utms = req.cookies.utms !== undefined ? JSON.parse(req.cookies.utms) : {};
  res.cookie('utms', '', { maxAge: 1 });
  return utms;
}

module.exports = {
  maxTokenAge,
  hash,
  getCityViaPincode,
  getCardViaLender,
  master,
  cities,
  citiesViaNames,
  yearsDiff,
  slugify,
  updateUserInfoIfEmpty,
  calculateLoanOffered,
  calculateProfessionalLoanOffered,
  getCompanies,
  getBanks,
  validateAge,
  getAndSetUtms,
  getAndParseUtms,
  getBankViaIfsc
};
