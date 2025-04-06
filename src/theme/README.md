# Design System Documentation

This design system provides a comprehensive set of components, styles, and utilities to create consistent UI across the application. The system is built on top of Tailwind CSS and provides both low-level design tokens and higher-level components.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Design Tokens](#design-tokens)
3. [Components](#components)
4. [Utility Classes](#utility-classes)
5. [Theming and Dark Mode](#theming-and-dark-mode)
6. [Best Practices](#best-practices)

## Getting Started

To use the design system, import the necessary components or utility functions from the theme directory:

```jsx
// Import components
import { Button, Card, Text } from '../theme/components';

// Import utility functions
import { classNames } from '../theme/utils';

// Import constants
import { GRADIENTS, HOVER_LIFT } from '../theme/constants';
```

For a complete showcase of all components and styles, visit the `/theme` route in the application.

## Design Tokens

Design tokens are stored in `theme.js` and represent the lowest level of the design system. They include:

### Colors

```jsx
import { colors } from '../theme/theme';

// Primary colors: colors.primary
// Secondary colors: colors.secondary
// Accent colors: colors.accent
// Neutral colors: colors.neutral
```

### Typography

```jsx
import { typography } from '../theme/theme';

// Font families: typography.fontFamily
// Font sizes: typography.fontSize
// Font weights: typography.fontWeight
// Line heights: typography.lineHeight
// Letter spacing: typography.letterSpacing
```

### Spacing

```jsx
import { spacing } from '../theme/theme';

// Spacing values are in rems
// Example: spacing[4] = '1rem' (16px)
```

### Other Tokens

- `borderRadius`: Border radius values
- `shadows`: Box shadow values
- `animations`: Animation timing functions, durations, delays, and keyframes
- `zIndex`: z-index scale
- `breakpoints`: Responsive breakpoints

## Components

The design system provides ready-to-use React components in `components.jsx`:

### Button

```jsx
<Button 
  variant="primary" // primary, secondary, outline, ghost, danger, success, dark, light
  size="md" // xs, sm, md, lg, xl
  isFullWidth={false}
  isDisabled={false}
  isAnimated={true}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  onClick={handleClick}
>
  Button Text
</Button>
```

### Card

```jsx
<Card
  variant="default" // default, outlined, elevated, flat, glass
  padding="md" // none, sm, md, lg
  hasHoverEffect={false}
  isAnimated={true}
>
  Card Content
</Card>
```

### Badge

```jsx
<Badge
  variant="primary" // primary, secondary, success, danger, warning, info, outline
  size="md" // sm, md, lg
>
  Badge Text
</Badge>
```

### Input

```jsx
<Input
  id="input-id"
  label="Input Label"
  type="text"
  placeholder="Placeholder text"
  isRequired={false}
  isDisabled={false}
  isInvalid={false}
  errorMessage="Error message"
  helperText="Helper text"
  size="md" // sm, md, lg
  value={value}
  onChange={handleChange}
/>
```

### Section

```jsx
<Section
  spacing="md" // sm, md, lg, xl
  containerWidth="default" // default, narrow, wide, full
  bgColor="default" // default, gray, primary, secondary, none
>
  Section Content
</Section>
```

### GridLayout

```jsx
<GridLayout
  columns={{ default: 1, sm: 2, md: 3 }} // Responsive column configuration
  gap={6} // Gap size
>
  Grid Items
</GridLayout>
```

### Text

```jsx
<Text
  variant="body" // h1, h2, h3, h4, h5, h6, subtitle, body, small, tiny
  color="default" // default, muted, primary, secondary, success, danger, warning, info, white
  align="left" // left, center, right, justify
  weight="normal" // thin, extralight, light, normal, medium, semibold, bold, extrabold, black
  as="p" // Override the HTML element
>
  Text content
</Text>
```

## Utility Classes

The system provides CSS utility classes in `index.css` for common styling needs:

### Button Utilities

- `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.btn-ghost`, etc.
- `.btn-sm`, `.btn-lg`, `.btn-xl` - Button sizes
- `.btn-full` - Full width button

### Card Utilities

- `.card` - Base card style
- `.card-hover` - Add hover effect to cards
- `.card-body`, `.card-header`, `.card-footer` - Card sections

### Form Utilities

- `.form-control` - Form control wrapper
- `.label` - Form label
- `.input`, `.select`, `.textarea` - Form controls
- `.checkbox`, `.radio` - Input elements

### Badge Utilities

- `.badge` - Base badge style
- `.badge-primary`, `.badge-secondary`, etc.

### Alert Utilities

- `.alert` - Base alert style
- `.alert-info`, `.alert-success`, `.alert-warning`, `.alert-danger`

### Section Utilities

- `.section`, `.section-sm`, `.section-lg`, `.section-xl` - Section spacings
- `.container-narrow`, `.container-default`, `.container-wide` - Container widths

### Gradient Utilities

- `.bg-gradient-primary`, `.bg-gradient-secondary`, `.bg-gradient-blue-purple`, etc.

### Animation Utilities

- `.animate-float`, `.animate-fade-in`, `.animate-slide-up`, `.animate-slide-down`
- `.glass` - Glassmorphism effect

## Theming and Dark Mode

The design system supports dark mode using Tailwind's `dark:` variant. Dark mode is toggled using the `ThemeContext`:

```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { darkMode, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    </button>
  );
}
```

## Best Practices

1. **Use Design Tokens**: Always refer to design tokens rather than hardcoding values.

2. **Consistent Spacing**: Use the spacing utility classes for margin and padding.

3. **Component Composition**: Build complex UIs by composing simpler components.

4. **Responsive Design**: Use responsive utilities for different screen sizes.

5. **Accessibility**: Ensure components meet accessibility standards.

6. **Dark Mode**: Test components in both light and dark modes.

7. **Animations**: Use consistent animation durations and easing functions.

8. **Reuse Components**: Prefer using existing components over creating new ones.

9. **Documentation**: Document any new components added to the system.

10. **Theme Showcase**: Reference the Theme Showcase page when in doubt about styling options.

---

The design system is built to be maintainable and scalable. If you need to modify or extend it, please update the documentation accordingly. 