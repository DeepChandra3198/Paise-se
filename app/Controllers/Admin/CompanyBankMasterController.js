const prisma = require('../../../prisma/prisma');
const fs = require('fs');
const { GetWorksheetDataWithHeadings } = require('../../Config/GetBankWorksheetDataWithHeadings');
const { ValidateImport } = require('../../Helpers/ValidateImport');
const { CompanyBanksImport } = require('../../Imports/CompanyBanksImport');
const {
  CompanyBankMasterImportRequest,
} = require('../../Requests/Admin/CompanyBankMasterImportRequest');
const { WebPaginate } = require('../../Helpers/WebPaginate');
const { master } = require('../../Helpers/Functions');

async function index(req, res) {
  const companyBankMasters = await WebPaginate(req, res, 'CompanyBankMasters', {
    where: {
      companyName: {
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

  return res.render('admin/setup/company-bank-masters', {
    companyBankMasters,
    cardProvidedBy
  });
}

async function store(req, res) {
  try {
    const companyBankMaster = await prisma.companyBankMasters.create({
      data: {
        ...req.body,
        foir: parseFloat(req.body.foir),
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Company bank master created successfully!',
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

async function storeViaExcel(req, res) {
  try {
    const sheetData = await GetWorksheetDataWithHeadings(req.file.path);
    ValidateImport(sheetData, CompanyBankMasterImportRequest);
    await CompanyBanksImport(sheetData);
    return res.status(200).json({
      status: 'success',
      message: 'Company bank masters created successfully!',
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
    await prisma.companyBankMasters.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect('/admin/setup/company-bank-master');
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
    const companyBankMaster = await prisma.companyBankMasters.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        foir: parseFloat(req.body.foir),
      },
    });

    return res.status(200).json({
      message: 'Company bank master updated successfully!',
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
    await prisma.companyBankMasters.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res.status(200).json({ message: 'Company bank master deleted successfully!', data: {} });
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
