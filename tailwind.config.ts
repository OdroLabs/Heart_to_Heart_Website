import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        brand: {
          50: "#fdf2fd",
          100: "#fce3fc",
          200: "#ffbbfc",
          300: "#f28df0",
          400: "#df5bdb",
          500: "#b523b2",
          600: "#8b1089",
          700: "#741572",
          800: "#510c4f",
          900: "#390437",
          950: "#280026",
        },
        plum: {
          50: "#fdf2fd",
          100: "#fce3fc",
          200: "#ffbbfc",
          300: "#f28df0",
          400: "#df5bdb",
          500: "#b523b2",
          600: "#8b1089",
          700: "#741572",
          800: "#510c4f",
          900: "#390437",
          950: "#280026",
        },
        navy: {
          700: "#741572",
          800: "#510c4f",
          900: "#390437",
          950: "#280026",
        },
        teal: {
          50: "#fdf2fd",
          100: "#fce3fc",
          500: "#1B1BFD",
          600: "#8b1089",
          700: "#741572",
          800: "#510c4f",
          900: "#390437",
        },
        ruby: {
          DEFAULT: "#FF0402",
          500: "#FF0402",
        },
        "brand-orange": "#F77928",
        "brand-yellow": "#FEF01C",
        "brand-green": "#84C14C",
        ocean: {
          DEFAULT: "#1B1BFD",
          500: "#1B1BFD",
        },
        "light-purple": "#FFBBFC",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(5, 18, 37, 0.04), 0 8px 24px -8px rgba(5, 18, 37, 0.10)",
        "card-hover":
          "0 2px 4px rgba(5, 18, 37, 0.05), 0 20px 40px -12px rgba(0, 119, 182, 0.22)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 60px -20px rgba(0, 0, 0, 0.5)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(6px)" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.9s ease both",
        "bounce-soft": "bounce-soft 1.6s ease-in-out infinite",
        "fade-in": "fade-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
