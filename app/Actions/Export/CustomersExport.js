const ExcelJS = require('exceljs');
const prisma = require('../../../prisma/prisma');

const CustomersExport = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 20 },
      { header: 'Email', key: 'email', width: 20 },
      { header: 'Phone', key: 'phone', width: 20 },
      { header: 'Gender', key: 'gender', width: 20 },
      { header: 'DOB', key: 'dob', width: 20 },
      { header: 'Marital Status', key: 'maritalStatus', width: 20 },
      { header: 'Address', key: 'address', width: 20 },
      { header: 'Pancard', key: 'pancard', width: 20 },
      { header: 'Created At', key: 'createdAt', width: 20 },
    ];

    const startDate = req.query.startDate.length > 0 ? new Date(req.query.startDate) : undefined;
    const endDate = req.query.endDate.length > 0 ? new Date(req.query.endDate) : new Date();

    const where = {
      type: 'customer',
    };

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

    const dataArray = await prisma.user.findMany({
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
    res.setHeader('Content-Disposition', 'attachment; filename=customers.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  CustomersExport,
};
