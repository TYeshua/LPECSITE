// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 1s ease-in-out',
        'fade-in-up': 'fadeInUp 1s ease-in-out',
        "marquee-left": "marquee-left var(--duration, 30s) linear infinite",
        "marquee-right": "marquee-right var(--duration, 30s) linear infinite",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        "marquee-left": {
          "from": { transform: "translateX(0)" },
          "to": { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-right": {
          "from": { transform: "translateX(calc(-100% - var(--gap)))" },
          "to": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
}