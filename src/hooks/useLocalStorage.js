import { useState, useEffect } from "react";

/**
 * Custom hook for managing form state persistence in localStorage
 * @param {string} key - Storage key to use
 * @param {Object} initialValue - Initial value if nothing found in storage
 * @returns {[Object, Function, Function]} - [storedValue, updateValue, clearValue]
 */
const useLocalStorage = (key, initialValue) => {
  // Get from localStorage on init
  const getStoredValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Failed to parse localStorage data:", error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Save to localStorage whenever state changes
  const setValue = (value) => {
    try {
      // Allow value to be a function like in useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state and localStorage
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  };

  // Clear the stored value
  const clearValue = () => {
    try {
      setStoredValue(initialValue);
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Failed to clear localStorage item:", error);
    }
  };

  // Update localStorage if key changes
  useEffect(() => {
    const savedValue = getStoredValue();
    if (savedValue !== storedValue) {
      setStoredValue(savedValue);
    }
  }, [key]);

  return [storedValue, setValue, clearValue];
};

export default useLocalStorage;
