const prisma = require("../../prisma/prisma");

module.exports.OtherBanksImport = async (sheetData) => {
  sheetData = sheetData.map((data) => ({
    ...data,
    foir: +data.foir,
    maxLoanAmount: +data.maxLoanAmount,
  }));

  return await prisma.OtherBankMasters.createMany({
    data: sheetData,
  });
};
