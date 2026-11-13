import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        // Remap neutral slate to Warm Cream, Latte & Dark Chocolate Espresso palette
        slate: {
          50: "#f8f2e8",
          100: "#efe5d5",
          200: "#e2d2bc",
          300: "#cbb395",
          400: "#9c7e61",
          500: "#785c42",
          600: "#5a412c",
          700: "#422d1d",
          800: "#2d1d11",
          900: "#1e120a",
          950: "#120a05",
        },
        // Remap indigo & violet to Zona Waktu Signature Espresso & Gula Aren Caramel palette
        indigo: {
          50: "#fbf3e6",
          100: "#f4e3c9",
          200: "#e7c89d",
          300: "#d8a86c",
          400: "#c48945",
          500: "#9a6026",
          600: "#6b3c16",
          700: "#532d0f",
          800: "#3d200a",
          900: "#291506",
          950: "#170b03",
        },
        violet: {
          50: "#fbf3e6",
          100: "#f4e3c9",
          200: "#e7c89d",
          300: "#d8a86c",
          400: "#c48945",
          500: "#9a6026",
          600: "#6b3c16",
          700: "#532d0f",
          800: "#3d200a",
          900: "#291506",
          950: "#170b03",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
