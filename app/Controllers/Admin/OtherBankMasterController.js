const prisma = require('../../../prisma/prisma');
const fs = require('fs');
const { GetWorksheetDataWithHeadings } = require('../../Config/GetBankWorksheetDataWithHeadings');
const { ValidateImport } = require('../../Helpers/ValidateImport');
const {
  OtherBankMasterImportRequest,
} = require('../../Requests/Admin/OtherBankMasterImportRequest');
const { WebPaginate } = require('../../Helpers/WebPaginate');
const { OtherBanksImport } = require('../../Imports/OtherBanksImport');
const { master } = require('../../Helpers/Functions');

async function index(req, res) {
  const OtherBankMasters = await WebPaginate(req, res, 'OtherBankMasters', {
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

  return res.render('admin/setup/other-bank-masters', {
    OtherBankMasters,
    cardProvidedBy
  });
}

async function store(req, res) {
  try {
    const otherBankMaster = await prisma.OtherBankMasters.create({
      data: {
        ...req.body,
        foir: parseFloat(req.body.foir),
        maxLoanAmount: +req.body.maxLoanAmount,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Other bank master created successfully!',
      data: otherBankMaster,
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
    ValidateImport(sheetData, OtherBankMasterImportRequest);
    await OtherBanksImport(sheetData);
    return res.status(200).json({
      status: 'success',
      message: 'Other bank masters created successfully!',
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
    await prisma.OtherBankMasters.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect('/admin/setup/other-bank-master');
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
    const companyBankMaster = await prisma.OtherBankMasters.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        foir: parseFloat(req.body.foir),
        maxLoanAmount: +req.body.maxLoanAmount,
      },
    });

    return res.status(200).json({
      message: 'Other bank master updated successfully!',
      data: companyBankMaster,
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
    await prisma.OtherBankMasters.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res.status(200).json({ message: 'Other bank master deleted successfully!', data: {} });
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
