const mongoose = require('mongoose');
const Product = require('../models/productModel');
const Category = require('../models/categoryModel');
const { generateSlug, generateUniqueSlug } = require('../utils/slugGenerator');
const { generateSKU, generateVariantSKU } = require('../utils/skuGenerator');

/**
 * @desc    Get all products with filters & pagination
 * @route   GET /api/products
 * @access  Public
 */
const getAllProducts = async (req, res, next) => {
    try {
        console.log('DEBUG: getAllProducts query:', req.query);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};

        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === 'true';

        } else {

            filter.isActive = true; // Default to active products only
        }

        if (req.query.category) {
            // Check if it's a valid ObjectId (direct ID match)
            if (mongoose.Types.ObjectId.isValid(req.query.category)) {
                filter.category = req.query.category;
            } else {
                // Assume it's a slug and look up the category
                const categoryDoc = await Category.findOne({ slug: req.query.category });
                if (categoryDoc) {
                    filter.category = categoryDoc._id;
                } else {
                    // Category not found by slug, ensure query returns nothing
                    // using a generated random ID that won't match anything
                    filter.category = new mongoose.Types.ObjectId();
                }
            }
        }

        if (req.query.isFeatured === 'true') {
            filter.isFeatured = true;
        }

        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }

        if (req.query.minPrice || req.query.maxPrice) {
            filter.sellingPrice = {};
            if (req.query.minPrice) filter.sellingPrice.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) filter.sellingPrice.$lte = parseFloat(req.query.maxPrice);
        }

        // Build sort
        let sort = { createdAt: -1 };
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'price-asc':
                    sort = { sellingPrice: 1 };
                    break;
                case 'price-desc':
                    sort = { sellingPrice: -1 };
                    break;
                case 'name-asc':
                    sort = { name: 1 };
                    break;
                case 'name-desc':
                    sort = { name: -1 };
                    break;
                case 'newest':
                    sort = { createdAt: -1 };
                    break;
            }
        }

        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .select('-variants')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            data: {
                products,
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
 * @desc    Get single product by ID or slug
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
    try {
        let product;

        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            product = await Product.findById(req.params.id)
                .populate('category', 'name slug');
        } else {
            product = await Product.findOne({ slug: req.params.id })
                .populate('category', 'name slug');
        }

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.json({
            success: true,
            data: { product },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new product
 * @route   POST /api/products
 * @access  Private/Admin & Staff
 */
const createProduct = async (req, res, next) => {
    try {
        const {
            name,
            description,
            shortDescription,
            category,
            basePrice,
            sellingPrice,
            lowStockThreshold,
            attributes,
            variants,
            hasVariants,
            images,
            tags,
            metaTitle,
            metaDescription,
            isFeatured,
            isActive,
        } = req.body;

        // Validate category
        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            return res.status(400).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Generate unique slug
        const slug = await generateUniqueSlug(name, async (s) => {
            const existing = await Product.findOne({ slug: s });
            return !!existing;
        });

        // Generate SKU
        const categoryPrefix = categoryExists.name.slice(0, 3).toUpperCase();
        const sku = generateSKU(categoryPrefix, name);

        // Process variants if hasVariants is true
        let processedVariants = [];
        if (hasVariants && variants && variants.length > 0) {
            processedVariants = variants.map((variant) => ({
                ...variant,
                sku: generateVariantSKU(sku, variant.attributes || {}),
            }));
        }

        const product = await Product.create({
            name,
            slug,
            sku,
            description,
            shortDescription,
            category,
            basePrice,
            sellingPrice,
            lowStockThreshold: lowStockThreshold || 10,
            attributes,
            variants: processedVariants,
            hasVariants: hasVariants || false,
            images: images || [],
            tags: tags || [],
            metaTitle,
            metaDescription,
            isFeatured: isFeatured || false,
            isActive: isActive !== undefined ? isActive : true,
            createdBy: req.user._id,
            updatedBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: { product },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/:id
 * @access  Private/Admin & Staff
 */
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        const {
            name,
            description,
            shortDescription,
            category,
            basePrice,
            sellingPrice,
            lowStockThreshold,
            attributes,
            variants,
            hasVariants,
            images,
            tags,
            metaTitle,
            metaDescription,
            isFeatured,
            isActive,
        } = req.body;

        // Update slug if name changed
        if (name && name !== product.name) {
            const newSlug = await generateUniqueSlug(name, async (s) => {
                const existing = await Product.findOne({ slug: s, _id: { $ne: product._id } });
                return !!existing;
            });
            product.slug = newSlug;
            product.name = name;
        }

        // Validate category if changed
        if (category && category !== product.category.toString()) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                return res.status(400).json({
                    success: false,
                    message: 'Category not found',
                });
            }
            product.category = category;
        }

        if (description !== undefined) product.description = description;
        if (shortDescription !== undefined) product.shortDescription = shortDescription;
        if (basePrice !== undefined) product.basePrice = basePrice;
        if (sellingPrice !== undefined) product.sellingPrice = sellingPrice;
        if (lowStockThreshold !== undefined) product.lowStockThreshold = lowStockThreshold;
        if (attributes !== undefined) product.attributes = attributes;
        if (hasVariants !== undefined) product.hasVariants = hasVariants;
        if (variants !== undefined) product.variants = variants;
        if (images !== undefined) product.images = images;
        if (tags !== undefined) product.tags = tags;
        if (metaTitle !== undefined) product.metaTitle = metaTitle;
        if (metaDescription !== undefined) product.metaDescription = metaDescription;
        if (isFeatured !== undefined) product.isFeatured = isFeatured;
        if (isActive !== undefined) product.isActive = isActive;

        product.updatedBy = req.user._id;

        await product.save();

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: { product },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete product (soft delete)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        // Soft delete - set isActive to false
        product.isActive = false;
        product.updatedBy = req.user._id;
        await product.save();

        res.json({
            success: true,
            message: 'Product archived successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 8;

        const products = await Product.find({
            isActive: true,
            isFeatured: true
        })
            .populate('category', 'name slug')
            .select('-variants')
            .limit(limit);

        res.json({
            success: true,
            data: { products },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get low stock products
 * @route   GET /api/products/low-stock
 * @access  Private/Admin & Staff
 */
const getLowStockProducts = async (req, res, next) => {
    try {
        const products = await Product.find({
            isActive: true,
            $expr: { $lte: ['$currentStock', '$lowStockThreshold'] },
        })
            .populate('category', 'name')
            .select('name sku currentStock lowStockThreshold')
            .sort({ currentStock: 1 });

        res.json({
            success: true,
            data: { products, count: products.length },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getLowStockProducts,
};
