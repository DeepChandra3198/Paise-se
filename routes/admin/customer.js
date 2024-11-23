const express = require('express');
var router = express.Router();
const { userAuthCheck } = require('../../app/Middleware/AuthMiddleware');
const CustomerController = require('../../app/Controllers/Admin/CustomerController');
const { CustomersExport } = require('../../app/Actions/Export/CustomersExport');
const { customerStatusRequest } = require('../../app/Requests/Admin/customerStatusRequest')
const { ValidateRequestMiddleware } = require('../../app/Middleware/ValidateRequestMiddleware');
const { WebhooksExport } = require('../../app/Actions/Export/WebhooksExport');
const { ContactQueriesExport } = require('../../app/Actions/Export/ContactQueriesExport');

router.get('*', userAuthCheck);
router.post('*', userAuthCheck);

router.get('/customers', CustomerController.index);
router.get('/customer/:id', CustomerController.getById);
router.post('/customer-status/:id', ValidateRequestMiddleware(customerStatusRequest), CustomerController.updateStatus);
router.get('/export-customers', CustomersExport);
router.get('/export-webhooks', WebhooksExport);
router.get('/export-contact-queries', ContactQueriesExport);

module.exports = router;
