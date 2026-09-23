import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        yard: {
          bg: "#0d0d0d",
          text: "#e2e2e2",
          amber: "#C9983A",
          dim: "#666666",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
