import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'capacity-connect-landing-theme';

export const useLandingTheme = () => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') {
        return saved;
      }
    } catch {
      // Safe fallback if localStorage is restricted
    }
    return 'dark'; // Default presentation theme
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Safe fallback
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return [theme, toggleTheme];
};
