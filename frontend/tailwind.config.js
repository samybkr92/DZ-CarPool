/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Art Direction: Algerian Mobility Brand
        ivory: {
          DEFAULT: '#FAF8F5', // Warm ivory canvas
          50: '#FDFCFB',
          100: '#FAF8F5',
          200: '#F4EFEB',
          300: '#EBE3DA',
          400: '#DECFC1',
        },
        forest: {
          50: '#F0F6F2',
          100: '#DEECE4',
          200: '#BFDBCB',
          300: '#94C3AD',
          400: '#5FA386',
          500: '#2F8562',
          600: '#156B48',
          700: '#0C4A32', // Primary deep Algerian forest green
          800: '#083725',
          900: '#052317', // Deepest forest ink
        },
        ink: {
          50: '#F8F9FA',
          100: '#F1F4F6',
          200: '#E4E9EC',
          300: '#CBD5DC',
          400: '#9EABB4',
          500: '#6E7D88',
          600: '#4F5E68',
          700: '#34414A',
          800: '#202A30',
          900: '#111827', // Near-black obsidian ink
        },
        citrus: {
          50: '#FFFDF5',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706', // Restrained warm Algerian ochre/citrus
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Backward compatibility mappings
        brand: {
          50: '#F0F6F2',
          100: '#DEECE4',
          200: '#BFDBCB',
          300: '#94C3AD',
          400: '#5FA386',
          500: '#2F8562',
          600: '#0C4A32',
          700: '#083725',
          800: '#052317',
          900: '#03170F',
        },
        canvas: '#FAF8F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Noto Sans Arabic', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'Cairo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(17, 24, 39, 0.04), 0 1px 2px -1px rgba(17, 24, 39, 0.04)',
        'card': '0 2px 8px -1px rgba(17, 24, 39, 0.05), 0 1px 3px -1px rgba(17, 24, 39, 0.03)',
        'elevated': '0 8px 24px -4px rgba(17, 24, 39, 0.08), 0 4px 12px -2px rgba(17, 24, 39, 0.04)',
      },
    },
  },
  plugins: [],
}
