const Product = require('../models/productModel');
const InventoryLog = require('../models/inventoryLogModel');
const { calculateWeightedAvgPrice } = require('../utils/weightedAvgPrice');

/**
 * @desc    Stock-in: Add inventory to product
 * @route   POST /api/inventory/stock-in
 * @access  Private/Admin & Staff
 */
const stockIn = async (req, res, next) => {
    try {
        const { productId, variantId, quantity, purchasePrice, batchNumber, supplier, note } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const prevQty = product.currentStock;
        const prevAvgPrice = product.avgPurchasePrice;

        // Calculate new weighted average purchase price
        const newAvgPrice = calculateWeightedAvgPrice(
            prevQty,
            prevAvgPrice,
            quantity,
            purchasePrice
        );

        // Update product stock and avg price
        product.currentStock = prevQty + quantity;
        product.avgPurchasePrice = newAvgPrice;
        await product.save();

        // Create inventory log
        const inventoryLog = await InventoryLog.create({
            product: productId,
            variantId: variantId || null,
            type: 'stock-in',
            qtyChange: quantity,
            prevQty,
            newQty: product.currentStock,
            purchasePrice,
            avgPurchaseBefore: prevAvgPrice,
            avgPurchaseAfter: newAvgPrice,
            batchNumber,
            supplier,
            note,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: 'Stock added successfully',
            data: {
                product: {
                    _id: product._id,
                    name: product.name,
                    currentStock: product.currentStock,
                    avgPurchasePrice: product.avgPurchasePrice,
                },
                inventoryLog,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Stock-out: Remove inventory from product
 * @route   POST /api/inventory/stock-out
 * @access  Private/Admin & Staff
 */
const stockOut = async (req, res, next) => {
    try {
        const { productId, variantId, quantity, note } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Check if enough stock
        if (product.currentStock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Available: ${product.currentStock}, Requested: ${quantity}`,
            });
        }

        const prevQty = product.currentStock;

        // Update product stock
        product.currentStock = prevQty - quantity;
        await product.save();

        // Create inventory log
        const inventoryLog = await InventoryLog.create({
            product: productId,
            variantId: variantId || null,
            type: 'stock-out',
            qtyChange: -quantity,
            prevQty,
            newQty: product.currentStock,
            note,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: 'Stock removed successfully',
            data: {
                product: {
                    _id: product._id,
                    name: product.name,
                    currentStock: product.currentStock,
                },
                inventoryLog,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Adjust inventory (for corrections)
 * @route   POST /api/inventory/adjust
 * @access  Private/Admin
 */
const adjustStock = async (req, res, next) => {
    try {
        const { productId, newQuantity, note } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const prevQty = product.currentStock;
        const qtyChange = newQuantity - prevQty;

        // Update product stock
        product.currentStock = newQuantity;
        await product.save();

        // Create inventory log
        const inventoryLog = await InventoryLog.create({
            product: productId,
            type: 'adjustment',
            qtyChange,
            prevQty,
            newQty: newQuantity,
            note: note || 'Manual stock adjustment',
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: 'Stock adjusted successfully',
            data: {
                product: {
                    _id: product._id,
                    name: product.name,
                    currentStock: product.currentStock,
                },
                inventoryLog,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get inventory logs for a product
 * @route   GET /api/inventory/logs/:productId
 * @access  Private/Admin & Staff
 */
const getProductLogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const logs = await InventoryLog.find({ product: req.params.productId })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await InventoryLog.countDocuments({ product: req.params.productId });

        res.json({
            success: true,
            data: {
                logs,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all inventory logs (with filters)
 * @route   GET /api/inventory/logs
 * @access  Private/Admin & Staff
 */
const getAllLogs = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const filter = {};

        if (req.query.type) {
            filter.type = req.query.type;
        }

        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate) {
                filter.createdAt.$gte = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                filter.createdAt.$lte = new Date(req.query.endDate);
            }
        }

        const logs = await InventoryLog.find(filter)
            .populate('product', 'name sku')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await InventoryLog.countDocuments(filter);

        res.json({
            success: true,
            data: {
                logs,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get inventory summary
 * @route   GET /api/inventory/summary
 * @access  Private/Admin & Staff
 */
const getInventorySummary = async (req, res, next) => {
    try {
        // Total inventory value
        const products = await Product.find({ isActive: true });

        let totalInventoryValue = 0;
        let totalProducts = products.length;
        let lowStockCount = 0;
        let outOfStockCount = 0;

        products.forEach((product) => {
            totalInventoryValue += product.currentStock * product.avgPurchasePrice;

            if (product.currentStock === 0) {
                outOfStockCount++;
            } else if (product.currentStock <= product.lowStockThreshold) {
                lowStockCount++;
            }
        });

        res.json({
            success: true,
            data: {
                totalInventoryValue: Math.round(totalInventoryValue * 100) / 100,
                totalProducts,
                lowStockCount,
                outOfStockCount,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    stockIn,
    stockOut,
    adjustStock,
    getProductLogs,
    getAllLogs,
    getInventorySummary,
};
