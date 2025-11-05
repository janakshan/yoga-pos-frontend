import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useStore } from '@/store';

/**
 * ThemeToggle Component
 * Button to switch between light and dark themes
 */
const ThemeToggle = () => {
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      ) : (
        <SunIcon className="w-5 h-5 text-gray-200" />
      )}
    </button>
  );
};

export default ThemeToggle;
