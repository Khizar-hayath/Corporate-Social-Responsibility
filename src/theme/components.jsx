import React from 'react';
import { motion } from 'framer-motion';
import { classNames } from './utils';
import { HOVER_LIFT, TAP_EFFECT, FOCUS_RING, DISABLED_STYLES } from './constants';

/**
 * Button Component
 * Provides consistent styling for buttons with variants
 */
export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  isFullWidth = false,
  isDisabled = false,
  isAnimated = true,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  ...props 
}) => {
  // Base classes that apply to all buttons
  const baseClasses = classNames(
    'inline-flex items-center justify-center font-medium transition-all',
    FOCUS_RING,
    DISABLED_STYLES,
    isFullWidth ? 'w-full' : '',
  );

  // Variant-specific classes
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm',
    secondary: 'bg-primary-100 hover:bg-primary-200 text-primary-700',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 bg-transparent',
    ghost: 'text-primary-600 hover:bg-primary-50 bg-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm',
    success: 'bg-green-600 hover:bg-green-700 text-white shadow-sm',
    dark: 'bg-gray-800 hover:bg-gray-900 text-white shadow-sm dark:bg-gray-700 dark:hover:bg-gray-600',
    light: 'bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 shadow-sm',
  };

  // Size-specific classes
  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1.5 rounded',
    sm: 'text-sm px-3 py-2 rounded-md',
    md: 'text-sm px-4 py-2 rounded-md',
    lg: 'text-base px-6 py-3 rounded-lg',
    xl: 'text-lg px-7 py-4 rounded-lg',
  };

  // Combine all classes
  const buttonClasses = classNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const ButtonComponent = isAnimated ? motion.button : 'button';
  const motionProps = isAnimated ? {
    whileHover: HOVER_LIFT,
    whileTap: TAP_EFFECT,
  } : {};

  return (
    <ButtonComponent
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={isDisabled}
      {...motionProps}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </ButtonComponent>
  );
};

/**
 * Card Component
 * Consistent container with optional hover effects
 */
export const Card = ({
  children,
  className = '',
  hasHoverEffect = false,
  variant = 'default',
  padding = 'md',
  isAnimated = true,
  ...props
}) => {
  const baseClasses = 'rounded-lg overflow-hidden transition-all';

  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 shadow',
    outlined: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg',
    flat: 'bg-gray-50 dark:bg-gray-900',
    glass: 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverClasses = hasHoverEffect ? 'hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1' : '';

  const cardClasses = classNames(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hoverClasses,
    className
  );

  const CardComponent = isAnimated ? motion.div : 'div';
  const motionProps = isAnimated && hasHoverEffect ? {
    whileHover: { 
      y: -5, 
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
    },
    transition: { 
      type: "spring", 
      stiffness: 500, 
      damping: 30 
    },
  } : {};

  return (
    <CardComponent
      className={cardClasses}
      {...motionProps}
      {...props}
    >
      {children}
    </CardComponent>
  );
};

/**
 * Badge Component
 * Small label or indicator
 */
export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';

  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    outline: 'border border-current bg-transparent',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-0.5',
  };

  const badgeClasses = classNames(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

/**
 * Input Component
 * Consistent form input styling
 */
export const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  isRequired = false,
  isDisabled = false,
  isInvalid = false,
  errorMessage,
  helperText,
  size = 'md',
  className = '',
  onChange,
  value,
  name,
  ...props
}) => {
  const baseClasses = classNames(
    'w-full border rounded-md shadow-sm transition-colors',
    FOCUS_RING,
    DISABLED_STYLES
  );

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-4 py-3 text-lg',
  };

  const stateClasses = isInvalid
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-900 dark:text-white';

  const inputClasses = classNames(
    baseClasses,
    sizeClasses[size],
    stateClasses,
    className
  );

  const labelClasses = classNames(
    'block text-sm font-medium mb-1',
    isDisabled ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'
  );

  const errorClasses = 'mt-1 text-sm text-red-600 dark:text-red-400';
  const helperClasses = 'mt-1 text-sm text-gray-500 dark:text-gray-400';

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        name={name}
        className={inputClasses}
        placeholder={placeholder}
        disabled={isDisabled}
        required={isRequired}
        value={value}
        onChange={onChange}
        aria-invalid={isInvalid}
        aria-describedby={isInvalid ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        {...props}
      />
      {isInvalid && errorMessage && (
        <p id={`${id}-error`} className={errorClasses}>
          {errorMessage}
        </p>
      )}
      {helperText && !isInvalid && (
        <p id={`${id}-helper`} className={helperClasses}>
          {helperText}
        </p>
      )}
    </div>
  );
};

