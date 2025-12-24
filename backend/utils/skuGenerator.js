/**
 * Generate unique SKU for products
 * @param {string} categoryPrefix - Category abbreviation (e.g., 'ELC' for Electronics)
 * @param {string} productName - Product name for reference
 * @returns {string} Unique SKU
 */
const generateSKU = (categoryPrefix = 'PRD', productName = '') => {
    const prefix = categoryPrefix.toUpperCase().slice(0, 3);
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();

    return `${prefix}-${timestamp}-${random}`;
};

/**
 * Generate variant SKU based on parent product SKU
 * @param {string} parentSku - Parent product SKU
 * @param {object} attributes - Variant attributes (e.g., { size: 'M', color: 'Red' })
 * @returns {string} Variant SKU
 */
const generateVariantSKU = (parentSku, attributes = {}) => {
    const attributeCode = Object.values(attributes)
        .map(val => String(val).slice(0, 2).toUpperCase())
        .join('');

    return `${parentSku}-${attributeCode || 'V' + Math.floor(Math.random() * 1000)}`;
};

module.exports = { generateSKU, generateVariantSKU };
