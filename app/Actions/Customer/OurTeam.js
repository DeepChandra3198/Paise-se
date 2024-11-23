const prisma = require('../../../prisma/prisma');
const { logger } = require('../../Middleware/ErrorLogger');

async function OurTeam(req, res) {
  try {
    const teamMembers = await prisma.teamMembers.findMany({
      where: {
        status: true,
      },
    });

    return res.render('customer/our-team', { teamMembers });
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = {
  OurTeam,
};
