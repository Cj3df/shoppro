import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import { useCart } from '../../context/CartContext';
import { ShoppingCart, Check, AlertCircle, ArrowLeft, Heart, Share2, Star, Truck, Shield, RotateCcw, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockProducts } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../../context/AuthContext';
import ReviewSection from '../../components/storefront/ReviewSection';
import { getImageUrl, getAllImageUrls } from '../../utils/imageHelper';

const ProductDetailPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user, isAuthenticated, toggleWishlist } = React.useContext(AuthContext);

    const [product, setProduct] = useState(null);
    const isWishlisted = user?.wishlist?.some(id => id.toString() === product?._id?.toString());
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/products/${slug}`);
            const productData = response.data?.data?.product || response.data;
            setupProduct(productData);
        } catch (error) {
            console.error('Error fetching product:', error);
            const mockProduct = mockProducts.find(p => p.slug === slug);
            if (mockProduct) {
                setupProduct(mockProduct);
            } else {
                toast.error('Product not found');
                navigate('/products');
            }
        } finally {
            setLoading(false);
        }
    };

    const setupProduct = (productData) => {
        setProduct(productData);
        if (productData.images && productData.images.length > 0) {
            setSelectedImage(getImageUrl(productData.images[0]));
        }
        if (productData.hasVariants && productData.variants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0]);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        if (product.hasVariants && !selectedVariant) {
            toast.error('Please select an option');
            return;
        }
        const currentStock = selectedVariant ? selectedVariant.currentStock : product.currentStock;
        if (currentStock < quantity) {
            toast.error('Not enough stock available');
            return;
        }
        addToCart(product, selectedVariant, quantity);
        toast.success('Added to cart!');
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="w-full lg:w-3/5 bg-slate-200 aspect-[4/3] rounded-[2.5rem]"></div>
                    <div className="w-full lg:w-2/5 space-y-6">
                        <div className="h-4 bg-slate-200 rounded-full w-1/4"></div>
                        <div className="h-12 bg-slate-200 rounded-2xl w-3/4"></div>
                        <div className="h-6 bg-slate-200 rounded-full w-1/3"></div>
                        <div className="h-32 bg-slate-200 rounded-3xl w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) return null;

    const displayPrice = selectedVariant
        ? (product.basePrice + (selectedVariant.additionalPrice || 0))
        : product.sellingPrice;

    const discount = product.basePrice > product.sellingPrice
        ? Math.round(((product.basePrice - product.sellingPrice) / product.basePrice) * 100)
        : 0;

    const benefits = [
        { icon: Truck, title: 'Express Delivery', desc: 'Ships within 24-48 hours' },
        { icon: Shield, title: 'Secure Payment', desc: 'SSL Encrypted transactions' },
        { icon: RotateCcw, title: 'Easy Returns', desc: '14-day hassle-free returns' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-6 py-10"
        >
            {/* Breadcrumb / Back */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-500 hover:text-emerald-600 mb-8 font-bold text-sm transition-colors group"
            >
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 group-hover:bg-emerald-50 transition-colors">
                    <ArrowLeft size={16} />
                </div>
                Back to Collection
            </motion.button>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                {/* GALLERY SECTON */}
                <div className="w-full lg:w-3/5">
                    <div className="sticky top-40 space-y-6">
                        <motion.div
                            layoutId={`img-${product._id}`}
                            className="aspect-[4/5] md:aspect-[4/3] bg-white rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-2xl relative"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.4 }}
                                    src={selectedImage}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-8"
                                />
                            </AnimatePresence>

                            {discount > 0 && (
                                <div className="absolute top-8 left-8 bg-red-500 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl">
                                    SAVE {discount}%
                                </div>
                            )}
                        </motion.div>

                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
                                {product.images.map((img, idx) => {
                                    const imgUrl = getImageUrl(img);
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(imgUrl)}
                                            className={`flex-shrink-0 w-24 h-24 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group ${selectedImage === imgUrl ? 'border-emerald-500 ring-4 ring-emerald-50/50' : 'border-slate-100'}`}
                                        >
                                            <img src={imgUrl} alt={`View ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            {selectedImage === imgUrl && <div className="absolute inset-0 bg-emerald-500/10" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* INFO SECTION */}
                <div className="w-full lg:w-2/5 flex flex-col">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1"
                    >
                        {/* Category & Rating */}
                        <div className="flex items-center justify-between mb-4">
                            {product.category && (
                                <span className="text-emerald-600 font-black text-[11px] uppercase tracking-[0.2em] bg-emerald-50 px-3 py-1.5 rounded-full">
                                    {product.category.name}
                                </span>
                            )}
                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span className="text-sm font-bold text-slate-700">
                                    {product.numReviews > 0 ? product.ratings.toFixed(1) : 'New'}
                                </span>
                                <span className="text-xs text-slate-400 font-medium ml-1">
                                    {product.numReviews > 0 ? `(${product.numReviews} reviews)` : '(No reviews yet)'}
                                </span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
                            {product.name}
                        </h1>

                        <div className="flex items-end gap-4 mb-10">
                            <span className="text-4xl font-black text-slate-900">₹{displayPrice.toLocaleString()}</span>
                            {discount > 0 && (
                                <span className="text-xl text-slate-400 line-through mb-1 font-bold">₹{product.basePrice.toLocaleString()}</span>
                            )}
                            <div className="ml-auto">
                                {product.currentStock > 10 ? (
                                    <div className="flex items-center text-emerald-600 bg-emerald-50/50 px-4 py-2 rounded-2xl border border-emerald-100 text-sm font-bold">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-3" />
                                        In Stock
                                    </div>
                                ) : product.currentStock > 0 ? (
                                    <div className="flex items-center text-amber-600 bg-amber-50/50 px-4 py-2 rounded-2xl border border-amber-100 text-sm font-bold">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-3" />
                                        Only {product.currentStock} left!
                                    </div>
                                ) : (
                                    <div className="flex items-center text-red-600 bg-red-50/50 px-4 py-2 rounded-2xl border border-red-100 text-sm font-bold">
                                        <AlertCircle size={16} className="mr-2" />
                                        Sold Out
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 mb-10">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Product Insight</h3>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                {product.description}
                            </p>
                        </div>

                        {/* Variants */}
                        {product.hasVariants && product.variants && (
                            <div className="mb-10">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Select Specification</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.variants.map((variant) => (
                                        <button
                                            key={variant._id || variant.sku}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-5 py-3 rounded-2xl border-2 text-sm font-bold transition-all relative ${selectedVariant === variant
                                                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-lg shadow-emerald-100'
                                                : 'border-slate-100 bg-white text-slate-500 hover:border-slate-300'
                                                }`}
                                        >
                                            {Object.values(variant.attributes).join(' / ')}
                                            {selectedVariant === variant && (
                                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center border-2 border-white">
                                                    <Check size={10} strokeWidth={4} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Benefits Grid */}
                        <div className="grid grid-cols-3 gap-4 mb-10 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100">
                            {benefits.map((b, i) => (
                                <div key={i} className="text-center">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
                                        <b.icon size={20} className="text-emerald-500" />
                                    </div>
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider mb-1">{b.title}</h4>
                                    <p className="text-[9px] text-slate-400 font-bold leading-tight">{b.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 border-t border-slate-100">
                            <div className="flex items-center bg-white border-2 border-slate-100 rounded-2xl p-1 shadow-sm">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors disabled:opacity-30"
                                    disabled={quantity <= 1}
                                ><Minus size={18} strokeWidth={3} /></button>
                                <span className="px-5 font-black text-lg text-slate-900 w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                                ><Plus size={18} strokeWidth={3} /></button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.currentStock <= 0}
                                className="flex-1 w-full bg-slate-900 text-white px-8 py-4 rounded-[1.25rem] font-black text-lg hover:bg-emerald-600 transition-all duration-300 shadow-xl shadow-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-95"
                            >
                                <ShoppingCart size={22} strokeWidth={2.5} />
                                ADD TO CART
                            </button>

                            <button
                                onClick={async () => {
                                    if (!isAuthenticated) {
                                        toast.error('Please login to use wishlist');
                                        return;
                                    }
                                    const result = await toggleWishlist(product._id);
                                    if (result !== null) {
                                        toast.success(result ? 'Added to wishlist' : 'Removed from wishlist');
                                    }
                                }}
                                className={`p-4 rounded-2xl border-2 transition-all ${isWishlisted ? 'bg-red-500 border-red-500 text-white' : 'border-slate-100 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50'}`}
                            >
                                <Heart size={24} fill={isWishlisted ? 'white' : 'none'} />
                            </button>
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-6 text-[10px] font-black tracking-widest text-slate-300 uppercase">
                            <span>SKU: {product.sku}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <span>Categories: {product.category?.name}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* REVIEWS SECTION */}
            <ReviewSection productId={product._id} isAuthenticated={isAuthenticated} />
        </motion.div>
    );
};

export default ProductDetailPage;
