const prisma = require('../../../prisma/prisma');
const { logger } = require('../../Middleware/ErrorLogger');

async function PaymentRecon(req, res) {
  try {
    const leads = await prisma.lead.findMany({
      where: {
        userId: +req.cookies.userId,
        status: 'Disbursed',
        invoiced: false
      },
    });

    // Map additional fields based on payoutAmount
    const leadsWithCalculations = leads.map(lead => {
      const payoutAmount = lead.payoutAmount;
      const tds = parseFloat((payoutAmount * 0.05).toFixed(2)); // 5% of payoutAmount
      const gst = parseFloat((payoutAmount * 0.18).toFixed(2)); // 18% of payoutAmount
      const netPayout = parseFloat((payoutAmount + gst - tds).toFixed(2));

      return {
        ...lead,
        tds,
        gst,
        netPayout
      };
    });

    return res.render('customer/profile/reconlist', { leads: leadsWithCalculations });
  } catch (error) {
    logger.error(error.message);
    return res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  PaymentRecon,
};
