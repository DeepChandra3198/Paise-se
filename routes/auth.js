var express = require("express");
var router = express.Router();
const {
  getLoginPage,
  sendOTP,
  sendRegisterOTP,
  validateOTP,
  validateRegisterOTP,
  logout,
  resetPassword,
} = require("../app/Controllers/Customer/Auth/AuthController");
const {
  guestUserOnly,
  customerAuthCheck,
} = require("../app/Middleware/AuthMiddleware");
const {
  ValidateRequestMiddleware,
} = require("../app/Middleware/ValidateRequestMiddleware");
const { LoginRequest } = require("../app/Requests/Customer/LoginRequest");
const { viewResetPassword } = require("../app/Actions/Customer/setPassword");

router.get("/login", guestUserOnly, getLoginPage);
router.post(
  "/login-otp",
  guestUserOnly,
  ValidateRequestMiddleware(LoginRequest),
  sendOTP
);
router.post(
  "/register-otp",
  guestUserOnly,
  ValidateRequestMiddleware(LoginRequest),
  sendRegisterOTP
);
router.post("/register-otp-validate/:id/:otp", guestUserOnly, validateRegisterOTP);

router.post("/login-otp-validate", guestUserOnly, validateOTP);
router.get("/reset-password", guestUserOnly, viewResetPassword);
router.post("/reset-password/:id/:otp/:password/:phone", resetPassword);
router.post("/logout", customerAuthCheck, logout);

module.exports = router;
