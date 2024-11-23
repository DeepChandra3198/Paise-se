const prisma = require('../../prisma/prisma');

module.exports.CompanyBanksImport = async (sheetData) => {
  sheetData = sheetData.map((data) => ({
    ...data,
    foir: +data.foir,
  }));

  return await prisma.CompanyBankMasters.createMany({
    data: sheetData,
  });
};
