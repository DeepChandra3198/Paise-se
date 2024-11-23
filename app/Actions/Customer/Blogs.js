const prisma = require('../../../prisma/prisma');
const { logger } = require('../../Middleware/ErrorLogger');

async function Blogs(req, res) {
  try {
    
    const blogs = await prisma.blogs.findMany({
      where: {
        status: true,
      },
    });

    return res.render('customer/blogs', { blogs });
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = {
  Blogs,
};
