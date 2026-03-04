import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fdfbf7",
        foreground: "#2d2d2d",
        muted: "#e5e0d8",
        accent: "#ff4d4d",
        border: "#2d2d2d",
        secondary: "#2d5da1",
      },
      fontFamily: {
        heading: ["var(--font-kalam)", "cursive"],
        body: ["var(--font-patrick-hand)", "cursive"],
      },
      boxShadow: {
        hard: "4px 4px 0px 0px #2d2d2d",
        "hard-lg": "8px 8px 0px 0px #2d2d2d",
        "hard-sm": "2px 2px 0px 0px #2d2d2d",
      },
      borderRadius: {
        wobbly: "255px 15px 225px 15px / 15px 225px 15px 255px",
        "wobbly-md": "15px 225px 15px 255px / 255px 15px 225px 15px",
      },
    },
  },
  plugins: [],
};
export default config;
