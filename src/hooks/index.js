import { useState, useEffect, useCallback, useMemo } from 'react';
import { storageService } from '../services/storageService';

// Custom hook for managing bookmarks
export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  
  useEffect(() => {
    setBookmarks(storageService.getBookmarks());
  }, []);
  
  const addBookmark = useCallback((post) => {
    const updated = storageService.addBookmark(post);
    setBookmarks(updated);
  }, []);
  
  const removeBookmark = useCallback((postId) => {
    const updated = storageService.removeBookmark(postId);
    setBookmarks(updated);
  }, []);
  
  const isBookmarked = useCallback((postId) => {
    return storageService.isBookmarked(postId);
  }, []);
  
  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked
  };
};

// Custom hook for theme management
export const useTheme = () => {
  const [theme, setTheme] = useState(() => storageService.getTheme());
  
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    storageService.saveTheme(newTheme);
    document.body.className = newTheme === 'dark' ? 'dark-theme' : '';
  }, [theme]);
  
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-theme' : '';
  }, [theme]);
  
  return { theme, toggleTheme };
};

// Custom hook for debounced search
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Custom hook for intersection observer (infinite scroll)
export const useIntersectionObserver = (options) => {
  const [ref, setRef] = useState(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    
    observer.observe(ref);
    
    return () => {
      observer.disconnect();
    };
  }, [ref, options]);
  
  return [setRef, isIntersecting];
};

// Custom hook for local storage state
export const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      setStoredValue(value);
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);
  
  return [storedValue, setValue];
};

// Custom hook for API error handling
export const useApiError = () => {
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const handleError = useCallback((err) => {
    console.error('API Error:', err);
    setError(err.message || 'An unexpected error occurred');
  }, []);
  
  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    setError(null);
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);
  
  return {
    error,
    retryCount,
    handleError,
    retry,
    clearError
  };
};
