import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/Components/**/*.{js,ts,jsx,tsx,mdx}", // ✅ ajoute les composants
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", 
    "./src/app/Components/lightswind/**/*.{js,ts,jsx,tsx,mdx}",      // ✅ si tu as un dossier pages
  ],
  theme: {
    extend: {
      animation: {
        marquee: "marquee 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-200%)" },
        },
      },
    },
  },

}

export default config
