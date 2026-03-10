/**
 * Common helper functions
 */

/**
 * Format price to display format
 * @param {number} price - Price in number format
 * @returns {string} - Formatted price string
 */
function formatPrice(price) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
}

/**
 * Generate order number
 * @param {number} serialNumber - Serial number from database
 * @returns {string} - Formatted order number
 */
function generateOrderNumber(serialNumber) {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `LK${year}${month}-${serialNumber.toString().padStart(5, '0')}`;
}

/**
 * Calculate pagination offset
 * @param {number} page - Page number (1-indexed)
 * @param {number} limit - Items per page
 * @returns {number} - Offset value
 */
function calculateOffset(page, limit) {
  return (page - 1) * limit;
}

/**
 * Create pagination response
 * @param {Array} data - Data array
 * @param {number} total - Total count
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {Object} - Pagination response object
 */
function paginateResponse(data, total, page, limit) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
}

/**
 * Sanitize object by removing undefined values
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
function removeUndefined(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== undefined)
  );
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after ms
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} - True if date is today
 */
function isToday(date) {
  const today = new Date();
  const checkDate = new Date(date);
  return today.toDateString() === checkDate.toDateString();
}

/**
 * Get start of day
 * @param {Date} date - Date
 * @returns {Date} - Start of day
 */
function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get end of day
 * @param {Date} date - Date
 * @returns {Date} - End of day
 */
function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Add days to date
 * @param {Date} date - Date
 * @param {number} days - Days to add
 * @returns {Date} - New date
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports = {
  formatPrice,
  generateOrderNumber,
  calculateOffset,
  paginateResponse,
  removeUndefined,
  sleep,
  isToday,
  startOfDay,
  endOfDay,
  addDays
};
