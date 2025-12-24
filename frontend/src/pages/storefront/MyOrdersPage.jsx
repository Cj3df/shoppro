import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyOrders();
    }, []);

    const fetchMyOrders = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get('/orders/my-orders');
            setOrders(response.data.orders || response.data.data.orders);
        } catch (error) {
            console.error('Error fetching my orders:', error);
            toast.error('Failed to load your orders');
        } finally {
            setLoading(false);
        }
    };

    const statusColors = {
        pending: 'text-yellow-600 bg-yellow-50 border-yellow-100',
        confirmed: 'text-blue-600 bg-blue-50 border-blue-100',
        shipped: 'text-purple-600 bg-purple-50 border-purple-100',
        completed: 'text-green-600 bg-green-50 border-green-100',
        cancelled: 'text-red-600 bg-red-50 border-red-100',
    };

    if (loading) {
        return <div className="max-w-4xl mx-auto p-4 md:p-8 text-center text-slate-500">Loading your orders...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <Package size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No orders yet</h3>
                    <p className="text-slate-500 mb-6">You haven't placed any orders yet.</p>
                    <Link to="/products" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 font-medium">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
                            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Order Placed</p>
                                    <p className="text-slate-900 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Total</p>
                                    <p className="text-slate-900 font-medium">₹{order.totalAmount}</p>
                                </div>
                                <div className="flex-1 sm:text-right">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase border ${statusColors[order.status] || 'bg-slate-100 text-slate-600'}`}>
                                        {order.status}
                                    </div>
                                    <p className="text-xs text-slate-400 mt-1 font-mono">#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-slate-400">
                                                    <Package size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-slate-900">{item.name}</h4>
                                                    <p className="text-sm text-slate-500">Qty: {item.qty}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-slate-900">₹{item.lineTotal}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
