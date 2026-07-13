import { defineTokens, defineSemanticTokens } from "@pandacss/dev"

export const baseTokens = defineTokens({
  colors: {
    //button colors
    primary: {
      DEFAULT: { value: "#0078e7", description: "button color" },
      hover: { value: "#0065c2" },
      front: { value: "#ffffff", description: "button text color" },
    },
    secondary: {
      DEFAULT: { value: "#42b8dd", description: "button color" },
      hover: { value: "#3799b7" },
      front: { value: "#ffffff", description: "button text color" },
    },
    success: {
      DEFAULT: { value: "#1cb841", description: "button color" },
      hover: { value: "#19a73a" },
      front: { value: "#ffffff", description: "button text color" },
    },
    warning: {
      DEFAULT: { value: "#df7614", description: "button color" },
      hover: { value: "#c96b12" },
      front: { value: "#ffffff", description: "button text color" },
    },
    error: {
      DEFAULT: { value: "#ca3c3c", description: "button color" },
      hover: { value: "#b03535" },
      front: { value: "#ffffff", description: "button text color" },
    },
    disabled: { value: "#676767", description: "disabled button color" },
    fatal: {
      DEFAULT: { value: "#a80000", description: "button color" },
      hover: { value: "#7a0000" },
      front: { value: "#ffffff", description: "button text color" },
    },
    normal: {
      DEFAULT: { value: "#aeaeae", description: "button color" },
      hover: { value: "#848484" },
      front: { value: "#383838", description: "button text color" },
    },

    //header colors
    header: {
      color: { value: "#ffffff", description: "header text color" },
      bg: {
        DEFAULT: { value: "#323232", description: "header background color" },
        hover: { value: "#424242", description: "header background color" },
      },
    },

    //table colors
    table: {
      title: { value: "#d5e2ff", description: "table header background color" },
      border: { value: "#999999", description: "table border color"},
      selected: { value: "#caeeff", description: "table selected row color"},
      even: { value: "#f7f7f7", description: "table even row color" },
    },

    container: {
      border: { value: "#b8b8b8", description: "container border color" },
    },

    web: {
      title: { value: "#eafff6", description: "web page background color" },
      active: { value: "#ff6c6c", description: "web page active color" },
      done: { value: "#838fff", description: "web page done color" },
      yet: { value: "#9a9a9a", description: "web page yet color" },
      selected: {
        DEFAULT: { value: "#ff5656" },
        back: { value: "#ff6c6c" },
      },
      disabled: {
        DEFAULT: { value: "#ffffff" },
        back: { value: "#747474" },
      },
      backdrop: { value: "#696969" },
    },

    etc: {
      red: {
        DEFAULT: { value: "#bd7189", description: "button color" },
        hover: { value: "#d8c8cf" },
        back: { value: "#ffeef6", description: "button text color" },
      },

      blue: {
        DEFAULT: { value: "#2162A1", description: "button color" },
        hover: { value: "#cae7ff" },
        back: { value: "#e0f3ff", description: "button text color" },
      }
    }
  },
  sizes: {
    header:{
      height: { value: "3.125rem" },
      menuWidth: { value: "9rem" },
      titleWidth: { value: "10rem"},
    },
    web:{
      timeWidth: { value: "13rem" },
      mainWidth: { value: "20rem" },
    },
    calendar: {
      cellWidth: { value: "8rem" },
    },
  },
  spacing: {
    short: { value: "0.5rem" },
    midium: { value: "1rem" },
    long: { value: "2rem" },
    spaceLeft: { value: "1rem" },
    px: {
      1: { value: "0.0625rem" },
      2: { value: "0.125rem" },
      3: { value: "0.1875rem" },
      4: { value: "0.25rem" },
      5: { value: "0.3125rem" },
      6: { value: "0.375rem" },
      7: { value: "0.4375rem" },
      8: { value: "0.5rem" },
      9: { value: "0.5625rem" },
      10: { value: "0.625rem" },
      11: { value: "0.6875rem" },
      12: { value: "0.75rem" },
      13: { value: "0.8125rem" },
      14: { value: "0.875rem" },
      15: { value: "0.9375rem" },
      16: { value: "1rem" },
    },
  },
});

export const semanticTokens = defineSemanticTokens({
  sizes: {
    webTimeAreaLeft: { value: "calc(0px - {sizes.web.timeWidth})" },
    webTimeAreaHeight: { value: "calc(100vh - {sizes.header.height})" },
    calendarMainWidth: { value: "calc({sizes.calendar.cellWidth} * 7 + 1rem)" },
    webMainWidth: { value: "calc({sizes.calendarMainWidth} + 2rem)" },
  },
  spacing: {
    mainTop: { value: "calc({sizes.header.height} + {spacing.px.10})" },
    timeTop: { value: "{sizes.header.height}" },
  },
  colors: {
    done: { value: "{colors.stone.500}" },
    today: { value: "{colors.orange.300}" },
    active: { value: "{colors.sky.300}" },
    yet: { value: "{colors.rose.500}" },
    subinfo: { value: "{colors.emerald.50}" },
  },
});