const ExcelJS = require('exceljs');
const prisma = require('../../../prisma/prisma');

const WebhooksExport = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.columns = [
      { header: 'externalId', key: 'externalId', width: 20 },
      { header: 'deliveredTS', key: 'deliveredTS', width: 20 },
      { header: 'status', key: 'status', width: 20 },
      { header: 'cause', key: 'cause', width: 20 },
      { header: 'phoneNo', key: 'phoneNo', width: 20 },
      { header: 'errCode', key: 'errCode', width: 20 },
      { header: 'noOfFrags', key: 'noOfFrags', width: 20 },
      { header: 'mask', key: 'mask', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
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

    const dataArray = await prisma.paiseseWebhook.findMany({
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
    res.setHeader('Content-Disposition', 'attachment; filename=webhooks.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  WebhooksExport,
};
