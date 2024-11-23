const ExcelJS = require('exceljs');
const prisma = require('../../../prisma/prisma');

const ContactQueriesExport = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.columns = [
      { header: 'id', key: 'id', width: 20 },
      { header: 'name', key: 'name', width: 20 },
      { header: 'email', key: 'email', width: 20 },
      { header: 'phone', key: 'phone', width: 20 },
      { header: 'subject', key: 'subject', width: 20 },
      { header: 'message', key: 'message', width: 20 },
    ];

    const startDate = req.query.startDate.length > 0 ? new Date(req.query.startDate) : undefined;
    const endDate = req.query.endDate.length > 0 ? new Date(req.query.endDate) : new Date();

    const where = {};

    if (startDate !== undefined) {
      where.createdAt = {
        gte: startDate,
      };
    }

    if (endDate !== undefined) {
      where.createdAt = {
        ...where.createdAt,
        lte: endDate,
      };
    }

    const dataArray = await prisma.contactQueries.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where,
    });

    for (let i = 0; i < dataArray.length; i++) {
      worksheet.addRow(dataArray[i]);
    }

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=contact-queries.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  ContactQueriesExport,
};
