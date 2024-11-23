const { Prisma } = require("@prisma/client");
const prisma = require("../../../prisma/prisma");
const { logger } = require("../../Middleware/ErrorLogger");
const { master } = require("../../Helpers/Functions");

async function setPassword(req, res) {
    try {

        console.log(req.body)
        const { password } = req.body

        const user = await prisma.user.findFirst({
            where: {
                id: +req.params.id
            }
        })

        if (!user) {
            return res.status(422).json({
                message: "User Does Not Exist",
                data: {},
            });
        }
        if (user.password && user.password !== '') {
            return res.status(422).json({
                message: "Password already Set",
                data: {},
            });
        }

        await prisma.user.update({
            where: {
                id: +req.params.id
            },
            data: {
                password: password
            }
        });

        return res.status(200).json({
            message: "Password Successfully Updated",
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
        console.log(error)
        return res.status(422).json({
            status: "error",
            message: error.message,
            data: {},
        });
    }
}



async function viewSetPassword(req, res) {
    try {
  
  
        const registerInstruction = await master('Register Instruction')
  
        return res.render('customer/set-password', { registerInstruction : registerInstruction.MasterValues});
    } catch (error) {
        logger.error(error.message);
    }
  }
  

async function viewResetPassword(req, res) {
    try {
  
  
        const registerInstruction = await master('Register Instruction')
  
        return res.render('customer/reset-password', { registerInstruction : registerInstruction.MasterValues});
    } catch (error) {
        logger.error(error.message);
    }
  }

module.exports = {
    setPassword,
    viewSetPassword,
    viewResetPassword
};