const express = require('express');
var router = express.Router();
const { storage } = require('../../app/Helpers/MulterConfig');
const multer = require('multer');
const upload = multer({ storage: storage });

const { userAuthCheck } = require('../../app/Middleware/AuthMiddleware');
const MasterController = require('../../app/Controllers/Admin/MasterController');
const MasterValueController = require('../../app/Controllers/Admin/MasterValueController');
const CardController = require('../../app/Controllers/Admin/CardController');
const BreController = require('../../app/Controllers/Admin/BreController');
const PersonalLoanBreController = require('../../app/Controllers/Admin/PersonalLoanBreController');
const CompanyBankMasterController = require('../../app/Controllers/Admin/CompanyBankMasterController');
const OtherBankMasterController = require('../../app/Controllers/Admin/OtherBankMasterController');
const ProfessionalBankMasterController = require('../../app/Controllers/Admin/ProfessionalBankMasterController');
const BankGradeMasterController = require('../../app/Controllers/Admin/BankGradeMasterController');
const TeamMemberController = require('../../app/Controllers/Admin/TeamMemberController');

const { MasterRequest } = require('../../app/Requests/Admin/MasterRequest');
const { MasterValueRequest } = require('../../app/Requests/Admin/MasterValueRequest');
const { CardRequest } = require('../../app/Requests/Admin/CardRequest');
const { BreRequest } = require('../../app/Requests/Admin/BreRequest');
const { PersonalLoanBreRequest } = require('../../app/Requests/Admin/PersonalLoanBreRequest');
const { CompanyBankRequest } = require('../../app/Requests/Admin/CompanyBankRequest');
const { BankGradeRequest } = require('../../app/Requests/Admin/BankGradeRequest');
const { ValidateRequestMiddleware } = require('../../app/Middleware/ValidateRequestMiddleware');
const { TrimStringsMiddleware } = require('../../app/Middleware/TrimStringsMiddleware');
const validateFileAndUpload = require('../../app/Middleware/validateFileAndUpload');
const { OtherBankRequest } = require('../../app/Requests/Admin/OtherBankRequest');
const { ProfessionalBankRequest } = require('../../app/Requests/Admin/ProfessionalBankRequest');
const { TeamMemberRequest } = require('../../app/Requests/Admin/TeamMemberRequest');

router.get('*', userAuthCheck);
router.post('*', userAuthCheck);

router.get('/master', MasterController.index);
router.post(
  '/master',
  [upload.single('icon'), ValidateRequestMiddleware(MasterRequest), TrimStringsMiddleware],
  MasterController.store
);
router.get('/master-status/:id/:status', MasterController.toggleStatus);
router.patch(
  '/master/update/:id',
  [upload.single('icon'), ValidateRequestMiddleware(MasterRequest), TrimStringsMiddleware],
  MasterController.update
);
router.delete('/master/delete/:id', MasterController.destroy);


router.get('/master-value', MasterValueController.index);
router.post(
  '/master-value',
  [upload.single('icon'), ValidateRequestMiddleware(MasterValueRequest), TrimStringsMiddleware],
  MasterValueController.store
);
router.get('/master-value-status/:id/:status', MasterValueController.toggleStatus);
router.patch(
  '/master-value/update/:id',
  [upload.single('icon'), ValidateRequestMiddleware(MasterValueRequest), TrimStringsMiddleware],
  MasterValueController.update
);
router.delete('/master-value/delete/:id', MasterValueController.destroy);

router.get('/card', CardController.index);
router.post(
  '/card',
  [upload.single('icon'), ValidateRequestMiddleware(CardRequest), TrimStringsMiddleware],
  CardController.store
);
router.get('/card/edit/:id', CardController.edit);
router.get('/card-status/:id/:status', CardController.toggleStatus);
router.patch(
  '/card/update/:id',
  [upload.single('icon'), ValidateRequestMiddleware(CardRequest), TrimStringsMiddleware],
  CardController.update
);
router.delete('/card/delete/:id', CardController.destroy);

router.get('/bre', BreController.index);
router.post('/bre', ValidateRequestMiddleware(BreRequest), BreController.store);
router.get('/bre-status/:id/:status', BreController.toggleStatus);
router.patch('/bre/update/:id', ValidateRequestMiddleware(BreRequest), BreController.update);
router.delete('/bre/delete/:id', BreController.destroy);
router.get('/bre-cities/:id', BreController.viewCities);
router.post('/bre-cities/:id', validateFileAndUpload, BreController.storeCities);
router.get('/bre-companies/:id', BreController.viewCompanies);
router.post('/bre-companies/:id', validateFileAndUpload, BreController.storeCompanies);

