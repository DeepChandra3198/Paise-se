const prisma = require("../../../prisma/prisma");
const path = "/uploads/";
const fs = require("fs");
const { WebPaginate } = require("../../Helpers/WebPaginate");

async function index(req, res) {
  const masters = await prisma.masters.findMany({
    orderBy: [
      {
        name: "asc",
      },
    ],
  });

  const masterValues = await WebPaginate(req, res, "masterValues", {
    include: {
      Master: true,
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
  });

  return res.render("admin/setup/master-value", {
    masters,
    masterValues,
  });
}

async function store(req, res) {
  try {
    const masterValues = await prisma.masterValues.create({
      data: {
        masterId: +req.body.masterId,
        name: req.body.name,
        icon: req.file?.filename,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Master value created successfully!",
      data: masterValues,
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
    await prisma.masterValues.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect("/admin/setup/master-value");
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
    const currentMasterValue = await prisma.masterValues.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    const masterValue = await prisma.masterValues.update({
      where: {
        id: +req.params.id,
      },
      data: {
        masterId: +req.body.masterId,
        name: req.body.name,
        icon:
          req.file === undefined ? currentMasterValue.icon : req.file.filename,
      },
    });

    if (req.file !== undefined && currentMasterValue.icon) {
      fs.unlinkSync(
        `${process.cwd()}/public/${path}${currentMasterValue.icon}`
      );
    }

    return res.status(200).json({
      message: "Master value updated successfully!",
      data: masterValue,
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
    const masterValue = await prisma.masterValues.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (masterValue.icon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${masterValue.icon}`);
    }

    await prisma.masterValues.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res
      .status(200)
      .json({ message: "Master value deleted successfully!", data: {} });
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
