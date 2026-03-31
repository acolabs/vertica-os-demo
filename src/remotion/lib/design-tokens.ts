// Design tokens matching globals.css dark theme
export const colors = {
  bg: '#0A0A0F',
  surface: '#111118',
  surfaceElevated: '#1A1A24',
  primary: '#2DB34A',
  primaryHover: '#249A3E',
  primary10: 'rgba(45, 179, 74, 0.15)',
  primary20: 'rgba(45, 179, 74, 0.25)',
  textPrimary: '#FFFFFF',
  textSecondary: '#A1A1AA',
  textMuted: '#71717A',
  border: '#2A2A34',
  borderSubtle: '#1F1F2A',
  cardBg: 'rgba(17, 17, 24, 0.7)',
  cardBorder: '#1A1A24',
  success: '#059669',
  warning: '#D97706',
  danger: '#E11D48',
  info: '#3B82F6',
  purple: '#8B5CF6',
} as const;

export const fonts = {
  sans: 'var(--font-geist-sans), system-ui, sans-serif',
  mono: 'var(--font-geist-mono), monospace',
} as const;
