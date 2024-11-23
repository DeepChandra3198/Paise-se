const express = require("express");
var router = express.Router();

const {
  login,
  loginPost,
  logout,
  dashboard,
} = require("../../app/Controllers/Admin/AuthController");
const {
  guestUserOnly,
  userAuthCheck,
} = require("../../app/Middleware/AuthMiddleware");

router.route("/login").get(guestUserOnly, login).post(guestUserOnly, loginPost);

router.get("/dashboard", userAuthCheck, dashboard);

router.get("/logout", userAuthCheck, logout);

module.exports = router;
