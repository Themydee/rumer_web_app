import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "sf-pro": ["SF Pro Display", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderImageSource: {
        "gradient-primary":
          "linear-gradient(90deg, rgba(1, 72, 52, 0.21) 0%, #47BA92 45.19%, rgba(1, 72, 52, 0.34) 99.04%)",
      },
      borderImage: {
        "gradient-primary":
          "linear-gradient(90deg, rgba(1, 72, 52, 0.21) 0%, #47BA92 45.19%, rgba(1, 72, 52, 0.34) 99.04%) 1",
      },
      backgroundImage: {
        "jolly-gradient": "linear-gradient(to top, #057d56, #A3CB3E)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-linear":
          "linear-brown-gradient(133deg, #2B3221 9.11%, rgba(242, 242, 242, 0.00) 298.89%)",
        "header-border":
          "linear-gradient(90deg, rgba(61, 61, 61, 0) 0%, #47BA92 45.19%, rgba(163, 163, 163, 0) 99.04%)",
        "gradient-linear-1":
          "linear-gradient(148.16deg, #10412F 0%, 0%, #10412F 45.19%, #000000 100%)",
        "gradient-agriculture":
          "linear-gradient(148.16deg, #10412F 0%, #000000 100%)",
        "green-dark-gradient":
          "linear-gradient(144.09deg, #08382E 16.87%, #031300 79%)",
        "green-fade":
          "linear-gradient(180deg, rgba(1, 72, 52, 0) 0%, rgba(1, 72, 52, 0.48) 46.17%)",
        "blue-71": "var(--color-blue-71, #9076F4)",
      },
      colors: {
        primary: {
          50: "#EEFFE4",
          100: "#014834",
          200: "#003228",
          300: "#E8FFE4",
          400: "#003F2E",
          500: "#278795",
          600: "#A1A1A1",
          700: "#003626",
          800: "#6DA544",
          900: "#FFFCF4",
        },
        secondary: {
          100: "#F8CE00",
          200: "#12AA5B",
          300: "#F9FAFB",
          400: "#98013D",
          500: "#B2DFE0",
          600: "#177BC8",
          700: "#26C281",
          800: "#10B981",
          900: "#F97316",
        },

        secondaryTwo: {
          100: "#E8F2EE",
          200: "#ECE8FE",
          300: "#FFEBE8",
          400: "#FFDCEA",
          500: "#C5EAF8",
          600: "#014834",
          700: "#8C77EC",
          800: "#F98371",
          900: "#98013D",
          950: "#267FA1",
        },

        vcinputsapp: {
          100: "#FFCA0D",
          200: "#95E430",
          300: "#E8FFE4",
          400: "#014834",
          500: "#C7DAA2",
          600: "#E8F7F0",
          700: "#D6F5E8",
          800: "#FFE4CC",
          900: "#EAF4EF", // problem
          1000: "#EDE4FF", // verification
          1100: "#FACC15", // shield
          1200: "#064E3B", // lock
          1300: "#2A4A42", // buyers
          1400: "#B91C1C", // store
          1500: "#FEF08A", // arrow
          1600: "#A7F3D0", // users
        },
        vchowrummerworks: {
          100: "#0EA5E9",
          200: "#E0F2FE",
          300: "#10B981",
          400: "#D1FAE5",
          500: "#F97316",
          600: "#FFEDD5",
          700: "#8B5CF6",
          800: "#EDE9FE",
          900: "#14B8A6",
          1000: "#CCFBF1",
        },
        vcwhatmakesrummerdifferent: {
          100: "#EAF4F0",
          200: "#004D40",
          300: "#007556",
          400: "#4E4E4E",
        },
        vctestimonial: {
          100: "#C7DAA2",
        },
        vcjointherummer: {
          100: "#013C2E",
          200: "#F2D40C",
          300: "#F0FDF4",
          400: "#166534",
          500: "#1F6654",
          600: "#E8FFE4",
          700: "#C0EE86",
          800: "#E9FFE4",
        },
        producerheroicon: {
          100: "#014834",
        },
        processorheroicon: {
          100: "#8C77EC",
        },
        partnerheroicon: {
          100: "#98013D",
          200: "#BE024A",
          300: "#FF53C2",
        },
        buyersheroicon: {
          100: "#F98371",
        },
        instock: {
          bg: "#F0FDF4",
          border: "#DCFCE7",
          text: "#16A34A",
        },
        accent: {
          green: "#4ADE80",
        },
        bg: {
          100: "#110202",
          200: "#001811",
          300: "#083420",
          400: "#1C1C1C",
          500: "#0A0B1E",
          600: "#645D5D",
          700: "#E7E4E4",
          800: "#282828",
          900: "#808080",
        },
        black: {
          100: "#000000",
          200: "#0D0D0D",
        },
        gray: {
          100: "#D9D9D9",
          200: "#F9F9F9",
          250: "#DBDEE3",
          300: "#6D7073",
          400: "#E4DBDB",
          500: "#858585",
          600: "#989898",
          700: "#E3E3E3",
          800: "#E8E8E8",
          900: "#4B4B4B",
        },
        gray_1: {
          100: "#F0F2F5",
          200: "#F5F5F5",
          300: "#011C15",
          400: "#032219",
          500: "#F6F6F6",
          600: "#D9D9D9",
          700: "#FFF8FA",
        },
        green_1: {
          100: "#038B5C",
          200: "#E8F2EE",
          300: "#6DA544",
          400: "#007556",
          500: "#023125",
        },
        yellowVB: {
          100: "#FFEDB3",
          200: "#FAEBC5",
          300: "#EEF35F",
        },
        cyan1: {
          100: "#17E3E3",
          200: "#8B5CF6",
        },
        rose: {
          100: "#98013D",
        },
        buttonColor: {
          100: "#370325",
          200: "#6161FF",
          300: "#014051",
        },

        // Add more colors as needed
      },
      fontSize: {
        xxs: "10px",
        mxs: "8px",
        md: "16px",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
export default config;
