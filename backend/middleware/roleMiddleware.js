/**
 * Role-based access control middleware
 * @param {...string} allowedRoles - Roles that are allowed to access the route
 * @returns {function} Express middleware function
 */
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, please login',
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}`,
            });
        }

        next();
    };
};

/**
 * Check if user is admin
 */
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, please login',
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.',
        });
    }

    next();
};

/**
 * Check if user is admin or staff
 */
const isAdminOrStaff = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, please login',
        });
    }

    if (!['admin', 'staff'].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin or Staff only.',
        });
    }

    next();
};

module.exports = { authorize, isAdmin, isAdminOrStaff };
