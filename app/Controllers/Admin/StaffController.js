const prisma = require("../../../prisma/prisma");
const { master } = require("../../Helpers/Functions")
const { WebPaginate } = require('../../Helpers/WebPaginate');
const bcrypt = require('bcrypt')

async function index(req, res) {

  const users = await WebPaginate(req, res, 'User', {
    where: {
      type: "staff"
    },
    orderBy: [
      {
        id: "desc",
      },
    ],
    include: {
      UserInformation: true,
    },
  });


  const loanType = await master('Loan Type')

  return res.render("admin/staff/index", {
    users,
    loanType: loanType.MasterValues,
  });
}


async function getById(req, res) {

  const { id } = req.params
  const customer = await prisma.user.findFirst({
    where: {
      type: "customer",
      id: +id
    },
    include: {
      UserInformation: true,
    },
  });

  const agentCategory = await master('Agent Category')
  return res.render("admin/customer/view", {
    customer,
    agentCategoryOptions: agentCategory.MasterValues
  });
}


async function store(req, res) {
  try {

    console.log(req.body)
    const { email, password, loanType } = req.body

    const exists = await prisma.user.findFirst({
      where:
      {
        email: email
      },
    });

    if (exists !== null) {
      throw new Error("Email already exists");
    }

    const staff = await prisma.user.create({
      data: {
        email: email,
        staffType: loanType,
        password: password,
        type: 'staff'
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Staff created successfully!",
      data: staff,
    });
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
  getById,
  store
};
