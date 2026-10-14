import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#622FFD",
          // Roxo para TEXTO sobre fundo escuro: #622FFD dá ~2.8:1 no #0A0A0A (reprova AA).
          light: "#A48BFF",
        },
        secondary: "#F94706",
        dark: "#0A0A0A",
        // Tokens de tema (ver app/globals.css). Use estes em vez de hex fixo nas áreas claras.
        canvas: "rgb(var(--c-canvas) / <alpha-value>)",
        surface: {
          DEFAULT: "rgb(var(--c-surface) / <alpha-value>)",
          elevated: "rgb(var(--c-surface-elevated) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--c-ink) / <alpha-value>)",
          secondary: "rgb(var(--c-ink-secondary) / <alpha-value>)",
          muted: "rgb(var(--c-ink-muted) / <alpha-value>)",
        },
        line: "rgb(var(--c-line) / <alpha-value>)",
        accent: "rgb(var(--c-accent) / <alpha-value>)",
        link: "rgb(var(--c-link) / <alpha-value>)",
        focus: "rgb(var(--c-focus) / <alpha-value>)",
        success: "rgb(var(--c-success) / <alpha-value>)",
        warning: "rgb(var(--c-warning) / <alpha-value>)",
        error: "rgb(var(--c-error) / <alpha-value>)",
        light: "#F8F8F8",
        white: "#FFFFFF",
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #6670FF, #3841B9)',
      },
      fontFamily: {
        display: ['var(--font-degular)', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
      fontSize: {
        'h1': ['96px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h2': ['72px', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'h3': ['48px', { lineHeight: '1.2' }],
        'body': ['18px', { lineHeight: '1.6' }],
        'caption': ['14px', { lineHeight: '1.5' }],
      },
      gridTemplateColumns: { '12': 'repeat(12, minmax(0, 1fr))' },
      gap: { 'gutter': '32px' }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
