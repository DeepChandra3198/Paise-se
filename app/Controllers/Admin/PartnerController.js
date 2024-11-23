const prisma = require("../../../prisma/prisma");
const path = "/uploads/";
const fs = require("fs");

async function index(req, res) {
  const partners = await prisma.partners.findMany({
    orderBy: [
      {
        id: "desc",
      },
    ],
  });
  return res.render("admin/cms/partner", {
    partners,
  });
}

async function store(req, res) {
  try {
    const partner = await prisma.partners.create({
      data: {
        ...req.body,
        sort: +req.body.sort,
        icon: req.file?.filename,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Partner created successfully!",
      data: partner,
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
    await prisma.partners.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect("/admin/partner");
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
    const currentPartner = await prisma.partners.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    const partner = await prisma.partners.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        sort: +req.body.sort,
        icon: req.file === undefined ? currentPartner.icon : req.file.filename,
      },
    });

    if (req.file !== undefined && currentPartner.icon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${currentPartner.icon}`);
    }

    return res.status(200).json({
      message: "Partner updated successfully!",
      data: partner,
    });
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
    const partner = await prisma.partners.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (partner.icon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${partner.icon}`);
    }

    await prisma.partners.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res
      .status(200)
      .json({ message: "Partner deleted successfully!", data: {} });
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
