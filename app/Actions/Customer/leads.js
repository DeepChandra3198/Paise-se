const prisma = require('../../../prisma/prisma');
const path = '/uploads/';
const fs = require('fs');
const { WebPaginate } = require('../../Helpers/WebPaginate');

async function index(req, res) {

  console.log(req.query, 'here')
  const { status, type } = req.query
  let filterObj = {
    userId: +req.cookies.userId
  }
  if (status && status != "") {
    filterObj.status = status
  }
  if (type && type != "") {
    filterObj.loanType = type.split('-').join(' ')
  }


  const leads = await WebPaginate(req, res, 'lead', {
    where: filterObj,
    orderBy: [
      {
        id: 'desc',
      },
    ],
  });


  return res.render('customer/profile/list', {
    leads
  });
}

async function store(req, res) {
  try {

    const dateString = req.body.dob
    const dateParts = dateString.split("-");
    let convertedDate = ""

    if (dateParts.length == 3) {
      convertedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      console.log(convertedDate);
    }

    const customer = await prisma.lead.findFirst({
      where: {
        pancard: req.body?.pancard
      }
    })

    console.log(customer)

    let customerId = Math.floor(1000 + Math.random() * 9000);
    let leadId = Math.floor(1000 + Math.random() * 9000);
    let date = new Date();

    if (!customer) {
      customerId = `PS${date.getDate().toString().padStart(2, '0') + (date.getMonth() + 1).toString().padStart(2, '0') + date.getFullYear()}${customerId}`

      const customerById = await prisma.lead.findFirst({
        where: {
          customerId: customerId
        }
      })

      if (customerById) {
        customerId = `PS${date.getDate().toString().padStart(2, '0') + (date.getMonth() + 1).toString().padStart(2, '0') + date.getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`
      }
    } else {
      customerId = customer.customerId
    }

    leadId = `PS${req.body.loanType.split(' ')[0][0]}${req.body.loanType.split(' ')[1][0]}${date.getDate().toString().padStart(2, '0') + (date.getMonth() + 1).toString().padStart(2, '0') + date.getFullYear()}${leadId}`


    const leadById = await prisma.lead.findFirst({
      where: {
        leadId: leadId
      }
    })


    if (leadById) {
      leadId = `PS${req.body.loanType.split(' ')[0][0]}${req.body.loanType.split(' ')[1][0]}${date.getDate().toString().padStart(2, '0') + (date.getMonth() + 1).toString().padStart(2, '0') + date.getFullYear()}${Math.floor(10000 + Math.random() * 90000)}`
    }


    const blogs = await prisma.lead.create({
      data: {
        ...req.body,
        customerId: customerId,
        leadId: leadId,
        userId: +req.cookies.userId,
        chanelCode: req.cookies.chanelCode,
        loanRequired: +req.body.loanRequired,
        netSalary: +req.body.netSalary,
        dob: convertedDate,
        turnOver: +req.body.turnOver,
        status: 'Pre-Login',
        preferedLender: req.body?.preferedLender?.length ? req.body?.preferedLender?.join(',') : null,
        aadharCardDocument: !req.files?.aadharCardDocument ? null : req.files.aadharCardDocument[0].filename,
        pancardDocument: !req.files?.pancardDocument ? null : req.files.pancardDocument[0].filename,
        bankStatement: !req.files?.bankStatement ? null : req.files.bankStatement[0].filename,
        passportPhoto: !req.files?.passportPhoto ? null : req.files.passportPhoto[0].filename,
        salarySlip: !req.files?.salarySlip ? null : req.files.salarySlip[0].filename,
        addressProof: !req.files?.addressProof ? null : req.files.addressProof[0].filename,
        coApAadharCardDocument: !req.files?.coApAadharCardDocument ? null : req.files.coApAadharCardDocument[0].filename,
        coApPancardDocument: !req.files?.coApPancardDocument ? null : req.files.coApPancardDocument[0].filename,
        coApPassportPhoto: !req.files?.coApPassportPhoto ? null : req.files.coApPassportPhoto[0].filename,
        registrationCertificate: !req.files?.registrationCertificate ? null : req.files.registrationCertificate[0].filename,
        udhyamAadhar: !req.files?.udhyamAadhar ? null : req.files.udhyamAadhar[0].filename,
        gstReturnTwelveMonths: !req.files?.gstReturnTwelveMonths ? null : req.files.gstReturnTwelveMonths[0].filename,
        itrTwoYears: !req.files?.itrTwoYears ? null : req.files.itrTwoYears[0].filename,
        coiTwoYears: !req.files?.coiTwoYears ? null : req.files.coiTwoYears[0].filename,
        balanceSheetTwoYears: !req.files?.balanceSheetTwoYears ? null : req.files.balanceSheetTwoYears[0].filename,
        profitLossAnnexure: !req.files?.profitLossAnnexure ? null : req.files.profitLossAnnexure[0].filename,
        taxAuditReport: !req.files?.taxAuditReport ? null : req.files.taxAuditReport[0].filename,
        currentBankOneYear: !req.files?.currentBankOneYear ? null : req.files.currentBankOneYear[0].filename,
        ccBankOneYear: !req.files?.ccBankOneYear ? null : req.files.ccBankOneYear[0].filename,
        odBankOneYear: !req.files?.odBankOneYear ? null : req.files.odBankOneYear[0].filename,
        runningLoanSheet: !req.files?.runningLoanSheet ? null : req.files.runningLoanSheet[0].filename,
        ownershipProof: !req.files?.ownershipProof ? null : req.files.ownershipProof[0].filename,
        detailSheet: !req.files?.detailSheet ? null : req.files.detailSheet[0].filename,
        otherDoc1: !req.files?.otherDoc1 ? null : req.files.otherDoc1[0].filename,
        otherDoc2: !req.files?.otherDoc2 ? null : req.files.otherDoc2[0].filename,
        otherDoc3: !req.files?.otherDoc3 ? null : req.files.otherDoc3[0].filename,
        otherDoc4: !req.files?.otherDoc4 ? null : req.files.otherDoc4[0].filename,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Lead created successfully!',
      data: blogs,
    });
  } catch (error) {
    console.log(error)
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function toggleStatus(req, res) {
  try {
    await prisma.lead.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect('/admin/blogs');
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function edit(req, res) {
  try {
    const teamMember = await prisma.lead.findFirst({
      where: {
        id: +req.params.id,
      },
    });

    return res.status(200).json({ message: 'Blog fetched successfully!', data: teamMember });
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function update(req, res) {
  try {

    const dateString = req.body.dob
    const dateParts = dateString.split("-");
    let convertedDate = ""

    if (dateParts.length == 3) {
      convertedDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      console.log(convertedDate);
    }

    const currentTeam = await prisma.lead.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    console.log(currentTeam)

    const team = await prisma.lead.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        loanRequired: +req.body.loanRequired,
        netSalary: +req.body.netSalary,
        dob: convertedDate,
        turnOver: +req.body.turnOver ? +req.body.turnOver : currentTeam.turnOver,
        aadharCardDocument: !req.files?.aadharCardDocument ? null : req.files.aadharCardDocument[0].filename,
        pancardDocument: !req.files?.pancardDocument ? null : req.files.pancardDocument[0].filename,
        bankStatement: !req.files?.bankStatement ? null : req.files.bankStatement[0].filename,
        passportPhoto: !req.files?.passportPhoto ? null : req.files.passportPhoto[0].filename,
        salarySlip: !req.files?.salarySlip ? null : req.files.salarySlip[0].filename,
        addressProof: !req.files?.addressProof ? null : req.files.addressProof[0].filename,
        coApAadharCardDocument: !req.files?.coApAadharCardDocument ? null : req.files.coApAadharCardDocument[0].filename,
        coApPancardDocument: !req.files?.coApPancardDocument ? null : req.files.coApPancardDocument[0].filename,
        coApPassportPhoto: !req.files?.coApPassportPhoto ? null : req.files.coApPassportPhoto[0].filename,
        registrationCertificate: !req.files?.registrationCertificate ? null : req.files.registrationCertificate[0].filename,
        udhyamAadhar: !req.files?.udhyamAadhar ? null : req.files.udhyamAadhar[0].filename,
        gstReturnTwelveMonths: !req.files?.gstReturnTwelveMonths ? null : req.files.gstReturnTwelveMonths[0].filename,
        itrTwoYears: !req.files?.itrTwoYears ? null : req.files.itrTwoYears[0].filename,
        coiTwoYears: !req.files?.coiTwoYears ? null : req.files.coiTwoYears[0].filename,
        balanceSheetTwoYears: !req.files?.balanceSheetTwoYears ? null : req.files.balanceSheetTwoYears[0].filename,
        profitLossAnnexure: !req.files?.profitLossAnnexure ? null : req.files.profitLossAnnexure[0].filename,
        taxAuditReport: !req.files?.taxAuditReport ? null : req.files.taxAuditReport[0].filename,
        currentBankOneYear: !req.files?.currentBankOneYear ? null : req.files.currentBankOneYear[0].filename,
        ccBankOneYear: !req.files?.ccBankOneYear ? null : req.files.ccBankOneYear[0].filename,
        odBankOneYear: !req.files?.odBankOneYear ? null : req.files.odBankOneYear[0].filename,
        runningLoanSheet: !req.files?.runningLoanSheet ? null : req.files.runningLoanSheet[0].filename,
        ownershipProof: !req.files?.ownershipProof ? null : req.files.ownershipProof[0].filename,
        detailSheet: !req.files?.detailSheet ? null : req.files.detailSheet[0].filename,
      },
    });

    if (req.files?.aadharCardDocument) {
      if (req.files?.aadharCardDocument[0]?.filename !== undefined && currentTeam.aadharCardDocument) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.aadharCardDocument}`);
      }
    }
    if (req.files?.pancardDocument) {
      if (req.files?.pancardDocument[0]?.filename !== undefined && currentTeam.pancardDocument) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.pancardDocument}`);
      }
    }
    if (req.files?.passportPhoto) {
      if (req.files?.passportPhoto[0]?.filename !== undefined && currentTeam.passportPhoto) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.passportPhoto}`);
      }
    }
    if (req.files?.bankStatement) {
      if (req.files?.bankStatement[0]?.filename !== undefined && currentTeam.bankStatement) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.bankStatement}`);
      }
    }
    if (req.files?.addressProof) {
      if (req.files?.addressProof[0]?.filename !== undefined && currentTeam.addressProof) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.addressProof}`);
      }
    }
    if (req.files?.salarySlip) {
      if (req.files?.salarySlip[0]?.filename !== undefined && currentTeam.salarySlip) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.salarySlip}`);
      }
    }
    if (req.files?.coApPancardDocument) {
      if (req.files?.coApPancardDocument[0]?.filename !== undefined && currentTeam.coApPancardDocument) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.coApPancardDocument}`);
      }
    }
    if (req.files?.coApAadharCardDocument) {
      if (req.files?.coApAadharCardDocument[0]?.filename !== undefined && currentTeam.coApAadharCardDocument) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.coApAadharCardDocument}`);
      }
    }
    if (req.files?.coApPassportPhoto) {
      if (req.files?.coApPassportPhoto[0]?.filename !== undefined && currentTeam.coApPassportPhoto) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.coApPassportPhoto}`);
      }
    }
    if (req.files?.registrationCertificate) {
      if (req.files?.registrationCertificate[0]?.filename !== undefined && currentTeam.registrationCertificate) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.registrationCertificate}`);
      }
    }
    if (req.files?.udhyamAadhar) {
      if (req.files?.udhyamAadhar[0]?.filename !== undefined && currentTeam.udhyamAadhar) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.udhyamAadhar}`);
      }
    }
    if (req.files?.gstReturnTwelveMonths) {
      if (req.files?.gstReturnTwelveMonths[0]?.filename !== undefined && currentTeam.gstReturnTwelveMonths) {
        fs.unlinkSync(`${process.cwd()}/public/${path}${currentTeam.gstReturnTwelveMonths}`);
      }
    }

    return res.status(200).json({ message: 'Lead updated successfully!', data: team });
  } catch (error) {
    console.log(error)
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function destroy(req, res) {
  try {
    const teamMember = await prisma.lead.findUnique({
      where: {
        id: +req.params.id,
      },
    });

    if (teamMember.icon) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${teamMember.icon}`);
    }
    if (teamMember.cover) {
      fs.unlinkSync(`${process.cwd()}/public/${path}${teamMember.cover}`);
    }

    await prisma.blogs.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res.status(200).json({ message: 'Blog deleted successfully!', data: {} });
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function leadById(req, res) {

  const { id } = req.params
  const lead = await prisma.lead.findFirst({
    where: {
      userId: +req.cookies.userId,
      id: +id
    },
    include: {
      User: true,
    },
  });
  return res.render("customer/profile/view", {
    lead,
  });
}

async function editLeadById(req, res) {

  const { id } = req.params
  const lead = await prisma.lead.findFirst({
    where: {
      userId: +req.cookies.userId,
      id: +id
    },
    include: {
      User: true,
    },
  });
  return res.render("customer/profile/edit", {
    lead,
  });
}

module.exports = {
  index,
  store,
  toggleStatus,
  edit,
  update,
  destroy,
  leadById,
  editLeadById
};

