const prisma = require("../../../prisma/prisma");
const { WebPaginate } = require("../../Helpers/WebPaginate");

async function index(req, res) {
   const faqs = await WebPaginate(req, res, "faqs", {
     include: {
       Product: true,
     },
     orderBy: [
       {
         id: "desc",
       },
     ],
   });

  const products = await prisma.products.findMany({
    where: {
      status: true,
    },
    orderBy: [
      {
        name: "asc",
      },
    ],
  });

  return res.render("admin/cms/faq", {
    faqs,
    products,
  });
}

async function store(req, res) {
  try {
    const faq = await prisma.faqs.create({
      data: {
        ...req.body,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Faq created successfully!",
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
    await prisma.faqs.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect("/admin/faq");
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
    const currentFaq = await prisma.faqs.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    const faq = await prisma.faqs.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
      },
    });

    return res
      .status(200)
      .json({ message: "Faq updated successfully!", data: faq });
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
    const faq = await prisma.faqs.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    await prisma.faqs.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res
      .status(200)
      .json({ message: "Faq deleted successfully!", data: {} });
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
