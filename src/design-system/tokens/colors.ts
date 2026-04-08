/**
 * GreenSkills Design System — Color Tokens
 *
 * Color palette for the East African Skills Platform.
 * Optimized for:
 *   - Low-end Android screens (poor color accuracy, low brightness)
 *   - Outdoor viewing in bright sunlight
 *   - WCAG AA minimum, AAA where possible
 *   - Warm neutral undertone (cold grays skew blue on cheap panels)
 *
 * Key decisions:
 *   - Primary green uses the 600 stop, not 500. Brighter greens wash out
 *     outdoors and fail contrast on white.
 *   - Accent is amber/gold, not orange. Orange is reserved for warnings.
 *   - Neutral ramp has a warm undertone (#FAFAF8 base, not Tailwind's
 *     blue-tinted #F9FAFB). Prevents cold cast on budget displays.
 *   - No cream background — pure white or very subtle warm gray. Cream
 *     (#FEF9F1) yellows on warm-shifted screens.
 */

// ─── FULL RAMPS ──────────────────────────────────────────────────
// Available for fine-grained use (Remotion themes, custom components).
// For most UI work, use the semantic tokens below.

export const ramps = {
  green: {
    50: '#ECFDF3',
    100: '#D1FAE0',
    200: '#A7F3C4',
    300: '#6AE69B',
    400: '#34D470',
    500: '#16A34A',
    600: '#148A3D',
    700: '#0F6E30',
    800: '#0A5424',
    900: '#063B18',
    950: '#03220E',
  },
  amber: {
    50: '#FFF8EB',
    100: '#FEECC0',
    200: '#FDD888',
    300: '#FBBC40',
    400: '#F5A623',
    500: '#D48B0A',
    600: '#A96D06',
    700: '#7F5104',
    800: '#5C3B07',
    900: '#3D2704',
    950: '#231602',
  },
  neutral: {
    50: '#FAFAF8',
    100: '#F3F3F0',
    200: '#E5E5E1',
    300: '#D0D0CB',
    400: '#A3A39D',
    500: '#73726C',
    600: '#5A5955',
    700: '#454441',
    800: '#2E2D2B',
    900: '#1C1B1A',
    950: '#0F0F0E',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
    950: '#450A0A',
  },
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A5F',
    950: '#172554',
  },
  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    950: '#431407',
  },
} as const;

// ─── SEMANTIC TOKENS ─────────────────────────────────────────────
// Use these in components. Never reference raw hex in UI code.

export const colors = {
  // ── Primary brand ──────────────────────────────────────────────
  // Green is the brand. 600 for interactive elements, 700 for hover.
  // 500 is available but only for large fills (cards, illustrations)
  // where contrast against text isn't the concern.
  primary: {
    main: ramps.green[600], // #148A3D — buttons, links, active nav
    hover: ramps.green[700], // #0F6E30 — hover/pressed states
    light: ramps.green[400], // #34D470 — icons on dark, illustrations
    surface: ramps.green[50], // #ECFDF3 — tinted backgrounds, banners
    text: ramps.green[800], // #0A5424 — text on green-50 surfaces
  },

  // ── Accent ─────────────────────────────────────────────────────
  // Amber/gold for achievements, progress, highlights, badges.
  // NOT for warnings — that's orange (see feedback below).
  accent: {
    main: ramps.amber[400], // #F5A623 — progress fill, star ratings
    hover: ramps.amber[500], // #D48B0A — hover on accent elements
    light: ramps.amber[200], // #FDD888 — soft highlight backgrounds
    surface: ramps.amber[50], // #FFF8EB — achievement cards
    text: ramps.amber[800], // #5C3B07 — text on amber surfaces
  },

  // ── Neutral ────────────────────────────────────────────────────
  // Warm-tinted grays. Replaces Tailwind's default cool grays.
  neutral: {
    white: '#FFFFFF',
    50: ramps.neutral[50], // #FAFAF8 — page background
    100: ramps.neutral[100], // #F3F3F0 — card/surface background
    200: ramps.neutral[200], // #E5E5E1 — borders, dividers
    300: ramps.neutral[300], // #D0D0CB — stronger borders, disabled bg
    400: ramps.neutral[400], // #A3A39D — placeholder text, disabled
    500: ramps.neutral[500], // #73726C — secondary text
    600: ramps.neutral[600], // #5A5955 — icons, captions
    700: ramps.neutral[700], // #454441 — subheadings
    800: ramps.neutral[800], // #2E2D2B — body text (dark mode surface)
    900: ramps.neutral[900], // #1C1B1A — headings, primary text
  },

  // ── Feedback / semantic ────────────────────────────────────────
  // Each state gets its own distinct color. Success is NOT the same
  // as primary green — it uses a brighter shade so users can tell
  // "brand" from "you completed something."
  feedback: {
    success: ramps.green[500], // #16A34A — brighter than primary
    successLight: ramps.green[50], // #ECFDF3
    warning: ramps.orange[500], // #F97316 — orange, not amber
    warningLight: ramps.orange[50], // #FFF7ED
    error: ramps.red[600], // #DC2626
    errorLight: ramps.red[50], // #FEF2F2
    info: ramps.blue[600], // #2563EB
    infoLight: ramps.blue[50], // #EFF6FF
  },

  // ── Category colors ────────────────────────────────────────────
  // For course categories / skill areas. Each is distinct even on
  // low-quality screens. Contrast-tested for use as card accents.
  categories: {
    agriculture: ramps.green[600], // #148A3D
    greenEnergy: ramps.amber[400], // #F5A623 — was orange, now amber
    construction: ramps.orange[500], // #F97316
    business: ramps.blue[600], // #2563EB
    digital: ramps.green[700], // #0F6E30 — for Google Workspace etc.
  },

  // ── Text ───────────────────────────────────────────────────────
  text: {
    primary: ramps.neutral[900], // #1C1B1A
    secondary: ramps.neutral[500], // #73726C
    tertiary: ramps.neutral[400], // #A3A39D
    inverse: '#FFFFFF',
    disabled: ramps.neutral[300], // #D0D0CB
    link: ramps.green[600], // #148A3D — matches primary
  },

  // ── Backgrounds ────────────────────────────────────────────────
  background: {
    primary: '#FFFFFF', // White, not cream
    secondary: ramps.neutral[50], // #FAFAF8
    tertiary: ramps.neutral[100], // #F3F3F0
    overlay: 'rgba(0, 0, 0, 0.5)',
    // Tinted surfaces for feature areas
    greenTint: ramps.green[50], // #ECFDF3
    amberTint: ramps.amber[50], // #FFF8EB
  },

  // ── Borders ────────────────────────────────────────────────────
  border: {
    light: ramps.neutral[200], // #E5E5E1
    medium: ramps.neutral[300], // #D0D0CB
    dark: ramps.neutral[400], // #A3A39D
    focus: ramps.green[600], // #148A3D — focus rings
  },
} as const;

export type ColorTokens = typeof colors;
export type ColorRamps = typeof ramps;
