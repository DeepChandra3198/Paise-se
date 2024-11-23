const prisma = require("../../../prisma/prisma");
const path = "/uploads/";
const fs = require("fs");
const { WebPaginate } = require("../../Helpers/WebPaginate");

async function index(req, res) {
  const masters = await WebPaginate(req, res, "masters", {
    orderBy: [
      {
        id: "desc",
      },
    ],
  });

  return res.render("admin/setup/master", {
    masters,
  });
}

async function store(req, res) {
  try {
    const exists = await prisma.masters.findFirst({
      where: { name: req.body.name },
    });

    if (exists !== null) {
      throw new Error("Master with the same name already exists");
    }

    const master = await prisma.masters.create({
      data: {
        ...req.body,
        icon: req.file?.filename,
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Master created successfully!",
      data: master,
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
    await prisma.masters.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect("/admin/setup/master");
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
    const exists = await prisma.masters.findFirst({
      where: {
        name: req.body.name,
        NOT: {
          id: +req.params.id,
        },
      },
    });

    if (exists !== null) {
      throw new Error("Master with the same name already exists");
    }

    const currentMaster = await prisma.masters.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    const master = await prisma.masters.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        icon: req.file === undefined ? currentMaster.icon : req.file.filename,
      },
    });

    if (req.file !== undefined && currentMaster.icon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${currentMaster.icon}`);
    }

    return res
      .status(200)
      .json({ message: "Master updated successfully!", data: master });
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
    const master = await prisma.masters.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (master.icon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${master.icon}`);
    }

    await prisma.masters.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res
      .status(200)
      .json({ message: "Master deleted successfully!", data: {} });
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
