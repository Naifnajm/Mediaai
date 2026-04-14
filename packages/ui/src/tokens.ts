// ═══════════════════════════════════════════════════════
//  MediaOS Design System — Revolut-Inspired Tokens
//  ZERO shadows — depth via contrast + whitespace only
// ═══════════════════════════════════════════════════════

export const colors = {
  dark: '#191c1f',
  white: '#ffffff',
  surface: '#f4f4f4',
  surface2: '#eaeaea',
  accent: '#494fdf',
  success: '#00a87e',
  warning: '#ec7e00',
  danger: '#e23b4a',
  info: '#007bc2',
  textPrimary: '#191c1f',
  textSecondary: '#505a63',
  textMuted: '#8d969e',
  border: '#e4e4e8',
  bg: '#f8f8fa',
} as const;

export const radius = {
  sm: '10px',
  md: '16px',
  lg: '20px',
  pill: '9999px',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '40px',
  '3xl': '48px',
} as const;

export const typography = {
  displayHero: { fontFamily: 'Aeonik Pro', fontSize: '80px', fontWeight: 500, letterSpacing: '-0.8px' },
  sectionHeading: { fontFamily: 'Aeonik Pro', fontSize: '48px', fontWeight: 500, letterSpacing: '-0.48px' },
  cardTitle: { fontFamily: 'Aeonik Pro', fontSize: '32px', fontWeight: 500, letterSpacing: '-0.32px' },
  featureTitle: { fontFamily: 'Aeonik Pro', fontSize: '24px', fontWeight: 500, letterSpacing: '0' },
  navButton: { fontFamily: 'Aeonik Pro', fontSize: '20px', fontWeight: 500, letterSpacing: '0' },
  bodyLarge: { fontFamily: 'IBM Plex Sans Arabic, Inter', fontSize: '18px', fontWeight: 400, letterSpacing: '-0.09px' },
  body: { fontFamily: 'IBM Plex Sans Arabic, Inter', fontSize: '16px', fontWeight: 400, letterSpacing: '+0.24px' },
  caption: { fontFamily: 'Inter', fontSize: '14px', fontWeight: 400, letterSpacing: '+0.28px' },
  label: { fontFamily: 'Inter', fontSize: '12px', fontWeight: 600, letterSpacing: '+0.48px', textTransform: 'uppercase' as const },
} as const;

export const zIndex = {
  sidebar: 100,
  topbar: 50,
  modal: 200,
  toast: 300,
  tooltip: 400,
} as const;
