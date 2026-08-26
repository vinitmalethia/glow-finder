/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glow: {
          orange: '#F07E00',
          'orange-hover': '#D96E00',
          'orange-light': '#FFF3E8',
          'orange-border': '#FEE0C8',
          navy: '#1B2A4A',
          'navy-dark': '#0F1B30',
          'navy-light': '#2A3C60',
          slate: '#5A6882',
          'slate-light': '#8A97A8',
          blue: '#1E3A8A',
          'blue-light': '#EBF4FE',
          'blue-tag': '#E3EFFC',
          'blue-tag-text': '#3B7BBF',
          'blue-banner': '#E8F2FC',
          bg: '#FAFCFF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-soft': '0 15px 30px -10px rgba(240, 126, 0, 0.3)',
        'card-soft': '0 4px 20px -2px rgba(27, 42, 74, 0.05)',
        'card-hover': '0 12px 30px -4px rgba(27, 42, 74, 0.1)',
        'podium': '0 25px 50px -12px rgba(15, 23, 42, 0.15)',
      }
    },
  },
  plugins: [],
}