/**
 * Section Component
 * Consistent container for page sections
 */
export const Section = ({
  children,
  className = '',
  spacing = 'md',
  containerWidth = 'default',
  bgColor = 'default',
  id,
  ...props
}) => {
  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-24',
    xl: 'py-20 md:py-32',
  };

  const containerClasses = {
    default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    narrow: 'max-w-4xl mx-auto px-4 sm:px-6 lg:px-8',
    wide: 'max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8',
    full: 'w-full px-4 sm:px-6 lg:px-8',
  };

  const bgClasses = {
    default: 'bg-white dark:bg-gray-900',
    gray: 'bg-gray-50 dark:bg-gray-800',
    primary: 'bg-primary-50 dark:bg-primary-900',
    secondary: 'bg-secondary-50 dark:bg-secondary-900',
    none: '',
  };

  const sectionClasses = classNames(
    spacingClasses[spacing],
    bgClasses[bgColor],
    className
  );

  return (
    <section className={sectionClasses} id={id} {...props}>
      <div className={containerClasses[containerWidth]}>
        {children}
      </div>
    </section>
  );
};

/**
 * GridLayout Component
 * Responsive grid with options for columns
 */
export const GridLayout = ({
  children,
  columns = { default: 1, sm: 2, md: 3 },
  gap = 6,
  className = '',
  ...props
}) => {
  const getColumnsClass = cols => {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      12: 'grid-cols-12',
    };

    return Object.entries(cols).map(([breakpoint, value]) => {
      if (breakpoint === 'default') {
        return gridCols[value];
      }
      return `${breakpoint}:${gridCols[value]}`;
    }).join(' ');
  };

  const gridClasses = classNames(
    'grid',
    getColumnsClass(columns),
    `gap-${gap}`,
    className
  );

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
};

/**
 * Text Component
 * Typography component with consistent styling
 */
export const Text = ({
  children,
  variant = 'body',
  color = 'default',
  align = 'left',
  weight = 'normal',
  className = '',
  as,
  ...props
}) => {
  const variantClasses = {
    h1: 'text-4xl sm:text-5xl font-bold leading-tight',
    h2: 'text-3xl sm:text-4xl font-bold leading-tight',
    h3: 'text-2xl sm:text-3xl font-bold leading-tight',
    h4: 'text-xl sm:text-2xl font-semibold leading-tight',
    h5: 'text-lg sm:text-xl font-semibold leading-tight',
    h6: 'text-base sm:text-lg font-semibold leading-tight',
    subtitle: 'text-xl font-normal leading-relaxed',
    body: 'text-base font-normal leading-relaxed',
    small: 'text-sm font-normal leading-relaxed',
    tiny: 'text-xs font-normal leading-relaxed',
  };

  const colorClasses = {
    default: 'text-gray-900 dark:text-white',
    muted: 'text-gray-600 dark:text-gray-400',
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-secondary-600 dark:text-secondary-400',
    success: 'text-green-600 dark:text-green-400',
    danger: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
    white: 'text-white',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  };

  const weightClasses = {
    thin: 'font-thin',
    extralight: 'font-extralight',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black',
  };

  const textClasses = classNames(
    variantClasses[variant],
    colorClasses[color],
    alignClasses[align],
    weightClasses[weight],
    className
  );

  const Component = as || {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    subtitle: 'p',
    body: 'p',
    small: 'p',
    tiny: 'span',
  }[variant];

  return (
    <Component className={textClasses} {...props}>
      {children}
    </Component>
  );
};

export default {
  Button,
  Card,
  Badge,
  Input,
  Section,
  GridLayout,
  Text,
}; 