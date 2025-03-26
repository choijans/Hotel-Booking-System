/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Scan all JS/TS/JSX/TSX files in src/
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          600: '#219995',
        },
        beige: {
          600: '#F6F3E9'
        }
      },
    }, // Extend default Tailwind theme here
  },
  plugins: [], // Add Tailwind plugins here if needed
};
