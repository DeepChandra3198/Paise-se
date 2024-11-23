const prisma = require("../../../prisma/prisma");
const { logger } = require("../../Middleware/ErrorLogger");

async function CardsCompare(req, res) {
  try {
    const cardIds = Array.isArray(req.query.cardId)
      ? req.query.cardId.map((cardId) => +cardId)
      : [+req.query.cardId];
    const cards = await prisma.cards.findMany({
      where: {
        id: {
          in: cardIds,
        },
      },
    });
    return res.render("customer/cards-compare", { cards });
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = {
  CardsCompare,
};
