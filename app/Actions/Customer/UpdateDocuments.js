const prisma = require("../../../prisma/prisma");
const { logger } = require("../../Middleware/ErrorLogger");

async function UpdateDocuments(req, res) {
  try {
    const profile = await prisma.user.findUnique({
      where: {
        id: +req.cookies.userId,
      },
    });

    await prisma.user.update({
      where: {
        id: +req.cookies.userId,
      },
      data: {
        aadharCardDocument:
          req?.files["aadharCardDocument"] === undefined
            ? profile.aadharCardDocument
            : req?.files["aadharCardDocument"][0]?.filename,
        pancardDocument:
          req?.files["pancardDocument"] === undefined
            ? profile.pancardDocument
            : req?.files["pancardDocument"][0]?.filename,
      },
    });
    return res
      .status(200)
      .json({ message: "Documents has been updated!", data: {} });
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
  UpdateDocuments,
};
