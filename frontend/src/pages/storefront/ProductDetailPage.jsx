import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import { useCart } from '../../context/CartContext';
import AuthContext from '../../context/AuthContext';
import { ShoppingCart, Check, AlertCircle, ArrowLeft, Heart, Star, Truck, Shield, RotateCcw, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { mockProducts } from '../../data/mockData';
import ReviewSection from '../../components/storefront/ReviewSection';
import { getImageUrl } from '../../utils/imageHelper';

// ProductDetailPage - Shows full details of a single product
const ProductDetailPage = () => {
    // Get the product slug from the URL (e.g., /products/wireless-headphones)
    const { slug } = useParams();
    const navigate = useNavigate();
    
    // Get cart and auth functions
    const { addToCart } = useCart();
    const { user, isAuthenticated, toggleWishlist } = useContext(AuthContext);

    // Component state
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Check if product is in wishlist
    const isWishlisted = user?.wishlist?.some(
        (id) => id.toString() === product?._id?.toString()
    );

    // Fetch product when page loads or slug changes
    useEffect(() => {
        fetchProduct();
        // Scroll to top of page
        window.scrollTo(0, 0);
    }, [slug]);

    // Function to get product data from API
    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/products/${slug}`);
            const productData = response.data?.data?.product || response.data;
            setupProduct(productData);
        } catch (error) {
            console.error('Error fetching product:', error);
            // Try to find in mock data as fallback
            const mockProduct = mockProducts.find((p) => p.slug === slug);
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

    // Setup product data after fetching
    const setupProduct = (productData) => {
        setProduct(productData);
        
        // Set first image as selected
        if (productData.images && productData.images.length > 0) {
            setSelectedImage(getImageUrl(productData.images[0]));
        }
        
        // Set first variant as selected (if product has variants)
        if (productData.hasVariants && productData.variants?.length > 0) {
            setSelectedVariant(productData.variants[0]);
        }
    };

    // Handle add to cart button click
    const handleAddToCart = () => {
        if (!product) return;
        
        // If product has variants, make sure one is selected
        if (product.hasVariants && !selectedVariant) {
            toast.error('Please select an option');
            return;
        }
        
        // Check stock
        const currentStock = selectedVariant 
            ? selectedVariant.currentStock 
            : product.currentStock;
            
        if (currentStock < quantity) {
            toast.error('Not enough stock available');
            return;
        }
        
        addToCart(product, selectedVariant, quantity);
        toast.success('Added to cart!');
    };

    // Handle wishlist button click
    const handleWishlistClick = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to use wishlist');
            return;
        }
        
        const result = await toggleWishlist(product._id);
        if (result !== null) {
            toast.success(result ? 'Added to wishlist' : 'Removed from wishlist');
        }
    };

    // Show loading skeleton while fetching data
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Image skeleton */}
                    <div className="w-full lg:w-3/5 bg-slate-200 aspect-square rounded-2xl animate-pulse"></div>
                    {/* Info skeleton */}
                    <div className="w-full lg:w-2/5 space-y-6">
                        <div className="h-4 bg-slate-200 rounded w-1/4 animate-pulse"></div>
                        <div className="h-10 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                        <div className="h-6 bg-slate-200 rounded w-1/3 animate-pulse"></div>
                        <div className="h-32 bg-slate-200 rounded w-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        );
    }

    // If no product found, return nothing
    if (!product) return null;

    // Calculate display price (with variant adjustment if any)
    const displayPrice = selectedVariant
        ? product.basePrice + (selectedVariant.additionalPrice || 0)
        : product.sellingPrice;

    // Calculate discount percentage
    const discount = product.basePrice > product.sellingPrice
        ? Math.round(((product.basePrice - product.sellingPrice) / product.basePrice) * 100)
        : 0;

    // Product benefits to display
    const benefits = [
        { icon: Truck, title: 'Express Delivery', desc: 'Ships within 24-48 hours' },
        { icon: Shield, title: 'Secure Payment', desc: 'SSL Encrypted transactions' },
        { icon: RotateCcw, title: 'Easy Returns', desc: '14-day hassle-free returns' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            {/* Back button */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-500 hover:text-emerald-600 mb-6 font-medium text-sm transition-colors"
            >
                <ArrowLeft size={16} className="mr-2" />
                Back to Collection
            </button>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                {/* ========== LEFT SIDE: PRODUCT IMAGES ========== */}
                <div className="w-full lg:w-1/2">
                    {/* Main Image */}
                    <div className="aspect-square bg-white rounded-2xl border border-slate-200 overflow-hidden mb-4 relative">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="w-full h-full object-contain p-4"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <ShoppingCart size={64} />
                            </div>
                        )}
                        
                        {/* Discount Badge */}
                        {discount > 0 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                SAVE {discount}%
                            </div>
                        )}
                    </div>

                    {/* Image Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto">
                            {product.images.map((img, idx) => {
                                const imgUrl = getImageUrl(img);
                                const isSelected = selectedImage === imgUrl;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(imgUrl)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                                            isSelected
                                                ? 'border-emerald-500 ring-2 ring-emerald-100'
                                                : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                    >
                                        <img
                                            src={imgUrl}
                                            alt={`View ${idx + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ========== RIGHT SIDE: PRODUCT INFO ========== */}
                <div className="w-full lg:w-1/2">
                    {/* Category and Rating */}
                    <div className="flex items-center justify-between mb-4">
                        {product.category && (
                            <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                                {product.category.name}
                            </span>
                        )}
                        <div className="flex items-center gap-1 bg-slate-50 px-3 py-1 rounded-full">
                            <Star size={14} className="text-amber-400 fill-amber-400" />
                            <span className="text-sm font-bold text-slate-700">
                                {product.numReviews > 0 ? product.ratings?.toFixed(1) : 'New'}
                            </span>
                            <span className="text-xs text-slate-400 ml-1">
                                {product.numReviews > 0 ? `(${product.numReviews})` : ''}
                            </span>
                        </div>
                    </div>

                    {/* Product Name */}
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">
                        {product.name}
                    </h1>

                    {/* Price Section */}
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-3xl font-bold text-slate-900">
                            ₹{displayPrice.toLocaleString()}
                        </span>
                        {discount > 0 && (
                            <span className="text-lg text-slate-400 line-through">
                                ₹{product.basePrice.toLocaleString()}
                            </span>
                        )}
                        
                        {/* Stock Status */}
                        <div className="ml-auto">
                            {product.currentStock > 10 ? (
                                <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium">
                                    ✓ In Stock
                                </span>
                            ) : product.currentStock > 0 ? (
                                <span className="text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm font-medium">
                                    Only {product.currentStock} left!
                                </span>
                            ) : (
                                <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                    <AlertCircle size={14} />
                                    Sold Out
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-2">
                            Description
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Variants (if product has variants) */}
                    {product.hasVariants && product.variants && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
                                Select Option
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {product.variants.map((variant) => {
                                    const isSelected = selectedVariant === variant;
                                    return (
                                        <button
                                            key={variant._id || variant.sku}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                                                isSelected
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                        >
                                            {Object.values(variant.attributes).join(' / ')}
                                            {isSelected && <Check size={14} className="inline ml-2" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Benefits */}
                    <div className="grid grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-xl">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="text-center">
                                <benefit.icon size={24} className="text-emerald-500 mx-auto mb-2" />
                                <h4 className="text-xs font-bold text-slate-900">{benefit.title}</h4>
                                <p className="text-xs text-slate-500">{benefit.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quantity and Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-slate-200 rounded-lg">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                className="px-3 py-2 text-slate-500 hover:text-slate-900 disabled:opacity-50"
                                disabled={quantity <= 1}
                            >
                                <Minus size={18} />
                            </button>
                            <span className="px-4 py-2 font-bold text-slate-900">{quantity}</span>
                            <button
                                onClick={() => setQuantity((q) => q + 1)}
                                className="px-3 py-2 text-slate-500 hover:text-slate-900"
                            >
                                <Plus size={18} />
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.currentStock <= 0}
                            className="flex-1 bg-slate-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={20} />
                            Add to Cart
                        </button>

                        {/* Wishlist Button */}
                        <button
                            onClick={handleWishlistClick}
                            className={`p-3 rounded-lg border-2 transition-all ${
                                isWishlisted
                                    ? 'bg-red-500 border-red-500 text-white'
                                    : 'border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200'
                            }`}
                        >
                            <Heart size={20} fill={isWishlisted ? 'white' : 'none'} />
                        </button>
                    </div>

                    {/* SKU Info */}
                    <div className="mt-6 text-xs text-slate-400 flex gap-4">
                        <span>SKU: {product.sku}</span>
                        <span>Category: {product.category?.name}</span>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <ReviewSection productId={product._id} isAuthenticated={isAuthenticated} />
        </div>
    );
};

export default ProductDetailPage;
