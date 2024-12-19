var express = require('express');
var router = express.Router();
const multer = require('multer');
const { storage } = require('../app/Helpers/MulterConfig');

const { Home } = require('../app/Actions/Customer/Home');
const { ProductDetail } = require('../app/Actions/Customer/ProductDetail');
const { ContactUs } = require('../app/Actions/Customer/ContactUs');
const { PConnect } = require('../app/Actions/Customer/partner-connect');
const { Register, viewRegister } = require('../app/Actions/Customer/register');
const { RegisterAccount, viewAccount } = require('../app/Actions/Customer/RegisterAccount');
const { setPassword, viewSetPassword } = require('../app/Actions/Customer/setPassword');
const { RegisterAgreement, viewAgreement } = require('../app/Actions/Customer/RegisterAgreement');
const { readURL, paiseseWebhook } = require('../app/Actions/Customer/realTimeDLR');
const { store, update } = require('../app/Actions/Customer/leads');
const { OurTeam } = require('../app/Actions/Customer/OurTeam');
const { Blogs } = require('../app/Actions/Customer/Blogs');
const { index } = require('../app/Actions/Customer/leads');
const { bankIFSC, stateIFSC, cityIFSC, branchIFSC, detailIFSC } = require("../app/Controllers/Admin/ifscCheckController")
const { viewBlog } = require('../app/Actions/Customer/viewBlog');
const { Cards } = require('../app/Actions/Customer/Cards');
const { sendOTP, ValidateOTP } = require('../app/Controllers/Customer/Auth/AuthController');
const CustomerInfoController = require('../app/Controllers/Customer/CustomerInfoController');
const BusinessLoanEnquiryController = require('../app/Controllers/Customer/Enquiries/BusinessLoanEnquiryController');
const HomeLoanEnquiryController = require('../app/Controllers/Customer/Enquiries/HomeLoanEnquiryController');
const LapLoanEnquiryController = require('../app/Controllers/Customer/Enquiries/LapLoanEnquiryController');
const TwoWheelerLoanEnquiryController = require('../app/Controllers/Customer/Enquiries/TwoWheelerLoanEnquiryController');
const CarLoanEnquiryController = require('../app/Controllers/Customer/Enquiries/CarLoanEnquiryController');
const FamilyDoctorEnquiryController = require('../app/Controllers/Customer/Enquiries/FamilyDoctorEnquiryController');
const PersonalLoanEnquiryController = require('../app/Controllers/Customer/Enquiries/PersonalLoanEnquiryController');
const HealthInsuranceEnquiryController = require('../app/Controllers/Customer/Enquiries/HealthInsuranceEnquiryController');
const upload = multer({ storage: storage });

const {
  CustomerInfoStepOneRequest,
} = require('../app/Requests/Customer/CustomerInfoStepOneRequest');
const {
  CustomerInfoStepTwoRequest,
} = require('../app/Requests/Customer/CustomerInfoStepTwoRequest');
const {
  BusinessLoanEnquiryRequest,
} = require('../app/Requests/Customer/BusinessLoanEnquiryRequest');
const { HomeLoanEnquiryRequest } = require('../app/Requests/Customer/HomeLoanEnquiryRequest');
const { LapLoanEnquiryRequest } = require('../app/Requests/Customer/LapLoanEnquiryRequest');
const {
  TwoWheelerLoanEnquiryRequest,
} = require('../app/Requests/Customer/TwoWheelerLoanEnquiryRequest');
const { CarLoanEnquiryRequest } = require('../app/Requests/Customer/CarLoanEnquiryRequest');
const {
  FamilyDoctorEnquiryRequest,
} = require('../app/Requests/Customer/FamilyDoctorEnquiryRequest');
const { ContactUsRequest } = require('../app/Requests/Customer/ContactUsRequest');
const { PartnerConnectRequest } = require('../app/Requests/Customer/PartnerConnectRequest');
const { RegisterRequest } = require('../app/Requests/Customer/registerRequest');
const { leadRequest } = require('../app/Requests/Customer/leadRequest');
const {
  PersonalLoanEnquiryRequestOne,
} = require('../app/Requests/Customer/PersonalLoanEnquiryRequestOne');
const {
  PersonalLoanEnquiryRequestTwo,
} = require('../app/Requests/Customer/PersonalLoanEnquiryRequestTwo');
const {
  PersonalLoanEnquiryRequestTwoProfessional,
} = require('../app/Requests/Customer/PersonalLoanEnquiryRequestTwoProfessional');
const {
  HealthInsuranceEnquiryRequest,
} = require('../app/Requests/Customer/HealthInsuranceEnquiryRequest');

const { ValidateRequestMiddleware } = require('../app/Middleware/ValidateRequestMiddleware');
const { customerAuthCheck } = require('../app/Middleware/AuthMiddleware');
const { UserCardClick } = require('../app/Actions/Customer/UserCardClick');
const { StaticPage } = require('../app/Actions/Customer/StaticPage');
const { CardsCompare } = require('../app/Actions/Customer/CardsCompare');

