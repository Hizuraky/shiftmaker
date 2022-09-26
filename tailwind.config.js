/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          pale: "#f0f9f8",
          light: "#8AC6D1",
          DEFAULT: "#72B4C0",
          dark: "#689CA6",
          text: "#385F5F"
        },
        secondary: {
          pale: "#fff8f9",
          light: "#FFB6B9",
          DEFAULT: "#EE8488",
          dark: "#008c8d"
        },
        tertiary: {
          light: "#FFB6B9",
          DEFAULT: "#EE8488",
          dark: "#008c8d"
        }
      }
    },
    screens: {
      xl: { max: "1279px" },
      lg: { max: "1023px" },
      md: { max: "767px" },
      sm: { max: "639px" },
      noPhone: "640px"
    }
  },
  plugins: []
}
