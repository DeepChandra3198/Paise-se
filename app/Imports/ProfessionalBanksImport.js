const prisma = require("../../prisma/prisma");

module.exports.ProfessionalBanksImport = async (sheetData) => {
  sheetData = sheetData.map((data) => ({
    ...data,
    foir: +data.foir,
  }));

  return await prisma.ProfessionalBankMasters.createMany({
    data: sheetData,
  });
};
