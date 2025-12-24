const express = require('express');
const router = express.Router();
const { createProductReview, getProductReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:productId', getProductReviews);
router.post('/:productId', protect, createProductReview);

module.exports = router;
