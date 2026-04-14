/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
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
        border: '#e4e4e8',
        'text-primary': '#191c1f',
        'text-secondary': '#505a63',
        'text-muted': '#8d969e',
        bg: '#f8f8fa',
      },
    },
  },
  plugins: [],
};
