const express = require('express');
const router = express.Router();
const { getAllCategories, getCategoryTree, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');
const { isAdminOrStaff, isAdmin } = require('../middleware/roleMiddleware');
const { categoryValidation, mongoIdValidation } = require('../middleware/validateRequest');

// Public routes
router.get('/', getAllCategories);
router.get('/tree', getCategoryTree);
router.get('/:id', getCategoryById);

// Protected routes (admin/staff)
router.post('/', protect, isAdminOrStaff, categoryValidation, createCategory);
router.put('/:id', protect, isAdminOrStaff, updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

module.exports = router;
