const multer = require('multer');
const path = require('path');

// Configure storage for local uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filter for images only
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
};

// Upload middleware for product images
const uploadProductImages = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: imageFileFilter,
});

// Upload middleware for category images
const uploadCategoryImage = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
    fileFilter: imageFileFilter,
});

/**
 * Get the public URL for an uploaded file
 * @param {string} filename - The stored filename
 * @returns {string} Public URL path
 */
const getFileUrl = (filename) => {
    if (!filename) return null;
    return `/uploads/${filename}`;
};

/**
 * Delete a file from uploads folder
 * @param {string} filepath - Path to the file
 */
const deleteFile = (filepath) => {
    const fs = require('fs');
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
    }
};

module.exports = {
    uploadProductImages,
    uploadCategoryImage,
    getFileUrl,
    deleteFile,
};
