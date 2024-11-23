const { Prisma } = require("@prisma/client");
const prisma = require("../../../prisma/prisma");
const { logger } = require("../../Middleware/ErrorLogger");
const { master } = require("../../Helpers/Functions");

async function RegisterAccount(req, res) {
  try {

    if (req.body.accountVerifyType === "cheque" && !req.files?.bankChequeDocument) {
      return res.status(402).json({
        message: "Bank Cheque Required.",
        data: {},
      });
    }


    const exist = await prisma.user.findFirst({
      where: {
        id: +req.params.id,
      },
      select: {
        bankAccount: true,
        bankAccountHolder: true,
        bankBranch: true,
        bankName: true,
        bankIfsc: true
      }
    })

    if (!exist) {
      return res.status(401).json({
        message: "User Not Found.",
        data: {},
      });
    }

    if (exist?.bankAccount && exist?.bankAccountHolder && exist?.bankBranch && exist?.bankName && exist?.bankIfsc) {
      return res.status(401).json({
        message: "Already Registered ! Proceed to Login.",
        data: {},
      });
    }

    await prisma.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        bankChequeDocument: !req.files?.bankChequeDocument ? null : req.files.bankChequeDocument[0].filename,
      }
    });
    return res.status(200).json({
      message: "Thank You! Information Saved.",
      data: {},
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        console.log(
          'User not found'
        )
      }
      logger.error(error.meta.cause);
      return res.status(422).json({
        status: "error",
        message: 'Error occured while registering',
        data: {},
      });
    }
    logger.error(error.message);
    console.log(error)
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}


async function viewAccount(req, res) {
  try {


    const registerInstruction = await master('Register Instruction')

    return res.render('customer/register-account', { registerInstruction: registerInstruction.MasterValues });
  } catch (error) {
    console.log(error)
    logger.error(error.message);
  }
}

module.exports = {
  RegisterAccount,
  viewAccount
};
