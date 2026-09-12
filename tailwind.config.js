/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Geist', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        transit: {
          bus: '#F59E0B',
          metro: '#6366F1',
          success: '#10B981',
          danger: '#EF4444',
          brand: '#2563EB',
        }
      }
    },
  },
  plugins: [],
}
