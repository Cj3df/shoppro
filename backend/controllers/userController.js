const User = require('../models/userModel');

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter
        const filter = {};
        if (req.query.role) {
            filter.role = req.query.role;
        }
        if (req.query.isActive !== undefined) {
            filter.isActive = req.query.isActive === 'true';
        }
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } },
            ];
        }

        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            data: {
                users,
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
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new user (admin only)
 * @route   POST /api/users
 * @access  Private/Admin
 */
const createUser = async (req, res, next) => {
    try {
        const { name, email, password, role, phone, isActive } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'staff',
            phone,
            isActive: isActive !== undefined ? isActive : true,
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res, next) => {
    try {
        const { name, email, role, phone, isActive } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Prevent changing own role/status (as admin)
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot modify your own account through this endpoint',
            });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (phone) user.phone = phone;
        if (isActive !== undefined) user.isActive = isActive;

        await user.save();

        res.json({
            success: true,
            message: 'User updated successfully',
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isActive: user.isActive,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete user (soft delete - deactivate)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Prevent deleting yourself
        if (req.user._id.toString() === req.params.id) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account',
            });
        }

        // Soft delete
        user.isActive = false;
        await user.save();

        res.json({
            success: true,
            message: 'User deactivated successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
};
