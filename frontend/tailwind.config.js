/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Confident Algerian Mobility Brand: Deep forest green, warm ivory, near-black ink, restrained citrus
        forest: {
          50: '#F2F7F4',
          100: '#E1EDE6',
          200: '#C2DBCF',
          300: '#8FBFA9',
          400: '#5A9F7E',
          500: '#2D6A4F',
          600: '#1E4D38',
          700: '#173C2C', // Signature deep Algerian forest green
          800: '#112E22',
          900: '#0A1C14',
          950: '#05100B',
          DEFAULT: '#173C2C',
        },
        ivory: {
          50: '#FDFCFB',
          100: '#FAF8F5', // Signature warm ivory background
          200: '#F3EFE8', // Card background / muted panels
          300: '#E6E0D6', // Hairline borders
          400: '#D4CCBF',
          500: '#B8ADA0',
          DEFAULT: '#FAF8F5',
        },
        ink: {
          50: '#F8F9F8',
          100: '#F0F1EF',
          200: '#E1E3DF',
          300: '#C2C5BE',
          400: '#8E9389',
          500: '#64695F',
          600: '#484D44',
          700: '#32362F',
          800: '#21241F',
          900: '#141613', // Near-black ink
          950: '#0B0D0A',
          DEFAULT: '#141613',
        },
        citrus: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706', // Restrained warm amber / citrus accent
          700: '#B45309',
          800: '#92400E',
          DEFAULT: '#D97706',
        },
        // Compatibility aliases for existing components
        brand: {
          50: '#F2F7F4',
          100: '#E1EDE6',
          200: '#C2DBCF',
          300: '#8FBFA9',
          400: '#5A9F7E',
          500: '#2D6A4F',
          600: '#1E4D38',
          700: '#173C2C',
          800: '#112E22',
          900: '#0A1C14',
          950: '#05100B',
          DEFAULT: '#173C2C',
        },
        slate: {
          50: '#FAF8F5',
          100: '#F3EFE8',
          200: '#E6E0D6',
          300: '#D4CCBF',
          400: '#8E9389',
          500: '#64695F',
          600: '#484D44',
          700: '#32362F',
          800: '#21241F',
          900: '#141613',
          950: '#0B0D0A',
        },
        accent: {
          amber: '#D97706',
          amberLight: '#FEF3C7',
          amberDark: '#B45309',
          blue: '#1E3A8A',
          blueLight: '#EFF6FF',
          blueDark: '#1E3A8A',
          purple: '#6B21A8',
          purpleLight: '#F3E8FF',
          purpleDark: '#581C87',
        },
      },
      fontFamily: {
        serif: [
          'Fraunces',
          'Playfair Display',
          'Georgia',
          'serif',
        ],
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Noto Sans Arabic',
          'sans-serif',
        ],
        arabic: [
          'Noto Sans Arabic',
          'Cairo',
          'Plus Jakarta Sans',
          'sans-serif',
        ],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(20, 22, 19, 0.04)',
        'card': '0 1px 3px 0 rgba(20, 22, 19, 0.05), 0 1px 2px -1px rgba(20, 22, 19, 0.05)',
        'elevated': '0 8px 24px -4px rgba(20, 22, 19, 0.08), 0 2px 6px -1px rgba(20, 22, 19, 0.04)',
        'search': '0 12px 32px -4px rgba(20, 22, 19, 0.12), 0 4px 10px -2px rgba(20, 22, 19, 0.05)',
        'soft-xs': '0 1px 2px 0 rgba(20, 22, 19, 0.04)',
        'soft-sm': '0 1px 3px 0 rgba(20, 22, 19, 0.05), 0 1px 2px -1px rgba(20, 22, 19, 0.05)',
        'soft-md': '0 4px 6px -1px rgba(20, 22, 19, 0.06), 0 2px 4px -2px rgba(20, 22, 19, 0.04)',
      },
    },
  },
  plugins: [],
};
