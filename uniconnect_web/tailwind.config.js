/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uc-azul':  '#002344',
        'uc-dorado': '#b39055',
        'uc-gris':  '#F4F6F8',
      },
    },
  },
  plugins: [],
}
