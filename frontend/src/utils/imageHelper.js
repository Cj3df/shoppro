/**
 * Utility function to get image URL from various image data formats.
 * Handles both string URLs and object formats { url, alt, isPrimary }.
 * @param {string|object} image - The image data (string URL or object)
 * @returns {string} - The image URL
 */
export const getImageUrl = (image) => {
    if (!image) return '';
    if (typeof image === 'string') return image;
    if (typeof image === 'object' && image.url) return image.url;
    return '';
};

/**
 * Get the primary image URL from a product's images array.
 * @param {Array} images - Array of images (strings or objects)
 * @returns {string} - The primary image URL
 */
export const getPrimaryImageUrl = (images) => {
    if (!images || images.length === 0) return '';

    // Check for a primary image first (if images are objects)
    if (typeof images[0] === 'object') {
        const primaryImage = images.find(img => img.isPrimary);
        if (primaryImage) return primaryImage.url;
    }

    // Return the first image URL
    return getImageUrl(images[0]);
};

/**
 * Get all image URLs from a product's images array.
 * @param {Array} images - Array of images (strings or objects)
 * @returns {Array<string>} - Array of image URLs
 */
export const getAllImageUrls = (images) => {
    if (!images || images.length === 0) return [];
    return images.map(img => getImageUrl(img)).filter(url => url !== '');
};
