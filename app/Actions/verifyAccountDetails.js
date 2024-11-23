const { default: axios } = require('axios');
const { GST_URLS } = require('../Config/ApiUrls');
const { logger } = require('../Middleware/ErrorLogger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to verify GST number
const verifyAccountNumber = async (accountNumber, ifsc) => {
    try {
        const username = process.env.GST_USERNAME;
        const password = process.env.GST_PASSWORD;
        const authString = Buffer.from(`${username}:${password}`).toString('base64');
        
        const response = await axios.post(
            GST_URLS.MAIN_URL + GST_URLS.ACCOUNT_VERIFY, null,
            {
                params: {
                    acc_number: accountNumber,
                    ifsc: ifsc
                },
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Accept': 'application/json'
                }
            }
        );



        const responseAgain = await axios.get(
            GST_URLS.MAIN_URL + GST_URLS.ACCOUNT_STATUS,
            {
                params: {
                    type: 'bank',
                    id: response.data.data?.id
                },
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Accept': 'application/json'
                }
            }
        );


        return responseAgain.data;  // Returning the response for further use
    } catch (error) {
        logger.error('Error verifying GST number:', error);
        throw new Error('GST verification failed');
    }
};

module.exports.VerifyAccountDetails = async (req, res) => {
    try {
        const { accountNumber, ifsc } = req.body;

        // Step 1: Verify the GST number
        const accountData = await verifyAccountNumber(accountNumber, ifsc);

        // Step 2: Save GST details to the database
        // await saveGstDetails(+req.cookies.userId, gstData.data);

        // Respond with success
        return res.status(200).json({ status: 'success', message: 'success', data: accountData.data });
    } catch (error) {
        logger.error(error);
        return res.status(422).json({ status: 'error', message: error.message || 'GST data is invalid', data: {} });
    }
};