router.get('/', Home);
// router.get('/index1', Home);
router.get('/p/:slug', StaticPage);
router
  .route('/contact-us')
  .get(function (req, res) {
    return res.render('contact-us');
  })
  .post(ValidateRequestMiddleware(ContactUsRequest), ContactUs);


router
  .route('/p-connect')
  .get(function (req, res) {
    return res.render('partner-connect');
  })
  .post(ValidateRequestMiddleware(PartnerConnectRequest), PConnect);

// router.get("/emi-calculator", function (req, res) {
//   return res.render("customer/calculators/emi-calculator");
// });

router.get('/personal-loan-calculator', function (req, res) {
  return res.render('customer/calculators/personal-loan-calculator');
});

router.get('/home-loan-calculator', function (req, res) {
  return res.render('customer/calculators/home-loan-calculator');
});

router.get('/lap-calculator', function (req, res) {
  return res.render('customer/calculators/lap-calculator');
});

router.get('/two-wheeler-loan-calculator', function (req, res) {
  return res.render('customer/calculators/two-wheeler-loan-calculator');
});

router.get('/car-loan-calculator', function (req, res) {
  return res.render('customer/calculators/car-loan-calculator');
});

router.get('/business-loan-calculator', function (req, res) {
  return res.render('customer/calculators/business-loan-calculator');
});

router.get('/product/:slug/:id', ProductDetail);

router.get('/our-team', OurTeam);

router.get('/blogs', Blogs);

router.get('/blogs/:id', viewBlog);

router.get('/customer-info/:productId', customerAuthCheck, CustomerInfoController.getCustomerInfo);
router.post(
  '/customer-info-step-one/:productId',
  [customerAuthCheck, ValidateRequestMiddleware(CustomerInfoStepOneRequest)],
  CustomerInfoController.postCustomerInfoStageOne
);

router.post(
  '/customer-info-step-two',
  [customerAuthCheck, ValidateRequestMiddleware(CustomerInfoStepTwoRequest)],
  CustomerInfoController.postCustomerInfoStageTwo
);

router.get('/cards', customerAuthCheck, Cards);
router.get('/cards/compare', customerAuthCheck, CardsCompare);
router.get('/grab-now/:cardId/:productId/:infoId', customerAuthCheck, UserCardClick);

router
  .route('/business-loan-enquiry/:productId')
  .get(customerAuthCheck, BusinessLoanEnquiryController.index)
  .post(
    [customerAuthCheck, ValidateRequestMiddleware(BusinessLoanEnquiryRequest)],
    BusinessLoanEnquiryController.store
  );

router
  .route('/home-loan-enquiry/:productId')
  .get(customerAuthCheck, HomeLoanEnquiryController.index)
  .post(
    [customerAuthCheck, ValidateRequestMiddleware(HomeLoanEnquiryRequest)],
    HomeLoanEnquiryController.store
  );

router
  .route('/lap-loan-enquiry/:productId')
  .get(customerAuthCheck, LapLoanEnquiryController.index)
  .post(
    [customerAuthCheck, ValidateRequestMiddleware(LapLoanEnquiryRequest)],
    LapLoanEnquiryController.store
  );

router
  .route('/two-wheeler-loan-enquiry/:productId')
  .get(customerAuthCheck, TwoWheelerLoanEnquiryController.index)
  .post(
    [customerAuthCheck, ValidateRequestMiddleware(TwoWheelerLoanEnquiryRequest)],
    TwoWheelerLoanEnquiryController.store
  );

router
  .route('/car-loan-enquiry/:productId')
  .get(customerAuthCheck, CarLoanEnquiryController.index)
  .post(
    [customerAuthCheck, ValidateRequestMiddleware(CarLoanEnquiryRequest)],
    CarLoanEnquiryController.store
  );

router
  .route('/family-doctor-enquiry/:productId')
  .get(customerAuthCheck, FamilyDoctorEnquiryController.index)
  .post(
    [customerAuthCheck, ValidateRequestMiddleware(FamilyDoctorEnquiryRequest)],
    FamilyDoctorEnquiryController.store
  );

router.get('/personal-loan-enquiry/:productId', PersonalLoanEnquiryController.index);

router.post(
  '/personal-loan-step-one/:productId',
  [customerAuthCheck, ValidateRequestMiddleware(PersonalLoanEnquiryRequestOne)],
  PersonalLoanEnquiryController.storeStepOne
);

router.post(
  '/personal-loan-step-two',
  [customerAuthCheck, ValidateRequestMiddleware(PersonalLoanEnquiryRequestTwo)],
  PersonalLoanEnquiryController.storeStepTwo
);

router.post(
  '/personal-loan-step-two-professional',
  [customerAuthCheck, ValidateRequestMiddleware(PersonalLoanEnquiryRequestTwoProfessional)],
  PersonalLoanEnquiryController.storeStepTwo
);

