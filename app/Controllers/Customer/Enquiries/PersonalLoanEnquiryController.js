const prisma = require('../../../../prisma/prisma');
const {
  master,
  updateUserInfoIfEmpty,
  calculateLoanOffered,
  calculateProfessionalLoanOffered,
  getAndParseUtms,
} = require('../../../Helpers/Functions');

async function index(req, res) {
  const employmentTypes = await master('Personal Loan Employment Type');
  const userTypes = await master('Personal Loan User Type');
  const product = await prisma.products.findUnique({
    where: {
      id: +req.params.productId,
    },
  });

  return res.render('customer/enquiries/personal-loan-enquiry', {
    employmentTypes,
    userTypes,
    product,
  });
}

async function storeStepOne(req, res) {
  const { id } = req.body;

  try {
    let information = {};
    if (id !== undefined) {
      delete req.body.id;
      delete req.body.userId;
      delete req.body.productId;
      information = await prisma.PersonalLoanEnquiries.update({
        where: {
          id: +id,
        },
        data: {
          ...req.body,
          dob: new Date(req.body.dob),
        },
      });
    } else {
      information = await prisma.PersonalLoanEnquiries.create({
        data: {
          ...req.body,
          userId: +req.cookies.userId,
          dob: new Date(req.body.dob),
          productId: +req.body.productId,
          utms: getAndParseUtms(req, res),
        },
      });
    }

    await updateUserInfoIfEmpty(
      +req.cookies.userId,
      req.body.name,
      req.body.email,
      new Date(req.body.dob),
      req.body.pancard
    );

    res.status(200).json({
      status: 'success',
      message: 'Information saved',
      data: { id: information.id },
    });
  } catch (error) {
    res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function storeStepTwo(req, res) {
  const { id: id } = req.body;
  try {
    delete req.body.id;
    await prisma.PersonalLoanEnquiries.update({
      where: {
        id: +id,
      },
      data: {
        ...req.body,
        salary: req.body.salary === undefined ? 0.0 : +req.body.salary,
        itr: req.body.itr === undefined ? 0.0 : +req.body.itr,
        loanAmount: +req.body.loanAmount,
        emiAmount: +req.body.emiAmount,
        company: req.body.company,
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Information saved',
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

async function banks(req, res) {
  const personalLoanInformation = await prisma.PersonalLoanEnquiries.findUnique({
    where: {
      id: +req.params.id,
    },
  });

  const age = Math.floor((new Date() - new Date(personalLoanInformation.dob)) / 31556952000);

  const checkPersonalLoanBre = await prisma.PersonalLoanBres.findMany({
    where: {
      AND: [
        personalLoanInformation.companyType === 'other'
          ? {
              otherIncome: { lte: personalLoanInformation.salary },
            }
          : {
              income: {
                lte: personalLoanInformation.salary,
              },
            },
        ,
        {
          age: {
            lte: age,
          },
        },
        {
          maxAge: {
            gte: age,
          },
        },
        {
          status: true,
        },
        {
          PersonalLoanBreCities: {
            some: {
              pincode: personalLoanInformation.pincode,
            },
          },
        },
      ],
    },
  });

  if (checkPersonalLoanBre.length === 0) {
    return res.render('customer/enquiries/personal-loan-banks', {
      personalLoanInformation,
      banks: [],
    });
  }

  const availableBanks = checkPersonalLoanBre.map((bre) => {
    return { bankName: bre.bankName, maxLoanAmount: bre.maxLoanAmount };
  });

  let banks = await prisma.CompanyBankMasters.findMany({
    where: {
      AND: [
        {
          companyName: {
            equals: personalLoanInformation.companyName,
          },
        },
        {
          bankName: {
            in: availableBanks.map((bank) => bank.bankName),
          },
        },
      ],
      status: true,
    },
  });

  if (banks.length > 0) {
    banks = banks
      .map((bank) => {
        if (availableBanks.some((availableBank) => availableBank.bankName === bank.bankName)) {
          const matchedBank = availableBanks.find(
            (availableBank) => availableBank.bankName === bank.bankName
          );
          return {
            ...bank,
            maxLoanAmount: matchedBank !== undefined ? matchedBank.maxLoanAmount : 0,
          };
        }
      })
      .filter((bank) => bank !== undefined);
  }

  if (banks.length === 0) {
    banks = await prisma.OtherBankMasters.findMany({
      where: {
        bankName: {
          in: availableBanks.map((bank) => bank.bankName),
        },
        status: true,
      },
    });
  }

  banks = await Promise.all(
    banks
      .map(async (bank) => ({
        ...bank,
        companyName: personalLoanInformation.companyName,
        loanOffered: calculateLoanOffered(personalLoanInformation, bank.foir, bank.maxLoanAmount),
        icon: await prisma.MasterValues.findFirst({
          where: {
            name: bank.bankName,
          },
        }),
      }))
      .filter((bank) => bank.loanOffered !== 0)
  );

  banks = banks
    .map((bank) => ({
      ...bank,
      icon: bank.icon.icon,
    }))
    .sort((a, b) => Number(a.loanOffered) - Number(b.loanOffered)).reverse();

  console.log(banks);

  return res.render('customer/enquiries/personal-loan-banks', {
    personalLoanInformation,
    banks,
  });
}

async function professionalBanks(req, res) {
  const personalLoanInformation = await prisma.PersonalLoanEnquiries.findUnique({
    where: {
      id: +req.params.id,
    },
  });


  const age = Math.floor((new Date() - new Date(personalLoanInformation.dob)) / 31556952000);

  const checkPersonalLoanBre = await prisma.PersonalLoanBres.findMany({
    where: {
      AND: [
        {
          age: {
            lte: age,
          },
        },
        {
          income: {
            lte: personalLoanInformation.itr,
          },
        },
        {
          status: true,
        },
        {
          PersonalLoanBreCities: {
            some: {
              pincode: personalLoanInformation.pincode,
            },
          },
        },
      ],
    },
  });

  if (!checkPersonalLoanBre.length > 0) {
    return res.render('customer/enquiries/personal-loan-banks', {
      personalLoanInformation,
      banks: [],
    });
  }

  const availableBanks = checkPersonalLoanBre.map((bre) => {
    return bre.bankName;
  });

  let banks = await prisma.ProfessionalBankMasters.findMany({
    where: {
      bankName: {
        in: availableBanks,
      },
      status: true,
    },
  });

  banks = await Promise.all(
    banks
      .map(async (bank) => ({
        ...bank,
        companyName: personalLoanInformation.companyName,
        loanOffered: calculateProfessionalLoanOffered(personalLoanInformation, bank.foir),
        icon: await prisma.MasterValues.findFirst({
          where: {
            name: bank.bankName,
          },
        }),
      }))
  );

  const filteredBanks = banks.filter((bank) => bank.loanOffered !== 0)
  banks = filteredBanks
    .map((bank) => ({
      ...bank,
      icon: bank.icon.icon,
    }))
    .sort((a, b) => Number(b.loanOffered) - Number(a.loanOffered));
    

    console.log(banks , personalLoanInformation ,'======>>> relevent data')

  return res.render('customer/enquiries/personal-loan-banks', {
    personalLoanInformation,
    banks,
  });
}

module.exports = {
  index,
  storeStepOne,
  storeStepTwo,
  banks,
  professionalBanks,
};
