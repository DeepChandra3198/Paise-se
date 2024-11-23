const ExcelJS = require('exceljs');
const prisma = require('../../../prisma/prisma');

const LeadExport = async (req, res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sheet 1');


        const { type } = req.params
        const filteringConditions = {}

        if (type == 'personal-loan') {
            filteringConditions.loanType = 'Personal Loan'
        }
        else if (type == 'business-loan') {
            filteringConditions.loanType = 'Business Loan'
        }
        else if (type == 'credit-card') {
            filteringConditions.loanType = 'Credit Card'
        }
        else if (type == 'home-loan') {
            filteringConditions.loanType = 'Home Loan'
        }
        else if (type == 'vehicle-loan') {
            filteringConditions.loanType = 'Vehicle Loan'
        }
        else if (type == 'lap-loan') {
            filteringConditions.loanType = 'Loan Against Property'
        }

        if(req.cookies.userType === 'staff'){
            filteringConditions.loanType = req.cookies.staffType
        }


        worksheet.columns = [
            { header: 'ID', key: 'id', width: 20 },
            { header: 'Loan Type', key: 'loanType', width: 20 },
            { header: 'Product Selection', key: 'productSelection', width: 20 },
            { header: 'Status', key: 'status', width: 20 },
            { header: 'Chanel Code', key: 'chanelCode', width: 20 },
            { header: 'disbursedAmount', key: 'disbursedAmount', width: 20 },
            { header: 'disbursedAt', key: 'disbursedAt', width: 20 },
            { header: 'payoutPercent', key: 'payoutPercent', width: 20 },
            { header: 'disbursingBank', key: 'disbursingBank', width: 20 },
            { header: 'Customer Name', key: 'customerName', width: 20 },
            { header: 'Phone', key: 'phone', width: 20 },
            { header: 'Area Code', key: 'locationPin', width: 20 },
            { header: 'Address', key: 'address', width: 20 },
            { header: 'Net Salary', key: 'netSalary', width: 20 },
            { header: 'Company Name', key: 'companyName', width: 20 },
            { header: 'Preferred Lender', key: 'preferedLender', width: 20 },
            { header: 'Required Loan', key: 'loanRequired', width: 20 },
            { header: 'Employment Type', key: 'employmentType', width: 20 },
            { header: 'Company Turnover', key: 'turnOver', width: 20 },
            { header: 'Vehicle Required', key: 'vehicleType', width: 20 },
            { header: 'Prefered Vehicle Brand', key: 'vehicleBrand', width: 20 },
            { header: 'Entity Type', key: 'entityType', width: 20 },
            { header: 'Gross Receipt', key: 'grossReceipt', width: 20 },
            { header: 'Profession', key: 'profession', width: 20 },
            { header: `Customer's Primary Bank`, key: 'primaryBank', width: 20 },
            { header: 'Prefered Credit Card', key: 'cardNameRequired', width: 20 },
            { header: 'aadharCardDocument', key: 'aadharCardDocument', width: 20 },
            { header: 'pancardDocument', key: 'pancardDocument', width: 20 },
            { header: 'bankStatement', key: 'bankStatement', width: 20 },
            { header: 'passportPhoto', key: 'passportPhoto', width: 20 },
            { header: 'salarySlip', key: 'salarySlip', width: 20 },
            { header: 'addressProof', key: 'addressProof', width: 20 },
            { header: 'coApAadharCardDocument', key: 'coApAadharCardDocument', width: 20 },
            { header: 'coApPancardDocument', key: 'coApPancardDocument', width: 20 },
            { header: 'coApPassportPhoto', key: 'coApPassportPhoto', width: 20 },
            { header: 'registrationCertificate', key: 'registrationCertificate', width: 20 },
            { header: 'udhyamAadhar', key: 'udhyamAadhar', width: 20 },
            { header: 'gstReturnTwelveMonths', key: 'gstReturnTwelveMonths', width: 20 },
            { header: 'itrTwoYears', key: 'itrTwoYears', width: 20 },
            { header: 'coiTwoYears', key: 'coiTwoYears', width: 20 },
            { header: 'balanceSheetTwoYears', key: 'balanceSheetTwoYears', width: 20 },
            { header: 'profitLossAnnexure', key: 'profitLossAnnexure', width: 20 },
            { header: 'taxAuditReport', key: 'taxAuditReport', width: 20 },
            { header: 'currentBankOneYear', key: 'currentBankOneYear', width: 20 },
            { header: 'ccBankOneYear', key: 'ccBankOneYear', width: 20 },
            { header: 'odBankOneYear', key: 'odBankOneYear', width: 20 },
            { header: 'runningLoanSheet', key: 'runningLoanSheet', width: 20 },
            { header: 'ownershipProof', key: 'ownershipProof', width: 20 },
            { header: 'detailSheet', key: 'detailSheet', width: 20 },
            { header: 'Created At', key: 'createdAt', width: 20 },
        ];

        const startDate = req.query.startDate.length > 0 ? new Date(req.query.startDate) : undefined;
        const endDate = req.query.endDate.length > 0 ? new Date(req.query.endDate) : new Date();

        if (startDate !== undefined) {
            filteringConditions.createdAt = {
                gte: startDate,
            };
        }

        if (endDate !== undefined) {
            filteringConditions.createdAt = {
                ...filteringConditions.createdAt,
                lte: endDate,
            };
        }

        const dataArray = await prisma.lead.findMany({
            where: filteringConditions,
            orderBy: {
                createdAt: 'desc',
            }
        });

        console.log(dataArray, process.env.APP_URL)

        for (let i = 0; i < dataArray.length; i++) {
            worksheet.addRow({
                ...dataArray[i],
                aadharCardDocument: dataArray[i].aadharCardDocument ? process.env.APP_URL + '/uploads/' + dataArray[i].aadharCardDocument : '',
                pancardDocument: dataArray[i].pancardDocument ? process.env.APP_URL + '/uploads/' + dataArray[i].pancardDocument : "",
                bankStatement: dataArray[i].bankStatement ? process.env.APP_URL + '/uploads/' + dataArray[i].bankStatement : "",
                passportPhoto: dataArray[i].passportPhoto ? process.env.APP_URL + '/uploads/' + dataArray[i].passportPhoto : "",
                salarySlip: dataArray[i].salarySlip ? process.env.APP_URL + '/uploads/' + dataArray[i].salarySlip : "",
                addressProof: dataArray[i].addressProof ? process.env.APP_URL + '/uploads/' + dataArray[i].addressProof : "",
                coApAadharCardDocument: dataArray[i].coApAadharCardDocument ? process.env.APP_URL + '/uploads/' + dataArray[i].coApAadharCardDocument : "",
                coApPancardDocument: dataArray[i].coApPancardDocument ? process.env.APP_URL + '/uploads/' + dataArray[i].coApPancardDocument : "",
                coApPassportPhoto: dataArray[i].coApPassportPhoto ? process.env.APP_URL + '/uploads/' + dataArray[i].coApPassportPhoto : "",
                registrationCertificate: dataArray[i].registrationCertificate ? process.env.APP_URL + '/uploads/' + dataArray[i].registrationCertificate : "",
                udhyamAadhar: dataArray[i].udhyamAadhar ? process.env.APP_URL + '/uploads/' + dataArray[i].udhyamAadhar : "",
                gstReturnTwelveMonths: dataArray[i].gstReturnTwelveMonths ? process.env.APP_URL + '/uploads/' + dataArray[i].gstReturnTwelveMonths : "",
                itrTwoYears: dataArray[i].itrTwoYears ? process.env.APP_URL + '/uploads/' + dataArray[i].itrTwoYears : "",
                coiTwoYears: dataArray[i].coiTwoYears ? process.env.APP_URL + '/uploads/' + dataArray[i].coiTwoYears : "",
                balanceSheetTwoYears: dataArray[i].balanceSheetTwoYears ? process.env.APP_URL + '/uploads/' + dataArray[i].balanceSheetTwoYears : "",
                profitLossAnnexure: dataArray[i].profitLossAnnexure ? process.env.APP_URL + '/uploads/' + dataArray[i].profitLossAnnexure : "",
                taxAuditReport: dataArray[i].taxAuditReport ? process.env.APP_URL + '/uploads/' + dataArray[i].taxAuditReport : "",
                currentBankOneYear: dataArray[i].currentBankOneYear ? process.env.APP_URL + '/uploads/' + dataArray[i].currentBankOneYear : "",
                ccBankOneYear: dataArray[i].ccBankOneYear ? process.env.APP_URL + '/uploads/' + dataArray[i].ccBankOneYear : "",
                odBankOneYear: dataArray[i].odBankOneYear ? process.env.APP_URL + '/uploads/' + dataArray[i].odBankOneYear : "",
                runningLoanSheet: dataArray[i].runningLoanSheet ? process.env.APP_URL + '/uploads/' + dataArray[i].runningLoanSheet : "",
                ownershipProof: dataArray[i].ownershipProof ? process.env.APP_URL + '/uploads/' + dataArray[i].ownershipProof : "",
                ownershipProof: dataArray[i].ownershipProof ? process.env.APP_URL + '/uploads/' + dataArray[i].ownershipProof : ""
            });
        }

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', 'attachment; filename=leads.xlsx');

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    LeadExport,
};
