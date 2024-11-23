const express = require("express");
var router = express.Router();
const multer = require("multer");
const { storage } = require("../app/Helpers/MulterConfig");

const upload = multer({ storage: storage });

const {
    login,
    loginPost,
    logout,
    dashboard,
} = require("../app/Controllers/Staff/AuthController");
const {
    guestUserOnly,
    staffAuthCheck,
} = require("../app/Middleware/AuthMiddleware");

const {
    ValidateRequestMiddleware,
} = require("../app/Middleware/ValidateRequestMiddleware");
const { LeadExport } = require('../app/Actions/Export/LeadExport');
const { LeadStatusBulkImport } = require('../app/Imports/leadStatusBulkImport');
const leadController = require('../app/Controllers/Staff/leadController');
const { leadStatusRequest } = require('../app/Requests/Admin/leadStatusRequest')

router.route("/login").get(guestUserOnly, login).post(guestUserOnly, loginPost);

router.get("/dashboard", staffAuthCheck, dashboard);

router.get("/logout", staffAuthCheck, logout);

router.get('/leads', leadController.index);

router.get('/lead/:id', leadController.getById);

router.delete('/lead/delete/:id', leadController.destroy);

router.get('/lead/download-docs/:id', leadController.downloadDocuments);

router.post('/lead-status/:id', ValidateRequestMiddleware(leadStatusRequest), leadController.updateStatus);

router.get('/export-leads', LeadExport);

router.post('/update-leads', upload.fields([{ name: 'leadSheet', maxCount: 1 }]), LeadStatusBulkImport);

module.exports = router;
