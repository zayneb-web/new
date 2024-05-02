module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    colors: {
      bgColor: "rgb(var(--color-bg) / 1)",
      googleColor: "rgb(66, 133, 244, 0.8)",

      primary: "rgb(var(--color-primary) / 1)",
      secondary: "rgb(var(--color-secondary) / 1)",
      blue: "rgb(var(--color-blue) / 1)",
      white: "rgb(var(--color-white) / 1)",
      ascent: {
        1: "rgb(var(--color-ascent1) / 1)",
        2: "rgb(var(--color-ascent2) / 1)",
      },

      customColor: "#D00000", // Define your custom color here

    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {},
  },
  plugins: [],
};
