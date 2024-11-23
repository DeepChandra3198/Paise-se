const { default: axios } = require('axios');
const prisma = require('../../../../prisma/prisma');
const jwt = require('jsonwebtoken');
const { maxTokenAge, getAndParseUtms } = require('../../../Helpers/Functions');
let existing = true;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxTokenAge,
  });
};

async function getLoginPage(req, res) {
  return res.render('customer/auth/login');
}

async function sendOTP(req, res) {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const saveOTP = await prisma.checkOfferOtp.create({
      data: {
        phone: req.body.phone,
        otp: `${otp}`,
      },
    });

    const exists = await prisma.user.findFirst({
      where: {
        phone: req.body.phone,
      },
    });

    if (exists === null) {
      existing = false;
      return res.status(200).json({
        status: 'error',
        message: 'Not a registered user, please register',
        // data: { otp, id: saveOTP.id },
        data: {},
      });
    }

    if (process.env.APP_ENV !== 'development') {
      await axios.get(
        `https://api2.growwsaas.com/fe/api/v1/send?username=paisese.api&password=eb0UDjPp&unicode=false&from=PaiseS&to=${req.body.phone}&text=Dear%20Customer%2C%20${otp}%20is%20your%20login%20code.%20Please%20do%20not%20share%20this%20with%20anyone.%20%7B%23var%23%7D%20Team%20PaiseSe.com%3A%20Bharat%27s%20Financial%20Marketplace`
      );
    }

    return res.status(200).json({
      status: 'success',
      message: 'OTP has been sent to the Phone Number',
      // data: { otp, id: saveOTP.id },
      data: { id: saveOTP.id },
    });
  } catch (error) {
    return res.status(422).json({ status: 'error', message: error.message, data: {} });
  }
}

async function sendRegisterOTP(req, res) {
  try {
    const otp = Math.floor(1000 + Math.random() * 9000);
    const saveOTP = await prisma.checkOfferOtp.create({
      data: {
        phone: req.body.phone,
        otp: `${otp}`,
      },
    });

    const exists = await prisma.user.findFirst({
      where: {
        phone: req.body.phone,
      },
    });

    if (exists) {
      existing = true;
      return res.status(200).json({
        status: 'error',
        message: 'Number already registered',
        // data: { otp, id: saveOTP.id },
        data: {},
      });
    }

    if (process.env.APP_ENV !== 'development') {
      const respose = await axios.get(
        `https://api2.growwsaas.com/fe/api/v1/send?username=paisese.api&password=eb0UDjPp&unicode=false&from=PaiseS&to=${req.body.phone}&text=Dear%20Customer%2C%20${otp}%20is%20your%20login%20code.%20Please%20do%20not%20share%20this%20with%20anyone.%20%7B%23var%23%7D%20Team%20PaiseSe.com%3A%20Bharat%27s%20Financial%20Marketplace`
      );

      console.log('ehere')
      console.log(respose.data)
    }

    return res.status(200).json({
      status: 'success',
      message: 'Login Code has been sent to the Phone Number',
      // data: { otp, id: saveOTP.id },
      data: { id: saveOTP.id },
    });
  } catch (error) {
    return res.status(422).json({ status: 'error', message: error.message, data: {} });
  }
}

async function validateOTP(req, res) {
  try {
    const { phone, password } = req.body;

    // console.log(req.params);
    // const OTPid = +req.params.id;
    // const userOTP = req.params.otp;

    // const savedOTP = await prisma.checkOfferOtp.findUnique({
    //   where: {
    //     id: OTPid,
    //   },
    // });

    // if (savedOTP === null) {
    //   throw new Error('Invalid request.');
    // }

    // if (savedOTP.otp !== userOTP) {
    //   throw new Error('Wrong Login Code.');
    // }

    const user = await prisma.user.findFirst({
      where: {
        phone: phone,
      },
    });

    const passwordMatch = password === user.password;

    if (!passwordMatch) {
      throw new Error('Invalid credentials, please try again.');
    }

    const token = createToken(user.id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxTokenAge });
    res.cookie('userId', user.id, { httpOnly: true, maxAge: maxTokenAge });
    res.cookie('role', user.role, { httpOnly: true, maxAge: maxTokenAge });
    res.cookie('agentCategory', user.agentCategory, { httpOnly: true, maxAge: maxTokenAge });
    res.cookie('chanelCode', user.chanelCode, { httpOnly: true, maxAge: maxTokenAge });
    res.cookie('userType', 'customer', { httpOnly: true, maxAge: maxTokenAge });

    if (user) {
      await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          updatedAt: new Date()
        }
      })
    }

    return res.status(200).json({
      status: 'success',
      message: 'Login Success!',
      data: {},
    });
  } catch (error) {
    return res.status(422).json({ status: 'error', message: error.message, data: {} });
  }
}

async function validateRegisterOTP(req, res) {
  try {
    const OTPid = +req.params.id;
    const userOTP = req.params.otp;

    const savedOTP = await prisma.checkOfferOtp.findUnique({
      where: {
        id: OTPid,
      },
    });

    if (savedOTP === null) {
      throw new Error('Invalid request.');
    }

    if (savedOTP.otp !== userOTP) {
      throw new Error('Wrong Login Code.');
    }

    // const user = await prisma.user.create({
    //   data: {
    //     phone: savedOTP.phone,
    //   },
    // });

    await prisma.checkOfferOtp.delete({
      where: {
        id: OTPid,
      },
    });

    // const token = createToken(user.id);
    // res.cookie('jwt', token, { httpOnly: true, maxAge: maxTokenAge });
    // res.cookie('userId', user.id, { httpOnly: true, maxAge: maxTokenAge });
    // res.cookie('userType', 'customer', { httpOnly: true, maxAge: maxTokenAge });

    return res.status(200).json({
      status: 'success',
      message: 'Login Code has been matched!',
      data: {},
    });
  } catch (error) {
    return res.status(422).json({ status: 'error', message: error.message, data: {} });
  }
}

async function logout(req, res) {
  res.cookie('jwt', '', { maxAge: 1 });
  res.cookie('userId', '', { maxAge: 1 });
  res.cookie('userType', '', { maxAge: 1 });
  res.redirect('/login');
}

async function resetPassword(req, res) {
  try {
    const OTPid = +req.params.id;
    const userOTP = req.params.otp;
    const phone = req.params.phone;
    const password = req.params.password;

    const savedOTP = await prisma.checkOfferOtp.findUnique({
      where: {
        id: OTPid,
      },
    });

    if (savedOTP === null) {
      throw new Error('Invalid request.');
    }

    if (savedOTP.otp !== userOTP) {
      throw new Error('Wrong OTP Code.');
    }

    const user = await prisma.user.update({
      where: {
        phone: phone
      },
      data: {
        password: password,
      },
    });

    await prisma.checkOfferOtp.delete({
      where: {
        id: OTPid,
      },
    });

    // const token = createToken(user.id);
    // res.cookie('jwt', token, { httpOnly: true, maxAge: maxTokenAge });
    // res.cookie('userId', user.id, { httpOnly: true, maxAge: maxTokenAge });
    // res.cookie('userType', 'customer', { httpOnly: true, maxAge: maxTokenAge });

    return res.status(200).json({
      status: 'success',
      message: 'Password has been changed!',
      data: {},
    });
  } catch (error) {
    return res.status(422).json({ status: 'error', message: error.message, data: {} });
  }
}

module.exports = {
  getLoginPage,
  sendOTP,
  sendRegisterOTP,
  validateOTP,
  validateRegisterOTP,
  logout,
  resetPassword
};
