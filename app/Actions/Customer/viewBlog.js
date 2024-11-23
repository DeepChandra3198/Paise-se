const prisma = require('../../../prisma/prisma');
const { logger } = require('../../Middleware/ErrorLogger');

async function viewBlog(req, res) {
  try {
    
    const page = await prisma.blogs.findFirst({
      where: {
        id: parseInt(req.params.id),
      },
    });

    return res.render('customer/viewBlog', { page });
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = {
  viewBlog,
};
