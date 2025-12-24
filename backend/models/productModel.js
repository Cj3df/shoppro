const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    sku: {
        type: String,
        unique: true,
        sparse: true,
    },
    attributes: {
        type: Map,
        of: String, // e.g., { size: 'M', color: 'Red' }
    },
    additionalPrice: {
        type: Number,
        default: 0,
    },
    currentStock: {
        type: Number,
        default: 0,
        min: 0,
    },
    images: [String],
    isActive: {
        type: Boolean,
        default: true,
    },
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Product name cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        sku: {
            type: String,
            unique: true,
            required: [true, 'SKU is required'],
        },
        description: {
            type: String,
            trim: true,
        },
        shortDescription: {
            type: String,
            trim: true,
            maxlength: [300, 'Short description cannot exceed 300 characters'],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        basePrice: {
            type: Number,
            required: [true, 'Base price is required'],
            min: [0, 'Base price cannot be negative'],
        },
        sellingPrice: {
            type: Number,
            required: [true, 'Selling price is required'],
            min: [0, 'Selling price cannot be negative'],
        },
        // Inventory fields (for products without variants)
        currentStock: {
            type: Number,
            default: 0,
            min: 0,
        },
        avgPurchasePrice: {
            type: Number,
            default: 0,
            min: 0,
        },
        lowStockThreshold: {
            type: Number,
            default: 10,
            min: 0,
        },
        // Attributes for filtering
        attributes: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
        },
        // Variants array (for products with size/color variations)
        variants: [variantSchema],
        hasVariants: {
            type: Boolean,
            default: false,
        },
        // Images
        images: [
            {
                url: String,
                alt: String,
                isPrimary: { type: Boolean, default: false },
            },
        ],
        // SEO
        metaTitle: String,
        metaDescription: String,
        tags: [String],
        // Status
        isActive: {
            type: Boolean,
            default: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        ratings: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        // Tracking
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Virtual for inventory value
productSchema.virtual('inventoryValue').get(function () {
    if (this.hasVariants && this.variants.length > 0) {
        return this.variants.reduce((total, variant) => {
            return total + variant.currentStock * this.avgPurchasePrice;
        }, 0);
    }
    return this.currentStock * this.avgPurchasePrice;
});

// Virtual for total stock (including variants)
productSchema.virtual('totalStock').get(function () {
    if (this.hasVariants && this.variants.length > 0) {
        return this.variants.reduce((total, variant) => total + variant.currentStock, 0);
    }
    return this.currentStock;
});

// Virtual for low stock status
productSchema.virtual('isLowStock').get(function () {
    const totalStock = this.hasVariants
        ? this.variants.reduce((total, variant) => total + variant.currentStock, 0)
        : this.currentStock;
    return totalStock <= this.lowStockThreshold;
});

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
