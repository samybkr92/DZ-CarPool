/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Blue Jeans / Denim Palette
        jeans: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6', // Blue Jeans bright
          600: '#2563EB', // Blue Jeans primary
          700: '#1D4ED8', // Deep denim
          800: '#1E40AF',
          900: '#1E3A8A',
          950: '#172554',
          DEFAULT: '#2563EB',
        },
        // Dark Mode Surfaces (Obsidian, Midnight Denim & Slate)
        dark: {
          canvas: '#0B0F17',   // Root canvas
          card: '#131D2E',     // Card surface
          cardHover: '#18253A',// Card hover
          border: '#1E2C42',   // Hairline border
          borderLight: '#2A3C58',
          input: '#0E1624',    // Input fields
          muted: '#94A3B8',    // Muted text
          text: '#F8FAFC',     // Primary text
        },
        // Alias forest/brand to Jeans for backwards compatibility
        forest: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#172554',
          950: '#0B0F17',
          DEFAULT: '#2563EB',
        },
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#172554',
          950: '#0B0F17',
          DEFAULT: '#2563EB',
        },
        ivory: {
          50: '#18253A',
          100: '#131D2E',
          200: '#0E1624',
          300: '#1E2C42',
          400: '#2A3C58',
          500: '#94A3B8',
          DEFAULT: '#131D2E',
        },
        ink: {
          50: '#0B0F17',
          100: '#131D2E',
          200: '#1E2C42',
          300: '#475569',
          400: '#94A3B8',
          500: '#CBD5E1',
          600: '#E2E8F0',
          700: '#F1F5F9',
          800: '#F8FAFC',
          900: '#FFFFFF',
          DEFAULT: '#F8FAFC',
        },
        citrus: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          DEFAULT: '#D97706',
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
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.4)',
        'elevated': '0 8px 24px -4px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)',
        'search': '0 12px 32px -4px rgba(0, 0, 0, 0.6), 0 4px 10px -2px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
