const prisma = require("../../../prisma/prisma");
const { WebPaginate } = require("../../Helpers/WebPaginate");
const { master } = require("../../Helpers/Functions")

async function index(req, res) {

    const faqs = await WebPaginate(req, res, "BankLoanTypeCommission", {
        orderBy: [
            {
                id: "desc",
            },
        ],
    });


    const bankName = await prisma.bankifsc.groupBy({
        by: ['bank'],
        orderBy: {
            bank: 'asc'
        }
    })
    const loanType = await master('Loan Type')
    const agentCategory = await master('Agent Category')

    return res.render("admin/cms/bankCommission", {
        faqs,
        bankName,
        loanType: loanType.MasterValues,
        agentCategory: agentCategory.MasterValues
    });
}

async function store(req, res) {
    try {
        const bankLoanTypeCommission = await prisma.bankLoanTypeCommission.create({
            data: {
                ...req.body,
            },
        });

        return res.status(200).json({
            status: "success",
            message: "ank Commission created successfully!",
            data: bankLoanTypeCommission,
        });
    } catch (error) {
        return res.status(422).json({
            status: "error",
            message: error.message,
            data: {},
        });
    }
}

async function toggleStatus(req, res) {
    try {
        await prisma.bankLoanTypeCommission.update({
            where: {
                id: +req.params.id,
            },
            data: {
                status: Boolean(+req.params.status),
            },
        });
        return res.redirect("/admin/bankCommission");
    } catch (error) {
        return res.status(422).json({
            status: "error",
            message: error.message,
            data: {},
        });
    }
}

async function update(req, res) {
    try {
        const currentFaq = await prisma.bankLoanTypeCommission.findUnique({
            where: {
                id: +req.params.id,
            },
        });

        const faq = await prisma.bankLoanTypeCommission.update({
            where: {
                id: +req.params.id,
            },
            data: {
                ...req.body,
            },
        });

        return res
            .status(200)
            .json({ message: "Bank Commission updated successfully!", data: faq });
    } catch (error) {
        return res.status(422).json({
            status: "error",
            message: error.message,
            data: {},
        });
    }
}

async function destroy(req, res) {
    try {
        const faq = await prisma.bankLoanTypeCommission.findUnique({
            where: {
                id: +req.params.id,
            },
        });

        await prisma.bankLoanTypeCommission.delete({
            where: {
                id: +req.params.id,
            },
        });

        return res
            .status(200)
            .json({ message: "Bank Commission deleted successfully!", data: {} });
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
    store,
    toggleStatus,
    update,
    destroy,
};
