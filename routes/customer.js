var express = require('express');
var router = express.Router();
const { Dashboard } = require('../app/Actions/Customer/Dashboard');
const { leadById, index, editLeadById } = require('../app/Actions/Customer/leads')
const { UpdateProfile } = require('../app/Actions/Customer/UpdateProfile');
const { UpdateDocuments } = require('../app/Actions/Customer/UpdateDocuments');
const { customerAuthCheck } = require('../app/Middleware/AuthMiddleware');
const { ValidateRequestMiddleware } = require('../app/Middleware/ValidateRequestMiddleware');
const { ProfileRequest } = require('../app/Requests/Customer/ProfileRequest');
const { PanVerifyRequest } = require('../app/Requests/Customer/PanDetailRequest');
const multer = require('multer');
const { storage } = require('../app/Helpers/MulterConfig');
const { VerifyPanDetails } = require('../app/Actions/VerifyPanDetails');
const upload = multer({ storage: storage });
const {
  TrimStringsMiddleware,
} = require("../app/Middleware/TrimStringsMiddleware");
const { PaymentRecon } = require('../app/Actions/Customer/paymentRecon');
const { generateInvoice } = require('../app/Actions/Customer/generateInvoice');

router.get('*', customerAuthCheck);
router.post('*', customerAuthCheck);

router.get('/dashboard', Dashboard);
router.get('/lead/:id', leadById)
router.get('/edit-lead/:id', editLeadById)
router.get('/lead-list', index)
router.get('/payment-reconList', PaymentRecon)
router.get('/generate-invoice/:normal/:advance', generateInvoice)
router.get('/generate-invoice/:normal', generateInvoice)

router.post('/profile',
  [upload.fields([
    { name: 'aadharCardDocument', maxCount: 1 },
    { name: 'pancardDocument', maxCount: 1 },
    { name: 'profile', maxCount: 1 },
    { name: 'bankChequeDocument', maxCount: 1 },
  ]), ValidateRequestMiddleware(ProfileRequest), TrimStringsMiddleware], UpdateProfile);

router.post(
  '/documents',
  upload.fields([
    { name: 'aadharCardDocument', maxCount: 1 },
    { name: 'pancardDocument', maxCount: 1 },
  ]),
  UpdateDocuments
);

router.get('/pan-verify', function (req, res) {
  return res.render('customer/pan-verify');
});

router.get('/verify-pan-details', function (req, res) {
  return res.render('customer/fetch-pan-details');
});

module.exports = router;
