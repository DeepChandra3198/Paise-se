const { Prisma } = require("@prisma/client");
const prisma = require("../../../prisma/prisma");
const { logger } = require("../../Middleware/ErrorLogger");
const { master } = require("../../Helpers/Functions");

async function RegisterAgreement(req, res) {
  try {

    await prisma.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        agreedToTerms : true
      }
    });
    return res.status(200).json({
      message: "Registration Successful. Thank You! ",
      data: {},
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        console.log(
          'User not found with this email'
        )
      }
      logger.error(error.meta.cause);
      return res.status(422).json({
        status: "error",
        message: 'Something Went Wrong',
        data: {},
      });
    }
    logger.error(error.message);
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}

async function viewAgreement(req, res) {
  try {


      const registerInstruction = await master('Register Instruction')

      return res.render('customer/register-aggrement', { registerInstruction : registerInstruction.MasterValues});
  } catch (error) {
      logger.error(error.message);
  }
}

module.exports = {
  RegisterAgreement,
  viewAgreement
};