/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['"Inter"', "sans-serif"],
        bangla: ['"Hind Siliguri"', "sans-serif"],
      },
      colors: {
        ds: {
          bg: "#01161e",
          surface: "#124559",
          border: "#598392",
          muted: "#aec3b0",
          text: "#eff6e0",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        deutschshikhi: {
          primary: "#124559",
          secondary: "#598392",
          accent: "#aec3b0",
          neutral: "#124559",
          "base-100": "#01161e",
          "base-200": "#124559",
          "base-300": "#598392",
          info: "#598392",
          success: "#aec3b0",
          warning: "#aec3b0",
          error: "#598392",
        },
      },
    ],
  },
};
