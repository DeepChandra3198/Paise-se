const prisma = require("../../../prisma/prisma");
const path = "/uploads/";
const fs = require("fs");
const { master } = require("../../Helpers/Functions");

async function index(req, res) {
  const cards = await prisma.cards.findMany({
    orderBy: [
      {
        id: "desc",
      },
    ],
  });
  const cardType = await master("Card Type");
  const cardProvidedBy = await master("Credit Card Provided By");
  
  return res.render("admin/setup/card", {
    cards,
    cardType,
    cardProvidedBy,
  });
}

async function store(req, res) {
  try {
    const exists = await prisma.cards.findFirst({
      where: { name: req.body.name },
    });

    if (exists !== null) {
      throw new Error("Card with the same name already exists");
    }

    const card = await prisma.cards.create({
      data: {
        ...req.body,
        icon: req.file?.filename,
        fees: parseFloat(req.body.fees),
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Card created successfully!",
      data: card,
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
    const card = await prisma.cards.findUnique({
      where: {
        id: +req.params.id,
      },
    });
    return res.status(200).json({ message: "", data: card });
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
    await prisma.cards.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect("/admin/setup/card");
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
    const exists = await prisma.cards.findFirst({
      where: {
        name: req.body.name,
        NOT: {
          id: +req.params.id,
        },
      },
    });

    if (exists !== null) {
      throw new Error("Card with the same name already exists");
    }

    const currentCard = await prisma.cards.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    const card = await prisma.cards.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        icon: req.file === undefined ? currentCard.icon : req.file.filename,
        fees: parseFloat(req.body.fees),
      },
    });

    if (req.file !== undefined && currentCard.icon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${currentCard.icon}`);
    }

    return res
      .status(200)
      .json({ message: "Card updated successfully!", data: card });
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
    const card = await prisma.cards.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (card.icon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${card.icon}`);
    }

    await prisma.cards.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res
      .status(200)
      .json({ message: "card deleted successfully!", data: {} });
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
