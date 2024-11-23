const { type } = require("os");
const prisma = require("../../../prisma/prisma");
const { master } = require("../../Helpers/Functions")
const { WebPaginate } = require('../../Helpers/WebPaginate');

async function index(req, res) {

  const users = await WebPaginate(req, res, 'User', {
    where: {
      type: "customer"
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
  
  return res.render("admin/customer/index", {
    users,
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

async function updateStatus(req, res) {

  const { id } = req.params
  console.log(id, req.body, 'iiiiiiiiii')

  let statusObj = {
    status: req.body.status,
    remark: ""
  }
  if (req.body.remark && req.body.remark != "") {
    statusObj.remark = req.body.remark
  }
  if (req.body.role && req.body.role != "") {
    statusObj.role = req.body.role
    statusObj.remark = ""
  }
  if (req.body.agentCategory && req.body.agentCategory != "") {
    statusObj.agentCategory = req.body.agentCategory
  }
  if (req.body.chanelCode && req.body.chanelCode != "") {
    const exists = await prisma.user.findFirst({
      where: {
        chanelCode: req.body.chanelCode
      }
    })

    console.log(exists, 'exists')

    if (exists) {
      return res.status(404).json({
        message: "Chanel Code is not available !",
        data: {},
      });
    }
    statusObj.chanelCode = req.body.chanelCode
  }

  const customer = await prisma.user.update({
    where: {
      id: +id
    },
    data: statusObj
  });

  return res.status(200).json({
    message: "Status Updated !",
    data: {},
  });
}

module.exports = {
  index,
  getById,
  updateStatus
};
