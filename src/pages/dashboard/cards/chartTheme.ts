/**
 * Chart palette resolved from the app's design tokens.
 *
 * Canvas cannot resolve `var(--color-*)`, so the tokens are read once at module
 * load. Fallbacks mirror `src/index.css` and keep charts usable when the module
 * is evaluated outside a styled browser (tests, SSR).
 */

function token(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

export function withAlpha(color: string, alpha: number): string {
  const hex = color.trim().replace(/^#/, "")
  if (!/^[0-9a-f]{6}$/i.test(hex)) return color
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const support100 = token("--color-support-100", "#e7e7e7")
const dark50 = token("--color-dark-50", "#f5f5f5")
const dark900 = token("--color-dark-900", "#191919")

// Categorical series colors, ordered to keep adjacent hues distinguishable.
export const CHART_COLORS: string[] = [
  token("--color-primary-500", "#4798d1"),
  token("--color-warning-400", "#ffa733"),
  token("--color-success-400", "#47cb87"),
  token("--color-info-400", "#33bfff"),
  token("--color-danger-400", "#e64f57"),
  token("--color-primary-300", "#82bae1"),
]

export const CHART_ACCENT = token("--color-primary-500", "#4798d1")
export const CHART_POINT = token("--color-dark-50", "#f5f5f5")
export const CHART_TICK = token("--color-support-400", "#9a9a9a")
export const CHART_TICK_MUTED = token("--color-support-500", "#8b8b8b")
export const CHART_GRID = withAlpha(support100, 0.08)

export const CHART_TOOLTIP = {
  backgroundColor: withAlpha(dark900, 0.96),
  titleColor: support100,
  bodyColor: dark50,
  titleFont: { size: 11, weight: "normal" as const },
  bodyFont: { size: 12, weight: "bold" as const },
  padding: { top: 8, bottom: 8, left: 12, right: 12 },
  cornerRadius: 6,
  borderColor: withAlpha(support100, 0.15),
  borderWidth: 1,
}
