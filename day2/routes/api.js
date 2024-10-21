const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const reportController = require('../controllers/reportController');

// Order routes
router.get('/order/odd', orderController.getOddOrders);
router.get('/order', orderController.getOrders);
router.get('/order/cursor', orderController.getOrdersByCursor);

// Report routes
router.get('/report/sale', reportController.getSaleReport);
router.get('/report/monthly', reportController.getMonthlyReport);
router.get('/report/user', reportController.getUserReport);
router.get('/report/shipping_dock', reportController.getShippingDockReport);
router.get('/report/user/count', reportController.getUserOrderCount);

module.exports = router;
