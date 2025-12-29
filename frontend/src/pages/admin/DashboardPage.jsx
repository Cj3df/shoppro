import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../config/apiClient';
import {
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    Package,
    DollarSign,
    AlertTriangle,
    ArrowRight,
    BarChart3,
    Users,
    Clock
} from 'lucide-react';
import { mockDashboardStats, mockOrders, mockLowStockProducts } from '../../data/mockData';

const DashboardPage = () => {
    const [stats, setStats] = useState(mockDashboardStats);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await apiClient.get('/dashboard/stats');
            if (response.data && response.data.success) {
                // Merge API data with mock data as defaults
                setStats({ ...mockDashboardStats, ...response.data.data });
            }
        } catch (error) {
            console.log('Using mock dashboard data (API unavailable)');
            // Keep using the already-set mock data
        }
    };

    const kpiCards = [
        {
            title: 'Total Sales',
            value: `₹${(stats.totalSales || 0).toLocaleString()}`,
            change: '+12.5%',
            changeType: 'positive',
            icon: DollarSign,
            bgColor: 'bg-gradient-to-br from-emerald-500 to-teal-600',
            iconBg: 'bg-emerald-400/30'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders || 0,
            change: '+8.2%',
            changeType: 'positive',
            icon: ShoppingCart,
            bgColor: 'bg-gradient-to-br from-sky-500 to-blue-600',
            iconBg: 'bg-sky-400/30'
        },
        {
            title: 'Inventory Value',
            value: `₹${(stats.inventoryValue || 0).toLocaleString()}`,
            change: '-2.1%',
            changeType: 'negative',
            icon: Package,
            bgColor: 'bg-gradient-to-br from-violet-500 to-purple-600',
            iconBg: 'bg-violet-400/30'
        },
        {
            title: 'Pending Orders',
            value: stats.pendingOrders || 0,
            change: '+3',
            changeType: 'neutral',
            icon: Clock,
            bgColor: 'bg-gradient-to-br from-amber-500 to-orange-600',
            iconBg: 'bg-amber-400/30'
        }
    ];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            confirmed: 'bg-blue-100 text-blue-700',
            shipped: 'bg-purple-100 text-purple-700',
            completed: 'bg-emerald-100 text-emerald-700',
            cancelled: 'bg-red-100 text-red-700'
        };
        return styles[status] || 'bg-slate-100 text-slate-700';
    };

    // Simple bar chart simulation using divs
    const maxSales = Math.max(...(stats.salesByDay?.map(d => d.sales) || [0]));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex gap-2">
                    <select className="px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm focus:ring-2 focus:ring-emerald-500">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>This month</option>
                        <option>This year</option>
                    </select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, idx) => (
                    <div
                        key={idx}
                        className={`${card.bgColor} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}
                    >
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>

                        <div className="relative z-10">
                            <div className={`inline-flex items-center justify-center w-12 h-12 ${card.iconBg} rounded-xl mb-4`}>
                                <card.icon size={24} />
                            </div>
                            <p className="text-sm font-medium text-white/80 mb-1">{card.title}</p>
                            <p className="text-3xl font-bold">{card.value}</p>
                            <div className="flex items-center gap-1 mt-2">
                                {card.changeType === 'positive' ? (
                                    <TrendingUp size={14} className="text-emerald-200" />
                                ) : card.changeType === 'negative' ? (
                                    <TrendingDown size={14} className="text-red-200" />
                                ) : null}
                                <span className="text-sm text-white/70">{card.change} from last period</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts & Tables Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                <BarChart3 size={20} className="text-emerald-600" />
                                Sales Overview
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Daily sales for the past week</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-slate-900">₹{stats.todaySales?.toLocaleString()}</p>
                            <p className="text-sm text-emerald-600">Today's sales</p>
                        </div>
                    </div>

                    {/* Simple Bar Chart */}
                    <div className="flex items-end justify-between gap-2 h-48 mt-4">
                        {stats.salesByDay?.map((day, idx) => {
                            const height = (day.sales / maxSales) * 100;
                            const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                            const isToday = idx === stats.salesByDay.length - 1;

                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex flex-col items-center">
                                        <span className="text-xs text-slate-500 mb-1">₹{(day.sales / 1000).toFixed(1)}k</span>
                                        <div
                                            className={`w-full max-w-12 rounded-t-lg transition-all duration-500 ${isToday
                                                ? 'bg-gradient-to-t from-emerald-500 to-teal-400'
                                                : 'bg-gradient-to-t from-slate-200 to-slate-100'
                                                }`}
                                            style={{ height: `${height}%`, minHeight: '20px' }}
                                        ></div>
                                    </div>
                                    <span className={`text-xs font-medium ${isToday ? 'text-emerald-600' : 'text-slate-500'}`}>
                                        {dayName}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-slate-900">Top Products</h3>
                        <Link to="/admin/products" className="text-sm text-emerald-600 hover:text-emerald-700">
                            View all
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {stats.topProducts?.slice(0, 5).map((product, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900 truncate">{product.name}</p>
                                    <p className="text-xs text-slate-500">{product.sales} sales</p>
                                </div>
                                <p className="text-sm font-semibold text-slate-900">₹{product.revenue?.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Orders & Low Stock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <ShoppingCart size={20} className="text-sky-600" />
                            Recent Orders
                        </h3>
                        <Link
                            to="/admin/orders"
                            className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                        >
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {mockOrders.slice(0, 4).map((order) => (
                            <div key={order._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-500">
                                        {order.customer.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{order.orderNumber}</p>
                                        <p className="text-xs text-slate-500">{order.customer.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-900">₹{order.total}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(order.status)}`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-amber-500" />
                            Low Stock Alert
                        </h3>
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                            {mockLowStockProducts.length} items
                        </span>
                    </div>
                    <div className="space-y-4">
                        {mockLowStockProducts.map((product) => (
                            <div key={product._id} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden border border-slate-200">
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{product.name}</p>
                                        <p className="text-xs text-slate-500">SKU: {product.sku}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-amber-600">{product.currentStock}</p>
                                    <p className="text-xs text-slate-500">units left</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link
                        to="/admin/inventory"
                        className="mt-4 block text-center py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
                    >
                        Manage Inventory
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link
                        to="/admin/products/new"
                        className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition"
                    >
                        <Package size={20} />
                        <span className="text-sm font-medium">Add Product</span>
                    </Link>
                    <Link
                        to="/admin/orders"
                        className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition"
                    >
                        <ShoppingCart size={20} />
                        <span className="text-sm font-medium">View Orders</span>
                    </Link>
                    <Link
                        to="/admin/inventory"
                        className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition"
                    >
                        <BarChart3 size={20} />
                        <span className="text-sm font-medium">Stock In/Out</span>
                    </Link>
                    <Link
                        to="/admin/users"
                        className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition"
                    >
                        <Users size={20} />
                        <span className="text-sm font-medium">Customers</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
