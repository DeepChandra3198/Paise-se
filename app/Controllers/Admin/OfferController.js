const prisma = require("../../../prisma/prisma");
const { WebPaginate } = require("../../Helpers/WebPaginate");

async function index(req, res) {
  const faqs = await WebPaginate(req, res, "offers", {
    orderBy: [
      {
        id: "desc",
      },
    ],
  });

  return res.render("admin/cms/offer", {
    faqs,
  });
}

async function store(req, res) {
  try {
    console.log(req.body)
    const faq = await prisma.offers.create({
      data: {
        ...req.body,
        photo: !req.files?.photo ? null : req.files.photo[0].filename,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Offer created successfully!",
      data: faq,
    });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}

async function toggleStatus(req, res) {
  try {
    await prisma.offers.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect("/admin/offer");
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}

async function update(req, res) {
  try {
    const currentFaq = await prisma.offers.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    const faq = await prisma.offers.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        photo: !req.files?.photo ? null : req.files.photo[0].filename,
      },
    });

    return res
      .status(200)
      .json({ message: "Offer updated successfully!", data: faq });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}

async function destroy(req, res) {
  try {
    const faq = await prisma.offers.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    await prisma.offers.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res
      .status(200)
      .json({ message: "Offer deleted successfully!", data: {} });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}

module.exports = {
  index,
  store,
  toggleStatus,
  update,
  destroy,
};
