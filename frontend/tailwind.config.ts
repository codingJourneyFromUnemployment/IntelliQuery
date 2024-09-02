import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          start: "#4f46e5", // indigo-600
          middle: "#a855f7", // purple-500
          end: "#ec4899", // pink-500
        },
      },
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(to right, var(--tw-gradient-stops))",
        "gradient-primary-light":
          "linear-gradient(to right, rgba(79, 70, 229, 0.1), rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.1))",
        "gradient-primary-medium":
          "linear-gradient(to right, rgba(79, 70, 229, 0.2), rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))",
        "gradient-primary-active":
          "linear-gradient(to right, rgba(79, 70, 229, 0.3), rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))",
        "gradient-primary-bg":
          "linear-gradient(to right, rgba(79, 70, 229, 0.07), rgba(168, 85, 247, 0.07), rgba(236, 72, 153, 0.07))",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/typography"),
  ],
};
export default config;
