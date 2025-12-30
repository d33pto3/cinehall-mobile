/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FAAA47",
        background: "#1A1A1A",
        card: "#262626",
        muted: "#CAC1C1",
        border: "#333333",
      }
    },
  },
  plugins: [],
}