// Synergy Construct Demo — Dark Enterprise Theme
// Single source of truth for all colors

export const theme = {
  bg: {
    base: '#0C0E12',
    surface: '#13161C',
    raised: '#1A1E27',
    overlay: 'rgba(12, 14, 18, 0.8)',
  },
  border: {
    default: '#252A35',
    hover: '#343B4A',
    active: '#4A5268',
  },
  text: {
    primary: '#E8ECF4',
    secondary: '#7A8499',
    tertiary: '#4A5268',
  },
  accent: {
    blue: '#3B7BF5',
    blueMuted: '#3B7BF520',
    orange: '#F97316',
    red: '#E31E24',
    redMuted: '#E31E2415',
  },
  status: {
    green: '#22C55E',
    greenMuted: '#22C55E15',
    amber: '#F59E0B',
    amberMuted: '#F59E0B15',
    red: '#EF4444',
    redMuted: '#EF444415',
    processing: '#60A5FA',
    processingMuted: '#60A5FA15',
  },
} as const;

// CSS class helpers for common patterns
export const surface = 'bg-[#13161C] border border-[#252A35]';
export const surfaceHover = 'hover:border-[#343B4A] hover:bg-[#1A1E27] transition-colors';
export const raised = 'bg-[#1A1E27] border border-[#343B4A]';