router.get('/personal-loan-banks/:id', customerAuthCheck, PersonalLoanEnquiryController.banks);

router.get(
  '/professional-personal-loan-banks/:id',
  customerAuthCheck,
  PersonalLoanEnquiryController.professionalBanks
);

router
  .route('/health-insurance-enquiry/:productId')
  .get(customerAuthCheck, HealthInsuranceEnquiryController.index)
  .post(
    [customerAuthCheck, ValidateRequestMiddleware(HealthInsuranceEnquiryRequest)],
    HealthInsuranceEnquiryController.store
  );


router.get('/ifsc-check', bankIFSC)

router.get('/ifsc-check/:bank', stateIFSC)

router.get('/ifsc-check/:bank/:state', cityIFSC)

router.get('/ifsc-check/:bank/:state/:city', branchIFSC)

router.get('/ifsc-check/:bank/:state/:city/:branch', detailIFSC)


router.route('/register').get(viewRegister)
  .post(
    upload.fields([
      { name: 'profile', maxCount: 1 },
      { name: 'aadharCardDocument', maxCount: 1 },
      { name: 'pancardDocument', maxCount: 1 },
    ]), ValidateRequestMiddleware(RegisterRequest), Register);

router.post('/lead',
  upload.fields([
    { name: 'bankStatement', maxCount: 1 },
    { name: 'aadharCardDocument', maxCount: 1 },
    { name: 'pancardDocument', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'salarySlip', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'coApAadharCardDocument', maxCount: 1 },
    { name: 'coApPancardDocument', maxCount: 1 },
    { name: 'coApPassportPhoto', maxCount: 1 },
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'udhyamAadhar', maxCount: 1 },
    { name: 'gstReturnTwelveMonths', maxCount: 1 },
    { name: 'itrTwoYears', maxCount: 1 },
    { name: 'coiTwoYears', maxCount: 1 },
    { name: 'balanceSheetTwoYears', maxCount: 1 },
    { name: 'profitLossAnnexure', maxCount: 1 },
    { name: 'taxAuditReport', maxCount: 1 },
    { name: 'currentBankOneYear', maxCount: 1 },
    { name: 'ccBankOneYear', maxCount: 1 },
    { name: 'odBankOneYear', maxCount: 1 },
    { name: 'runningLoanSheet', maxCount: 1 },
    { name: 'ownershipProof', maxCount: 1 },
    { name: 'detailSheet', maxCount: 1 },
    { name: 'otherDoc1', maxCount: 1 },
    { name: 'otherDoc2', maxCount: 1 },
    { name: 'otherDoc3', maxCount: 1 },
    { name: 'otherDoc4', maxCount: 1 },
  ]), ValidateRequestMiddleware(leadRequest), store);



router.post('/edit-lead/:id',
  upload.fields([
    { name: 'bankStatement', maxCount: 1 },
    { name: 'aadharCardDocument', maxCount: 1 },
    { name: 'pancardDocument', maxCount: 1 },
    { name: 'passportPhoto', maxCount: 1 },
    { name: 'salarySlip', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'coApAadharCardDocument', maxCount: 1 },
    { name: 'coApPancardDocument', maxCount: 1 },
    { name: 'coApPassportPhoto', maxCount: 1 },
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'udhyamAadhar', maxCount: 1 },
    { name: 'gstReturnTwelveMonths', maxCount: 1 },
    { name: 'itrTwoYears', maxCount: 1 },
    { name: 'coiTwoYears', maxCount: 1 },
    { name: 'balanceSheetTwoYears', maxCount: 1 },
    { name: 'profitLossAnnexure', maxCount: 1 },
    { name: 'taxAuditReport', maxCount: 1 },
    { name: 'currentBankOneYear', maxCount: 1 },
    { name: 'ccBankOneYear', maxCount: 1 },
    { name: 'odBankOneYear', maxCount: 1 },
    { name: 'runningLoanSheet', maxCount: 1 },
    { name: 'ownershipProof', maxCount: 1 },
    { name: 'detailSheet', maxCount: 1 },
    { name: 'otherDoc1', maxCount: 1 },
    { name: 'otherDoc2', maxCount: 1 },
    { name: 'otherDoc3', maxCount: 1 },
    { name: 'otherDoc4', maxCount: 1 },
  ]), ValidateRequestMiddleware(leadRequest), update);


router.route('/register-account/:id').get(viewAccount)
  .post(
    upload.fields([
      { name: 'bankChequeDocument', maxCount: 1 },
    ]), RegisterAccount);

router.get('/register-aggrement/:id', viewAgreement);

router.post('/register-aggrement/:id',  RegisterAgreement)

router.route('/set-password/:id').get(viewSetPassword)
  .post(upload.none(), setPassword);

router.get('/RealTimeDLR/readurl', readURL)

module.exports = router;
