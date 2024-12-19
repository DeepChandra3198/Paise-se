const { Prisma } = require("@prisma/client");
const prisma = require("../../../prisma/prisma");
const { logger } = require("../../Middleware/ErrorLogger");
const { master } = require("../../Helpers/Functions");
const { GST_URLS } = require("../../Config/ApiUrls");
const fs = require("fs")
const path = require("path")
const axios = require("axios")
const FormData = require('form-data');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const { format } = require('date-fns');
const cron = require('node-cron');



async function generatePDF(templatePath, data, outputPath) {
  try {
    const template = fs.readFileSync(templatePath, 'utf-8');
    const renderedHTML = ejs.render(template, data);

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(renderedHTML, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}


const esignVerify = async (user, document) => {
  try {
    const username = process.env.GST_USERNAME;
    const password = process.env.GST_PASSWORD;
    const authString = Buffer.from(`${username}:${password}`).toString('base64');

    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1);
    const formattedDate = currentDate.toISOString().split('T')[0].split('-').reverse().join('-');

    const parentPath = path.join(__dirname, '..', '..', '..', 'public', 'uploads');
    const documentPath = path.join(parentPath, document);
    if (!fs.existsSync(documentPath)) {
      throw new Error("Document file not found");
    }

    const data = new FormData();
    data.append('document', fs.createReadStream(documentPath));
    data.append('sender', JSON.stringify({ name: user.name, email: user.email }));
    data.append('signatory', JSON.stringify({ signatories: [{ name: user.name, email: user.email }] }));
    data.append('signature_config', JSON.stringify({ signature_stamp: 'ALL_PAGES' }));
    data.append('reminder_config', JSON.stringify({ reminder: 'NO_REMINDER' }));
    data.append('document_config', JSON.stringify({ expiry_date: formattedDate, send_signed_copy: 'BOTH' }));


    const response = await axios.post(
      `${GST_URLS.MAIN_URL}${GST_URLS.ESIGN_UPLOAD}`,
      data,
      {
        headers: {
          Authorization: `Basic ${authString}`,
          Accept: 'application/json',
          ...data.getHeaders(),
        },
        maxBodyLength: Infinity,
      }
    );

    const esignId = response.data.data?.id;
    if (!esignId) {
      throw new Error("E-Sign ID not found in the response");
    }

    const responseAgain = await axios.post(
      `${GST_URLS.MAIN_URL}${GST_URLS.ESIGN_STATUS}`,
      {},
      {
        params: {
          id: response.data.data?.id,
        },
        headers: {
          Authorization: `Basic ${authString}`,
          Accept: 'application/json',
        },
      }
    );

    return responseAgain.data.data;
  } catch (error) {
    logger.error('E-Sign verifying number:', error.message);
    throw new Error('E-Sign verification failed');
  }
};


const uniquePath = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000000);
  return `${timestamp}_${randomNum}`;
};


async function RegisterAgreement(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        id: +id
      }
    })
    const formattedDate = format(new Date(), 'dd-MM-yyyy');

    const templatePath = path.join(__dirname, '..', '..', '..', 'views', 'templates', 'customerAgreement.ejs')
    const data = {
      effectiveDate: formattedDate || '',
      agentName: user?.name || ''
    };
    const currentTime = uniquePath()
    const documentName = `CommissionAgentAgreement${currentTime}.pdf`
    const outputPath = path.join(__dirname, '..', '..', '..', 'public', 'uploads', documentName);

    await generatePDF(templatePath, data, outputPath);



    const eResponse = await esignVerify(user, documentName)

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        agreedToTerms: true,
        commissionAgentAgreement: documentName || "",
        eSignVerifyData: typeof eResponse === "string" ? eResponse : JSON.stringify(eResponse),
        eSignStatus: eResponse?.document_status || '',
        eSignLink: eResponse?.download_link || '',
        eSignId: eResponse?.esign_id || ''
      }
    });
    return res.status(200).json({
      message: "Registration Successful. Thank You! ",
      data: {},
    });
  } catch (error) {
    console.log("line 163", error.message)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        console.log(
          'User not found with this email'
        )
      }
      logger.error(error.meta.cause);
      return res.status(422).json({
        status: "error",
        message: 'Something Went Wrong',
        data: {},
      });
    }
    logger.error(error.message);
    return res.status(422).json({
      status: "error",
      message: error.message,
      data: {},
    });
  }
}

async function viewAgreement(req, res) {
  try {


    const registerInstruction = await master('Register Instruction')

    return res.render('customer/register-aggrement', { registerInstruction: registerInstruction.MasterValues });
  } catch (error) {
    logger.error(error.message);
  }
}



async function verifyEsignStatus(id) {
  const username = process.env.GST_USERNAME;
  const password = process.env.GST_PASSWORD;
  const authString = Buffer.from(`${username}:${password}`).toString('base64');
  const responseAgain = await axios.post(
    `${GST_URLS.MAIN_URL}${GST_URLS.ESIGN_STATUS}`,
    {},
    {
      params: {
        id: id,
      },
      headers: {
        Authorization: `Basic ${authString}`,
        Accept: 'application/json',
      },
    }
  );

  return responseAgain.data.data;
}

const checkVerificationStatus = async () => {
  try {
    const users = await prisma.user.findMany({
      where: {
        eSignStatus: 'PENDING'
      }
    })
    if (users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        const response = await verifyEsignStatus(users[i].eSignId)
        if (response && response.document_status === 'COMPLETED') {
          await prisma.user.update({
            where: {
              id: users[i].id
            },
            data: {
              eSignVerifyData: JSON.stringify(response),
              eSignStatus: response.document_status,
              eSignLink: response.download_link
            }
          })
        }
      }
    }
  } catch (error) {
    console.log("error message", error.message)
  }
}


cron.schedule('0 */10 * * * *', async () => {
  await checkVerificationStatus()
  console.log('Task is running every 10 minute!');
})


module.exports = {
  RegisterAgreement,
  viewAgreement
};