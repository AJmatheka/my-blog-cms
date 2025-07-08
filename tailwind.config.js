/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New minimal color palette
        sage: {
          50: '#f8f9f6',
          100: '#f0f2eb',
          200: '#e1e5d6',
          300: '#ccd5ae', // Primary sage
          400: '#b5c088',
          500: '#9ea862',
          600: '#7d8650',
          700: '#626742',
          800: '#4f5336',
          900: '#42462e'
        },
        cream: {
          50: '#fefdfb',
          100: '#fefae0', // Light cream
          200: '#fcf6d1',
          300: '#f9f0b8',
          400: '#f5e99f',
          500: '#f0e186',
          600: '#e6d46d',
          700: '#d4c054',
          800: '#b8a545',
          900: '#9c8a37'
        },
        warm: {
          50: '#fefcf9',
          100: '#faedcd', // Warm beige
          200: '#f5e1b3',
          300: '#f0d599',
          400: '#ebc97f',
          500: '#e6bd65',
          600: '#d4a373', // Warm brown
          700: '#c1924f',
          800: '#a67c42',
          900: '#8b6635'
        },
        mint: {
          50: '#f7faf7',
          100: '#e9edc9', // Soft mint
          200: '#dde5b5',
          300: '#d1dda1',
          400: '#c5d58d',
          500: '#b9cd79',
          600: '#a8c065',
          700: '#97b351',
          800: '#7d9543',
          900: '#637735'
        }
      },
      fontFamily: {
        'serif': ['Georgia', 'Times New Roman', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
}