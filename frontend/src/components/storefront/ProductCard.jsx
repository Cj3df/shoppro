import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { getPrimaryImageUrl } from '../../utils/imageHelper';

// ProductCard component - displays a single product in a grid
const ProductCard = ({ product }) => {
    // Get cart functions
    const { addToCart } = useCart();
    
    // Get auth state for wishlist feature
    const { user, isAuthenticated, toggleWishlist } = useContext(AuthContext);

    // Check if product is in user's wishlist
    const isWishlisted = user?.wishlist?.some(
        (id) => id.toString() === product._id.toString()
    );

    // Handle add to cart button click
    const handleAddToCart = (e) => {
        // Prevent navigation when clicking the button inside the Link
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    // Handle wishlist button click
    const handleWishlistClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Must be logged in
        if (!isAuthenticated) {
            toast.error('Please login to use wishlist');
            return;
        }
        
        // Toggle wishlist
        const result = await toggleWishlist(product._id);
        if (result !== null) {
            toast.success(result ? 'Added to wishlist' : 'Removed from wishlist');
        }
    };

    // Calculate discount percentage
    const calculateDiscount = () => {
        if (product.basePrice > product.sellingPrice) {
            const discount = ((product.basePrice - product.sellingPrice) / product.basePrice) * 100;
            return Math.round(discount);
        }
        return 0;
    };

    const discount = calculateDiscount();

    // Get product image URL
    const imageUrl = getPrimaryImageUrl(product.images);

    // Check if product is out of stock
    const isOutOfStock = product.currentStock <= 0;

    // Check if product is low on stock
    const isLowStock = product.currentStock <= 10 && product.currentStock > 0;

    return (
        <Link
            to={`/products/${product.slug}`}
            className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100"
        >
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-slate-50">
                {/* Product Image */}
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ShoppingCart size={48} />
                    </div>
                )}

                {/* Discount Badge */}
                {discount > 0 && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discount}%
                    </span>
                )}

                {/* Low Stock Badge */}
                {isLowStock && (
                    <span className="absolute top-3 right-3 bg-amber-400 text-slate-900 text-xs font-bold px-2 py-1 rounded-full">
                        Low Stock
                    </span>
                )}

                {/* Wishlist Button - shows on hover */}
                <button
                    onClick={handleWishlistClick}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 ${
                        isWishlisted
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-slate-600 hover:text-red-500'
                    } ${isLowStock ? 'right-20' : 'right-3'}`}
                >
                    <Heart size={18} fill={isWishlisted ? 'white' : 'none'} />
                </button>

                {/* Add to Cart Button - shows on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className="w-full bg-white text-slate-900 py-2 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 hover:bg-emerald-500 hover:text-white transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        <ShoppingCart size={16} />
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Product Info Section */}
            <div className="p-4">
                {/* Category */}
                <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide mb-1">
                    {product.category?.name || 'Uncategorized'}
                </p>

                {/* Product Name */}
                <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
                    {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs text-slate-500">
                        {product.numReviews > 0 
                            ? `${product.ratings?.toFixed(1) || '0.0'} (${product.numReviews})` 
                            : 'New'}
                    </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2">
                    {/* Selling Price */}
                    <span className="text-lg font-bold text-slate-900">
                        ₹{product.sellingPrice?.toLocaleString() || '0'}
                    </span>
                    
                    {/* Original Price (if discounted) */}
                    {discount > 0 && (
                        <span className="text-sm text-slate-400 line-through">
                            ₹{product.basePrice?.toLocaleString() || '0'}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
