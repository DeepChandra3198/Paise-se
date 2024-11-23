const prisma = require("../../../prisma/prisma");
const { logger } = require("../../Middleware/ErrorLogger");

async function UserCardClick(req, res) {
  try {
    const infoId = +req.params.infoId;
    const cardId = +req.params.cardId;
    const productId = +req.params.productId;
    const card = await prisma.cards.findUnique({ where: { id: cardId } });
  
    await prisma.userCardClicks.create({
      data: {
        userInformationId: infoId,
        cardId,
        productId,
      },
    });
  
    res.redirect(card.link);
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = {
  UserCardClick,
};
