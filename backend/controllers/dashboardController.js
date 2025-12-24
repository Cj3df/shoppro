const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const User = require('../models/userModel');

// Get dashboard stats
const getStats = async (req, res, next) => {
    try {
        // Date ranges
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        // Total sales
        const totalSalesResult = await Order.aggregate([
            { $match: { status: { $in: ['completed', 'delivered'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const totalSales = totalSalesResult[0]?.total || 0;

        // Today's sales
        const todaySalesResult = await Order.aggregate([
            { $match: { createdAt: { $gte: today }, status: { $nin: ['cancelled'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
        ]);
        const todaySales = todaySalesResult[0]?.total || 0;
        const todayOrders = todaySalesResult[0]?.count || 0;

        // Total orders
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });

        // Inventory stats
        const products = await Product.find({ isActive: true });
        let totalInventoryValue = 0;
        let lowStockCount = 0;

        products.forEach((p) => {
            totalInventoryValue += p.currentStock * p.avgPurchasePrice;
            if (p.currentStock <= p.lowStockThreshold) lowStockCount++;
        });

        // Total customers
        const totalCustomers = await User.countDocuments({ role: 'customer' });

        // Monthly sales
        const monthlySalesResult = await Order.aggregate([
            { $match: { createdAt: { $gte: thisMonth }, status: { $nin: ['cancelled'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const monthlySales = monthlySalesResult[0]?.total || 0;

        res.json({
            success: true,
            data: {
                totalSales,
                todaySales,
                todayOrders,
                totalOrders,
                pendingOrders,
                totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
                lowStockCount,
                totalProducts: products.length,
                totalCustomers,
                monthlySales,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get top selling products
const getTopProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;

        const topProducts = await Order.aggregate([
            { $match: { status: { $in: ['completed', 'delivered'] } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalQty: { $sum: '$items.qty' }, totalRevenue: { $sum: '$items.lineTotal' } } },
            { $sort: { totalQty: -1 } },
            { $limit: limit },
        ]);

        res.json({ success: true, data: { products: topProducts } });
    } catch (error) {
        next(error);
    }
};

// Get sales chart data
const getSalesChart = async (req, res, next) => {
    try {
        const days = parseInt(req.query.days) || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        startDate.setHours(0, 0, 0, 0);

        const salesData = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $nin: ['cancelled'] } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, sales: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]);

        res.json({ success: true, data: { salesData } });
    } catch (error) {
        next(error);
    }
};

// Get recent orders
const getRecentOrders = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;

        const orders = await Order.find()
            .populate('customer', 'name email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('orderNumber status totalAmount createdAt customer');

        res.json({ success: true, data: { orders } });
    } catch (error) {
        next(error);
    }
};

module.exports = { getStats, getTopProducts, getSalesChart, getRecentOrders };
