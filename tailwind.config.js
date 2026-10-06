/** @type {import('tailwindcss').Config} */
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        mustard: "#CCA42A",
        mauve: "#A5818D",
        sage: "#92A581",
        cream: "#FFF5F2",
        text: "#1A1A1A",
      },
      keyframes: {
        'dialog-in': {
          from: { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          to: { opacity: '1', transform: 'none' },
        },
      },
      animation: {
        'dialog-in': 'dialog-in 200ms ease-out',
      },
      fontFamily: {
        display: ["Poppins", "serif"],
        body: ["Poppins", "sans-serif"],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
        },
      },
    },
  },
  plugins: [],
}