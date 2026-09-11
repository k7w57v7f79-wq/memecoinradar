/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#0A0612",
        panel: "#150B24",
        panel2: "#1E1030",
        line: "#382655",
        hot: "#FF3D71",
        gain: "#C6FF3D",
        gold: "#FFC53D",
        ink: "#F3EEFF",
        mute: "#9483B8",
      },
      fontFamily: {
        display: ["'Archivo Black'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        num: ["'JetBrains Mono'", "monospace"],
      },
      keyframes: {
        glowIn: {
          "0%": { boxShadow: "0 0 0 0 rgba(198,255,61,0)", transform: "scale(0.98)" },
          "30%": { boxShadow: "0 0 24px 2px rgba(198,255,61,0.35)" },
          "100%": { boxShadow: "0 0 0 0 rgba(198,255,61,0)", transform: "scale(1)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        glowIn: "glowIn 1.2s ease-out",
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};
