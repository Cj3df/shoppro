const Category = require('../models/categoryModel');
const Product = require('../models/productModel');
const { generateSlug, generateUniqueSlug } = require('../utils/slugGenerator');

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
const getAllCategories = async (req, res, next) => {
    try {
        const filter = {};

        // Filter by active status
        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === 'true';
        }

        // Filter by parent (for tree structure)
        if (req.query.parentCategory === 'null') {
            filter.parentCategory = null;
        } else if (req.query.parentCategory) {
            filter.parentCategory = req.query.parentCategory;
        }

        const categories = await Category.find(filter)
            .populate('parentCategory', 'name slug')
            .populate('productCount')
            .sort({ sortOrder: 1, name: 1 });

        res.json({
            success: true,
            data: { categories },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get category tree (nested structure)
 * @route   GET /api/categories/tree
 * @access  Public
 */
const getCategoryTree = async (req, res, next) => {
    try {
        // Get root categories (no parent)
        const rootCategories = await Category.find({
            parentCategory: null,
            isActive: true
        })
            .populate({
                path: 'subcategories',
                match: { isActive: true },
                options: { sort: { sortOrder: 1, name: 1 } },
            })
            .sort({ sortOrder: 1, name: 1 });

        res.json({
            success: true,
            data: { categories: rootCategories },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single category by ID or slug
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = async (req, res, next) => {
    try {
        let category;

        // Check if param is MongoDB ObjectId or slug
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            category = await Category.findById(req.params.id)
                .populate('parentCategory', 'name slug')
                .populate('productCount');
        } else {
            category = await Category.findOne({ slug: req.params.id })
                .populate('parentCategory', 'name slug')
                .populate('productCount');
        }

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.json({
            success: true,
            data: { category },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new category
 * @route   POST /api/categories
 * @access  Private/Admin & Staff
 */
const createCategory = async (req, res, next) => {
    try {
        const { name, description, parentCategory, image, sortOrder, isActive } = req.body;

        // Generate unique slug
        const slug = await generateUniqueSlug(name, async (s) => {
            const existing = await Category.findOne({ slug: s });
            return !!existing;
        });

        // Validate parent category if provided
        if (parentCategory) {
            const parent = await Category.findById(parentCategory);
            if (!parent) {
                return res.status(400).json({
                    success: false,
                    message: 'Parent category not found',
                });
            }
        }

        const category = await Category.create({
            name,
            slug,
            description,
            parentCategory: parentCategory || null,
            image,
            sortOrder: sortOrder || 0,
            isActive: isActive !== undefined ? isActive : true,
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: { category },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin & Staff
 */
const updateCategory = async (req, res, next) => {
    try {
        const { name, description, parentCategory, image, sortOrder, isActive } = req.body;

        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Update slug if name changed
        if (name && name !== category.name) {
            const newSlug = await generateUniqueSlug(name, async (s) => {
                const existing = await Category.findOne({ slug: s, _id: { $ne: category._id } });
                return !!existing;
            });
            category.slug = newSlug;
            category.name = name;
        }

        if (description !== undefined) category.description = description;
        if (parentCategory !== undefined) {
            // Prevent setting itself as parent
            if (parentCategory === req.params.id) {
                return res.status(400).json({
                    success: false,
                    message: 'Category cannot be its own parent',
                });
            }
            category.parentCategory = parentCategory || null;
        }
        if (image !== undefined) category.image = image;
        if (sortOrder !== undefined) category.sortOrder = sortOrder;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.json({
            success: true,
            message: 'Category updated successfully',
            data: { category },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        // Check if category has products
        const productCount = await Product.countDocuments({ category: req.params.id });
        if (productCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category with ${productCount} associated products. Please move or delete products first.`,
            });
        }

        // Check if category has subcategories
        const subCategoryCount = await Category.countDocuments({ parentCategory: req.params.id });
        if (subCategoryCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category with ${subCategoryCount} subcategories. Please move or delete subcategories first.`,
            });
        }

        await Category.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategories,
    getCategoryTree,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
