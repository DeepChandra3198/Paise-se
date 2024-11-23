const express = require('express');
var router = express.Router();
const { userAuthCheck } = require('../../app/Middleware/AuthMiddleware');
const ProductController = require('../../app/Controllers/Admin/ProductController');
const { storage } = require('../../app/Helpers/MulterConfig');
const multer = require('multer');
const upload = multer({ storage: storage });
const { ProductRequest } = require('../../app/Requests/Admin/ProductRequest');
const { ValidateRequestMiddleware } = require('../../app/Middleware/ValidateRequestMiddleware');
const { ProductEnquiries } = require('../../app/Actions/Admin/Enquiries/ProductEnquiries');
const { HomeLoanEnquiries } = require('../../app/Actions/Admin/Enquiries/HomeLoanEnquiries');
const {
  BusinessLoanEnquiries,
} = require('../../app/Actions/Admin/Enquiries/BusinessLoanEnquiries');
const { LapLoanEnquiries } = require('../../app/Actions/Admin/Enquiries/LapLoanEnquiries');
const {
  TwoWheelerLoanEnquiries,
} = require('../../app/Actions/Admin/Enquiries/TwoWheelerLoanEnquiries');
const { CarLoanEnquiries } = require('../../app/Actions/Admin/Enquiries/CarLoanEnquiries');
const {
  FamilyDoctorEnquiries,
} = require('../../app/Actions/Admin/Enquiries/FamilyDoctorEnquiries');
const {
  PersonalLoanEnquiries,
} = require('../../app/Actions/Admin/Enquiries/PersonalLoanEnquiries');
const {
  HealthInsuranceEnquiries,
} = require('../../app/Actions/Admin/Enquiries/HealthInsuranceEnquiries');

const { TrimStringsMiddleware } = require('../../app/Middleware/TrimStringsMiddleware');
const { CreditCardEnquiriesExport } = require('../../app/Actions/Export/CreditCardEnquiriesExport');
const { HomeLoanEnquiriesExport } = require('../../app/Actions/Export/HomeLoanEnquiriesExport');
const {
  BusinessLoanEnquiriesExport,
} = require('../../app/Actions/Export/BusinessLoanEnquiriesExport');
const {
  TwoWheelerLoanEnquiriesExport,
} = require('../../app/Actions/Export/TwoWheelerLoanEnquiriesExport');
const { CarLoanEnquiriesExport } = require('../../app/Actions/Export/CarLoanEnquiriesExport');
const {
  FamilyDoctorEnquiriesExport,
} = require('../../app/Actions/Export/FamilyDoctorEnquiriesExport');
const {
  PersonalLoanEnquiriesExport,
} = require('../../app/Actions/Export/PersonalLoanEnquiriesExport');
const {
  HealthInsuranceEnquiriesExport,
} = require('../../app/Actions/Export/HealthInsuranceEnquiriesExport');

router.get('*', userAuthCheck);
router.post('*', userAuthCheck);

router.get('/products', ProductController.index);
router.post(
  '/products',
  [
    upload.fields([
      { name: 'icon', maxCount: 1 },
      { name: 'tagLineIcon', maxCount: 1 },
    ]),
    ValidateRequestMiddleware(ProductRequest),
    TrimStringsMiddleware,
  ],
  ProductController.store
);
router.get('/products-status/:id/:status', ProductController.toggleStatus);
router.patch(
  '/products/update/:id',
  [
    upload.fields([
      { name: 'icon', maxCount: 1 },
      { name: 'tagLineIcon', maxCount: 1 },
    ]),
    ValidateRequestMiddleware(ProductRequest),
    TrimStringsMiddleware,
  ],
  ProductController.update
);
router.delete('/products/delete/:id', ProductController.destroy);

router.get('/product-queries', ProductEnquiries);
router.get('/home-loan-queries', HomeLoanEnquiries);
router.get('/business-loan-queries', BusinessLoanEnquiries);
router.get('/lap-loan-queries', LapLoanEnquiries);
router.get('/two-wheeler-loan-queries', TwoWheelerLoanEnquiries);
router.get('/car-loan-queries', CarLoanEnquiries);
router.get('/family-doctor-queries', FamilyDoctorEnquiries);
router.get('/personal-loan-queries', PersonalLoanEnquiries);
router.get('/health-insurance-queries', HealthInsuranceEnquiries);

router.get('/export-product-queries', CreditCardEnquiriesExport);
router.get('/export-home-loan-queries', HomeLoanEnquiriesExport);
router.get('/export-business-loan-queries', BusinessLoanEnquiriesExport);
router.get('/export-two-wheeler-loan-queries', TwoWheelerLoanEnquiriesExport);
router.get('/export-car-loan-queries', CarLoanEnquiriesExport);
router.get('/export-family-doctor-queries', FamilyDoctorEnquiriesExport);
router.get('/export-personal-loan-queries', PersonalLoanEnquiriesExport);
router.get('/export-health-insurance-queries', HealthInsuranceEnquiriesExport);

module.exports = router;
