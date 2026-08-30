/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF5FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7E22CE',
          800: '#6B21A8',
          900: '#581C87',
          950: '#3B0764',
        },
        saffron: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        coral: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
        },
        warm: {
          50: '#FCFAF7',
          100: '#F7F3EB',
          200: '#ECE4D5',
          300: '#D9CDB8',
          400: '#AFA18B',
          500: '#7E705B',
          600: '#5C503D',
          700: '#3D3425',
          800: '#251F14',
          900: '#1A140B',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', '"Rozha One"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(107, 33, 168, 0.08), 0 2px 6px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(107, 33, 168, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 20px 40px -6px rgba(107, 33, 168, 0.16), 0 8px 16px -4px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
}
