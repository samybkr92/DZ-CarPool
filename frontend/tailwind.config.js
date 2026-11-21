/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#0D7A53', // Algerian Green hero accent
          700: '#085338',
          800: '#06402b',
          900: '#03261a',
        },
        ink: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          500: '#64748b',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a', // Deep midnight text
        },
        canvas: '#FAF9F6', // Warm off-white
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
