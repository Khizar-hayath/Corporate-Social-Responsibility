/**
 * Design System Constants
 * 
 * This file provides named constants for common theme values.
 * Use these constants instead of hardcoded values in your components.
 */

// Animation Constants
export const TRANSITION_DURATION = {
  FAST: '150ms',
  DEFAULT: '300ms',
  SLOW: '500ms',
  VERY_SLOW: '1000ms',
};

export const TRANSITION_EASE = {
  DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  IN: 'cubic-bezier(0.4, 0, 1, 1)',
  OUT: 'cubic-bezier(0, 0, 0.2, 1)',
  IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

// Common Animation Presets
export const HOVER_LIFT = {
  scale: 1.05,
  transition: {
    duration: 0.3,
    ease: TRANSITION_EASE.OUT,
  },
};

export const TAP_EFFECT = {
  scale: 0.95,
  transition: {
    duration: 0.1,
    ease: TRANSITION_EASE.IN,
  },
};

export const HOVER_GLOW = (color = 'rgba(59, 130, 246, 0.5)') => ({
  boxShadow: `0 0 20px ${color}`,
});

// Layout Constants
export const SECTION_SPACING = {
  SMALL: 'py-8 md:py-12',
  MEDIUM: 'py-12 md:py-16',
  LARGE: 'py-16 md:py-24',
  X_LARGE: 'py-20 md:py-32',
};

export const CONTAINER_WIDTH = {
  DEFAULT: 'max-w-7xl',
  NARROW: 'max-w-4xl',
  WIDE: 'max-w-full',
};

export const CONTENT_PADDING = {
  DEFAULT: 'px-4 sm:px-6 lg:px-8',
  NARROW: 'px-4 sm:px-4',
  WIDE: 'px-6 sm:px-10 lg:px-12',
};

// Border Radius
export const BORDER_RADIUS = {
  NONE: 'rounded-none',
  SMALL: 'rounded-sm',
  DEFAULT: 'rounded',
  MEDIUM: 'rounded-md',
  LARGE: 'rounded-lg',
  X_LARGE: 'rounded-xl',
  XX_LARGE: 'rounded-2xl',
  XXX_LARGE: 'rounded-3xl',
  FULL: 'rounded-full',
};

// Shadows
export const SHADOW = {
  NONE: 'shadow-none',
  SMALL: 'shadow-sm',
  DEFAULT: 'shadow',
  MEDIUM: 'shadow-md',
  LARGE: 'shadow-lg',
  X_LARGE: 'shadow-xl',
  XX_LARGE: 'shadow-2xl',
  INNER: 'shadow-inner',
};

// Color Gradients
export const GRADIENTS = {
  PRIMARY: 'bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800',
  SECONDARY: 'bg-gradient-to-br from-secondary-700 via-secondary-600 to-secondary-800',
  BLUE_PURPLE: 'bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-800',
  ORANGE_RED: 'bg-gradient-to-br from-orange-500 via-red-500 to-red-600',
  GREEN_BLUE: 'bg-gradient-to-br from-green-600 via-teal-500 to-blue-600',
  SUNSET: 'bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700',
  DARK: 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900',
};

// Responsive Breakpoints
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  XXL: '1536px',
};

// Common Tailwind Class Combinations
export const FOCUS_RING = 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
export const HOVER_BG_OPACITY = 'hover:bg-opacity-90';
export const DISABLED_STYLES = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

// Default Export
export default {
  TRANSITION_DURATION,
  TRANSITION_EASE,
  HOVER_LIFT,
  TAP_EFFECT,
  HOVER_GLOW,
  SECTION_SPACING,
  CONTAINER_WIDTH,
  CONTENT_PADDING,
  BORDER_RADIUS,
  SHADOW,
  GRADIENTS,
  BREAKPOINTS,
  FOCUS_RING,
  HOVER_BG_OPACITY,
  DISABLED_STYLES,
}; 