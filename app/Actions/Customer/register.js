const prisma = require("../../../prisma/prisma");
const { master } = require("../../Helpers/Functions");
const { logger } = require("../../Middleware/ErrorLogger");
const { SaveGstDetails, VerifyGstDetailsRegister } = require('../verifyGstDetails');

async function Register(req, res) {
    try {
        const exist = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: req.body.email },
                    { phone: req.body.phone }
                ]
            },
            select: {
                id: true,
                name: true
            }
        });

        if (exist) {
            return res.status(409).json({ 
                message: "A user with this email or phone number is already registered.",
                data: {},
            });
        }

        if (!req.files?.aadharCardDocument || !req.files?.pancardDocument) {
            return res.status(400).json({
                status: "error",
                message: "PAN and Aadhaar documents are required.",
                data: {},
            });
        }

        if (req.body.userType === "Individual/Sole Proprietary" || req.body.userType === "Partnership/LLP") {
            if (!req.body.gstNumber) {
                return res.status(400).json({
                    status: "error",
                    message: "GST Number is required for this user type.",
                    data: {},
                });
            }

            try {
                 await VerifyGstDetailsRegister(req.body.gstNumber);
            } catch (error) {
                return res.status(400).json({
                    status: "error",
                    message: "Invalid GST Number.",
                    data: error.message,
                });
            }
        }

        // Create user with the provided data
        const user = await prisma.user.create({
            data: {
                ...req.body,
                status: 'Pending',
                profile: req.files?.profile?.[0]?.filename || null,
                aadharCardDocument: req.files?.aadharCardDocument?.[0]?.filename || null,
                pancardDocument: req.files?.pancardDocument?.[0]?.filename || null,
            },
            select: {
                id: true
            }
        });

        // Save GST Details if provided
        if (req.body.gstNumber) {
            await SaveGstDetails(user.id, req.body.gstNumber);
        }

        return res.status(201).json({ // Use 201 for successful creation
            message: "Thank you! Your information has been saved.",
            data: user.id,
        });
    } catch (error) {
        console.error("Error during registration:", error.message);
        logger.error(error.message);

        return res.status(500).json({ // Use 500 for internal server error
            status: "error",
            message: error.message || "An unexpected error occurred during registration.",
            data: {},
        });
    }
}


async function viewRegister(req, res) {
    try {
        const registerInstruction = await master('Register Instruction')

        return res.render('customer/register', { registerInstruction: registerInstruction.MasterValues });
    } catch (error) {
        logger.error(error.message);
    }
}

module.exports = {
    Register,
    viewRegister
};
