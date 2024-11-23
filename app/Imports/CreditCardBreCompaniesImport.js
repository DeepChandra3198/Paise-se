const prisma = require('../../prisma/prisma');

module.exports.CreditCardBreCompaniesImport = async (sheetData) => {
  console.log(sheetData[0].breId);
  await prisma.CreditCardBreCompanies.deleteMany({
    where: {
      breId: sheetData[0].breId,
    },
  });
  return await prisma.CreditCardBreCompanies.createMany({
    data: sheetData,
  });
};
