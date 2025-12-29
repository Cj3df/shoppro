import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Loader } from 'lucide-react';

const ProductFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditMode);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        basePrice: '',
        sellingPrice: '',
        currentStock: 0, // Note: Initial stock usually set via stock-in, but MVP might allow direct set or we treat this as read-only/edit-only
        isActive: true,
        images: '', // Comma separated for MVP, or handle file upload in Phase 2
        sku: '' // Auto-generated usually
    });

    const fetchCategories = React.useCallback(async () => {
        try {
            // Mocking categories if endpoint doesn't exist yet, or check typical REST endpoint
            // masdoc.html mentions "Configure categories". Assuming GET /api/categories or similar
            // If fails, we can hardcode for now or fix later.
            // Let's try to fetch, if fail use defaults
            const response = await apiClient.get('/categories'); // Creating assumption
            setCategories(response.data.categories || response.data.data.categories || []);
        } catch (error) {
            console.warn('Failed to fetch categories, using manual input or empty list');
        }
    }, []);

    const fetchProduct = React.useCallback(async () => {
        try {
            const response = await apiClient.get(`/products/${id}`);
            const product = response.data.data.product;
            setFormData({
                name: product.name,
                description: product.description || '',
                category: product.category?._id || product.category,
                basePrice: product.basePrice,
                sellingPrice: product.sellingPrice,
                currentStock: product.currentStock,
                isActive: product.isActive,
                images: product.images ? product.images.join(', ') : '',
                sku: product.sku
            });
        } catch (error) {
            toast.error('Failed to fetch product details');
            navigate('/admin/products');
        } finally {
            setFetching(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        fetchCategories();
        if (isEditMode) {
            fetchProduct();
        }
    }, [id, isEditMode, fetchCategories, fetchProduct]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                images: formData.images.split(',').map(url => url.trim()).filter(Boolean),
                basePrice: Number(formData.basePrice),
                sellingPrice: Number(formData.sellingPrice),
                // Exclude fields that shouldn't be updated directly if needed
            };

            if (isEditMode) {
                await apiClient.put(`/products/${id}`, payload);
                toast.success('Product updated successfully');
            } else {
                await apiClient.post('/products', payload);
                toast.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-8 text-center text-slate-500">Loading product...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => navigate('/admin/products')}
                className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition"
            >
                <ArrowLeft size={16} className="mr-1" /> Back to Products
            </button>

            <h1 className="text-2xl font-bold text-slate-900 mb-8">{isEditMode ? 'Edit Product' : 'Create New Product'}</h1>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                        {categories.length > 0 ? (
                            <select
                                name="category"
                                required
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.category}
                                onChange={handleChange}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                name="category"
                                placeholder="Category ID"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.category}
                                onChange={handleChange}
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                        <select
                            name="isActive"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                            value={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                            value={formData.description}
                            onChange={handleChange}
                        ></textarea>
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="border-t border-slate-200 pt-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Pricing & Inventory</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price (Cost)</label>
                            <input
                                type="number"
                                name="basePrice"
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.basePrice}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Selling Price</label>
                            <input
                                type="number"
                                name="sellingPrice"
                                required
                                min="0"
                                step="0.01"
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                            />
                        </div>
                        {/* Stock is often managed via stock-in, but creating product might init with 0 */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Current Stock</label>
                            <input
                                type="number"
                                disabled={true} // Usually managed via logs
                                className="w-full px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500 cursor-not-allowed"
                                value={formData.currentStock}
                            />
                            <p className="text-xs text-slate-400 mt-1">Manage stock via Inventory</p>
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="border-t border-slate-200 pt-6">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Media</h2>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Image URLs (Comma separated)</label>
                        <input
                            type="text"
                            name="images"
                            placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                            value={formData.images}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition font-medium flex items-center gap-2"
                    >
                        {loading && <Loader size={16} className="animate-spin" />}
                        {isEditMode ? 'Update Product' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;
