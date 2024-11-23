const ExcelJS = require('exceljs');
const prisma = require('../../../prisma/prisma');

const CarLoanEnquiriesExport = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.columns = [
      { header: 'Product Name', key: 'productName', width: 20 },

      { header: 'Customer Name', key: 'name', width: 20 },
      { header: 'Customer Email', key: 'email', width: 20 },
      { header: 'Customer Phone', key: 'phone', width: 20 },
      { header: 'DOB', key: 'dob', width: 20 },
      { header: 'Car Brand', key: 'carBrand', width: 20 },
      { header: 'Monthly Income', key: 'monthlyIncome', width: 20 },
      { header: 'From', key: 'city', width: 20 },
      { header: 'Pancard', key: 'pancard', width: 20 },
      { header: 'Tentative Purchase Month', key: 'tentativePurchaseMonth', width: 20 },
      { header: 'Car Model Year', key: 'carModelYear', width: 20 },
      { header: 'Employment', key: 'employment', width: 20 },
      { header: 'UTM Source', key: 'utmSource', width: 20 },
      { header: 'UTM Medium', key: 'utmMedium', width: 20 },
      { header: 'UTM Campaign', key: 'utmCampaign', width: 20 },
      { header: 'UTM Content', key: 'utmContent', width: 20 },
      { header: 'UTM Term', key: 'utmTerm', width: 20 },
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

    const dataArray = await prisma.carLoanEnquiries.findMany({
      orderBy: [
        {
          id: 'desc',
        },
      ],
      include: { Product: true },
      where,
    });

    for (let i = 0; i < dataArray.length; i++) {
      const row = {
        productName: dataArray[i].Product?.name,

        name: dataArray[i].name,
        email: dataArray[i].email,
        phone: dataArray[i].phone,
        dob: new Date(dataArray[i].dob).toISOString().slice(0, 10),
        carBrand: dataArray[i].carBrand,
        monthlyIncome: dataArray[i].monthlyIncome,
        city: dataArray[i].city,
        bankAccount: dataArray[i].bankAccount,
        pancard: dataArray[i].pancard,
        tentativePurchaseMonth: dataArray[i].tentativePurchaseMonth,
        carModelYear: dataArray[i].carModelYear,
        employment: dataArray[i].employment,
        utmSource: dataArray[i].utms?.utmSource,
        utmMedium: dataArray[i].utms?.utmMedium,
        utmCampaign: dataArray[i].utms?.utmCampaign,
        utmContent: dataArray[i].utms?.utmContent,
        utmTerm: dataArray[i].utms?.utmTerm,
        createdAt: new Date(dataArray[i].createdAt).toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
        }),
      };
      worksheet.addRow(row);
    }

    worksheet.columns.forEach((column) => {
      column.width = worksheet.getColumn(column.key).values.reduce((maxWidth, value) => {
        const valueLength = (value || '').toString().length;
        return valueLength > maxWidth ? valueLength : maxWidth;
      }, column.header.length);
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', 'attachment; filename=CarLoanEnquiries.xlsx');

    // Save the workbook directly to the response
    return workbook.xlsx.write(res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  CarLoanEnquiriesExport,
};