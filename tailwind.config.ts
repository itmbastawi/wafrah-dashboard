import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#B8924A",
          50: "#F7F3EB",
          100: "#EFE6D6",
          200: "#DFCDAC",
          300: "#CFB482",
          400: "#BF9B58",
          500: "#B8924A",
          600: "#8F7339",
          700: "#6B5629",
          800: "#47391A",
          900: "#231C0D",
        },
        teal: {
          DEFAULT: "#1D9E75",
          50: "#E6F5F0",
          100: "#CCE9E1",
          200: "#99D3C3",
          300: "#66BDA5",
          400: "#33A787",
          500: "#1D9E75",
          600: "#177D5C",
          700: "#115C44",
          800: "#0B3B2B",
          900: "#051A13",
        },
        rose: {
          DEFAULT: "#D4537E",
          50: "#FCEEF3",
          100: "#F8DCE6",
          200: "#F1B9CD",
          300: "#EA96B4",
          400: "#E3739B",
          500: "#D4537E",
          600: "#A74163",
          700: "#7D3049",
          800: "#541E30",
          900: "#2B0E18",
        },
        aura: {
          gold: "#B8924A",
          teal: "#1D9E75",
          rose: "#D4537E",
          blue: "#3B82F6",
          dark: "#0F0F0F",
          "dark-card": "#1A1A1A",
          "dark-border": "#2A2A2A",
          light: "#FAFAFA",
          "light-card": "#FFFFFF",
          "light-border": "#E5E5E5",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant-garamond)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderWidth: {
        DEFAULT: "0.5px",
      },
    },
  },
  plugins: [],
};

export default config;