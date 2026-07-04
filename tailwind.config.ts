import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#173D26",
          teal: "#5AA6B4",
          lime: "#BABC00",
          gold: "#F7CB3A",
          coral: "#F76F34",
          pink: "#EA6C93",
          cream: "#FFFDF7",
          soft: "#F8F4EA",
        },
      },
      fontFamily: {
        serifDisplay: ["var(--font-noto-serif-display)", "Georgia", "serif"],
        sans: ["var(--font-open-sans)", "Arial", "sans-serif"],
        script: ["var(--font-dancing-script)", "cursive"],
      },
      boxShadow: {
        soft: "0 24px 70px rgba(23, 61, 38, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;