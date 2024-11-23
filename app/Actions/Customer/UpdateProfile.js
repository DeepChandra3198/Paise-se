const prisma = require('../../../prisma/prisma');
const { logger } = require('../../Middleware/ErrorLogger');

async function UpdateProfile(req, res) {
  try {
    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          {
            phone: req.body.phone,
          },
          { email: req.body.email },
        ]
      },
    });

    console.log(exists.id, +req.cookies.userId, 'update')
    if (exists.id !== +req.cookies.userId) {
      console.log('Phone number or Email is already taken.');
    }

    // delete req.body.email;
    delete req.body.phone;

    if (req.files?.profile) {
      req.body = {
        ...req.body,
        profile: req.files.profile[0].filename
      }
    }
    if (req.files?.aadharCardDocument) {
      req.body = {
        ...req.body,
        aadharCardDocument: req.files.aadharCardDocument[0].filename
      }
    }
    if (req.files?.pancardDocument) {
      req.body = {
        ...req.body,
        pancardDocument: req.files.pancardDocument[0].filename
      }
    }
    if (req.files?.bankChequeDocument) {
      req.body = {
        ...req.body,
        bankChequeDocument: req.files.bankChequeDocument[0].filename
      }
    }

    let chanelCode = ''
    chanelCode = req.body.state.split(' ')
    if(chanelCode[1]){
      chanelCode = chanelCode[0][0] + chanelCode[1][0]
    }else{
      chanelCode = chanelCode[0][0] + chanelCode[0][2].toUpperCase()
    }

    const paddedNumber = exists.id.toString().padStart(4, '0');
    req.body.chanelCode = `PS${chanelCode}${paddedNumber}`

    req.cookies.chanelCode = req.body.chanelCode

    await prisma.user.update({
      where: {
        id: +req.cookies.userId,
      },
      data: {
        ...req.body,
        dob: new Date(req.body.dob),
      },
    });
    return res.status(200).json({ message: 'Profile has been updated!', data: {} });
  } catch (error) {
    logger.error(error.message);
    console.log(error)
    return res.status(422).json({
      status: 'error',
      message: error.message,
      data: {},
    });
  }
}

module.exports = {
  UpdateProfile,
};
