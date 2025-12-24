import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Shield, Clock } from 'lucide-react';
import apiClient from '../../config/apiClient';
import ProductCard from '../../components/storefront/ProductCard';
import { mockProducts, mockCategories } from '../../data/mockData';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/products');
            console.log(response)
            const productData = response.data.data?.products || [];
            // Use API data if available, otherwise fall back to mock data
            setProducts(productData.length > 0 ? productData.slice(0, 8) : mockProducts.slice(0, 8));
        } catch (error) {
            console.error('Error fetching products:', error);
            // Use mock data as fallback
            setProducts(mockProducts.slice(0, 8));
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: Truck, title: 'Free Shipping', description: 'On orders over ₹999' },
        { icon: Shield, title: 'Secure Payment', description: '100% protected' },
        { icon: Clock, title: '24/7 Support', description: 'Always here to help' },
        { icon: ShoppingBag, title: 'Easy Returns', description: '7-day return policy' }
    ];

    return (
        <div>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 px-4 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-20 left-10 w-20 h-20 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-sky-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <span className="inline-block px-4 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-medium mb-6 animate-fade-in">
                        ✨ New Collection Available
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                        Master Your
                        <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent"> Shopping </span>
                        Experience
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Premium quality products at unbeatable prices. Shop the latest trends in electronics, fashion, and home essentials with confidence.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/products"
                            className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold hover:bg-slate-100 transition transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 group"
                        >
                            Shop Now
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/products"
                            className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition backdrop-blur-sm"
                        >
                            View Collection
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-white/10">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">10K+</p>
                            <p className="text-sm text-slate-400">Happy Customers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">500+</p>
                            <p className="text-sm text-slate-400">Products</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">50+</p>
                            <p className="text-sm text-slate-400">Brands</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">4.9★</p>
                            <p className="text-sm text-slate-400">Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bar */}
            <section className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <feature.icon size={24} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{feature.title}</p>
                                    <p className="text-sm text-slate-500">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Shop by Category</h2>
                            <p className="text-slate-500 mt-2">Browse our curated collections</p>
                        </div>
                        <Link to="/products" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 group">
                            View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockCategories.map((cat) => (
                            <Link
                                key={cat._id}
                                to={`/products?category=${cat.slug}`}
                                className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                                    <p className="text-sm text-white/70">{cat.productCount} Products</p>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Explore →
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
                            <p className="text-slate-500 mt-2">Handpicked favorites just for you</p>
                        </div>
                        <Link to="/products" className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 group">
                            View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="bg-slate-200 aspect-square rounded-lg mb-3"></div>
                                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Shopping?</h2>
                    <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                        Join thousands of happy customers. Sign up now and get 10% off your first order!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="px-8 py-4 bg-white text-emerald-600 rounded-full font-semibold hover:bg-slate-50 transition shadow-lg"
                        >
                            Create Account
                        </Link>
                        <Link
                            to="/products"
                            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition"
                        >
                            Continue as Guest
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
