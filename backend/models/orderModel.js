const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    variantId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    variantInfo: {
        type: Map,
        of: String, // e.g., { size: 'M', color: 'Red' }
    },
    qty: {
        type: Number,
        required: true,
        min: 1,
    },
    priceAtOrder: {
        type: Number,
        required: true,
    },
    lineTotal: {
        type: Number,
        required: true,
    },
});

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            unique: true,
            required: true,
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Customer is required'],
        },
        items: [orderItemSchema],
        // Pricing
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        taxAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        shippingAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        discountAmount: {
            type: Number,
            default: 0,
            min: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        // Status
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'],
            default: 'pending',
        },
        // Shipping
        shippingAddress: {
            fullName: String,
            phone: String,
            street: String,
            city: String,
            state: String,
            pincode: String,
            country: { type: String, default: 'India' },
        },
        // Payment
        paymentInfo: {
            method: {
                type: String,
                enum: ['cod', 'online', 'upi', 'card'],
                default: 'cod',
            },
            status: {
                type: String,
                enum: ['pending', 'paid', 'failed', 'refunded'],
                default: 'pending',
            },
            transactionId: String,
            paidAt: Date,
        },
        // Notes
        customerNote: {
            type: String,
            trim: true,
        },
        adminNote: {
            type: String,
            trim: true,
        },
        // Tracking
        cancelReason: String,
        cancelledAt: Date,
        shippedAt: Date,
        deliveredAt: Date,
        completedAt: Date,
        // Stock reservation tracking
        stockReserved: {
            type: Boolean,
            default: false,
        },
        stockDeducted: {
            type: Boolean,
            default: false,
        },
        // Audit
        processedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `ORD-${year}${month}${day}-${random}`;
    }
    next();
});

// Indexes
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
