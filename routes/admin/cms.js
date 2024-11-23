const express = require("express");
var router = express.Router();
const { userAuthCheck } = require("../../app/Middleware/AuthMiddleware");
const FaqController = require("../../app/Controllers/Admin/FaqController");
const tdsController = require("../../app/Controllers/Admin/tdsController");
const OfferController = require("../../app/Controllers/Admin/OfferController");
const bankCommissionController = require("../../app/Controllers/Admin/bankCommissionController");
const StaticPageController = require("../../app/Controllers/Admin/StaticPageController");
const TestimonialController = require("../../app/Controllers/Admin/TestimonialController");
const PartnerController = require("../../app/Controllers/Admin/PartnerController");
const BlogController = require("../../app/Controllers/Admin/BlogController");
const { LeadExport } = require('../../app/Actions/Export/LeadExport');
const { LeadStatusBulkImport } = require('../../app/Imports/leadStatusBulkImport');
const leadController = require('../../app/Controllers/Admin/leadController');
const { leadStatusRequest } = require('../../app/Requests/Admin/leadStatusRequest')
const { FaqRequest } = require("../../app/Requests/Admin/FaqRequest");
const { OfferRequest } = require("../../app/Requests/Admin/OfferRequest");
const { BankCommissionRequest } = require("../../app/Requests/Admin/bankCommissionRequest");
const { paiseseWebhook, destroy } = require("../../app/Actions/Customer/realTimeDLR");
const {
  StaticPageRequest,
} = require("../../app/Requests/Admin/StaticPageRequest");
const {
  TestimonialRequest,
} = require("../../app/Requests/Admin/TestimonialRequest");
const { PartnerRequest } = require("../../app/Requests/Admin/PartnerRequest");
const { BlogRequest } = require('../../app/Requests/Admin/BlogRequest');
const {
  ValidateRequestMiddleware,
} = require("../../app/Middleware/ValidateRequestMiddleware");
const { storage } = require("../../app/Helpers/MulterConfig");
const multer = require("multer");
const {
  TrimStringsMiddleware,
} = require("../../app/Middleware/TrimStringsMiddleware");
const { Invoice , destroyInvoice } = require("../../app/Actions/Customer/invoice");
const { TdsRequest } = require("../../app/Requests/Admin/TdsRequest");
const { contactQueries } = require("../../app/Actions/Customer/ContactUs");
const upload = multer({ storage: storage });

router.get("*", userAuthCheck);
router.post("*", userAuthCheck);

router.get("/faq", FaqController.index);
router.post("/faq", ValidateRequestMiddleware(FaqRequest), FaqController.store);
router.get("/faq-status/:id/:status", FaqController.toggleStatus);
router.patch(
  "/faq/update/:id",
  ValidateRequestMiddleware(FaqRequest),
  FaqController.update
);
router.delete("/faq/delete/:id", FaqController.destroy);

router.get("/tds", tdsController.index);
router.post("/tds", ValidateRequestMiddleware(TdsRequest), tdsController.store);
router.patch(
  "/tds/update/:id",
  ValidateRequestMiddleware(TdsRequest),
  tdsController.update
);

router.get("/offer", OfferController.index);

router.post("/offer",
  upload.fields([{ name: 'photo', maxCount: 1 }]),
  ValidateRequestMiddleware(OfferRequest),
  OfferController.store);

router.get("/offer-status/:id/:status", OfferController.toggleStatus);

router.patch(
  "/offer/update/:id",
  upload.fields([{ name: 'photo', maxCount: 1 }]),
  ValidateRequestMiddleware(OfferRequest),
  OfferController.update
);
router.delete("/offer/delete/:id", OfferController.destroy);

router.get("/bankCommission", bankCommissionController.index);
router.post("/bankCommission", ValidateRequestMiddleware(BankCommissionRequest), bankCommissionController.store);
router.get("/bankCommission-status/:id/:status", bankCommissionController.toggleStatus);
router.delete("/bankCommission/delete/:id", bankCommissionController.destroy);

router.get('/paiseseWebhook', paiseseWebhook);
router.get('/contact-query', contactQueries);
router.get('/invoices', Invoice);
router.delete("/paiseseWebhook/delete/:id", destroy);
router.delete("/invoice/delete/:id", destroyInvoice);

router.get("/page", StaticPageController.index);
router.post(
  "/page",
  ValidateRequestMiddleware(StaticPageRequest),
  StaticPageController.store
);
router.get("/page/edit/:id", StaticPageController.edit);
router.get("/page-status/:id/:status", StaticPageController.toggleStatus);
router.patch(
  "/page/update/:id",
  ValidateRequestMiddleware(StaticPageRequest),
  StaticPageController.update
);
router.delete("/page/delete/:id", StaticPageController.destroy);

router.get("/testimonial", TestimonialController.index);
router.post(
  "/testimonial",
  [
    upload.single("icon"),
    ValidateRequestMiddleware(TestimonialRequest),
    TrimStringsMiddleware,
  ],
  TestimonialController.store
);
router.get(
  "/testimonial-status/:id/:status",
  TestimonialController.toggleStatus
);
router.patch(
  "/testimonial/update/:id",
  [
    upload.single("icon"),
    ValidateRequestMiddleware(TestimonialRequest),
    TrimStringsMiddleware,
  ],
  TestimonialController.update
);
router.delete("/testimonial/delete/:id", TestimonialController.destroy);

router.get("/partner", PartnerController.index);
router.post(
  "/partner",
  [
    upload.single("icon"),
    ValidateRequestMiddleware(PartnerRequest),
    TrimStringsMiddleware,
  ],
  PartnerController.store
);
router.get("/partner-status/:id/:status", PartnerController.toggleStatus);
router.patch(
  "/partner/update/:id",
  [
    upload.single("icon"),
    ValidateRequestMiddleware(PartnerRequest),
    TrimStringsMiddleware,
  ],
  PartnerController.update
);
router.delete("/partner/delete/:id", PartnerController.destroy);

router.get('/blogs', BlogController.index);
router.post(
  '/blogs',
  [upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]), ValidateRequestMiddleware(BlogRequest), TrimStringsMiddleware],
  BlogController.store
);


router.get('/leads', leadController.index);

router.get('/lead/:id', leadController.getById);

router.get('/lead/download-docs/:id', leadController.downloadDocuments);

router.delete('/lead/delete/:id', leadController.destroy);

router.post('/lead-status/:id', ValidateRequestMiddleware(leadStatusRequest), leadController.updateStatus);

router.get('/export-leads/:type', LeadExport);

router.post('/update-leads', upload.fields([{ name: 'leadSheet', maxCount: 1 }]), LeadStatusBulkImport);

router.get('/blogs/edit/:id', BlogController.edit);

router.get('/blogs-status/:id/:status', BlogController.toggleStatus);
router.patch(
  '/blogs/update/:id',
  [upload.fields([
    { name: 'icon', maxCount: 1 },
    { name: 'cover', maxCount: 1 }
  ]), ValidateRequestMiddleware(BlogRequest), TrimStringsMiddleware],
  BlogController.update
);
router.delete('/blogs/delete/:id', BlogController.destroy);


module.exports = router;
