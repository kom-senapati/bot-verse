/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/templates/*.html"],
  darkMode: "class", // Enables dark mode with 'class' strategy
  theme: {
    screens: {
      'sm': '640px',   // => @media (min-width: 640px) { ... }
      'md': '768px',   // => @media (min-width: 768px) { ... }
      'lg': '1024px',  // => @media (min-width: 1024px) { ... }
      'xl': '1280px',  // => @media (min-width: 1280px) { ... }
      '2xl': '1536px', // => @media (min-width: 1536px) { ... }
    },
    extend: {
      textColor: {
        DEFAULT: "#333",   // Default text color
        dark: "#eaeaea",   // Text color for dark mode
      },
      colors: {
        dark: "#171717",    // Dark background color
        light: "#f4ede3",   // Light background color
        darker: "#444746",  // Darker shade for elements
        lighter: "#f5f1ed", // Lighter shade for elements
      },
      animation: {
        sparkle: "sparkle 6.8s linear infinite", // Sparkle animation
        "sparkle-checked": "sparkle-checked 7.5s linear infinite", // Checked sparkle animation
      },
      keyframes: {
        sparkle: {
          'to': { width: "1px", transform: "translate(1500%, -50%)" }, // Final state for sparkle
        },
        "sparkle-checked": {
          'to': { width: "1.5px", transform: "translate(3750%, -50%)" }, // Final state for checked sparkle
        },
      },
      backgroundImage: {
        "radial-gradient-blue": "radial-gradient(circle at 50% -100%, rgb(58, 155, 252) 0%, rgba(12, 12, 12, 1) 80%)", // Blue radial gradient
        "radial-gradient-gray": "radial-gradient(circle at 50% 0%, #666666 0%, #414344 100%)", // Gray radial gradient
      },
      boxShadow: {
        toggle: "inset 0 -0.15rem 0.15rem #54a8fc, inset 0 0 0.5rem 0.75rem #414344", // Shadow for toggle switches
      },
    },
  },
  plugins: [], // Add any necessary plugins here
};
