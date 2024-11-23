const prisma = require('../../../prisma/prisma');
const { yearsDiff } = require('../../Helpers/Functions');
const { logger } = require('../../Middleware/ErrorLogger');

async function Cards(req, res) {
  try {
    const infoId = +req.query.info;
    const information = await prisma.userInformation.findUnique({
      where: {
        id: infoId,
      },
    });

    // const age = yearsDiff(information.dob, new Date());

    // const checkCreditCardBre = await prisma.Bres.findMany({
    //   where: {
    //     AND: [
    //       {
    //         age: {
    //           lte: age,
    //         },
    //       },
    //       {
    //         income: {
    //           lte: information.salary,
    //         },
    //       },
    //       {
    //         status: true,
    //       },
    //       {
    //         CreditCardBreCities: {
    //           some: {
    //             pincode: information.pincode,
    //           },
    //         },
    //       },
    //     ],
    //   },
    // });

    // if (checkCreditCardBre.length === 0) {
    //   return res.render('customer/cards', {
    //     cards: [],
    //     information,
    //     infoId,
    //   });
    // }

    // const availableBanks = checkCreditCardBre.map((bre) => bre.lender);

    // const cards = await prisma.cards.findMany({
    //   include: {
    //     Bres: {
    //       where: {
    //         AND: [
    //           {
    //             age: {
    //               lte: age,
    //             },
    //           },
    //           {
    //             income: {
    //               lte: information.annualIncome,
    //             },
    //           },
    //           {
    //             productId: information.productId,
    //           },
    //           {
    //             lender: {
    //               in: availableBanks,
    //             },
    //           },
    //         ],
    //       },
    //     },
    //   },
    // });

    const cards = await prisma.cards.findMany({
      where: {
        status: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return res.render('customer/cards', {
      cards,
      information,
      infoId,
    });
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = {
  Cards,
};
