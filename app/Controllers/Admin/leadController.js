const prisma = require("../../../prisma/prisma");
const { WebPaginate } = require('../../Helpers/WebPaginate');
const archiver = require('archiver');
const { default: axios } = require("axios");
const fs = require('fs');
const path = require('path');

async function index(req, res) {

    const { type, day } = req.query
    const filteringConditions = {}

    if (type == 'personal-loan') {
        filteringConditions.loanType = 'Personal Loan'
    }
    else if (type == 'business-loan') {
        filteringConditions.loanType = 'Business Loan'
    }
    else if (type == 'prof-loan') {
        filteringConditions.loanType = 'Prof Loan'
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
    else if (type == 'family-doctor') {
        filteringConditions.loanType = 'Family Doctor'
    }
    else if (type == 'health-insurance') {
        filteringConditions.loanType = 'Health Insurance'
    }

    if (day) {
        filteringConditions.createdAt = {
            gte: new Date(new Date() - parseInt(day) * 24 * 60 * 60 * 1000)
        }
    }


    const leads = await WebPaginate(req, res, 'lead', {
        where: filteringConditions,
        orderBy: {
            id: 'desc'
        }
    });
    return res.render("admin/lead/index", {
        leads,
        type
    });
}


async function getById(req, res) {

    const { id } = req.params
    const lead = await prisma.lead.findFirst({
        where: {
            id: +id
        },
        // include: {
        //     User: true,
        // },
    });

    const bankName = await prisma.bankifsc.groupBy({
        by: ['bank'],
        orderBy: {
            bank: 'asc'
        }
    })

    console.log(lead)

    return res.render("admin/lead/view", {
        lead,
        bankName
    });
}

const downloadDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

async function downloadFile(url, outputPath) {
    const writer = fs.createWriteStream(outputPath);

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading file from ${url}:`, error.message);
        throw error;
    }
}

async function downloadDocuments(req, res) {
    const { id } = req.params;

    // Fetch the lead data from the database
    const lead = await prisma.lead.findFirst({
        where: {
            id: +id
        }
    });

    if (!lead) {
        return res.status(404).send('Lead not found');
    }

    const filenames = [
        lead.aadharCardDocument,
        lead.pancardDocument,
        lead.bankStatement,
        lead.passportPhoto,
        lead.salarySlip,
        lead.addressProof,
        lead.coApAadharCardDocument,
        lead.coApPancardDocument,
        lead.coApPassportPhoto,
        lead.registrationCertificate,
        lead.udhyamAadhar,
        lead.gstReturnTwelveMonths,
        lead.itrTwoYears,
        lead.coiTwoYears,
        lead.balanceSheetTwoYears,
        lead.profitLossAnnexure,
        lead.taxAuditReport,
        lead.currentBankOneYear,
        lead.ccBankOneYear,
        lead.odBankOneYear,
        lead.runningLoanSheet,
        lead.ownershipProof,
        lead.detailSheet,
        lead.otherDoc1,
        lead.otherDoc2,
        lead.otherDoc3,
        lead.otherDoc4
    ].filter(filename => filename); // Filter out null or undefined filenames

    const zipFilePath = path.join(downloadDir, `documents-${id}.zip`);

    // Create a file to stream archive data to
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level
    });

    // Listen for all archive data to be written
    output.on('close', () => {
        console.log(`Zip file created: ${zipFilePath}`);
        res.download(zipFilePath, `documents-${id}.zip`, err => {
            if (err) throw err;
            // Clean up the zip file after download
            fs.unlink(zipFilePath, err => {
                if (err) console.error(`Error deleting zip file: ${err.message}`);
            });
        });
    });

    // Catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', err => {
        if (err.code !== 'ENOENT') {
            throw err;
        } else {
            console.warn(err);
        }
    });

    // Catch errors
    archive.on('error', err => {
        console.error(`Archiver error: ${err.message}`);
        throw err;
    });

    // Pipe archive data to the file
    archive.pipe(output);

    for (const filename of filenames) {
        const fileUrl = `${process.env.APP_URL}/uploads/${filename}`;
        const tempFilePath = path.join(downloadDir, filename);

        try {
            console.log(`Downloading file from ${fileUrl}`);
            // Download the file from the URL and save it temporarily
            await downloadFile(fileUrl, tempFilePath);
            // Append the downloaded file to the archive
            archive.file(tempFilePath, { name: filename });
        } catch (error) {
            console.error(`Failed to download or add file: ${filename}`, error.message);
        }
    }

    // Finalize the archive
    archive.finalize();
}


async function updateStatus(req, res) {

    const { id } = req.params
    const { disbursedAmount, leadRemark, bankName, status, loanType, payoutPercent } = req.body

    let statusObj = {
        status: status,
        remark: ""
    }

    if(status==='Disbursed'){
        if(disbursedAmount==""){
            return res.status(404).json({
                message: "Disbursed Amount Required !",
                data: {},
            });
        }
    }

    if (disbursedAmount && disbursedAmount != "") {
        statusObj.disbursedAmount = +disbursedAmount
        statusObj.disbursedAt = new Date().toISOString()

        if(payoutPercent=="" || bankName==""){
            return res.status(404).json({
                message: "Disbursing Bank & Payout% Required !",
                data: {},
            });
        }

        statusObj.payoutAmount = +disbursedAmount * (payoutPercent / 100)
        statusObj.disbursingBank = bankName

        // const lead = await prisma.lead.findFirst({
        //     where: {
        //         id: +id
        //     }
        // })

        // const user = await prisma.user.findFirst({
        //     where: {
        //         id: lead.userId
        //     }
        // })

        // const bankCommission = await prisma.bankLoanTypeCommission.findFirst({
        //     where: {
        //         bank: bankName,
        //         agentCategory: user.agentCategory,
        //         loanType: loanType
        //     }
        // })

        // if (bankCommission) {
        //     statusObj.payoutAmount = +disbursedAmount * (bankCommission.payoutPercent / 100)
        // }
    }
    if (leadRemark && leadRemark != "") {
        statusObj.remark = leadRemark
    }

    const customer = await prisma.lead.update({
        where: {
            id: +id
        },
        data: statusObj
    });
    return res.status(200).json({
        message: "Status Updated !",
        data: {},
    });
}


async function destroy(req, res) {
    try {
        const faq = await prisma.lead.findUnique({
            where: {
                id: +req.params.id,
            },
        });

        await prisma.lead.delete({
            where: {
                id: +req.params.id,
            },
        });

        return res
            .status(200)
            .json({ message: "Lead deleted successfully!", data: {} });
    } catch (error) {
        return res.status(422).json({
            status: "error",
            message: error.message,
            data: {},
        });
    }
}

module.exports = {
    index,
    getById,
    updateStatus,
    destroy,
    downloadDocuments
};
