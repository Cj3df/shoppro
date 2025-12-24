const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user authentication
 * @param {string} userId - The user's MongoDB ObjectId
 * @param {string} role - The user's role (admin, staff, customer)
 * @returns {string} JWT token
 */
const generateToken = (userId, role) => {
    return jwt.sign(
        { id: userId, role: role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
