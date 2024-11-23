const jwt = require('jsonwebtoken');
const prisma = require('../../prisma/prisma');

/*
this middleware checks for the authenticated user. 
If the user is authenticated, 
then it will proceed to the next and if not, 
it will redirect to the login page. 
*/

const userAuthCheck = (req, res, next) => {
  const token = req.cookies.jwt;
  const userType = req.cookies.userType;
  // check jwt existence and is verified.
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.redirect('/');
      } else {
        if (userType !== 'admin') {
          return res.redirect('/');
        }
        next();
      }
    });
  } else {
    return res.redirect('/');
  }
};

const staffAuthCheck = (req, res, next) => {
  const token = req.cookies.jwt;
  const userType = req.cookies.userType;
  // check jwt existence and is verified.
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.redirect('/');
      } else {
        if (userType !== 'staff') {
          return res.redirect('/');
        }
        next();
      }
    });
  } else {
    return res.redirect('/');
  }
};

const customerAuthCheck = (req, res, next) => {
  const token = req.cookies.jwt;
  const userType = req.cookies.userType;
  // check jwt existence and is verified.
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        return res.redirect('/');
      } else {
        if (userType !== 'customer') {
          return res.redirect('/');
        }
        next();
      }
    });
  } else {
    return res.redirect('/');
  }
};
/* 
this middleware checks if the user is logged in or not.
 If yes, then it will proceed to the next middleware
and saves the user information in the user local variable
which will be available where ever this middleware will be called.
 */
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        const user = await prisma.user.findUnique({
          include: {
            PanVerifications: true,
          },
          where: { id: Number(decodedToken.id) },
        });
        if (user) {
          res.locals.user = user;
          next();
        } else {
          res.locals.user = null;
          next();
        }
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

/* 
this middleware checks if the user is logged out, 
if yes, then it will proceed to the next middleware
else it will redirect to the home page.
*/
const guestUserOnly = (req, res, next) => {
  const token = req.cookies.jwt;
  const userType = req.cookies.userType;

  // check jwt existence and is verified.
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        next(err); // Pass the error to the error handling middleware
      } else {
        try {
          const user = await prisma.user.findUnique({
            where: { id: Number(decodedToken.id) },
          });
          if (user) {
            if (userType === 'admin') {
              return res.redirect('/admin/dashboard'); // Return the response to terminate further execution
            } else if (userType === 'staff') {
              return res.redirect('/staff/dashboard'); // Return the response to terminate further execution
            } else {
              return res.redirect('/'); // Return the response to terminate further execution
            }
          }
          next(); // Move next() inside the try block
        } catch (error) {
          next(error); // Pass any database-related errors to the error handling middleware
        }
      }
    });
  } else {
    next(); // No token, move to the next middleware
  }
};

module.exports = { userAuthCheck, staffAuthCheck, customerAuthCheck, checkUser, guestUserOnly };
