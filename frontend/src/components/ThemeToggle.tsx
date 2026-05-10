import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const storageKey = 'farewell_diary_theme';

function getInitialDarkMode() {
  if (typeof window === 'undefined') return false;
  const savedTheme = window.localStorage.getItem(storageKey);

  if (savedTheme === 'dark') return true;
  if (savedTheme === 'light') return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applySavedTheme() {
  if (typeof window === 'undefined') return;
  const shouldUseDarkMode = getInitialDarkMode();
  document.documentElement.classList.toggle('dark', shouldUseDarkMode);
}

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(getInitialDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    window.localStorage.setItem(storageKey, isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return (
    <button
      type="button"
      onClick={() => setIsDarkMode((current) => !current)}
      className="btn btn-secondary h-11 w-11 px-0"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
