const jwt = require('jsonwebtoken');
const prisma = require('../../../prisma/prisma');
const bcrypt = require('bcryptjs');
const { maxTokenAge } = require('../../Helpers/Functions');

const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxTokenAge,
  });
};

module.exports.login = (req, res) => {
  return res.render('admin/auth/login');
};

module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user || user.type !== 'admin') {
      throw new Error('Invalid credentials, please try again.');
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid credentials, please try again.');
    }

    const token = createToken(user.id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxTokenAge * 1000 });
    res.cookie('userId', user.id, { httpOnly: true, maxAge: maxTokenAge * 1000 });
    res.cookie('userType', 'admin', { httpOnly: true, maxAge: maxTokenAge * 1000 });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'You have been successfully logged in.',
      data: user,
    });
  } catch (error) {
    res.status(422).json({ status: 'error', message: error.message, data: {} });
  }
};

module.exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.cookie('userId', '', { maxAge: 1 });
  res.cookie('userType', '', { maxAge: 1 });
  res.redirect('/admin/login');
};


module.exports.dashboard = async (req, res) => {

  
  const customers = await prisma.user.count({
    where: {
      type: 'customer'
    }
  });

  const staffs = await prisma.user.count({
    where: {
      type: 'staff'
    }
  });

  const leads = await prisma.lead.count({});

  const leadsLastDay = await prisma.lead.count({
    where: {
      createdAt: {
        gte: new Date(new Date() - 1 * 24 * 60 * 60 * 1000)
      }
    }
  });

  console.log(staffs ,customers ,leads , leadsLastDay)

  return res.render("admin/dashboard" , {
    leads,
    leadsLastDay,
    customers,
    staffs
  });
}