router.get('/personal-loan-bre', PersonalLoanBreController.index);
router.post(
  '/personal-loan-bre',
  ValidateRequestMiddleware(PersonalLoanBreRequest),
  PersonalLoanBreController.store
);
router.get('/personal-loan-bre-status/:id/:status', PersonalLoanBreController.toggleStatus);
router.patch(
  '/personal-loan-bre/update/:id',
  ValidateRequestMiddleware(PersonalLoanBreRequest),
  PersonalLoanBreController.update
);
router.delete('/personal-loan-bre/delete/:id', PersonalLoanBreController.destroy);
router.get('/personal-loan-cities/:id', PersonalLoanBreController.viewCities);
router.post(
  '/personal-loan-cities/:id',
  validateFileAndUpload,
  PersonalLoanBreController.storeCities
);

router.get('/company-bank-master', CompanyBankMasterController.index);
router.post(
  '/company-bank-master',
  ValidateRequestMiddleware(CompanyBankRequest),
  CompanyBankMasterController.store
);
router.post(
  '/company-bank-master-via-excel',
  validateFileAndUpload,
  CompanyBankMasterController.storeViaExcel
);

router.get('/company-bank-master-status/:id/:status', CompanyBankMasterController.toggleStatus);
router.patch(
  '/company-bank-master/update/:id',
  ValidateRequestMiddleware(CompanyBankRequest),
  CompanyBankMasterController.update
);
router.delete('/company-bank-master/delete/:id', CompanyBankMasterController.destroy);

router.get('/other-bank-master', OtherBankMasterController.index);
router.post(
  '/other-bank-master',
  ValidateRequestMiddleware(OtherBankRequest),
  OtherBankMasterController.store
);
router.post(
  '/other-bank-master-via-excel',
  validateFileAndUpload,
  OtherBankMasterController.storeViaExcel
);

router.get('/other-bank-master-status/:id/:status', OtherBankMasterController.toggleStatus);
router.patch(
  '/other-bank-master/update/:id',
  ValidateRequestMiddleware(OtherBankRequest),
  OtherBankMasterController.update
);
router.delete('/other-bank-master/delete/:id', OtherBankMasterController.destroy);

router.get('/professional-bank-master', ProfessionalBankMasterController.index);
router.post(
  '/professional-bank-master',
  ValidateRequestMiddleware(ProfessionalBankRequest),
  ProfessionalBankMasterController.store
);
router.post(
  '/professional-bank-master-via-excel',
  validateFileAndUpload,
  ProfessionalBankMasterController.storeViaExcel
);

router.get(
  '/professional-bank-master-status/:id/:status',
  ProfessionalBankMasterController.toggleStatus
);
router.patch(
  '/professional-bank-master/update/:id',
  ValidateRequestMiddleware(ProfessionalBankRequest),
  ProfessionalBankMasterController.update
);
router.delete('/professional-bank-master/delete/:id', ProfessionalBankMasterController.destroy);

router.get('/bank-grade-master', BankGradeMasterController.index);
router.post(
  '/bank-grade-master',
  ValidateRequestMiddleware(BankGradeRequest),
  BankGradeMasterController.store
);
router.get('/bank-grade-master-status/:id/:status', BankGradeMasterController.toggleStatus);
router.patch(
  '/bank-grade-master/update/:id',
  ValidateRequestMiddleware(BankGradeRequest),
  BankGradeMasterController.update
);
router.delete('/bank-grade-master/delete/:id', BankGradeMasterController.destroy);

router.get('/team-members', TeamMemberController.index);
router.post(
  '/team-members',
  [upload.single('photo'), ValidateRequestMiddleware(TeamMemberRequest), TrimStringsMiddleware],
  TeamMemberController.store
);
router.get('/team-members/edit/:id', TeamMemberController.edit);

router.get('/team-members-status/:id/:status', TeamMemberController.toggleStatus);
router.patch(
  '/team-members/update/:id',
  [upload.single('photo'), ValidateRequestMiddleware(TeamMemberRequest), TrimStringsMiddleware],
  TeamMemberController.update
);
router.delete('/team-members/delete/:id', TeamMemberController.destroy);

module.exports = router;
