const { default: axios } = require('axios');
const { GST_URLS } = require('../Config/ApiUrls');
const { logger } = require('../Middleware/ErrorLogger');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verifyGstNumber = async (gstNo) => {
    try {
        const username = process.env.GST_USERNAME;
        const password = process.env.GST_PASSWORD;
        const authString = Buffer.from(`${username}:${password}`).toString('base64');

        const response = await axios.post(
            GST_URLS.MAIN_URL + GST_URLS.GST_VERIFY, null,
            {
                params: {
                    gst_number: gstNo
                },
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'Accept': 'application/json'
                }
            }
        );
        if (!response || !response.data.data) {
            throw new Error("Invalid GST Number."); 
        }

        return response.data.data;
    } catch (error) {
        logger.error(error);
        throw new Error(error.message || 'Invalid GST Number 234');
    }
};

const saveGstDetails = async (userId, gstDetails) => {
    try {
        await prisma.gstVerifications.create({
            data: {
                userId: userId,
                companyName: gstDetails.business_legal_name,
                gstNo: gstDetails.business_gstin_number,
                gstDetails: JSON.stringify(gstDetails)
            }
        });
    } catch (error) {
        logger.error('Error saving GST details:', error);
        throw new Error('Error saving GST details');
    }
};

module.exports.VerifyGstDetails = async (req, res) => {
    try {
        const { gstNo } = req.body;

        const gstData = await verifyGstNumber(gstNo);


        return res.status(200).json({ status: 'success', message: 'success', data: gstData.data });
    } catch (error) {
        logger.error(error);
        return res.status(422).json({ status: 'error', message: 'GST data is invalid 879', data: {} });
    }
};

module.exports.VerifyGstDetailsRegister = async (gstNumber) => {
    try {

        const gstData = await verifyGstNumber(gstNumber); 

        if (!gstData || !gstData) {
            throw new Error("Invalid GST Data");
        }

        return gstData; 
    } catch (error) {
        logger.error("Error in VerifyGstDetails:", error);
        throw new Error("GST data is invalid");
    }
};

module.exports.SaveGstDetails = async (userId, gstNumber) => {
    try {
        const gstData = await verifyGstNumber(gstNumber);

        await saveGstDetails(+userId, gstData);

        return gstData.data;
    } catch (error) {
        logger.error('Error saving GST details:', error);
        throw new Error(error.message || 'Failed to save GST details');
    }
};



