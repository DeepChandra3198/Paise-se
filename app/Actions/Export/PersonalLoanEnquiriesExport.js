const ExcelJS = require('exceljs');
const prisma = require('../../../prisma/prisma');

const PersonalLoanEnquiriesExport = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.columns = [
      { header: 'Product Name', key: 'productName', width: 20 },

      { header: 'Customer Name', key: 'name', width: 20 },
      { header: 'Customer Email', key: 'email', width: 20 },
      { header: 'Customer Phone', key: 'phone', width: 20 },
      { header: 'Pincode', key: 'pincode', width: 20 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'State', key: 'state', width: 20 },
      { header: 'DOB', key: 'dob', width: 20 },
      { header: 'Pancard', key: 'pancard', width: 20 },
      { header: 'Current Salary', key: 'salary', width: 20 },
      { header: 'ITR', key: 'itr', width: 20 },
      { header: 'Needed Loan Amount', key: 'loanAmount', width: 20 },
      { header: 'Current Ongoing EMI Amount', key: 'emiAmount', width: 20 },
      { header: 'Company', key: 'companyName', width: 20 },
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

    const dataArray = await prisma.PersonalLoanEnquiries.findMany({
      orderBy: [
        {
          id: 'desc',
        },
      ],
      include: { Product: true, User: true },
      where,
    });

    for (let i = 0; i < dataArray.length; i++) {
      const row = {
        productName: dataArray[i].Product?.name,

        name: dataArray[i].name,
        email: dataArray[i].email,
        phone: dataArray[i].User.phone,
        pincode: dataArray[i].pincode,
        city: dataArray[i].city,
        state: dataArray[i].state,
        dob: new Date(dataArray[i].dob).toISOString().slice(0, 10),
        pancard: dataArray[i].pancard,
        salary: dataArray[i].salary,
        itr: dataArray[i].itr,
        loanAmount: dataArray[i].loanAmount,
        emiAmount: dataArray[i].emiAmount,
        companyName: dataArray[i].companyName,
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
    res.setHeader('Content-Disposition', 'attachment; filename=PersonalLoanEnquiries.xlsx');

    // Save the workbook directly to the response
    return workbook.xlsx.write(res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  PersonalLoanEnquiriesExport,
};
