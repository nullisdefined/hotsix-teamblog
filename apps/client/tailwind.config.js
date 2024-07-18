/** @type {import('tailwindcss').Config} */
// import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#764fe1",
        disable: "#d1d1d1",
        background: "#f8fafc",
        gray: "#94a3b8",
      },
    },
  },
  plugins: [],
};
