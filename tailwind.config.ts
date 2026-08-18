import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        // Brand palette
        ink: {
          DEFAULT: "#0A2540", // Dark Blue
          50: "#eef3f8",
          100: "#d5e0ec",
          900: "#0A2540",
          950: "#061726",
        },
        royal: {
          DEFAULT: "#2563EB", // Royal Blue
          50: "#eff5ff",
          100: "#dbe8fe",
          200: "#bfd7fe",
          300: "#93bbfd",
          400: "#609afa",
          500: "#2563EB",
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#172554",
        },
        mist: {
          DEFAULT: "#F4F7FB", // Light Gray
          100: "#F8FAFC",
          200: "#EEF2F7",
          300: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(10, 37, 64, 0.18)",
        glow: "0 0 60px -12px rgba(37, 99, 235, 0.55)",
        card: "0 4px 24px -8px rgba(10, 37, 64, 0.12)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(to right, rgba(37,99,235,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.06) 1px, transparent 1px)",
        "hero-radial":
          "radial-gradient(60% 60% at 50% 0%, rgba(37,99,235,0.22) 0%, rgba(10,37,64,0) 70%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-22px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "dash": {
          to: { strokeDashoffset: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.4,0,0.2,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
