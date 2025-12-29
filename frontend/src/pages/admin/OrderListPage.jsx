import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import { Eye, Filter, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');

    const fetchOrders = React.useCallback(async () => {
        try {
            setLoading(true);
            const query = statusFilter ? `?status=${statusFilter}` : '';
            const response = await apiClient.get(`/orders${query}`);
            setOrders(response.data.orders || response.data.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium"><Clock size={12} /> Pending</span>;
            case 'confirmed': return <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"><CheckCircle size={12} /> Confirmed</span>;
            case 'shipped': return <span className="flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium"><Truck size={12} /> Shipped</span>;
            case 'completed': return <span className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"><CheckCircle size={12} /> Completed</span>;
            case 'cancelled': return <span className="flex items-center gap-1 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium"><XCircle size={12} /> Cancelled</span>;
            default: return <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-full text-xs font-medium">{status}</span>;
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
                    <p className="text-slate-500 text-sm">Manage customer orders</p>
                </div>

                <div className="flex items-center gap-2">
                    <Filter size={18} className="text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-600 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-semibold border-b">Order ID</th>
                                <th className="px-6 py-4 font-semibold border-b">Date</th>
                                <th className="px-6 py-4 font-semibold border-b">Customer</th>
                                <th className="px-6 py-4 font-semibold border-b">Amount</th>
                                <th className="px-6 py-4 font-semibold border-b">Payment</th>
                                <th className="px-6 py-4 font-semibold border-b text-center">Status</th>
                                <th className="px-6 py-4 font-semibold border-b text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">Loading orders...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-8 text-center text-slate-500">No orders found.</td></tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 font-mono text-xs text-slate-600">
                                            {order._id.substring(order._id.length - 8).toUpperCase()}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-slate-600">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-3 text-sm font-medium text-slate-900">
                                            {order.customer?.name || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-3 text-sm font-medium text-slate-900">
                                            ₹{order.totalAmount}
                                        </td>
                                        <td className="px-6 py-3 text-sm text-slate-500 capitalize">
                                            {order.paymentInfo?.method || 'N/A'}
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Link
                                                to={`/admin/orders/${order._id}`}
                                                className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                                            >
                                                View <Eye size={14} />
                                            </Link>
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

export default OrderListPage;
