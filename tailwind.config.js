/** @type {import('tailwindcss').Config} */
module.exports = {
  content: module.exports = {
    content: [
      './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    options: {
      safelist: ['bg-red-green', 'bg-green-red'],
    },
    theme: {
      extend: {
      },
    },
    variants: {},
    plugins: [],
  }
}
