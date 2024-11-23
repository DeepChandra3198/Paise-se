const express = require('express');
var router = express.Router();
const { userAuthCheck } = require('../../app/Middleware/AuthMiddleware');
const StaffController = require('../../app/Controllers/Admin/StaffController');
// const { CustomersExport } = require('../../app/Actions/Export/CustomersExport');
const { staffRequest } = require('../../app/Requests/Admin/staffRequest')
const { ValidateRequestMiddleware } = require('../../app/Middleware/ValidateRequestMiddleware');

router.get('*', userAuthCheck);
router.post('*', userAuthCheck);

router.get('/staffs', StaffController.index);
router.post('/add-staff', ValidateRequestMiddleware(staffRequest), StaffController.store);
// router.get('/staff/:id', CustomerController.getById);
// router.post('/staff-status/:id', ValidateRequestMiddleware(customerStatusRequest), CustomerController.updateStatus);
// router.get('/export-staff', CustomersExport);

module.exports = router;
