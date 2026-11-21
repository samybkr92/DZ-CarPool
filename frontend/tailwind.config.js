/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Art Direction: Premium Algerian Mobility Brand (Luminous, crisp, confident)
        ivory: {
          DEFAULT: '#FFFFFF',
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F4F4F5',
          300: '#E4E4E7',
          400: '#D4D4D8',
        },
        forest: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857', // Algerian Emerald
          800: '#065F46', // Deep Algerian Cedar Forest
          900: '#064E3B', // Deepest forest ink
          950: '#022C22',
        },
        ink: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A', // Deepest obsidian ink
          950: '#020617',
        },
        citrus: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706', // Warm Algerian ochre / desert gold
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Backward compatibility mappings
        brand: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#047857',
          700: '#065F46',
          800: '#064E3B',
          900: '#022C22',
        },
        canvas: '#F8FAFC',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['"Noto Sans Arabic"', 'Cairo', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card': '0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)',
        'floating': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
        'elevated': '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
      },
      borderRadius: {
        'pill': '9999px',
      },
    },
  },
  plugins: [],
}
