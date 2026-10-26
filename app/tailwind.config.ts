import type { Config } from "tailwindcss";
export default { content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"] },
    colors: { navy: { 950: "#0a1224", 900: "#101b33", 800: "#1a2747", 700: "#2a3a60" },
      // Restrained accent: muted sage-lime instead of neon
      lime: { DEFAULT: "#a9cf6a", 50: "#f4f9ec", 100: "#e6f1d3", 400: "#bcda8a", 500: "#a9cf6a", 600: "#7fa53f", 700: "#5a7a2a" } } } }, plugins: [] } satisfies Config;
