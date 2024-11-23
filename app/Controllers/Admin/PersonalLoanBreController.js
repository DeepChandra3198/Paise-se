const prisma = require('../../../prisma/prisma');
const { GetWorksheetDataWithHeadings } = require('../../Config/GetCitiesWorksheetDataWithHeadings');
const { cities, master } = require('../../Helpers/Functions');
const { ValidateImport } = require('../../Helpers/ValidateImport');
const { PersonalLoanBreCitiesImport } = require('../../Imports/PersonalLoanBreCitiesImport');
const {
  PersonalLoanCitiesImportRequest,
} = require('../../Requests/Admin/PersonalLoanCitiesImportRequest');
const fs = require('fs');

async function index(req, res) {
  const bres = await prisma.PersonalLoanBres.findMany({
    include: {
      Product: true,
    },
    orderBy: [
      {
        id: 'desc',
      },
    ],
  });

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
  const cardProvidedBy = await master('Credit Card Provided By');

  return res.render('admin/setup/personal-loan-bre', {
    bres,
    products,
    city,
    cardProvidedBy,
  });
}

async function store(req, res) {
  try {
    const bre = await prisma.PersonalLoanBres.create({
      data: {
        ...req.body,
        age: +req.body.age,
        maxLoanAmount: +req.body.maxLoanAmount,
        income: req.body.income.length > 0 ? parseFloat(req.body.income) : 0.0,
        productId: +req.body.productId,
        maxAge: +req.body.maxAge,
        otherIncome: +req.body.otherIncome,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Personal loan bre created successfully!',
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
    await prisma.PersonalLoanBres.update({
      where: {
        id: +req.params.id,
      },
      data: {
        status: Boolean(+req.params.status),
      },
    });
    return res.redirect('/admin/setup/personal-loan-bre');
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
    const bre = await prisma.PersonalLoanBres.update({
      where: {
        id: +req.params.id,
      },
      data: {
        ...req.body,
        age: +req.body.age,
        maxAge: +req.body.maxAge,
        maxLoanAmount: +req.body.maxLoanAmount,
        income: req.body.income.length > 0 ? parseFloat(req.body.income) : 0.0,
        productId: +req.body.productId,
        otherIncome: +req.body.otherIncome,
      },
    });

    return res.status(200).json({ message: 'Personal loan bre updated successfully!', data: bre });
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
    await prisma.PersonalLoanBres.delete({
      where: {
        id: +req.params.id,
      },
    });

    return res.status(200).json({ message: 'Personal loan bre deleted successfully!', data: {} });
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
    ValidateImport(sheetData, PersonalLoanCitiesImportRequest);
    const updatedSheetData = sheetData.map((val) => {
      val.breId = +req.params.id;
      return val;
    });
    await PersonalLoanBreCitiesImport(updatedSheetData);
    return res.status(200).json({
      status: 'success',
      message: 'Personal loan bre cities mapped successfully!',
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
      data: await prisma.PersonalLoanBreCities.findMany({
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
};
