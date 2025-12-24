const express = require('express');
const router = express.Router();
const { stockIn, stockOut, adjustStock, getProductLogs, getAllLogs, getInventorySummary } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');
const { isAdminOrStaff, isAdmin } = require('../middleware/roleMiddleware');
const { stockInValidation, stockOutValidation } = require('../middleware/validateRequest');

// All inventory routes require authentication
router.use(protect);
router.use(isAdminOrStaff);

router.post('/stock-in', stockInValidation, stockIn);
router.post('/stock-out', stockOutValidation, stockOut);
router.post('/adjust', isAdmin, adjustStock);
router.get('/logs', getAllLogs);
router.get('/logs/:productId', getProductLogs);
router.get('/summary', getInventorySummary);

module.exports = router;
