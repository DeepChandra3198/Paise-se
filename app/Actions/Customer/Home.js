const prisma = require('../../../prisma/prisma');
const { logger } = require('../../Middleware/ErrorLogger');

async function Home(req, res) {
  try {
    const products = await prisma.products.findMany({
      where: {
        status: true,
      },
      orderBy: [
        {
          sort: 'desc',
        },
      ],
    });
    const displayProducts = await prisma.products.findMany({
      where: {
        AND: [
          {
            status: true,
          },
          {
            isVisibleOnHomePage: true,
          },
        ],
      },
      orderBy: [
        {
          sort: 'desc',
        },
      ],
    });
    const testimonials = await prisma.testimonials.findMany({
      where: {
        status: true,
      },
      orderBy: [
        {
          id: 'desc',
        },
      ],
    });
    const partners = await prisma.partners.findMany({
      where: {
        status: true,
      },
      orderBy: [
        {
          sort: 'desc',
        },
      ],
    });

    const greetings = await prisma.greetings.findMany({});

    const randomGreetId = greetings.map((greet) => greet.id)[
      Math.floor(Math.random() * greetings.map((greet) => greet.id).length)
    ];

    const greeting = greetings.find((greet) => greet.id === randomGreetId);

    return res.render('customer/index', {
      products,
      displayProducts,
      testimonials,
      partners,
      greeting,
    });
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = {
  Home,
};
