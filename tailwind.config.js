/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f8ff',
          100: '#e0f0ff',
          200: '#cce4ff',
          300: '#b3d7ff',
          400: '#99caff',
          500: '#80bcff',
          600: '#66adff',
          700: '#4d9fff',
          800: '#3392ff',
          900: '#1a85ff',
          950: '#0078ff',
        },
        secondary: {
          50: '#f9f5ff',
          100: '#f2e8ff',
          200: '#e9d9ff',
          300: '#d9c2ff',
          400: '#c9abff',
          500: '#b994ff',
          600: '#a97dff',
          700: '#9966ff',
          800: '#894fff',
          900: '#7938ff',
          950: '#6921ff',
        },
        accent: {
          50: '#fff7f0',
          100: '#ffebdb',
          200: '#ffd9c2',
          300: '#ffc7a8',
          400: '#ffb58f',
          500: '#ffa375',
          600: '#ff915c',
          700: '#ff7f42',
          800: '#ff6d29',
          900: '#ff5b0f',
          950: '#ff4800',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
}
