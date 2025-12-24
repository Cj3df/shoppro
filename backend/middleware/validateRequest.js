const { validationResult, body, param, query } = require('express-validator');

/**
 * Middleware to check validation results
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }
    next();
};

// ============ Auth Validations ============
const signupValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ max: 100 })
        .withMessage('Name cannot exceed 100 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    validate,
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
];

// ============ Product Validations ============
const productValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ max: 200 })
        .withMessage('Product name cannot exceed 200 characters'),
    body('category')
        .notEmpty()
        .withMessage('Category is required')
        .isMongoId()
        .withMessage('Invalid category ID'),
    body('basePrice')
        .notEmpty()
        .withMessage('Base price is required')
        .isFloat({ min: 0 })
        .withMessage('Base price must be a positive number'),
    body('sellingPrice')
        .notEmpty()
        .withMessage('Selling price is required')
        .isFloat({ min: 0 })
        .withMessage('Selling price must be a positive number'),
    validate,
];

// ============ Category Validations ============
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ max: 100 })
        .withMessage('Category name cannot exceed 100 characters'),
    validate,
];

// ============ Inventory Validations ============
const stockInValidation = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID'),
    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),
    body('purchasePrice')
        .notEmpty()
        .withMessage('Purchase price is required')
        .isFloat({ min: 0 })
        .withMessage('Purchase price must be a positive number'),
    validate,
];

const stockOutValidation = [
    body('productId')
        .notEmpty()
        .withMessage('Product ID is required')
        .isMongoId()
        .withMessage('Invalid product ID'),
    body('quantity')
        .notEmpty()
        .withMessage('Quantity is required')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),
    validate,
];

// ============ Order Validations ============
const createOrderValidation = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('Order must have at least one item'),
    body('items.*.product')
        .isMongoId()
        .withMessage('Invalid product ID in items'),
    body('items.*.qty')
        .isInt({ min: 1 })
        .withMessage('Quantity must be a positive integer'),
    body('shippingAddress.fullName')
        .trim()
        .notEmpty()
        .withMessage('Full name is required in shipping address'),
    body('shippingAddress.phone')
        .trim()
        .notEmpty()
        .withMessage('Phone is required in shipping address'),
    body('shippingAddress.street')
        .trim()
        .notEmpty()
        .withMessage('Street address is required'),
    body('shippingAddress.city')
        .trim()
        .notEmpty()
        .withMessage('City is required'),
    body('shippingAddress.state')
        .trim()
        .notEmpty()
        .withMessage('State is required'),
    body('shippingAddress.pincode')
        .trim()
        .notEmpty()
        .withMessage('Pincode is required'),
    validate,
];

const updateOrderStatusValidation = [
    param('id').isMongoId().withMessage('Invalid order ID'),
    body('status')
        .notEmpty()
        .withMessage('Status is required')
        .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'])
        .withMessage('Invalid status value'),
    validate,
];

// ============ Common Validations ============
const mongoIdValidation = [
    param('id').isMongoId().withMessage('Invalid ID format'),
    validate,
];

const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    validate,
];

module.exports = {
    validate,
    signupValidation,
    loginValidation,
    productValidation,
    categoryValidation,
    stockInValidation,
    stockOutValidation,
    createOrderValidation,
    updateOrderStatusValidation,
    mongoIdValidation,
    paginationValidation,
};
