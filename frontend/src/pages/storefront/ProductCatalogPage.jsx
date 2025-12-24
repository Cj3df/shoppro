import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import ProductCard from '../../components/storefront/ProductCard';
import { Search, Filter, X, SlidersHorizontal, Grid3X3, LayoutGrid, ArrowUpDown } from 'lucide-react';
import { mockCategories } from '../../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

const ProductCatalogPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Initialize state from URL params to keep sync
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
    const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
    
    const [viewMode, setViewMode] = useState('grid');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 1
    });

    useEffect(() => {
        console.log('DEBUG: useEffect triggered. Filters:', { searchTerm, categoryFilter, priceRange, sortBy });
        // Update URL params when state changes
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (categoryFilter) params.category = categoryFilter;
        if (priceRange) params.price = priceRange;
        if (sortBy && sortBy !== 'newest') params.sort = sortBy;
        setSearchParams(params);

        fetchProducts();
    }, [searchTerm, categoryFilter, priceRange, sortBy]);

    const fetchProducts = async () => {
        try {
            console.log('DEBUG: fetchProducts calling API with params:', {
                page: pagination.page,
                limit: pagination.limit,
                sort: sortBy,
                search: searchTerm,
                category: categoryFilter,
                priceRange
            });
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                sort: sortBy,
                isActive: true
            };

            if (searchTerm) params.search = searchTerm;
            if (categoryFilter) params.category = categoryFilter;
            
            if (priceRange) {
                const [min, max] = priceRange.split('-');
                if (min) params.minPrice = min;
                if (max) params.maxPrice = max;
            }

            const response = await apiClient.get('/products', { params });
            console.log('DEBUG: API Response success:', response.data.success);
            
            if (response.data.success) {
                setProducts(response.data.data.products);
                setPagination(response.data.data.pagination);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('DEBUG: fetchProducts Error:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setPriceRange('');
        setSortBy('newest');
    };

    const activeFiltersCount = [searchTerm, categoryFilter, priceRange].filter(Boolean).length;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Premium Header */}
            <div className="glass sticky top-16 z-30 py-6 border-b border-slate-200/60">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-3xl font-black text-slate-900 tracking-tight"
                            >
                                Discover <span className="text-gradient">Collections</span>
                            </motion.h1>
                            <p className="text-slate-500 text-sm mt-1 font-medium">
                                Showing {products.length} curated products
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:max-w-2xl">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="What are you looking for?"
                                    className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white shadow-sm transition-all"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="pl-10 pr-4 py-3.5 border-none ring-1 ring-slate-200 rounded-2xl bg-white focus:ring-2 focus:ring-emerald-500 text-sm font-semibold appearance-none cursor-pointer"
                                    >
                                        <option value="newest">Sort: Newest</option>
                                        <option value="price-asc">Price: Low-High</option>
                                        <option value="price-desc">Price: High-Low</option>
                                        <option value="name-asc">Name: A-Z</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'compact' : 'grid')}
                                    className="p-3.5 bg-white ring-1 ring-slate-200 rounded-2xl text-slate-600 hover:text-emerald-600 transition-colors shadow-sm"
                                >
                                    {viewMode === 'grid' ? <LayoutGrid size={20} /> : <Grid3X3 size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="premium-card p-6 sticky top-44">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                                    <Filter size={20} className="text-emerald-500" />
                                    Refine Search
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-emerald-600 hover:text-emerald-700 font-bold uppercase tracking-wider"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>

                            <div className="space-y-10">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Categories</h4>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${categoryFilter === '' ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                                {categoryFilter === '' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>
                                            <input type="radio" className="hidden" name="category" checked={categoryFilter === ''} onChange={() => setCategoryFilter('')} />
                                            <span className={`text-sm font-medium transition-colors ${categoryFilter === '' ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'}`}>All Collections</span>
                                        </label>
                                        {mockCategories.map(cat => (
                                            <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${categoryFilter === cat.slug ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                                    {categoryFilter === cat.slug && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                </div>
                                                <input type="radio" className="hidden" name="category" checked={categoryFilter === cat.slug} onChange={() => setCategoryFilter(cat.slug)} />
                                                <span className={`text-sm font-medium transition-colors ${categoryFilter === cat.slug ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'}`}>{cat.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 ml-auto bg-slate-100 px-2 py-0.5 rounded-full">{cat.productCount}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Price Bracket</h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'All Prices', value: '' },
                                            { label: 'Under ₹500', value: '0-500' },
                                            { label: '₹500 - ₹1,000', value: '500-1000' },
                                            { label: '₹1,000 - ₹2,000', value: '1000-2000' },
                                            { label: '₹2,000 - ₹5,000', value: '2000-5000' },
                                            { label: 'Above ₹5,000', value: '5000-' }
                                        ].map(option => (
                                            <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center ${priceRange === option.value ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 group-hover:border-emerald-400'}`}>
                                                    {priceRange === option.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                </div>
                                                <input type="radio" className="hidden" name="price" checked={priceRange === option.value} onChange={() => setPriceRange(option.value)} />
                                                <span className={`text-sm font-medium transition-colors ${priceRange === option.value ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'}`}>{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1">
                        {loading ? (
                            <div className={`grid gap-8 ${viewMode === 'compact' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="premium-card p-4 animate-pulse">
                                        <div className="bg-slate-100 aspect-[4/5] rounded-2xl mb-4 shadow-inner"></div>
                                        <div className="h-4 bg-slate-100 rounded-full w-2/3 mb-3"></div>
                                        <div className="h-6 bg-slate-100 rounded-full w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                {products.length > 0 ? (
                                    <motion.div
                                        key="grid"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="show"
                                        className={`grid gap-x-6 gap-y-10 ${viewMode === 'compact' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}
                                    >
                                        {products.map((product) => (
                                            <ProductCard key={product._id} product={product} />
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="empty"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-32 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-sm"
                                    >
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-50 rounded-full mb-6 text-slate-300">
                                            <Search size={40} strokeWidth={1.5} />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-3">No Results Match Your Search</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto mb-8 font-medium">We couldn't find any products matching your current filters. Try adjusting them to see more options.</p>
                                        <button
                                            onClick={clearFilters}
                                            className="btn-premium-primary"
                                        >
                                            Clear All Filters
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductCatalogPage;
