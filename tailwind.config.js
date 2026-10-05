/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          'from': { opacity: '0', transform: 'translateY(-4px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        menuEnter: {
          'from': { opacity: '0', transform: 'scaleY(0.92) scaleX(0.96)' },
          'to': { opacity: '1', transform: 'scaleY(1) scaleX(1)' },
        },
      },
      animation: {
        'menu-enter': 'menuEnter 200ms cubic-bezier(0.05, 0.7, 0.1, 1)',
      },
    },
  },
  plugins: [],
}
