/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Art Direction: Premium Algerian Mobility Brand
        // Warm ivory / stone canvas
        ivory: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F4EFE6',
          300: '#EAE3D6',
          400: '#DDD4C3',
          DEFAULT: '#FAF7F2',
        },
        // Deep Algerian Atlas Forest Green (Matte, luxury, organic)
        forest: {
          50: '#F2F7F4',
          100: '#E2EDE6',
          200: '#C4DBCD',
          300: '#97C0A7',
          400: '#649E7C',
          500: '#3D7E5A',
          600: '#276243',
          700: '#1B4D34',
          800: '#16382C', // Signature deep forest
          900: '#0F281F',
          950: '#071711',
          DEFAULT: '#16382C',
        },
        // Near-black charcoal ink (No harsh blue-slate)
        ink: {
          50: '#F6F7F6',
          100: '#ECEEEC',
          200: '#D6D9D7',
          300: '#ADB3AF',
          400: '#7E8681',
          500: '#5A625D',
          600: '#434A46',
          700: '#303632',
          800: '#212623',
          900: '#141716', // Primary ink
          950: '#0B0D0C',
          DEFAULT: '#141716',
        },
        // Restrained Citrus Accent (Mediterranean terracotta / clementine)
        citrus: {
          50: '#FCF7F3',
          100: '#F8ECE3',
          200: '#F0D5C3',
          300: '#E4B497',
          400: '#D98F66',
          500: '#D96B27', // Signature citrus terracotta
          600: '#C2551A',
          700: '#A14114',
          800: '#823414',
          900: '#6B2D14',
          DEFAULT: '#D96B27',
        },
        // Warm architectural borders & lines
        sand: {
          100: '#F5F1E9',
          200: '#EAE5DC',
          300: '#DCD5C8',
          400: '#C8BEAD',
          DEFAULT: '#EAE5DC',
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
        serif: [
          'Newsreader',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif',
        ],
        arabic: [
          'Noto Sans Arabic',
          'Cairo',
          'Plus Jakarta Sans',
          'sans-serif',
        ],
      },
      boxShadow: {
        'fine': '0 1px 2px 0 rgba(20, 23, 22, 0.04)',
        'card': '0 2px 8px -2px rgba(20, 23, 22, 0.05), 0 1px 3px -1px rgba(20, 23, 22, 0.03)',
        'elevated': '0 12px 24px -6px rgba(20, 23, 22, 0.08), 0 4px 8px -2px rgba(20, 23, 22, 0.03)',
        'dropdown': '0 16px 32px -8px rgba(20, 23, 22, 0.12), 0 4px 12px -2px rgba(20, 23, 22, 0.04)',
      },
    },
  },
  plugins: [],
};
