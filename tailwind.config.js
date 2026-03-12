/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5", // Example: Indigo 600
        background: {
          light: "#f6f6f8", // From your globals.css
          dark: "#121121", // From your globals.css
        },
      },
    },
  },
  plugins: [],
};