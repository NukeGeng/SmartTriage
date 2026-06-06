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
        ink: "#202124",
        panel: "#f7f8f6",
        line: "#dfe5dc",
        brand: {
          50: "#edfdf6",
          100: "#d4f7e8",
          500: "#14a06f",
          600: "#0b7f58",
          700: "#075f44"
        },
        signal: {
          cyan: "#0e7490",
          amber: "#b45309",
          rose: "#be123c"
        }
      },
      boxShadow: {
        soft: "0 12px 35px rgba(32, 33, 36, 0.08)"
      }
    },
  },
  plugins: [],
};

export default config;
