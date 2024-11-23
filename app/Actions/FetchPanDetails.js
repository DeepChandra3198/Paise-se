const { default: axios } = require('axios');
const { GRIDLINES_URLS } = require('../Config/ApiUrls');
const { logger } = require('../Middleware/ErrorLogger');
const prisma = require('../../prisma/prisma');

module.exports.FetchPanDetails = async (req, res) => {
  try {
    const { panNumber } = req.body;

    const response = await axios.post(
      GRIDLINES_URLS.MAIN_URL + GRIDLINES_URLS.PAN_FETCH,
      {
        pan_number: panNumber,
        consent: 'Y',
      },
      {
        headers: {
          'X-Auth-Type': 'API-Key',
          'X-API-Key': process.env.GRIDLINES_API_KEY,
          'Content-Type': 'application/json',
        },
      }
    );

    await prisma.panVerifications.create({
      data: {
        userId: +req.cookies.userId,
        name: response.data.data.pan_data.name,
        pancard: panNumber,
      },
    });

    await prisma.user.update({
      where: {
        id: +req.cookies.userId,
      },
      data: {
        pancard: panNumber,
      },
    });
    return res.status(200).json({
      status: 'success',
      message: 'success',
      data: { name: response.data.data.pan_data.name },
    });
  } catch (error) {
    logger.error(error);
    res.status(422).json({ status: 'error', message: 'PAN card data is invalid', data: {} });
  }
};
