/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        // Chinese-inspired color palette
        primary: {
          DEFAULT: "#B91C1C", // Vermilion red (traditional Chinese red)
          light: "#EF4444",
          dark: "#7F1D1D",
        },
        secondary: {
          DEFAULT: "#0F766E", // Jade green
          light: "#14B8A6",
          dark: "#115E59",
        },
        accent: {
          DEFAULT: "#B45309", // Gold
          light: "#F59E0B",
          dark: "#78350F",
        },
        neutral: {
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          800: "#292524",
          900: "#1C1917",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', '"Noto Sans"', "system-ui", "sans-serif"],
        heading: ['"Noto Serif SC"', '"Noto Serif"', "Georgia", "serif"],
        decorative: ['"Ma Shan Zheng"', "cursive"],
      },
      // Custom box shadow for card hover effects
      boxShadow: {
        "card-hover":
          "0 15px 30px -5px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.05)",
      },
      // For animations and transitions
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideInFromLeft: {
          "0%": { transform: "translateX(-30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideInFromRight: {
          "0%": { transform: "translateX(30px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-out",
        slideUp: "slideUp 0.8s ease-out",
        slideInFromLeft: "slideInFromLeft 0.6s ease-out",
        slideInFromRight: "slideInFromRight 0.6s ease-out",
        scaleIn: "scaleIn 0.5s ease-out",
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
      },
    },
  },
  plugins: [],
};
