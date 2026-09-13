# Kiasin System - Design Theme

Custom Tailwind theme defined in `src/index.css` using Tailwind v4 `@theme` directive.

## Color Palette

### Primary (Blue Brand)
Main brand identity color. Use for primary actions, links, key UI elements.
```
primary-50  → #e4f8ff (lightest)
primary-100 → #d4ebfb
primary-200 → #acd3ee
primary-300 → #82bae1
primary-400 → #5ea5d7
primary-500 → #4798d1
primary-600 → #3791cf (default)
primary-700 → #257eb8
primary-800 → #1670a6
primary-900 → #006194 (darkest)
```

**Usage:** `bg-primary-600`, `text-primary-700`, `border-primary-500`

### Dark (Night/Slate)
Background and surface colors. Main app uses dark mode.
```
dark-50  → #f5f5f5 (lightest)
dark-100 → #e2e2e2
dark-200 → #cdcdcd
dark-300 → #b2b2b2
dark-400 → #9a9a9a
dark-500 → #8b8b8b
dark-600 → #848484
dark-700 → #717171
dark-800 → #656565
dark-900 → #191919 (darkest - main background)
```

**Usage:** `bg-dark-900` (body), `bg-dark-800` (surfaces), `bg-dark-700` (elevated)

### Support (Gray/Neutral)
Text and secondary UI elements.
```
support-50  → #f7f7f7 (lightest)
support-100 → #e7e7e7 (default text)
support-200 → #cdcdcd
support-300 → #b2b2b2
support-400 → #9a9a9a
support-500 → #8b8b8b
support-600 → #848484
support-700 → #717171
support-800 → #656565
support-900 → #575757 (darkest)
```

**Usage:** `text-support-100` (body text), `bg-support-600` (secondary buttons)

### Semantic Colors

#### Danger (Red)
Destructive actions, errors, warnings.
```
danger-50  → #ffeaec
danger-600 → #e22732 (default)
danger-900 → #9e0419
```

**Usage:** `bg-danger-600` (delete buttons), `text-danger-600` (error text)

#### Success (Green)
Success states, confirmations, positive feedback.
```
success-50  → #e8f9f0
success-600 → #239a5d (default)
success-900 → #0b3a24
```

**Usage:** `bg-success-600` (success buttons), `text-success-600` (success messages)

#### Warning (Orange)
Warnings, caution states.
```
warning-50  → #fff4e6
warning-600 → #cc7400 (default)
warning-900 → #331d00
```

**Usage:** `bg-warning-600` (warning banners), `text-warning-600` (warning text)

#### Info (Cyan)
Informational messages, tips.
```
info-50  → #e6f7ff
info-600 → #008acc (default)
info-900 → #002133
```

**Usage:** `bg-info-600` (info banners), `text-info-600` (info text)

### Borders & Dividers
```
border-main   → #e2e2e220 (default border)
border-subtle → #e2e2e210 (light dividers)
border-strong → #e2e2e240 (prominent borders)
```

**Usage:** `border-border-main`, `border-border-subtle`, `border-border-strong`

## Component Variants

### Buttons (src/components/Button/index.tsx)
```tsx
variant="primary"   // bg-primary-600 hover:bg-primary-700
variant="secondary" // bg-support-600 hover:bg-support-700
variant="danger"    // bg-danger-600 hover:bg-danger-700
```

### Sizes
```
sm: px-3 py-1 text-sm
md: px-4 py-2 text-base (default)
lg: px-5 py-3 text-lg
```

## Utility Classes

### Background Helper
```css
.bg → bg-dark-50 (light mode) / bg-dark-900 (dark mode)
```

### Button Base
```css
.btn → primary-600 background with hover state
```

## Usage Guidelines

1. **Primary actions:** Use `primary-600` for main CTAs
2. **Secondary actions:** Use `support-600` for secondary buttons
3. **Destructive actions:** Use `danger-600` for delete/remove
4. **Text:** Default text is `support-100` (set globally)
5. **Backgrounds:** Main bg is `dark-900`, surfaces use `dark-800`
6. **Borders:** Default is `border-main` (20% opacity)

## Migration Notes

Replaced default Tailwind colors:
- `sky-*` → `primary-*`
- `gray-*` → `support-*`
- `red-*` → `danger-*`

Avoid hardcoded hex values. Use theme colors for consistency.
