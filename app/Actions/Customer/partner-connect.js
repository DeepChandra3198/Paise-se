const prisma = require("../../../prisma/prisma");
const { logger } = require("../../Middleware/ErrorLogger");

async function PConnect(req, res) {
  try {
    await prisma.PartnerConnectQueries.create({ data: req.body });
    return res.status(200).json({
      message: "Thank you for contacting us! We will get back to you soon.",
      data: {},
    });
  } catch (error) {
    logger.error(error.message);
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}

module.exports = {
    PConnect,
};
