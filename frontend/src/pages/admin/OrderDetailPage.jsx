import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import toast from 'react-hot-toast';
import { ArrowLeft, Package, User, CreditCard, Calendar, Truck } from 'lucide-react';

const OrderDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = React.useCallback(async () => {
        try {
            const response = await apiClient.get(`/orders/${id}`);
            const fetchedOrder = response.data.data.order;
            setOrder(fetchedOrder);
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const updateStatus = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to mark this order as ${newStatus}?`)) return;

        try {
            await apiClient.put(`/orders/${id}/status`, { status: newStatus });
            toast.success(`Order updated to ${newStatus}`);
            fetchOrder(); // Refresh to see changes (like timestamps)
        } catch (error) {
            toast.error('Failed to update status');
            console.error(error);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading order details...</div>;
    if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>;

    const StatusBadge = ({ status }) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            completed: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colors[status] || 'bg-slate-100 text-slate-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <button
                onClick={() => navigate('/admin/orders')}
                className="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition"
            >
                <ArrowLeft size={16} className="mr-1" /> Back to Orders
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        Order #{order._id.substring(order._id.length - 6).toUpperCase()}
                        <StatusBadge status={order.status} />
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                        <Calendar size={14} /> Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>

                {/* Status Actions */}
                <div className="flex gap-2">
                    {order.status === 'pending' && (
                        <>
                            <button onClick={() => updateStatus('confirmed')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium">Confirm Order</button>
                            <button onClick={() => updateStatus('cancelled')} className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 font-medium">Cancel</button>
                        </>
                    )}
                    {order.status === 'confirmed' && (
                        <button onClick={() => updateStatus('shipped')} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium">Mark as Shipped</button>
                    )}
                    {order.status === 'shipped' && (
                        <button onClick={() => updateStatus('completed')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium">Complete Order</button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Checkpoint: Customer Info */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><User size={18} className="text-slate-400" /> Customer</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                        <p className="font-medium text-slate-900">{order.customer?.name}</p>
                        <p>{order.customer?.email}</p>
                        <hr className="my-2 border-slate-100" />
                        <h4 className="font-medium text-slate-800 mb-1">Shipping Address</h4>
                        <p>{order.shippingAddress?.fullName}</p>
                        <p>{order.shippingAddress?.street}</p>
                        <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                        <p className="mt-1">{order.customerNote}</p>
                    </div>
                </div>

                {/* Checkpoint: Payment Info */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><CreditCard size={18} className="text-slate-400" /> Payment</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex justify-between">
                            <span>Method</span>
                            <span className="font-medium uppercase">{order.paymentInfo?.method}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Status</span>
                            <span className={`font-medium capitalize ${order.paymentInfo?.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                {order.paymentInfo?.status}
                            </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-100 mt-2">
                            <span>Subtotal</span>
                            <span>₹{order.subtotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>₹{order.taxAmount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹{order.shippingAmount}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-slate-200 mt-2 font-bold text-slate-900 text-base">
                            <span>Total</span>
                            <span>₹{order.totalAmount}</span>
                        </div>
                    </div>
                </div>

                {/* Checkpoint: Order Timeline */}
                <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2"><Truck size={18} className="text-slate-400" /> Timeline</h3>
                    <div className="space-y-4 relative pl-4 border-l-2 border-slate-100 text-sm">
                        <div className="relative">
                            <div className="absolute -left-[21px] top-1 w-3 h-3 bg-slate-300 rounded-full"></div>
                            <p className="font-medium text-slate-900">Order Placed</p>
                            <p className="text-slate-500 text-xs">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        {order.shippedAt && (
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                                <p className="font-medium text-purple-700">Shipped</p>
                                <p className="text-slate-500 text-xs">{new Date(order.shippedAt).toLocaleString()}</p>
                            </div>
                        )}
                        {order.deliveredAt && (
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-green-500 rounded-full"></div>
                                <p className="font-medium text-green-700">Delivered</p>
                                <p className="text-slate-500 text-xs">{new Date(order.deliveredAt).toLocaleString()}</p>
                            </div>
                        )}
                        {order.cancelledAt && (
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-3 h-3 bg-red-500 rounded-full"></div>
                                <p className="font-medium text-red-700">Cancelled</p>
                                <p className="text-slate-500 text-xs">{new Date(order.cancelledAt).toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mt-8">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 font-semibold text-slate-700 flex items-center gap-2">
                    <Package size={18} className="text-slate-400" /> Order Items
                </div>
                <div className="divide-y divide-slate-100">
                    {order.items.map((item, index) => (
                        <div key={index} className="px-6 py-4 flex justify-between items-center">
                            <div>
                                <h4 className="font-medium text-slate-900">{item.name}</h4>
                                <p className="text-xs text-slate-500">SKU: {item.sku}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-slate-900">{item.qty} x ₹{item.priceAtOrder}</p>
                                <p className="text-sm font-bold text-slate-900">₹{item.lineTotal}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
