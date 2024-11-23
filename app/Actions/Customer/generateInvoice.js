const prisma = require('../../../prisma/prisma');
const { logger } = require('../../Middleware/ErrorLogger');
const { ToWords } = require('to-words')
const toWords = new ToWords()

async function generateInvoice(req, res) {
    try {
        const { normal, advance } = req.params
        const normalArr = normal.split(',').map(Number).filter(id => !isNaN(id))
        const advanceArr = advance?.split(',')?.map(Number).filter(id => !isNaN(id))

        console.log(req.cookies.userId)
        console.log(req.params, normalArr, advanceArr)

        const leadArr = await prisma.lead.findMany({
            where: {
                userId: +req.cookies.userId,
                invoiced: false,
                id: {
                    in: normalArr
                }
            }
        })

        if (advanceArr) {
            const advanceLeadArr = await prisma.lead.findMany({
                where: {
                    userId: +req.cookies.userId,
                    invoiced: false,
                    id: {
                        in: advanceArr
                    }
                }
            })

            if (advanceLeadArr?.length !== advanceArr?.length) {
                return res.render('errors/404');
            }
        }

        if (leadArr.length !== normalArr.length) {
            return res.render('errors/404');
        }

        const sumPayoutAmount = await prisma.lead.aggregate({
            _sum: {
                payoutAmount: true,
            },
            where: {
                userId: +req.cookies.userId,
                invoiced: false,
                id: {
                    in: normalArr,
                },
            },
        });

        const advanceSumPayoutAmount = await prisma.lead.aggregate({
            _sum: {
                payoutAmount: true,
            },
            where: {
                userId: +req.cookies.userId,
                invoiced: false,
                id: {
                    in: advanceArr,
                },
            },
        });

        const totalPayoutAmount = sumPayoutAmount._sum.payoutAmount;
        const advanceTotalPayoutAmount = advanceSumPayoutAmount._sum.payoutAmount;

        const normalTds = await prisma.tds.findFirst({
            where: {
                role: 'normal'
            }
        })

        const advanceTds = await prisma.tds.findFirst({
            where: {
                role: 'advance'
            }
        })

        const finalPayoutAmount = totalPayoutAmount + advanceTotalPayoutAmount
        const tdsAmount = (totalPayoutAmount * (normalTds.percent / 100)) + (advanceTotalPayoutAmount * (advanceTds.percent / 100))


        await prisma.lead.updateMany({
            where: {
                userId: +req.cookies.userId,
                invoiced: false,
                id: {
                    in: normalArr
                }
            },
            data: {
                invoiced: true
            }
        });

        if (advanceArr) {
            await prisma.lead.updateMany({
                where: {
                    userId: +req.cookies.userId,
                    invoiced: false,
                    id: {
                        in: advanceArr
                    }
                },
                data: {
                    invoiced: true
                }
            });
        }

        const invoice = await prisma.invoice.create({
            data: {
                userId: +req.cookies.userId,
                payoutAmount: parseFloat(finalPayoutAmount.toFixed(2)),
                tds: parseFloat(tdsAmount.toFixed(2)),
                gst: parseFloat((finalPayoutAmount * 0.18).toFixed(2)),
                totalAmount: parseFloat(((finalPayoutAmount * 1.18) - tdsAmount).toFixed(2)),
                normal: normalArr.join(','),
                advance: advanceArr ? advanceArr.join(',') : null
            }
        })

        console.log(toWords.convert(parseFloat(((finalPayoutAmount * 1.18) - tdsAmount).toFixed(2)), { currency: true }))


        return res.render('customer/profile/Tax-Invoice', {
            invoiceId: `XF${invoice.id.toString().padStart(6, '0')}`,
            payoutAmount: parseFloat(finalPayoutAmount.toFixed(2)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            tdsAmount: parseFloat(tdsAmount.toFixed(2)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            gstAmount: parseFloat((finalPayoutAmount * 0.18).toFixed(2)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            totalPayableAmount: parseFloat(((finalPayoutAmount * 1.18) - tdsAmount).toFixed(2)).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            amountInWords: toWords.convert(parseFloat(((finalPayoutAmount * 1.18) - tdsAmount).toFixed(2)), { currency: true })
        });
    } catch (error) {
        logger.error(error.message);
        console.log(error)
    }
}

module.exports = {
    generateInvoice,
};
