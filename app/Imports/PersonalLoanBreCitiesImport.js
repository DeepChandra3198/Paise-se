const prisma = require('../../prisma/prisma');

module.exports.PersonalLoanBreCitiesImport = async (sheetData) => {
  await prisma.PersonalLoanBreCities.deleteMany({
    where: {
      breId: sheetData[0].breId,
    },
  });
  return await prisma.PersonalLoanBreCities.createMany({
    data: sheetData,
  });
};
