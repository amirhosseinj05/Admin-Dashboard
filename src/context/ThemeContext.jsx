import { createContext, useContext, useEffect, useState } from 'react';

/**
 * ThemeContext - global dark/light mode state.
 * The choice is persisted in localStorage and applied to <html data-bs-theme>,
 * which Bootstrap 5.3 understands natively (our custom CSS follows the same attribute).
 */
const ThemeContext = createContext(null);

const STORAGE_KEY = 'ariya-theme';

const readStoredTheme = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* storage may be unavailable (private mode) - fall back to light */
  }
  return 'light';
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readStoredTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Custom hook: const { isDark, toggleTheme } = useTheme(); */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
