/**
 * Theme Utility Functions
 * 
 * Helper functions for working with the theme
 */

/**
 * Combines multiple class names and handles conditional classes
 * A simplified version of the classnames library
 * 
 * @param  {...any} classes - Array of class names or objects
 * @returns {string} - Combined class string
 * 
 * @example
 * // Returns "btn btn-primary active"
 * classNames('btn', 'btn-primary', { active: true, disabled: false })
 */
export function classNames(...classes) {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return cls;
    })
    .join(' ');
}

/**
 * Creates responsive class names based on provided breakpoints
 * 
 * @param {string} property - Base CSS property (e.g., 'text', 'p', 'm')
 * @param {object} values - Object with breakpoint-specific values
 * @returns {string} - Combined responsive class string
 * 
 * @example
 * // Returns "text-sm md:text-base lg:text-lg"
 * responsive('text', { default: 'sm', md: 'base', lg: 'lg' })
 */
export function responsive(property, values) {
  if (!values || typeof values !== 'object') {
    return '';
  }

  return Object.entries(values)
    .map(([breakpoint, value]) => {
      if (breakpoint === 'default') {
        return `${property}-${value}`;
      }
      return `${breakpoint}:${property}-${value}`;
    })
    .join(' ');
}

/**
 * Creates a color class with optional opacity
 * 
 * @param {string} type - Type of color class (text, bg, border)
 * @param {string} color - Color name
 * @param {string|number} [shade=DEFAULT] - Color shade (e.g., 500, 600)
 * @param {number} [opacity] - Optional opacity value (0-100)
 * @returns {string} - Tailwind color class
 * 
 * @example
 * // Returns "bg-primary-600"
 * colorClass('bg', 'primary', 600)
 * 
 * // Returns "text-primary/75"
 * colorClass('text', 'primary', 'DEFAULT', 75)
 */
export function colorClass(type, color, shade = 'DEFAULT', opacity) {
  const baseClass = shade === 'DEFAULT' 
    ? `${type}-${color}` 
    : `${type}-${color}-${shade}`;
    
  return opacity !== undefined 
    ? `${baseClass}/${opacity}` 
    : baseClass;
}

/**
 * Creates a custom animation class with specified properties
 * 
 * @param {string} name - Animation name
 * @param {string} [duration=DEFAULT] - Animation duration key
 * @param {string} [ease=DEFAULT] - Animation easing key
 * @param {string|number} [delay=0] - Animation delay key or value
 * @param {boolean} [infinite=false] - Whether the animation should loop infinitely
 * @returns {string} - Animation classes
 * 
 * @example
 * // Returns "animate-fadeIn duration-300 ease-in-out"
 * animationClass('fadeIn', 'DEFAULT', 'DEFAULT')
 */
export function animationClass(name, duration = 'DEFAULT', ease = 'DEFAULT', delay = 0, infinite = false) {
  const classes = [`animate-${name}`];
  
  if (duration !== 'DEFAULT') {
    classes.push(`duration-${duration}`);
  }
  
  if (ease !== 'DEFAULT') {
    classes.push(`ease-${ease}`);
  }
  
  if (delay && delay !== 0) {
    classes.push(`delay-${delay}`);
  }
  
  if (infinite) {
    classes.push('infinite');
  }
  
  return classes.join(' ');
}

/**
 * Creates a gradient background class
 * 
 * @param {string} direction - Gradient direction (e.g., 'to-r', 'to-br')
 * @param {string} fromColor - Starting color (e.g., 'primary-600')
 * @param {string} toColor - Ending color (e.g., 'secondary-600')
 * @param {string} [viaColor] - Optional middle color (e.g., 'blue-500')
 * @returns {string} - Gradient class
 * 
 * @example
 * // Returns "bg-gradient-to-r from-primary-600 to-secondary-600"
 * gradientClass('to-r', 'primary-600', 'secondary-600')
 */
export function gradientClass(direction, fromColor, toColor, viaColor) {
  const classes = [
    `bg-gradient-${direction}`,
    `from-${fromColor}`,
    `to-${toColor}`
  ];
  
  if (viaColor) {
    classes.push(`via-${viaColor}`);
  }
  
  return classes.join(' ');
}

/**
 * Creates a spacing utility class
 * 
 * @param {string} type - Type of spacing (m, p, gap, space-x, space-y)
 * @param {string|number} value - Spacing value
 * @param {string} [direction] - Optional direction (t, r, b, l, x, y)
 * @returns {string} - Spacing class
 * 
 * @example
 * // Returns "p-4"
 * spacingClass('p', 4)
 * 
 * // Returns "mt-8"
 * spacingClass('m', 8, 't')
 */
export function spacingClass(type, value, direction) {
  if (direction) {
    return `${type}${direction}-${value}`;
  }
  return `${type}-${value}`;
}

export default {
  classNames,
  responsive,
  colorClass,
  animationClass,
  gradientClass,
  spacingClass,
}; 