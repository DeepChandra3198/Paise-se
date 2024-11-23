const prisma = require("../../../prisma/prisma");
const { logger } = require("../../Middleware/ErrorLogger");
const { PaiseseWebhook } = require('../../Requests/Customer/paiseseWebhook');
const { WebPaginate } = require('../../Helpers/WebPaginate');

async function paiseseWebhook(req, res) {

  const teamMember = await WebPaginate(req, res, 'paiseseWebhook', {
    orderBy: [
      {
        id: 'desc',
      },
    ],
  });


  return res.render('admin/cms/webhookPaisese', {
    teamMember
} );
}

async function readURL(req, res) {
    try {
        console.log(req.query)
        const { error } = PaiseseWebhook.validate(req.query)

        if (error) {
            console.log(error.details[0].message)
            return res.status(422).json({
                status: "error",
                message: error.details[0].message,
                data: {},
            });
        }

        const user = await prisma.paiseseWebhook.create({
            data: {
                ...req.query
            },
            select: {
                id: true
            }
        });
        console.log(user)
        return res.status(200).json({
            message: "Thank You! Information Saved.",
            data: user.id,
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



async function destroy(req, res) {
    try {
      const teamMember = await prisma.paiseseWebhook.findUnique({
        where: {
          id: +req.params.id,
        },
      });

      await prisma.paiseseWebhook.delete({
        where: {
          id: +req.params.id,
        },
      });
  
      return res.status(200).json({ message: 'Webhook deleted successfully!', data: {} });
    } catch (error) {
      return res.status(422).json({
        status: 'error',
        message: error.message,
        data: {},
      });
    }
  }

module.exports = {
    readURL,
    paiseseWebhook,
    destroy
};
