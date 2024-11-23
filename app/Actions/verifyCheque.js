const { default: axios } = require('axios');
const { GST_URLS } = require('../Config/ApiUrls');
const { logger } = require('../Middleware/ErrorLogger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
var fs = require('fs');
const FormData = require('form-data');


const verifyChequeImage = async (file) => {
    try {
        const username = process.env.GST_USERNAME;
        const password = process.env.GST_PASSWORD;
        const authString = Buffer.from(`${username}:${password}`).toString('base64');

        // Prepare FormData for file upload
        const formData = new FormData();
        formData.append('type', 'chq');
        formData.append('file_1', fs.createReadStream(file.path))
        formData.append('qc', 'true');
        formData.append('rotate', 'true');
        formData.append('side', 'front');
        formData.append('issuing_country', 'ind');

        // Make the API request
        const response = await axios.post(GST_URLS.MAIN_URL + GST_URLS.CHEQUE_VERIFY, formData, {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Accept': 'application/json',
                ...formData.getHeaders(),
            },
        });

        return response.data;
    } catch (error) {
        logger.error('Error verifying Cheque:', error.message);
        throw new Error(error.message);
    }
};


module.exports.VerifyCheque = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ status: 'error', message: 'Cheque image is required' });
        }

        const accountData = await verifyChequeImage(file);

        // Step 2: Save cheque details to the database (optional)
        // await saveChequeDetails(+req.cookies.userId, accountData.data);

        return res.status(200).json({
            status: 'success',
            message: 'Cheque verification successful',
            data: accountData,
        });
    } catch (error) {
        logger.error('Error in VerifyCheque:', error.message);
        console.log(error.message)
        return res.status(422).json({
            status: 'error',
            message: error.message || 'Cheque verification failed',
            data: {},
        });
    }
};
