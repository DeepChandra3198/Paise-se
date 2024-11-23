require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
const helmet = require("helmet");
var path = require("path");
var cookieParser = require("cookie-parser");

const { checkUser } = require("./app/Middleware/AuthMiddleware");
const {
  AppDisableMiddleware,
} = require("./app/Middleware/AppDisableMiddleware");
const {
  TrimStringsMiddleware,
} = require("./app/Middleware/TrimStringsMiddleware");
const {
  LowerCaseEmailMiddleware,
} = require("./app/Middleware/LowerCaseEmailMiddleware");
const {
  SetCurrentUrlAndPaginationData,
} = require("./app/Middleware/SetCurrentUrlAndPaginationData");
var app = express();

const indexRouter = require("./routes/web");
const customerAuthRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customer");
const globalRoutes = require("./routes/global");
const adminAuthRoutes = require("./routes/admin/auth");
const adminSetupRoutes = require("./routes/admin/setup");
const adminProductRoutes = require("./routes/admin/product");
const adminCmsRoutes = require("./routes/admin/cms");
const adminCustomerRoutes = require("./routes/admin/customer");
const adminStaffRoutes = require("./routes/admin/staff");
const staffRoutes = require("./routes/staff");

app.use(helmet.crossOriginResourcePolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.hidePoweredBy());
app.use(helmet.frameguard());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.originAgentCluster());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(TrimStringsMiddleware);
app.use(LowerCaseEmailMiddleware);
app.use(checkUser);
app.use(SetCurrentUrlAndPaginationData);
// app.use(AppDisableMiddleware);

// app.get("/", AppDisableMiddleware);
app.use("/", [indexRouter, customerAuthRoutes, globalRoutes]);
app.use("/customer", [customerRoutes]);
app.use("/admin", [
  adminAuthRoutes,
  adminProductRoutes,
  adminCmsRoutes,
  adminCustomerRoutes,
  adminStaffRoutes
]);
app.use("/staff", [staffRoutes]);
app.use("/admin/setup", [adminSetupRoutes]);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).render("errors/404");
});



module.exports = app;
