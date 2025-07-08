/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        buff: {
          DEFAULT: '#cb997e',
          100: '#2f1d13',
          200: '#5f3a26',
          300: '#8e5739',
          400: '#b97550',
          500: '#cb997e',
          600: '#d6ae99',
          700: '#e0c3b2',
          800: '#ebd7cc',
          900: '#f5ebe5'
        },
        desert_sand: {
          DEFAULT: '#ddbea9',
          100: '#372316',
          200: '#6f472c',
          300: '#a66a42',
          400: '#c69270',
          500: '#ddbea9',
          600: '#e3cab9',
          700: '#ead7ca',
          800: '#f1e4dc',
          900: '#f8f2ed'
        },
        champagne_pink: {
          DEFAULT: '#ffe8d6',
          100: '#5e2900',
          200: '#bc5100',
          300: '#ff7e1b',
          400: '#ffb378',
          500: '#ffe8d6',
          600: '#ffedde',
          700: '#fff1e7',
          800: '#fff6ef',
          900: '#fffaf7'
        },
        ash_gray: {
          DEFAULT: '#b7b7a4',
          100: '#27271f',
          200: '#4e4e3d',
          300: '#75755c',
          400: '#99997d',
          500: '#b7b7a4',
          600: '#c6c6b6',
          700: '#d4d4c8',
          800: '#e2e2da',
          900: '#f1f1ed'
        },
        sage: {
          DEFAULT: '#a5a58d',
          100: '#22221b',
          200: '#454536',
          300: '#676751',
          400: '#89896c',
          500: '#a5a58d',
          600: '#b7b7a4',
          700: '#c9c9ba',
          800: '#dbdbd1',
          900: '#edede8'
        },
        reseda_green: {
          DEFAULT: '#6b705c',
          100: '#151612',
          200: '#2b2d25',
          300: '#404337',
          400: '#565a49',
          500: '#6b705c',
          600: '#8b9178',
          700: '#a8ac9a',
          800: '#c5c8bc',
          900: '#e2e3dd'
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