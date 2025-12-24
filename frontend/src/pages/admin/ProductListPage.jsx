import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import { Plus, Edit, Trash2, Search, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/products?limit=100'); // Get more for admin list
            setProducts(response.data.products || response.data.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            await apiClient.delete(`/products/${id}`);
            setProducts(products.filter(p => p._id !== id));
            toast.success('Product deleted successfully');
        } catch (error) {
            toast.error('Failed to delete product');
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Products</h1>
                    <p className="text-slate-500 text-sm">Manage your product catalog</p>
                </div>
                <Link
                    to="/admin/products/new"
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition flex items-center gap-2"
                >
                    <Plus size={18} /> Add Product
                </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-200 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or SKU..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-600 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-semibold border-b">Product</th>
                                <th className="px-6 py-4 font-semibold border-b">SKU</th>
                                <th className="px-6 py-4 font-semibold border-b">Category</th>
                                <th className="px-6 py-4 font-semibold border-b text-right">Price</th>
                                <th className="px-6 py-4 font-semibold border-b text-center">Stock</th>
                                <th className="px-6 py-4 font-semibold border-b text-center">Status</th>
                                <th className="px-6 py-4 font-semibold border-b text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">Loading products...</td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">No products found.</td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-slate-50">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded border border-slate-200 flex items-center justify-center overflow-hidden">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-xs text-slate-400">Img</span>
                                                    )}
                                                </div>
                                                <div className="font-medium text-slate-900">{product.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-sm font-mono text-slate-600">{product.sku}</td>
                                        <td className="px-6 py-3 text-sm text-slate-600">{product.category?.name || '-'}</td>
                                        <td className="px-6 py-3 text-sm text-slate-900 text-right">₹{product.sellingPrice}</td>
                                        <td className="px-6 py-3 text-center">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${product.currentStock < 10 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                {product.currentStock}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {product.isActive ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    <CheckCircle size={12} /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                                                    Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/admin/products/${product._id}/edit`}
                                                    className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductListPage;
