const prisma = require("../../../prisma/prisma");
const { logger } = require("../../Middleware/ErrorLogger");
const { WebPaginate } = require('../../Helpers/WebPaginate');

async function Invoice(req, res) {

    const teamMember = await WebPaginate(req, res, 'invoice', {
        orderBy: [
            {
                id: 'desc',
            },
        ]
    });

    const invoicingUser = await prisma.user.findFirst({
        where:{
            id: teamMember?.[0]?.userId ? teamMember?.[0]?.userId : ''
        },
        select:{
            name: true
        }
    })

    return res.render('admin/cms/invoices', {
        teamMember,
        invoicingUser
    });
}


async function destroyInvoice(req, res) {
    try {
        const teamMember = await prisma.invoice.findUnique({
            where: {
                id: +req.params.id,
            },
        });

        await prisma.invoice.delete({
            where: {
                id: +req.params.id,
            },
        });

        return res.status(200).json({ message: 'Invoice deleted successfully!', data: {} });
    } catch (error) {
        return res.status(422).json({
            status: 'error',
            message: error.message,
            data: {},
        });
    }
}

module.exports = {
    Invoice,
    destroyInvoice
};
