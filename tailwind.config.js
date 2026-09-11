/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0b0e11",
        panel: "#151a21",
        border: "#242b35",
        accent: "#22c55e",
        danger: "#ef4444",
        warn: "#f59e0b",
      },
    },
  },
  plugins: [],
};
