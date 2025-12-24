const Review = require('../models/reviewModel');
const Product = require('../models/productModel');

// @desc    Create new review
// @route   POST /api/reviews/:productId
// @access  Private
exports.createProductReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const alreadyReviewed = await Review.findOne({
            product: productId,
            user: req.user._id,
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = await Review.create({
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            product: productId,
        });

        // Update product ratings
        const reviews = await Review.find({ product: productId });
        product.numReviews = reviews.length;
        if (reviews.length > 0) {
            product.ratings =
                reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        } else {
            product.ratings = 0;
        }

        await product.save();

        res.status(201).json({ success: true, message: 'Review added' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).sort('-createdAt');
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
