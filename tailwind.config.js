/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./templates/*.html"],
  darkMode: "class",
  theme: {
    extend: {
      textColor: {
        DEFAULT: "#333",
        dark: "#eaeaea",
      },
      colors: {
        dark: "#171717",
        light: "#f4ede3",
        darker: "#444746",
        lighter: "#f5f1ed",
      },
      animation: {
        sparkle: "sparkle 6.8s linear infinite",
        "sparkle-checked": "sparkle-checked 7.5s linear infinite",
      },
      keyframes: {
        sparkle: {
          to: { width: "1px", transform: "translate(1500%, -50%)" },
        },
        "sparkle-checked": {
          to: { width: "1.5px", transform: "translate(3750%, -50%)" },
        },
      },
      backgroundImage: {
        "radial-gradient-blue":
          "radial-gradient(circle at 50% -100%, rgb(58, 155, 252) 0%, rgba(12, 12, 12, 1) 80%)",
        "radial-gradient-gray":
          "radial-gradient(circle at 50% 0%, #666666 0%, #414344 100%)",
      },
      boxShadow: {
        toggle:
          "inset 0 -0.15rem 0.15rem #54a8fc, inset 0 0 0.5rem 0.75rem #414344",
      },
    },
  },
  plugins: [],
};
