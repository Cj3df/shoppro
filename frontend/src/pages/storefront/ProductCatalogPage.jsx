import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import ProductCard from '../../components/storefront/ProductCard';
import { Search, Filter, X, ArrowUpDown, Grid3X3, LayoutGrid } from 'lucide-react';
import { mockCategories } from '../../data/mockData';

// ProductCatalogPage - Shows all products with filters and search
const ProductCatalogPage = () => {
    // Get and set URL search params (e.g., ?category=electronics&search=phone)
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Products list and loading state
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Categories from API
    const [categories, setCategories] = useState([]);

    // Filter states - initialized from URL params
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
    const [priceRange, setPriceRange] = useState(searchParams.get('price') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');

    // View mode: 'grid' (larger cards) or 'compact' (smaller cards)
    const [viewMode, setViewMode] = useState('grid');

    // Pagination data from API
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 1
    });

    // Fetch categories from API on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/categories');
                if (response.data.success && response.data.data.categories) {
                    setCategories(response.data.data.categories);
                } else {
                    // Fallback to mock categories if API fails
                    setCategories(mockCategories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Use mock categories as fallback
                setCategories(mockCategories);
            }
        };
        fetchCategories();
    }, []);

    // Fetch products when filters change
    useEffect(() => {
        // Update URL with current filters
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (categoryFilter) params.category = categoryFilter;
        if (priceRange) params.price = priceRange;
        if (sortBy && sortBy !== 'newest') params.sort = sortBy;
        setSearchParams(params);

        // Fetch products with current filters
        fetchProducts();
    }, [searchTerm, categoryFilter, priceRange, sortBy]);

    // Function to fetch products from API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            
            // Build API params
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                sort: sortBy,
                isActive: true
            };

            // Add search term if provided
            if (searchTerm) {
                params.search = searchTerm;
            }
            
            // Add category filter if selected
            if (categoryFilter) {
                params.category = categoryFilter;
            }

            // Add price range if selected
            if (priceRange) {
                const [min, max] = priceRange.split('-');
                if (min) params.minPrice = min;
                if (max) params.maxPrice = max;
            }

            // Make API request
            const response = await apiClient.get('/products', { params });

            if (response.data.success) {
                setProducts(response.data.data.products);
                setPagination(response.data.data.pagination);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setPriceRange('');
        setSortBy('newest');
    };

    // Count how many filters are active
    const activeFiltersCount = [searchTerm, categoryFilter, priceRange].filter(Boolean).length;

    // Price range options for filter
    const priceOptions = [
        { label: 'All Prices', value: '' },
        { label: 'Under ₹500', value: '0-500' },
        { label: '₹500 - ₹1,000', value: '500-1000' },
        { label: '₹1,000 - ₹2,000', value: '1000-2000' },
        { label: '₹2,000 - ₹5,000', value: '2000-5000' },
        { label: 'Above ₹5,000', value: '5000-' }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ========== Header with Search and Sort ========== */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-30 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        {/* Title */}
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                Discover <span className="text-emerald-600">Collections</span>
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Showing {products.length} products
                            </p>
                        </div>

                        {/* Search and Sort Controls */}
                        <div className="flex flex-col sm:flex-row gap-3 flex-1 lg:max-w-xl">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search 
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
                                    size={20} 
                                />
                                <input
                                    type="text"
                                    placeholder="What are you looking for?"
                                    className="w-full pl-10 pr-10 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={18} />
                                    </button>
                                )}
                            </div>

                            {/* Sort Dropdown and View Toggle */}
                            <div className="flex items-center gap-2">
                                <div className="relative">
                                    <ArrowUpDown 
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
                                        size={16} 
                                    />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="pl-9 pr-4 py-3 border border-slate-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 text-sm font-medium appearance-none cursor-pointer"
                                    >
                                        <option value="newest">Sort: Newest</option>
                                        <option value="price-asc">Price: Low-High</option>
                                        <option value="price-desc">Price: High-Low</option>
                                        <option value="name-asc">Name: A-Z</option>
                                    </select>
                                </div>

                                {/* View Mode Toggle */}
                                <button
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'compact' : 'grid')}
                                    className="p-3 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-emerald-600 transition-colors"
                                    title={viewMode === 'grid' ? 'Compact view' : 'Grid view'}
                                >
                                    {viewMode === 'grid' ? <Grid3X3 size={20} /> : <LayoutGrid size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== Main Content ========== */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* ========== Sidebar Filters ========== */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 sticky top-40">
                            {/* Filter Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Filter size={18} className="text-emerald-500" />
                                    Filters
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-slate-900 mb-3">Categories</h4>
                                <div className="space-y-2">
                                    {/* All Categories Option */}
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={categoryFilter === ''}
                                            onChange={() => setCategoryFilter('')}
                                            className="text-emerald-500 focus:ring-emerald-500"
                                        />
                                        <span className={`text-sm ${categoryFilter === '' ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                            All Categories
                                        </span>
                                    </label>
                                    
                                    {/* Category Options */}
                                    {categories.map((cat) => (
                                        <label key={cat._id} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={categoryFilter === cat.slug}
                                                onChange={() => setCategoryFilter(cat.slug)}
                                                className="text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <span className={`text-sm ${categoryFilter === cat.slug ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                                {cat.name}
                                            </span>
                                            {cat.productCount !== undefined && (
                                                <span className="text-xs text-slate-400 ml-auto">
                                                    ({cat.productCount})
                                                </span>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-900 mb-3">Price Range</h4>
                                <div className="space-y-2">
                                    {priceOptions.map((option) => (
                                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="price"
                                                checked={priceRange === option.value}
                                                onChange={() => setPriceRange(option.value)}
                                                className="text-emerald-500 focus:ring-emerald-500"
                                            />
                                            <span className={`text-sm ${priceRange === option.value ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ========== Products Grid ========== */}
                    <main className="flex-1">
                        {loading ? (
                            // Loading Skeleton
                            <div className={`grid gap-6 ${
                                viewMode === 'compact' 
                                    ? 'grid-cols-2 md:grid-cols-4' 
                                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                            }`}>
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse">
                                        <div className="bg-slate-200 aspect-square rounded-lg mb-4"></div>
                                        <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
                                        <div className="h-5 bg-slate-200 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            // Products Grid
                            <div className={`grid gap-6 ${
                                viewMode === 'compact' 
                                    ? 'grid-cols-2 md:grid-cols-4' 
                                    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                            }`}>
                                {products.map((product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            // No Results Message
                            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4 text-slate-400">
                                    <Search size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    No Products Found
                                </h3>
                                <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                                    We couldn't find any products matching your current filters. 
                                    Try adjusting them to see more options.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default ProductCatalogPage;
