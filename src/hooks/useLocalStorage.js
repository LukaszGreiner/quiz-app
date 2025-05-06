import { useRef, useCallback } from "react";

function useLocalStorage() {
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

export default useLocalStorage;
