const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getFeaturedProducts, getLowStockProducts } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { isAdminOrStaff, isAdmin } = require('../middleware/roleMiddleware');
const { productValidation } = require('../middleware/validateRequest');

// Public routes
router.get('/', getAllProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

// Protected routes
router.get('/admin/low-stock', protect, isAdminOrStaff, getLowStockProducts);
router.post('/', protect, isAdminOrStaff, productValidation, createProduct);
router.put('/:id', protect, isAdminOrStaff, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;
