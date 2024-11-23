const prisma = require('../../../prisma/prisma');
const fs = require('fs');
const { GetWorksheetDataWithHeadings } = require('../../Config/GetBankWorksheetDataWithHeadings');
const { ValidateImport } = require('../../Helpers/ValidateImport');
const {
  OtherBankMasterImportRequest,
} = require('../../Requests/Admin/OtherBankMasterImportRequest');
const { WebPaginate } = require('../../Helpers/WebPaginate');
const { OtherBanksImport } = require('../../Imports/OtherBanksImport');
const {
  ProfessionalBankMasterImportRequest,
} = require('../../Requests/Admin/ProfessionalBankMasterImportRequest');
const { ProfessionalBanksImport } = require('../../Imports/ProfessionalBanksImport');
const { master } = require('../../Helpers/Functions');

async function index(req, res) {
  const ProfessionalBankMasters = await WebPaginate(req, res, 'ProfessionalBankMasters', {
    where: {
      bankName: {
        contains: req.query.search,
      },
    },
    orderBy: [
      {
        id: 'desc',
      },
    ],
  });

  const cardProvidedBy = await master('Credit Card Provided By');

  return res.render('admin/setup/professional-bank-masters', {
    ProfessionalBankMasters,
    cardProvidedBy
  });
}

async function store(req, res) {
  try {
    const ProfessionalBankMasters = await prisma.ProfessionalBankMasters.create({
      data: {
        ...req.body,
        foir: parseFloat(req.body.foir),
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Professional bank master created successfully!',
      data: ProfessionalBankMasters,
    });
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function storeViaExcel(req, res) {
  try {
    const sheetData = await GetWorksheetDataWithHeadings(req.file.path);
    ValidateImport(sheetData, ProfessionalBankMasterImportRequest);
    await ProfessionalBanksImport(sheetData);
    return res.status(200).json({
      status: 'success',
      message: 'Professional bank masters created successfully!',
      data: {},
    });
  } catch (error) {
    fs.unlinkSync(`${process.cwd()}/${req.file.path}`);
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function toggleStatus(req, res) {
  try {
    await prisma.ProfessionalBankMasters.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect('/admin/setup/professional-bank-master');
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
    const ProfessionalBankMaster = await prisma.ProfessionalBankMasters.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        foir: parseFloat(req.body.foir),
      },
    });

    return res.status(200).json({
      message: 'Other bank master updated successfully!',
      data: ProfessionalBankMaster,
    });
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function destroy(req, res) {
  try {
    await prisma.ProfessionalBankMasters.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res
      .status(200)
      .json({ message: 'Professional bank master deleted successfully!', data: {} });
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

module.exports = {
  index,
  store,
  storeViaExcel,
  toggleStatus,
  update,
  destroy,
};
