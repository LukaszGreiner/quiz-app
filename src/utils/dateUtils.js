/**
 * Date utilities for handling user timezone-aware dates
 * Simple solution for daily streak timezone issues
 */

/**
 * Convert date to YYYY-MM-DD format (commonly used pattern)
 * @param {Date} date - Date object
 * @returns {string} Date in YYYY-MM-DD format
 */
export const formatDateToString = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Get today's date as YYYY-MM-DD string
 * @returns {string} Today's date in YYYY-MM-DD format
 */
export const getTodayString = () => {
  return formatDateToString(new Date());
};

/**
 * Get yesterday's date as YYYY-MM-DD string
 * @returns {string} Yesterday's date in YYYY-MM-DD format
 */
export const getYesterdayString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateToString(yesterday);
};

/**
 * Get a date offset by specified days
 * @param {number} daysOffset - Number of days to offset (negative for past)
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getDateWithOffset = (daysOffset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return formatDateToString(date);
};

/**
 * Generate array of week days going backwards from today
 * @param {number} days - Number of days to include (default 7)
 * @returns {Array} Array of date objects with metadata
 */
export const getWeekDaysBackwards = (days = 7) => {
  const today = new Date();
  const weekDays = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    weekDays.push({
      date: date,
      dateString: formatDateToString(date),
      dayName: date.toLocaleDateString('pl-PL', { weekday: 'short' }),
      isToday: i === 0,
      completed: false
    });
  }
  
  return weekDays;
};

/**
 * Get unique months from an array of dates
 * @param {Array} dates - Array of date objects
 * @returns {Array} Array of first day of each unique month
 */
export const getUniqueMonthsFromDates = (dates) => {
  return [...new Set(dates.map(date => 
    new Date(date.getFullYear(), date.getMonth(), 1)
  ))];
};

/**
 * Check if a date string is today
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {boolean} True if the date is today
 */
export const isToday = (dateString) => {
  return dateString === getTodayString();
};

/**
 * Check if a date string is yesterday
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {boolean} True if the date is yesterday
 */
export const isYesterday = (dateString) => {
  return dateString === getYesterdayString();
};

/**
 * Get end of today as Date object (23:59:59)
 * @returns {Date} End of today
 */
export const getEndOfToday = () => {
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

/**
 * Calculate time remaining until end of today
 * @returns {string|null} Formatted time string (e.g., "2h 30min") or null if day ended
 */
export const getTimeUntilEndOfDay = () => {
  const now = new Date();
  const endOfDay = getEndOfToday();
  
  const diffMs = endOfDay - now;
  
  if (diffMs <= 0) return null;
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  } else {
    return `${minutes}min`;
  }
};

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
