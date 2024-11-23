var express = require('express');
var router = express.Router();
const {
  getCityViaPincode,
  getCardViaLender,
  getCompanies,
  getBanks,
  getBankViaIfsc,
} = require('../app/Helpers/Functions');
const multer = require('multer');
const { storage } = require('../app/Helpers/MulterConfig');
const upload = multer({ storage: storage });

const { VerifyPanDetails } = require('../app/Actions/VerifyPanDetails');
const { ValidateRequestMiddleware } = require('../app/Middleware/ValidateRequestMiddleware');
const { PanVerifyRequest, PanDetailRequest } = require('../app/Requests/Customer/PanDetailRequest');
const { customerAuthCheck } = require('../app/Middleware/AuthMiddleware');
const { FetchPanDetails } = require('../app/Actions/FetchPanDetails');
const { GetPanDetails } = require('../app/Actions/GetPanDetails');
const { VerifyGstDetails } = require('../app/Actions/verifyGstDetails');
const { VerifyAccountDetails } = require('../app/Actions/verifyAccountDetails');
const { VerifyCheque } = require('../app/Actions/verifyCheque');

router.get('/get-city-via-pincode/:pincode', getCityViaPincode);
router.get('/get-card-via-lender/:lenderName', getCardViaLender);
router.get('/get-bank-via-ifsc/:ifsc', getBankViaIfsc);
router.post(
  '/verify-pan-details',
  [customerAuthCheck, ValidateRequestMiddleware(PanVerifyRequest)],
  VerifyPanDetails
);
router.post(
  '/fetch-pan-details',
  [customerAuthCheck, ValidateRequestMiddleware(PanDetailRequest)],
  FetchPanDetails
);

router.post(
  '/get-pan-details',
  [customerAuthCheck, ValidateRequestMiddleware(PanDetailRequest)],
  GetPanDetails
);
router.post(
  '/get-name-pancard', ValidateRequestMiddleware(PanDetailRequest),
  GetPanDetails
);
router.get('/search-companies', getCompanies);

router.post(
  '/verifyGstNo',
  VerifyGstDetails
)
router.post(
  '/verifyAccountNo',
  VerifyAccountDetails
)
router.post(
  '/verifyCheque',
  upload.single('bankChequeDocument'), 
  VerifyCheque
);



module.exports = router;
