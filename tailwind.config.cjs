const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");
module.exports = {
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx,svelte}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Roboto"', "sans-serif"],
        mono: ['"Roboto Mono"', "monospace"],
      },
      height: {
        google: "36px",
      },
      colors: {
        trueGray: colors.trueGray,
        googleBlue: "#4285f4",
      },
      animation: {
        fade: "fadeOut 5s ease-in-out",
      },
      keyframes: (theme) => ({
        fadeOut: {
          "0%": { backgroundColor: theme("colors.red.300") },
          "100%": { backgroundColor: theme("colors.transparent") },
        },
      }),
      boxShadow: {
        blue: "0 0 6px 0 rgba(66, 133, 244, 0.75)",
      },
      maxHeight: {
        "3/4": "75%",
      },
      maxWidth: {
        "3/4": "75%",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["obs"],
    },
  },
  plugins: [
    plugin(({ addVariant, e }) => {
      addVariant("obs", ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.obs .${e(`obs${separator}${className}`)}`;
        });
      });
    }),
  ],
};
