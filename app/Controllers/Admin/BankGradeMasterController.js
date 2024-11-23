const prisma = require("../../../prisma/prisma");

async function index(req, res) {
  const bankGradeMasters = await prisma.BankGradeMasters.findMany({
    orderBy: [
      {
        id: "desc",
      },
    ],
  });

  return res.render("admin/setup/bank-grade-masters", {
    bankGradeMasters,
  });
}

async function store(req, res) {
  try {
    const bankGradeMasters = await prisma.BankGradeMasters.create({
      data: req.body,
    });

    return res.status(200).json({
      status: "success",
      message: "Bank grade master created successfully!",
      data: bankGradeMasters,
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
    await prisma.BankGradeMasters.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect("/admin/setup/bank-grade-master");
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
    const bankGradeMasters = await prisma.BankGradeMasters.update({
      where: {
        id: +req.params.id,
      },
      data: req.body
    });

    return res
      .status(200)
      .json({ message: "Bank grade master updated successfully!", data: bankGradeMasters });
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
    await prisma.BankGradeMasters.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res
      .status(200)
      .json({ message: "Bank grade master deleted successfully!", data: {} });
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
