const prisma = require("../../../prisma/prisma");
const { WebPaginate } = require("../../Helpers/WebPaginate");

async function index(req, res) {
  const faqs = await WebPaginate(req, res, "tds", {
    orderBy: [
      {
        id: "desc",
      },
    ],
  });

  return res.render("admin/cms/tds", {
    faqs,
  });
}

async function store(req, res) {
  try {
    console.log(req.body)
    const faq = await prisma.tds.create({
      data: {
        ...req.body,
        percent: +req.body.percent
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Tds created successfully!",
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

async function update(req, res) {
  try {
    const currentFaq = await prisma.tds.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    const faq = await prisma.tds.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        percent: +req.body.percent
      },
    });

    return res
      .status(200)
      .json({ message: "Tds updated successfully!", data: faq });
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
  update
};
