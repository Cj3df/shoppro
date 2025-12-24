import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { getPrimaryImageUrl } from '../../utils/imageHelper';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user, isAuthenticated, toggleWishlist } = React.useContext(AuthContext);

    const isWishlisted = user?.wishlist?.some(id => id.toString() === product._id.toString());

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart(product);
    };

    const discount = product.basePrice > product.sellingPrice
        ? Math.round(((product.basePrice - product.sellingPrice) / product.basePrice) * 100)
        : 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
            <Link
                to={`/products/${product.slug}`}
                className="group relative block premium-card overflow-hidden h-full flex flex-col bg-white"
            >
                {/* Image Container */}
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
                    {product.images && product.images.length > 0 ? (
                        <motion.img
                            src={getPrimaryImageUrl(product.images)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <ShoppingCart size={48} strokeWidth={1.5} />
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {discount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md">
                                -{discount}%
                            </span>
                        )}
                        {product.currentStock <= 10 && product.currentStock > 0 && (
                            <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                                Low Stock
                            </span>
                        )}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                            onClick={async (e) => {
                                e.preventDefault();
                                if (!isAuthenticated) {
                                    toast.error('Please login to use wishlist');
                                    return;
                                }
                                const result = await toggleWishlist(product._id);
                                if (result !== null) {
                                    toast.success(result ? 'Added to wishlist' : 'Removed from wishlist');
                                }
                            }}
                            className={`p-2.5 rounded-full shadow-xl transition-all ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-slate-600 hover:text-red-500'}`}
                        >
                            <Heart size={18} fill={isWishlisted ? 'white' : 'none'} />
                        </button>
                        <button
                            onClick={(e) => e.preventDefault()}
                            className="p-2.5 bg-white text-slate-600 hover:text-emerald-500 rounded-full shadow-xl transition-colors"
                        >
                            <Eye size={18} />
                        </button>
                    </div>

                    {/* Add to Cart Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-white/90 to-transparent backdrop-blur-[2px]">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.currentStock <= 0}
                            className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-600 transition-colors shadow-xl disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            <ShoppingCart size={16} />
                            {product.currentStock <= 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-[11px] font-bold tracking-wider text-emerald-600 uppercase">
                            {product.category?.name || 'Uncategorized'}
                        </p>
                        <div className="flex items-center gap-1">
                            <Star size={12} className="text-amber-400 fill-amber-400" />
                            <span className="text-xs font-semibold text-slate-600">
                                {product.numReviews > 0 ? product.ratings.toFixed(1) : 'New'}
                            </span>
                        </div>
                    </div>

                    <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-3 leading-snug">
                        {product.name}
                    </h3>

                    <div className="mt-auto pt-2 flex items-center justify-between">
                        <div className="flex flex-col">
                            {discount > 0 && (
                                <span className="text-xs text-slate-400 line-through">₹{product.basePrice?.toLocaleString()}</span>
                            )}
                            <span className="text-xl font-black text-slate-900">₹{product.sellingPrice?.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ProductCard;
