const slugify = require('slugify');

/**
 * Generate URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @param {object} options - Additional options
 * @returns {string} URL-friendly slug
 */
const generateSlug = (text, options = {}) => {
    const defaultOptions = {
        lower: true,
        strict: true,
        trim: true,
    };

    return slugify(text, { ...defaultOptions, ...options });
};

/**
 * Generate unique slug by appending random suffix if needed
 * @param {string} text - Text to convert to slug
 * @param {Function} checkExists - Async function to check if slug exists
 * @returns {Promise<string>} Unique slug
 */
const generateUniqueSlug = async (text, checkExists) => {
    let slug = generateSlug(text);
    let exists = await checkExists(slug);

    if (!exists) {
        return slug;
    }

    // Add random suffix if slug already exists
    let counter = 1;
    let newSlug = slug;

    while (exists && counter < 100) {
        newSlug = `${slug}-${counter}`;
        exists = await checkExists(newSlug);
        counter++;
    }

    // If still exists after 100 tries, add timestamp
    if (exists) {
        newSlug = `${slug}-${Date.now()}`;
    }

    return newSlug;
};

module.exports = { generateSlug, generateUniqueSlug };
