import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
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
        display: ['var(--font-aeonik)', 'sans-serif'],
        sans: ['var(--font-ibm-plex-arabic)', 'var(--font-inter)', 'sans-serif'],
        en: ['var(--font-inter)', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        none: 'none',
        DEFAULT: 'none',
        sm: 'none',
        md: 'none',
        lg: 'none',
        xl: 'none',
        '2xl': 'none',
        inner: 'none',
      },
      animation: {
        'fade-in': 'fadeIn 0.15s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'spin-slow': 'spin 2s linear infinite',
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
