const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { isAdminOrStaff } = require('../middleware/roleMiddleware');
const { createOrderValidation, updateOrderStatusValidation } = require('../middleware/validateRequest');

// All order routes require authentication
router.use(protect);

// Customer routes
router.post('/', createOrderValidation, createOrder);
router.get('/my-orders', getMyOrders);
router.put('/:id/cancel', cancelOrder);

// Admin/Staff routes
router.get('/', isAdminOrStaff, getAllOrders);
router.put('/:id/status', isAdminOrStaff, updateOrderStatusValidation, updateOrderStatus);

// Shared route (with authorization check in controller)
router.get('/:id', getOrderById);

module.exports = router;
