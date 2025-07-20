import { useState, useRef, useCallback } from "react";

// Standard useLocalStorage hook that accepts key and defaultValue
export function useLocalStorage(key, defaultValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

// Legacy useLocalStorage hook for backward compatibility
function useLocalStorageService() {
  const cache = useRef(new Map());

  const setItem = useCallback((key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    cache.current.set(key, value);
    console.log(`Set ${key} in localStorage`);
  }, []);

  const getItem = useCallback((key) => {
    console.log(`Getting ${key} from localStorage`);
    // Check cache first
    if (cache.current.has(key)) {
      return cache.current.get(key);
    }

    // If not in cache, get from localStorage
    const rawValue = localStorage.getItem(key);
    if (!rawValue) return null;

    try {
      const value = JSON.parse(rawValue);
      cache.current.set(key, value); // Cache the parsed value
      return value;
    } catch (err) {
      console.error("Error parsing localStorage value:", err);
      return null;
    }
  }, []);

  const removeItem = useCallback((key) => {
    localStorage.removeItem(key);
    cache.current.delete(key);
  }, []);

  return {
    setItem,
    getItem,
    removeItem,
  };
}

export default useLocalStorageService;
