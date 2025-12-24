const express = require('express');
const router = express.Router();
const { getStats, getTopProducts, getSalesChart, getRecentOrders } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');
const { isAdminOrStaff } = require('../middleware/roleMiddleware');

// All dashboard routes require admin/staff access
router.use(protect);
router.use(isAdminOrStaff);

router.get('/stats', getStats);
router.get('/top-products', getTopProducts);
router.get('/sales-chart', getSalesChart);
router.get('/recent-orders', getRecentOrders);

module.exports = router;
