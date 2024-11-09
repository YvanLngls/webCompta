/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,js}", 
  ],
  theme: {
    extend: {
      fontFamily:{
        droid: ['DroidSans', 'sans-serif']
      }
    }, 
  },
  plugins: [],
}