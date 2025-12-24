const User = require('../models/userModel');
const Product = require('../models/productModel');

// @desc    Toggle product in wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const productId = req.params.productId;

        const isWishlisted = user.wishlist.some(id => id.toString() === productId);

        if (isWishlisted) {
            user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
            await user.save();
            res.json({ success: true, message: 'Removed from wishlist', isWishlisted: false });
        } else {
            user.wishlist.push(productId);
            await user.save();
            res.json({ success: true, message: 'Added to wishlist', isWishlisted: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('wishlist');
        res.json({ success: true, data: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
