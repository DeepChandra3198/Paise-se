const prisma = require("../../../prisma/prisma");
const { logger } = require("../../Middleware/ErrorLogger");
const { WebPaginate } = require('../../Helpers/WebPaginate');

async function contactQueries(req, res) {

  const teamMember = await WebPaginate(req, res, 'ContactQueries', {
    orderBy: [
      {
        id: 'desc',
      },
    ],
  });


  return res.render('admin/cms/contact-queries', {
    teamMember
} );
}

async function ContactUs(req, res) {
  try {
    await prisma.contactQueries.create({ data: req.body });
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
  ContactUs,
  contactQueries
};
