/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./docs/**/*.{vue,js,ts,jsx,tsx,md}",
    "./docs/.vitepress/**/*.{vue,js,ts,jsx,tsx,md}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}