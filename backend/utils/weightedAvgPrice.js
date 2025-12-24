/**
 * Calculate weighted average purchase price after a stock-in operation
 * 
 * Formula: newAvg = (oldQty × oldPrice + newQty × newPrice) / (oldQty + newQty)
 * 
 * @param {number} oldQty - Existing stock quantity
 * @param {number} oldPrice - Current average purchase price
 * @param {number} newQty - Quantity being added
 * @param {number} newPrice - Purchase price of new stock
 * @returns {number} New weighted average purchase price
 */
const calculateWeightedAvgPrice = (oldQty, oldPrice, newQty, newPrice) => {
    // Handle edge cases
    if (oldQty < 0 || newQty <= 0) {
        throw new Error('Quantities must be positive numbers');
    }

    if (oldQty === 0) {
        // First stock entry, average is just the new price
        return newPrice;
    }

    const totalOldValue = oldQty * oldPrice;
    const totalNewValue = newQty * newPrice;
    const totalQty = oldQty + newQty;

    const newAvgPrice = (totalOldValue + totalNewValue) / totalQty;

    // Round to 2 decimal places
    return Math.round(newAvgPrice * 100) / 100;
};

/**
 * Calculate total inventory value for a product
 * @param {number} currentStock - Current stock quantity
 * @param {number} avgPurchasePrice - Average purchase price per unit
 * @returns {number} Total inventory value
 */
const calculateInventoryValue = (currentStock, avgPurchasePrice) => {
    if (currentStock < 0 || avgPurchasePrice < 0) {
        return 0;
    }
    return Math.round(currentStock * avgPurchasePrice * 100) / 100;
};

/**
 * Calculate profit margin
 * @param {number} sellingPrice - Selling price per unit
 * @param {number} avgPurchasePrice - Average purchase price per unit
 * @returns {object} Profit amount and percentage
 */
const calculateProfitMargin = (sellingPrice, avgPurchasePrice) => {
    if (avgPurchasePrice === 0) {
        return {
            amount: sellingPrice,
            percentage: 100,
        };
    }

    const profitAmount = sellingPrice - avgPurchasePrice;
    const profitPercentage = (profitAmount / avgPurchasePrice) * 100;

    return {
        amount: Math.round(profitAmount * 100) / 100,
        percentage: Math.round(profitPercentage * 100) / 100,
    };
};

module.exports = {
    calculateWeightedAvgPrice,
    calculateInventoryValue,
    calculateProfitMargin,
};
