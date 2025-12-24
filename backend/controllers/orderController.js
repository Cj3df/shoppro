const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const InventoryLog = require('../models/inventoryLogModel');

// Create new order
const createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddress, paymentInfo, customerNote } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items' });
        }

        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product || !product.isActive) {
                return res.status(400).json({ success: false, message: `Product unavailable: ${item.product}` });
            }

            let price = product.sellingPrice;
            let sku = product.sku;
            let variantInfo = null;
            let targetStock = product.currentStock;

            if (item.variant) {
                const variant = product.variants.id(item.variant);
                if (!variant || !variant.isActive) {
                    return res.status(400).json({ success: false, message: `Variant unavailable for ${product.name}` });
                }
                price = product.basePrice + (variant.additionalPrice || 0);
                sku = variant.sku || product.sku;
                variantInfo = variant.attributes;
                targetStock = variant.currentStock;
            }

            if (targetStock < item.qty) {
                return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}${item.variant ? ' (selected variant)' : ''}` });
            }

            const lineTotal = price * item.qty;
            subtotal += lineTotal;
            orderItems.push({
                product: product._id,
                variantId: item.variant || null,
                name: product.name,
                sku: sku,
                variantInfo: variantInfo,
                qty: item.qty,
                priceAtOrder: price,
                lineTotal,
            });
        }

        const taxAmount = Math.round(subtotal * 0.18 * 100) / 100;
        const shippingAmount = subtotal > 500 ? 0 : 50;
        const totalAmount = subtotal + taxAmount + shippingAmount;

        const order = await Order.create({
            customer: req.user._id,
            items: orderItems,
            subtotal,
            taxAmount,
            shippingAmount,
            totalAmount,
            shippingAddress,
            paymentInfo: paymentInfo || { method: 'cod', status: 'pending' },
            customerNote,
            status: 'pending',
        });

        // Reserve stock
        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            let prevQty;

            if (item.variantId) {
                const variant = product.variants.id(item.variantId);
                prevQty = variant.currentStock;
                variant.currentStock -= item.qty;
            } else {
                prevQty = product.currentStock;
                product.currentStock -= item.qty;
            }

            await product.save();

            await InventoryLog.create({
                product: item.product,
                variantId: item.variantId,
                type: 'order-reserve',
                qtyChange: -item.qty,
                prevQty,
                newQty: item.variantId ? product.variants.id(item.variantId).currentStock : product.currentStock,
                order: order._id,
                note: `Reserved for order ${order.orderNumber}`,
                createdBy: req.user._id,
            });
        }

        order.stockReserved = true;
        await order.save();

        res.status(201).json({ success: true, message: 'Order placed', data: { order } });
    } catch (error) {
        next(error);
    }
};

// Get all orders (admin/staff)
const getAllOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const filter = {};

        if (req.query.status) filter.status = req.query.status;

        const orders = await Order.find(filter)
            .populate('customer', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            data: { orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } },
        });
    } catch (error) {
        next(error);
    }
};

// Get customer's orders
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, data: { orders } });
    } catch (error) {
        next(error);
    }
};

// Get single order
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('customer', 'name email');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (req.user.role === 'customer' && order.customer._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, data: { order } });
    } catch (error) {
        next(error);
    }
};

// Update order status
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status, adminNote, cancelReason } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (status === 'cancelled' && order.stockReserved) {
            for (const item of order.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    const prevQty = product.currentStock;
                    product.currentStock += item.qty;
                    await product.save();
                    await InventoryLog.create({
                        product: item.product,
                        type: 'order-cancel',
                        qtyChange: item.qty,
                        prevQty,
                        newQty: product.currentStock,
                        order: order._id,
                        note: `Order ${order.orderNumber} cancelled`,
                        createdBy: req.user._id,
                    });
                }
            }
            order.stockReserved = false;
            order.cancelReason = cancelReason;
            order.cancelledAt = new Date();
        }

        if (status === 'shipped') order.shippedAt = new Date();
        if (status === 'delivered') order.deliveredAt = new Date();
        if (status === 'completed') order.completedAt = new Date();

        order.status = status;
        if (adminNote) order.adminNote = adminNote;
        order.processedBy = req.user._id;
        await order.save();

        res.json({ success: true, message: `Status updated to ${status}`, data: { order } });
    } catch (error) {
        next(error);
    }
};

// Cancel order (customer)
const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        if (order.customer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        if (order.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Cannot cancel this order' });
        }

        if (order.stockReserved) {
            for (const item of order.items) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.currentStock += item.qty;
                    await product.save();
                }
            }
        }

        order.status = 'cancelled';
        order.cancelReason = req.body.reason || 'Cancelled by customer';
        order.cancelledAt = new Date();
        await order.save();

        res.json({ success: true, message: 'Order cancelled', data: { order } });
    } catch (error) {
        next(error);
    }
};

module.exports = { createOrder, getAllOrders, getMyOrders, getOrderById, updateOrderStatus, cancelOrder };
