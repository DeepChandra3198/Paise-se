const prisma = require('../../../prisma/prisma');
const { master, updateUserInfoIfEmpty, getAndParseUtms } = require('../../Helpers/Functions');

async function getCustomerInfo(req, res) {
  const employmentTypes = await master('Employment Type');
  const cardProvidedBy = await master('Credit Card Provided By');
  const cardType = await master('Card Type');
  const product = await prisma.products.findUnique({
    where: {
      id: +req.params.productId,
    },
  });

  return res.render('customer/customer-info', {
    employmentTypes,
    cardProvidedBy,
    cardType,
    product,
  });
}

async function postCustomerInfoStageOne(req, res) {
  const { id } = req.body;

  try {
    let information = {};
    if (id !== undefined) {
      delete req.body.id;
      delete req.body.userId;
      delete req.body.productId;
      information = await prisma.userInformation.update({
        where: {
          id: +id,
        },
        data: {
          ...req.body,
          dob: new Date(req.body.dob),
        },
      });
    } else {
      information = await prisma.userInformation.create({
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

async function postCustomerInfoStageTwo(req, res) {
  const { id } = req.body;
  try {
    delete req.body.id;
    await prisma.userInformation.update({
      where: {
        id: +id,
      },
      data: {
        ...req.body,
        annualIncome: parseFloat(req.body.annualIncome),
        tentativeCreditLimit: isNaN(parseFloat(req.body.tentativeCreditLimit))
          ? 0.0
          : parseFloat(req.body.tentativeCreditLimit),
        creditCardHolder: Boolean(+req.body.creditCardHolder),
        creditCardProvidedBy: JSON.parse(req.body.creditCardProvidedBy),
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

module.exports = {
  getCustomerInfo,
  postCustomerInfoStageOne,
  postCustomerInfoStageTwo,
};
