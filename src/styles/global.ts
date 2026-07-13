import { defineGlobalStyles } from "@pandacss/dev"

//@layer base
export const globalCss = defineGlobalStyles({
  ":root": {
    fontFamily: "body",

    lineHeight: "1.5",
    fontWeight: "400", /*normal*/

    fontSynthesis: "none",
    textRendering: "optimizeLegibility",
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale",
  },

  main: {
    marginLeft: "px.10",
    marginRight: "px.10",
    marginTop: "mainTop",
    marginBottom: "long",
    fontSize: "1.3rem",
  },
});