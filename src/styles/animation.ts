import { defineAnimationStyles, defineKeyframes } from "@pandacss/dev"

export const keyframes = defineKeyframes({
  fadeInOut: {
    "0%": { opacity: 0 },
    "20%": { opacity: 1 },
    "90%": { opacity: 1 },
    "100%": { opacity: 0 },
  },
  slide: {
    "0%": { left: "{sizes.webTimeAreaLeft}" },
    "100%": { left: "0px" },
  },
});

export const animationStyles = defineAnimationStyles({
  fadeInOut: {
    value: {
      animation: "2s ease 0s 1 normal forwards running fadeInOut",
    },
  },
  slide: {
    value: {
      animation: "0.2s ease 0s 1 normal forwards running slide",
    }
  },
});