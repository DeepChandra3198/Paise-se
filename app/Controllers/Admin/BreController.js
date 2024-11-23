const prisma = require('../../../prisma/prisma');
const { GetWorksheetDataWithHeadings } = require('../../Config/GetCitiesWorksheetDataWithHeadings');
const {
  GetWorksheetDataWithHeadings: GetCompaniesWorksheetDataWithHeadings,
} = require('../../Config/GetCompaniesWorksheetDataWithHeadings');
const { master, cities } = require('../../Helpers/Functions');
const { CreditCardBreCitiesImport } = require('../../Imports/CreditCardBreCitiesImport');
const {
  CreditCardCitiesImportRequest,
} = require('../../Requests/Admin/CreditCardCitiesImportRequest');
const { ValidateImport } = require('../../Helpers/ValidateImport');
const fs = require('fs');
const { CreditCardBreCompaniesImport } = require('../../Imports/CreditCardBreCompaniesImport');
const {
  CreditCardCompaniesImportRequest,
} = require('../../Requests/Admin/CreditCardCompaniesImportRequest');

async function index(req, res) {
  const bres = await prisma.bres.findMany({
    include: {
      Product: true,
      Card: true,
    },
    orderBy: [
      {
        id: 'desc',
      },
    ],
  });
  const cardProvidedBy = await master('Credit Card Provided By');
  const companyNames = await master('Company Name');
  const products = await prisma.products.findMany({
    where: {
      status: true,
    },
    orderBy: [
      {
        id: 'desc',
      },
    ],
  });
  const city = await cities();

  return res.render('admin/setup/bre', {
    bres,
    cardProvidedBy,
    companyNames,
    products,
    city,
  });
}

async function store(req, res) {
  try {
    const bre = await prisma.bres.create({
      data: {
        ...req.body,
        age: +req.body.age,
        income: req.body.income.length > 0 ? parseFloat(req.body.income) : 0.0,
        productId: +req.body.productId,
        cardId: req.body.cardId !== undefined ? +req.body.cardId : null,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Bre created successfully!',
      data: bre,
    });
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function toggleStatus(req, res) {
  try {
    await prisma.bres.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect('/admin/setup/bre');
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
    const bre = await prisma.bres.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        age: +req.body.age,
        income: req.body.income.length > 0 ? parseFloat(req.body.income) : 0.0,
        productId: +req.body.productId,
        cardId: req.body.cardId !== undefined ? +req.body.cardId : null,
      },
    });

    return res.status(200).json({ message: 'Bre updated successfully!', data: bre });
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
    await prisma.bres.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res.status(200).json({ message: 'Bre deleted successfully!', data: {} });
  } catch (error) {
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

async function storeCities(req, res) {
  try {
    const sheetData = await GetWorksheetDataWithHeadings(req.file.path);
    ValidateImport(sheetData, CreditCardCitiesImportRequest);
    const updatedSheetData = sheetData.map((val) => {
      val.breId = +req.params.id;
      return val;
    });
    await CreditCardBreCitiesImport(updatedSheetData);
    return res.status(200).json({
      status: 'success',
      message: 'Credit card bre cities mapped successfully!',
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

async function viewCities(req, res) {
  try {
    return res.status(200).json({
      status: 'success',
      message: '',
      data: await prisma.CreditCardBreCities.findMany({
        where: {
          breId: +req.params.id,
        },
      }),
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

async function storeCompanies(req, res) {
  try {
    const sheetData = await GetCompaniesWorksheetDataWithHeadings(req.file.path);
    ValidateImport(sheetData, CreditCardCompaniesImportRequest);
    const updatedSheetData = sheetData.map((val) => {
      val.breId = +req.params.id;
      return val;
    });
    await CreditCardBreCompaniesImport(updatedSheetData);
    return res.status(200).json({
      status: 'success',
      message: 'Credit card bre companies mapped successfully!',
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

async function viewCompanies(req, res) {
  try {
    return res.status(200).json({
      status: 'success',
      message: '',
      data: await prisma.CreditCardBreCompanies.findMany({
        where: {
          breId: +req.params.id,
        },
      }),
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

module.exports = {
  index,
  store,
  toggleStatus,
  update,
  destroy,
  storeCities,
  viewCities,
  storeCompanies,
  viewCompanies,
};
