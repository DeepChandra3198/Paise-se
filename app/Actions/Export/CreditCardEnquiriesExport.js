const ExcelJS = require('exceljs');
const prisma = require('../../../prisma/prisma');

const CreditCardEnquiriesExport = async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    worksheet.columns = [
      { header: 'Product Name', key: 'productName', width: 20 },
      { header: 'Card Name', key: 'cardName', width: 20 },
      { header: 'Card Type', key: 'cardType', width: 20 },
      { header: 'Card Fees', key: 'cardFees', width: 20 },
      { header: 'Card Link', key: 'cardLink', width: 20 },
      { header: 'Customer Name', key: 'customerName', width: 20 },
      { header: 'Customer Phone', key: 'customerPhone', width: 20 },
      { header: 'Customer Email', key: 'customerEmail', width: 20 },
      { header: 'Customer Type', key: 'customerType', width: 20 },
      { header: 'Customer Annual Income', key: 'customerAnnualIncome', width: 20 },
      { header: 'Customer Tentative Credit Limit', key: 'customerTentativeCreditLimit', width: 20 },
      { header: 'Customer Have Credit Card', key: 'customerHaveCreditCard', width: 20 },
      { header: 'State', key: 'state', width: 20 },
      { header: 'City', key: 'city', width: 20 },
      { header: 'Pincode', key: 'pincode', width: 20 },
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

    const dataArray = await prisma.UserInformation.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where,
      include: {
        User: true,
        Product: true,
        UserCardClicks: {
          include: {
            Card: true,
          },
        },
      },
    });

    for (let i = 0; i < dataArray.length; i++) {
      const row = {
        productName: dataArray[i].Product?.name,
        cardName: dataArray[i]?.UserCardClicks[0]?.Card?.name,
        cardType: dataArray[i]?.UserCardClicks[0]?.Card?.type,
        cardFees: dataArray[i]?.UserCardClicks[0]?.Card?.fees,
        cardLink: dataArray[i]?.UserCardClicks[0]?.Card?.link,
        customerName: dataArray[i].name,
        customerPhone: dataArray[i]?.User?.phone,
        customerEmail: dataArray[i].email,
        customerType: dataArray[i].employment,
        customerAnnualIncome:
          dataArray[i].annualIncome !== null
            ? Number(dataArray[i]?.annualIncome?.toFixed(0)).toLocaleString('en-US')
            : 'N/A',
        customerTentativeCreditLimit: dataArray[i].tentativeCreditLimit,
        customerHaveCreditCard: dataArray[i].creditCardHolder ? 'Yes' : 'No',
        city: dataArray[i].city,
        state: dataArray[i].state,
        pincode: dataArray[i].pincode,
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
    res.setHeader('Content-Disposition', 'attachment; filename=CreditCardEnquiries.xlsx');

    // Save the workbook directly to the response
    return workbook.xlsx.write(res);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  CreditCardEnquiriesExport,
};
