function withOpacityValue(variable) {
  return ({opacityValue}) => {
    return `rgb(var(${variable}))`;
  };
}
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        black: withOpacityValue("--black"),
        blue: withOpacityValue("--blue"),
        "dark-grey": withOpacityValue("--dark-grey"),
        "light-grey": withOpacityValue("--light-grey"),
        "extra-light-grey": withOpacityValue("--extra-light-grey"),
        danger: withOpacityValue("--danger"),
        secondary: withOpacityValue("--secondary"),
        background: withOpacityValue("--background"),
        neutral: withOpacityValue("--neutral"),
      },
      height: {
        "128": "32rem",
        "140": "40rem",
      },
    },
  },
  plugins: [
    function({addVariant}) {
      addVariant("child", "& > *");
    },
  ],
};
