/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'input': '0 0 5px 0px rgba(43, 184, 240, 0.5)',
      }
    },
  },
  plugins: [],
}

