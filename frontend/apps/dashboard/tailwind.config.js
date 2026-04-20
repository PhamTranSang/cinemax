import preset from "../../libs/ui/tailwind-preset.js"

/** @type {import('tailwindcss').Config} */
export default {
  presets: [preset],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
    "../../libs/ui/src/**/*.{ts,tsx,js,jsx}",
  ],
}
