const prisma = require("../../../prisma/prisma");
const path = "/uploads/";
const fs = require("fs");

async function index(req, res) {
  let products = [];
  if (req.query.search) {
    products = await prisma.products.findMany({
      where: {
        name: {
          search: `${req.query.search}*`,
        },
      },
      orderBy: [
        {
          id: "desc",
        },
      ],
    });
  } else {
    products = await prisma.products.findMany({
      orderBy: [
        {
          id: "desc",
        },
      ],
    });
  }

  return res.render("admin/product/index", {
    products,
    search: req.query.search,
  });
}

async function store(req, res) {
  try {
    const product = await prisma.products.create({
      data: {
        ...req.body,
        icon: req?.files["icon"][0]?.filename,
        tagLineIcon: req?.files["tagLineIcon"][0]?.filename,
        isVisibleOnHomePage: Boolean(+req.body.isVisibleOnHomePage),
        sort: +req.body.sort,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Product created successfully!",
      data: product,
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
    await prisma.products.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect("/admin/products");
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
    const currentProduct = await prisma.products.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    const product = await prisma.products.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        icon:
          req?.files["icon"] === undefined
            ? currentProduct.icon
            : req?.files["icon"][0]?.filename,
        tagLineIcon:
          req?.files["tagLineIcon"] === undefined
            ? currentProduct.tagLineIcon
            : req?.files["tagLineIcon"][0]?.filename,
        isVisibleOnHomePage: Boolean(+req.body.isVisibleOnHomePage),
        sort: +req.body.sort,
      },
    });

    if (req?.files["icon"] !== undefined && currentProduct.icon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${currentProduct.icon}`);
    }

    if (req?.files["tagLineIcon"] !== undefined && currentProduct.tagLineIcon) {
      fs.unlinkSync(
        `${process.cwd()}/public/${path}${currentProduct.tagLineIcon}`
      );
    }

    return res
      .status(200)
      .json({ message: "Product updated successfully!", data: product });
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
    const product = await prisma.products.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (product.icon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${product.icon}`);
    }
    if (product.tagLineIcon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${product.tagLineIcon}`);
    }

    await prisma.products.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res
      .status(200)
      .json({ message: "Product deleted successfully!", data: {} });
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
