import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import ProductCard from '../../components/storefront/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/wishlist');
            setWishlist(response.data.data || []);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="h-10 bg-slate-100 w-48 rounded-full mb-12 animate-pulse"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-96 bg-slate-50 rounded-[2rem] animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 min-h-[70vh]">
            <div className="flex items-center gap-4 mb-12">
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shadow-sm">
                    <Heart size={24} fill="currentColor" />
                </div>
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Wishlist</h1>
                    <p className="text-slate-500 font-medium">{wishlist.length} items saved for later</p>
                </div>
            </div>

            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlist.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm"
                >
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
                        <Heart size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">Your Wishlist is Empty</h2>
                    <p className="text-slate-500 max-w-sm mx-auto mb-10 font-medium">
                        Explore our collections and save your favorite products to buy them later.
                    </p>
                    <Link
                        to="/products"
                        className="btn-premium-primary px-10 py-4 rounded-2xl flex items-center gap-3 mx-auto w-fit"
                    >
                        <ShoppingBag size={20} />
                        START EXPLORING
                        <ArrowRight size={20} />
                    </Link>
                </motion.div>
            )}
        </div>
    );
};

export default WishlistPage;
