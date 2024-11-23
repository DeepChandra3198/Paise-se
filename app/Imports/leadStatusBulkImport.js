const prisma = require('../../prisma/prisma');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

module.exports.LeadStatusBulkImport = async (req, res) => {

    const fileContent = fs.readFileSync(req.files.leadSheet[0].path);

    const workbook = XLSX.read(fileContent, { type: 'buffer' });

    const firstSheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[firstSheetName];

    const sheetData = XLSX.utils.sheet_to_json(worksheet);

    // console.log(sheetData);
    let sheetDataArr = []
    let ids = []
    sheetData.map((data) => {
        sheetDataArr.push({
            id: data.ID,
            status: data.Status,
            disbursedAmount: data.disbursedAmount,
            bank: data.disbursingBank,
            payoutPercent: data.payoutPercent
        })
        ids.push(data.ID)
    })

    const existingRecords = await prisma.lead.findMany({
        where: {
            id: {
                in: ids
            },
        },
    });

    const updatedSheetData = await Promise.all(sheetDataArr.map(async (item) => {
        const existingRecord = existingRecords.find((record) => record.id === item.id);
        if (existingRecord) {
            existingRecord.status = item.status;
            if (existingRecord.disbursedAmount !== item.disbursedAmount && item.disbursedAmount) {
                existingRecord.disbursedAmount = item.disbursedAmount;
                existingRecord.disbursedAt = new Date().toISOString();

                existingRecord.payoutAmount = item.disbursedAmount * (item.payoutPercent / 100);

                // const user = await prisma.user.findFirst({
                //     where: {
                //         id: existingRecord.userId,
                //     },
                // });

                // const bankCommission = await prisma.bankLoanTypeCommission.findFirst({
                //     where: {
                //         bank: item.bank,
                //         agentCategory: user.agentCategory,
                //         loanType: existingRecord.loanType,
                //     },
                // });

                // if (bankCommission) {
                //     existingRecord.payoutAmount = item.disbursedAmount * (bankCommission.payoutPercent / 100);
                // }
            }
        }
        return existingRecord;
    }));

    const upsertData = updatedSheetData.map((item) => ({
        where: { id: item.id },
        update: {
            status: item.status,
            disbursedAmount: item.disbursedAmount,
            payoutAmount: item.payoutAmount,
            disbursedAt: item.disbursedAt
        },
    }));

    for (const data of upsertData) {
        const { where, update } = data;
        const existingLead = await prisma.lead.findUnique({ where });

        if (existingLead) {
            await prisma.lead.update({
                where,
                data: update,
            });
        }
    }

    // await prisma.lead.deleteMany({
    //     where: {
    //         id: {
    //             in: ids
    //         },
    //     },
    // });

    // await prisma.lead.createMany({
    //     data: updatedSheetData,
    // });


    return res.status(200).json({
        message: "Status Updated !",
        data: {},
    });


};
