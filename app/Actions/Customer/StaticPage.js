const prisma = require("../../../prisma/prisma");
const { logger } = require("../../Middleware/ErrorLogger");

async function StaticPage(req, res) {
  try {
    const page = await prisma.staticPages.findUniqueOrThrow({
      where: {
        slug: req.params.slug,
      },
    });
    return res.render("static-page", {
      page,
    });
  } catch (error) {
    logger.error(error.message);
    if (error.code === "P2025") {
      return res.status(404).render("errors/404");
    }
  }
}

module.exports = {
  StaticPage,
};
