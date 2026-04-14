import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    '../../apps/web/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#191c1f',
        accent: '#494fdf',
        success: '#00a87e',
        warning: '#ec7e00',
        danger: '#e23b4a',
        info: '#007bc2',
        surface: '#f4f4f4',
        'surface-2': '#eaeaea',
        border: '#e4e4e8',
        'text-primary': '#191c1f',
        'text-secondary': '#505a63',
        'text-muted': '#8d969e',
        bg: '#f8f8fa',
      },
      borderRadius: {
        sm: '10px',
        md: '16px',
        lg: '20px',
        pill: '9999px',
      },
      fontFamily: {
        display: ['Aeonik Pro', 'sans-serif'],
        sans: ['IBM Plex Sans Arabic', 'Inter', 'sans-serif'],
        en: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '14px' }],
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['13px', { lineHeight: '18px' }],
        base: ['15px', { lineHeight: '1.7' }],
        lg: ['16px', { lineHeight: '24px' }],
        xl: ['18px', { lineHeight: '28px' }],
        '2xl': ['20px', { lineHeight: '30px' }],
        '3xl': ['24px', { lineHeight: '32px' }],
        '4xl': ['32px', { lineHeight: '40px' }],
        '5xl': ['48px', { lineHeight: '56px' }],
        '6xl': ['80px', { lineHeight: '88px' }],
      },
      boxShadow: {
        // ZERO shadows — Revolut principle
        none: 'none',
      },
      // Remove default shadows
      dropShadow: {},
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};

export default config;
