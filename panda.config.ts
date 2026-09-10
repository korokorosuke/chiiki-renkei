import { defineConfig } from "@pandacss/dev"
import { inputRecipe, buttonRecipe, tableRecipe, headerRecipe, alertAreaRecipe,
  webpageRecipe, listRecipe, areaRecipe, etcRecipe, progressRecipe,
  calendarRecipe, timeAreaRecipe } from "./src/styles/recipes.ts"
import { globalCss } from "./src/styles/global.ts"
import { baseTokens, semanticTokens } from "./src/styles/tokens.ts"
import { keyframes, animationStyles } from "./src/styles/animation.ts"

export default defineConfig({
  globalCss,
  staticCss: {
    css: [
      {
        properties: {
          bg: ["neutral.800", "neutral.700"]
        }
      }
    ]
  },
  theme: {
    extend: {
      tokens: {
        fonts: {
          body: { value: "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Noto Sans JP', 'BIZ UDPGothic', sans-serif" },
          number: { value: "Arial, Helvetica, sans-serif" },
        },
        colors: baseTokens.colors,
        sizes: baseTokens.sizes,
        spacing: baseTokens.spacing,
      },
      semanticTokens: {
        sizes: semanticTokens.sizes,
        spacing: semanticTokens.spacing,
        colors: semanticTokens.colors,
      },
      recipes: {
        input: inputRecipe,
        button: buttonRecipe,
        table: tableRecipe,
        alertArea: alertAreaRecipe,
        web: webpageRecipe,
        list: listRecipe,
        area: areaRecipe,
        etc: etcRecipe,
        progress: progressRecipe,
        calendar: calendarRecipe,
        timeArea: timeAreaRecipe,
      },
      slotRecipes: {
        header: headerRecipe,
      },
      keyframes: keyframes,
      animationStyles: animationStyles,
    },
  },

  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{ts,tsx}"],

  // Files to exclude
  exclude: [],

  // The output directory for your css system
  outdir: "./src/styled-system",
});
