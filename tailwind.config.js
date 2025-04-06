/** @type {import('tailwindcss').Config} */
import { colors, typography, animations } from './src/theme/theme.js';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        secondary: colors.secondary,
        ...colors.accent,
        gray: colors.neutral,
      },
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      lineHeight: typography.lineHeight,
      letterSpacing: typography.letterSpacing,
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 1s infinite',
      },
      keyframes: animations.keyframes,
      transitionTimingFunction: animations.easings,
      transitionDuration: animations.durations,
      transitionDelay: animations.delays,
      // Add custom SCSS-like variables for more flexibility
      '--primary-color': 'var(--primary-600)',
      '--secondary-color': 'var(--secondary-600)',
      '--accent-color': 'var(--blue-600)',
      '--danger-color': 'var(--red-600)',
      '--success-color': 'var(--green-600)',
      '--warning-color': 'var(--yellow-600)',
      // Add responsive container padding
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  // Add some useful plugins
  plugins: [
    // This adds responsive variants to the focus-visible plugin
    function({ addVariant }) {
      addVariant('hocus', ['&:hover', '&:focus']);
      addVariant('group-hocus', ['.group:hover &', '.group:focus &']);
    }
  ],
} 