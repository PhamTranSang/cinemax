const preset = require("../../libs/ui/tailwind-preset.js")

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
    "../../libs/ui/src/**/*.{ts,tsx,js,jsx}",
  ],
}
