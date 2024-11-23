const { default: axios } = require('axios');
const { GRIDLINES_URLS } = require('../Config/ApiUrls');
const { logger } = require('../Middleware/ErrorLogger');

module.exports.VerifyPanDetails = async (req, res) => {
  try {
    const { panNumber, name, dob } = req.body;
    const response = await axios.post(
      GRIDLINES_URLS.MAIN_URL + GRIDLINES_URLS.PAN_VERIFY,
      {
        pan_id: panNumber,
        name: name,
        date_of_birth: new Date(dob),
        consent: 'Y',
      },
      {
        headers: {
          'X-Auth-Type': 'API-Key',
          'X-API-Key': process.env.GRIDLINES_API_KEY,
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

    return res.status(200).json({ status: 'success', message: 'success', data: response.data });
  } catch (error) {
    logger.error(error);
    res.status(422).json({ status: 'error', message: 'PAN card data is invalid', data: {} });
  }
};
