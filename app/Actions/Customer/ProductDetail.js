const prisma = require('../../../prisma/prisma');
const { getAndSetUtms } = require('../../Helpers/Functions');
const { logger } = require('../../Middleware/ErrorLogger');

async function ProductDetail(req, res) {
  try {
    getAndSetUtms(req, res);
    const product = await prisma.products.findUniqueOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        Faqs: true,
      },
    });

    if (!product.status) return res.redirect('/');

    return res.render('customer/product-detail', {
      product,
    });
  } catch (error) {
    console.log(error);
    if (error.code === 'P2025') {
      return res.status(404).render('errors/404');
    }
    logger.error(error.message);
  }
}

module.exports = {
  ProductDetail,
};
