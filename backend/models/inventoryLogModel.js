const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: [true, 'Product reference is required'],
        },
        variantId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null, // null if product has no variants
        },
        type: {
            type: String,
            enum: ['stock-in', 'stock-out', 'adjustment', 'return', 'order-reserve', 'order-complete', 'order-cancel'],
            required: [true, 'Transaction type is required'],
        },
        qtyChange: {
            type: Number,
            required: [true, 'Quantity change is required'],
            // Positive for stock-in, negative for stock-out
        },
        prevQty: {
            type: Number,
            required: true,
            min: 0,
        },
        newQty: {
            type: Number,
            required: true,
            min: 0,
        },
        // Purchase price info (for stock-in)
        purchasePrice: {
            type: Number,
            default: null,
        },
        avgPurchaseBefore: {
            type: Number,
            default: null,
        },
        avgPurchaseAfter: {
            type: Number,
            default: null,
        },
        // Reference to related order (if applicable)
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            default: null,
        },
        // Additional details
        batchNumber: {
            type: String,
            trim: true,
        },
        supplier: {
            type: String,
            trim: true,
        },
        note: {
            type: String,
            trim: true,
            maxlength: [500, 'Note cannot exceed 500 characters'],
        },
        // Audit trail
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Created by user is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient querying
inventoryLogSchema.index({ product: 1, createdAt: -1 });
inventoryLogSchema.index({ type: 1, createdAt: -1 });
inventoryLogSchema.index({ createdBy: 1, createdAt: -1 });
inventoryLogSchema.index({ order: 1 });

const InventoryLog = mongoose.model('InventoryLog', inventoryLogSchema);

module.exports = InventoryLog;
