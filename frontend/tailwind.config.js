/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-Tech Modern Algerian Mobility Palette (BlaBlaCar / Uber Tier)
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669', // Signature tech emerald
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
          950: '#022C22',
          DEFAULT: '#059669',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        accent: {
          amber: '#F59E0B',
          amberLight: '#FEF3C7',
          amberDark: '#B45309',
          blue: '#2563EB',
          blueLight: '#EFF6FF',
          blueDark: '#1D4ED8',
          purple: '#7C3AED',
          purpleLight: '#F5F3FF',
          purpleDark: '#5B21B6',
        },
      },
      fontFamily: {
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
        'soft-xs': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'soft-sm': '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
        'soft-md': '0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.06)',
        'soft-lg': '0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04)',
        'soft-xl': '0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'search': '0 12px 36px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
      },
    },
  },
  plugins: [],
};
