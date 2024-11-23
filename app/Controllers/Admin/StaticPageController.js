const prisma = require("../../../prisma/prisma");
const { slugify } = require("../../Helpers/Functions");

async function index(req, res) {
  const pages = await prisma.staticPages.findMany({
    orderBy: [
      {
        id: "desc",
      },
    ],
  });
  return res.render("admin/cms/static-page", {
    pages,
  });
}

async function store(req, res) {
  try {
    const exists = await prisma.staticPages.findFirst({
      where: { name: req.body.name },
    });

    if (exists !== null) {
      throw new Error("Page with the same name already exists");
    }

    const page = await prisma.staticPages.create({
      data: {
        ...req.body,
        slug: slugify(req.body.name),
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Page created successfully!",
      data: page,
    });
  } catch (error) {
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}

async function edit(req, res) {
  try {
    const page = await prisma.staticPages.findUnique({
      where: {
        id: +req.params.id,
      },
    });
    return res.status(200).json({ message: "", data: page });
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
    await prisma.staticPages.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect("/admin/page");
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
    const staticPages = await prisma.staticPages.findFirst({
      where: {
        name: req.body.name,
        NOT: {
          id: +req.params.id,
        },
      },
    });

    if (staticPages !== null) {
      throw new Error("Page with the same name already exists");
    }

    const page = await prisma.staticPages.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        slug: slugify(req.body.name),
      },
    });

    return res
      .status(200)
      .json({ message: "Page updated successfully!", data: page });
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
    await prisma.staticPages.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res
      .status(200)
      .json({ message: "Page deleted successfully!", data: {} });
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
  edit,
  toggleStatus,
  update,
  destroy,
};
