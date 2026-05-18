/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "brand-dark": "#2C5EAD",
        "brand-medium": "#1591DC",
        "brand-light": "#4BB8FA",
        "brand-pale": "#C4E2F5",
      },
    },
  },
  plugins: [],
};
