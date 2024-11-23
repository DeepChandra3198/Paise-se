const prisma = require('../../prisma/prisma');

module.exports.CreditCardBreCitiesImport = async (sheetData) => {
  console.log(sheetData[0].breId);
  await prisma.CreditCardBreCities.deleteMany({
    where: {
      breId: sheetData[0].breId,
    },
  });
  return await prisma.CreditCardBreCities.createMany({
    data: sheetData,
  });
};
