/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#1e1b54",
          50: "#f0f0ff",
          100: "#e0e0fe",
          200: "#c4c3fc",
          500: "#4d4a9f",
          600: "#1e1b54",
          700: "#17144a",
          900: "#0d0b33",
        },
      },
      boxShadow: {
        panel: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.05)",
        card: "0 4px 16px 0 rgba(30,27,84,0.08)",
      },
    },
  },
  plugins: [],
};
