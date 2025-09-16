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