/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
  theme: {
    extend: {
      colors: {
        black: "#202123",
        lightBlack: "#343541",
      },
    },
  },
  plugins: [flowbite.plugin()],
};
