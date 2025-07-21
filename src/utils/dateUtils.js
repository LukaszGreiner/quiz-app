/**
 * Date utilities for handling user timezone-aware dates
 * Simple solution for daily streak timezone issues
 */

/**
 * Get user's local date in YYYY-MM-DD format
 * Uses user's current timezone (perfect for travel)
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getUserLocalDate = () => {
  return new Date().toLocaleDateString('sv-SE'); // 'sv-SE' gives YYYY-MM-DD format
};

/**
 * Get date from timestamp in user's local timezone
 * @param {string|Date} timestamp - ISO timestamp or Date object
 * @returns {string} Date in YYYY-MM-DD format in user's timezone
 */
export const getLocalDateFromTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('sv-SE');
};

/**
 * Get start and end of user's local day in UTC (for Firebase queries)
 * @param {string} localDate - Optional date in YYYY-MM-DD format, defaults to today
 * @returns {Object} { start: ISO string, end: ISO string }
 */
export const getUserLocalDayRange = (localDate = null) => {
  const dateStr = localDate || getUserLocalDate();
  
  // Create start and end of user's local day
  const startOfDay = new Date(dateStr + 'T00:00:00');
  const endOfDay = new Date(dateStr + 'T23:59:59');
  
  return {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString(),
    localDate: dateStr
  };
};

/**
 * Check if two dates are consecutive days in user's timezone
 * @param {string} date1 - YYYY-MM-DD format
 * @param {string} date2 - YYYY-MM-DD format  
 * @returns {boolean} True if date2 is day after date1
 */
export const areConsecutiveDays = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  const d1 = new Date(date1 + 'T00:00:00');
  const d2 = new Date(date2 + 'T00:00:00');
  
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays === 1;
};
