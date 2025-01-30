/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        'accent-alt': 'var(--color-accent-alt)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'text-primary': 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
      },
      transitionDuration: {
        DEFAULT: 'var(--transition-duration)',
      },
    },
  },
  plugins: [],
};