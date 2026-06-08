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
        ink: "hsl(var(--color-ink) / <alpha-value>)",
        panel: "hsl(var(--color-canvas) / <alpha-value>)",
        line: "hsl(var(--color-line) / <alpha-value>)",
        command: {
          bg: "hsl(var(--color-bg) / <alpha-value>)",
          soft: "hsl(var(--color-bg-soft) / <alpha-value>)",
          surface: "hsl(var(--color-surface) / <alpha-value>)",
          elevated: "hsl(var(--color-surface-elevated) / <alpha-value>)",
          text: "hsl(var(--color-text-primary) / <alpha-value>)",
          muted: "hsl(var(--color-text-secondary) / <alpha-value>)",
          border: "hsl(var(--color-border))",
        },
        brand: {
          50: "hsl(var(--color-brand-50) / <alpha-value>)",
          100: "hsl(var(--color-brand-100) / <alpha-value>)",
          500: "hsl(var(--color-brand-500) / <alpha-value>)",
          600: "hsl(var(--color-brand-600) / <alpha-value>)",
          700: "hsl(var(--color-brand-700) / <alpha-value>)",
        },
        signal: {
          cyan: "hsl(var(--color-info) / <alpha-value>)",
          amber: "hsl(var(--color-warning) / <alpha-value>)",
          rose: "hsl(var(--color-danger) / <alpha-value>)",
        },
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        command: "var(--shadow-command)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
        mono: "var(--font-mono)",
      },
      zIndex: {
        sticky: "var(--z-sticky)",
        overlay: "var(--z-overlay)",
        toast: "var(--z-toast)",
        mascot: "var(--z-mascot)",
      },
      transitionTimingFunction: {
        "out-expo": "var(--ease-out-expo)",
        spring: "var(--ease-spring)",
        smooth: "var(--ease-smooth)",
        snappy: "var(--ease-snappy)",
      },
    },
  },
  plugins: [],
};

export default config;
