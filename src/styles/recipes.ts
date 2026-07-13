import { defineRecipe, defineSlotRecipe } from "@pandacss/dev"
import { require, searchError } from "./common.ts"

export const buttonRecipe = defineRecipe({
  className: "button",
  description: "Some button styles",
  base: {
    fontSize: "1.2rem",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer",
    _disabled: {
      cursor: "not-allowed",
      bg: "disabled!",
    },
  },
  variants: {
    color: {
      primary: { bg: "primary", color: "primary.front", _hover: { bg: "primary.hover" } },
      second: { bg: "secondary", color: "secondary.front", _hover: { bg: "secondary.hover" } },
      success: { bg: "success", color: "success.front", _hover: { bg: "success.hover" } },
      warning: { bg: "warning", color: "warning.front", _hover: { bg: "warning.hover" } },
      cancel: { bg: "warning", color: "warning.front", _hover: { bg: "warning.hover" } },
      error: { bg: "error", color: "error.front", _hover: { bg: "error.hover" } },
      fatal: { bg: "fatal", color: "fatal.front", _hover: { bg: "fatal.hover" } },
      normal: { bg: "normal", color: "normal.front", _hover: { bg: "normal.hover" } },
    },
    size: {
      normal: { padding: "0.4rem 2rem" },
      slim: { padding: "0.2rem 2rem" },
      small: { padding: "0.2rem 0.5rem" },
      long: { padding: "0.4rem 2rem", width: "15rem" },
      master: { padding: "0.4rem 2rem", width: "17rem" },
      tiny: { padding: "0.2rem 0.2rem", fontSize: "1.1rem" },
      full: { padding: "0.4rem 2rem", width: "100%" },
      quarter: { width: "24%" },
      quarter3: { width: "74%" }
    },
    space: {
      normal: {},
      none: { margin: "0" },
      small: { marginLeft: "0.5rem", marginRight: "0.5rem" },
      left1: { marginLeft: "1rem" },
      right1: { marginRight: "1rem" },
      top1: { marginTop: "1rem" },
      top1_2: { marginTop: "1.2rem" },
    },
  },
  defaultVariants: {
    color: "primary",
    size: "normal",
    space: "normal",
  }
});

export const inputRecipe = defineRecipe({
  className: "input",
  description: "Some input styles(text, number, date, time, datetime, select, textarea)",
  base: {
    fontSize: "1.2rem",
    padding: "0.1rem 0.3rem",
    border: "none",
    outline: "1px solid",
    outlineColor: "gray.500",
    borderRadius: "5px",

    _focus: {
      outline: "2px solid",
      outlineColor: "primary",
    },

    _placeholder: {
      color: "neutral.400",
    }
  },
  variants: {
    type: {
      text: {},
      number: {
        fontFamily: "number",
      },
      checkbox: {
        cursor: "pointer",
        border: "none",
        outline: "none",
        marginRight: "0.5rem",
      },
    },
    size: {
      id: { width: "6rem", minWidth: "6rem" },
      text: { width: "15rem", minWidth: "10rem" },
      patient: { width: "10rem", minWidth: "10rem" },
      dept: { width: "10rem", minWidth: "10rem" },
      tel: { width: "10rem", minWidth: "10rem" },
      post: { width: "6rem", minWidth: "6rem" },
      address: { width: "25rem", minWidth: "25rem" },
      sex: { width: "4rem", minWidth: "4rem" },
      date: { width: "10rem", minWidth: "10rem" },
      time: { width: "6rem", minWidth: "6rem" },
      datetime: { width: "14rem", minWidth: "14rem" },
      number: { width: "3rem", minWidth: "3rem" },
      textarea: { width: "100%", minWidth: "100%", height: "6.5rem" },
      disease: { width: "100%", minWidth: "100%", height: "4rem" },
      full: { width: "100%", minWidth: "100%" },
      first: { width: "9rem", minWidth: "9rem" },
      first2: { width: "15rem", minWidth: "15rem" },
      search: { width: "10rem", minWidth: "10rem" },
      name: { width: "10rem", minWidth: "10rem" },
      rem20: { width: "20rem", minWidth: "20rem" },
      rem1: { minWidth: "1rem", maxWidth: "1rem" },
      rem2: { minWidth: "2rem", maxWidth: "2rem" },
      rem3: { minWidth: "3rem", maxWidth: "3rem" },
      rem4: { minWidth: "4rem", maxWidth: "4rem" },
      rem5: { minWidth: "5rem", maxWidth: "5rem" },
      rem6: { minWidth: "6rem", maxWidth: "6rem" },
      rem7: { minWidth: "7rem", maxWidth: "7rem" },
      rem8: { minWidth: "8rem", maxWidth: "8rem" },
      rem9: { minWidth: "9rem", maxWidth: "9rem" },
      rem10: { minWidth: "10rem", maxWidth: "10rem" },
      rem11: { minWidth: "11rem", maxWidth: "11rem" },
      rem12: { minWidth: "12rem", maxWidth: "12rem" },
      check3: {
        transform: "scale(3)",
        margin: "0.8rem 0 0 0.8rem",
      },
      check2: {
        transform: "scale(2)",
      },
      check1_5: {
        transform: "scale(1.5)",
      },
    },
    space: {
      ignore: {},
      none: { margin: "0" },
      first: { marginLeft: "px.10", marginRight: "px.8", },
      top1: { marginTop: "1rem", marginBottom: "0" },
      bottom1: { marginTop: "0", marginBottom: "1rem" },
      right1: { marginLeft: "0", marginRight: "1rem" },
      left1: { marginLeft: "1rem", marginRight: "0" },
    },
    height: {
      medium: {
        height: "2rem",
      },
      short: {
        height: "1.5rem",
      },
      tall: {
        height: "6rem",
      },
      none: {}
    }
  },
  defaultVariants: {
    type: "text",
    size: "text",
    space: "ignore",
    height: "none",
  },
});

export const tableRecipe = defineRecipe({
  className: "table",
  description: "Some table styles",
  base: {
    border: "1px solid",
    borderColor: "table.border",
    borderLeft: "0",
    borderRight: "0",
    borderCollapse: "collapse",
    paddingTop: "px.5",
    paddingBottom: "px.5",
    paddingRight: "px.10",
    paddingLeft: "px.10",

    "& th, td": {
      textAlign: "left",
      paddingTop: "px.5",
      paddingBottom: "px.5",
      paddingRight: "px.10",
      paddingLeft: "px.10",
    },
    "& tbody tr": {
      cursor: "pointer",
      _even: {
        bg: "table.even",
      },
      _hover: {
        backgroundColor: "table.selected",
        transition: "0.5s"
      },
    },
  },
  variants: {
    color: {
      normal: {
        "& th": {
          bg: "table.title",
        },
      },
      web: {
        "& th": {
          bg: "web.title",
        },
      },
    },
    size: {
      normal: {},
      full: {
        width: "100%",
      },
    },
  },
  defaultVariants: {
    color: "normal",
    size: "full",
  },
});

export const headerRecipe = defineSlotRecipe({
  className: "header",
  description: "Header styles",
  slots: ["root", "menu", "item", "image", "title", "dropMenu", "subMenu", "button", "none"],
  base: {
    root:{
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "header.height",
      bg: "header.bg",
      color: "header.color",
      "& a": {
        height: "header.height",
        width: "header.menuWidth",
        color: "header.color",
        textDecoration: "none",
        padding: "0",
        margin: "0",
        display: "block",
        fontSize: "1.2rem",
        paddingTop: "0.5rem",
      },
    },
    menu:{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      fontSize: "1.5rem",
      height: "header.height",
      alignItems: "center",
    },
    item:{
      display: "flex",
      flexDirection: "row",
      alignItems: "stretch",
      justifyContent: "center",
      height: "header.height",
      position: "relative",
    },
    title:{
      padding: "0.25rem 1rem 0 1rem",
      "& a": {
        width: "header.titleWidth",
      },
    },
    button: {
      cursor: "pointer",
      fontSize: "1.1rem",
      marginLeft: "1rem",
      "& span": {
        paddingLeft: "0.5rem",
        display: "inline-block",
      },
      "& img": {
        display: "inline-block",
        width: "1.2rem",
        height: "1.2rem",
        marginTop: "-0.2rem",
      }
    },
    image:{
      cursor: "pointer",
      height: "header.height",
      "& img": {
        paddingTop: "0.4rem",
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        height: "2.2rem"
      },
      _hover: {
        bg: "header.bg.hover",
      },
    },
    dropMenu:{
      textAlign: "center",
      width: "header.menuWidth",
      _hover: {
        bg: "header.bg.hover",
        "& .header__subMenu": {
          display: "block",
        },
      },
    },
    subMenu:{
      display: "none",
      "& ul": {
        border: "1px solid white",
        "& li": {
          listStyle: "none",
          bg: "header.bg",
          _hover: {
            bg: "header.bg.hover",
          },
        },
      },
    },
    none: {
      height: "1px!",
    },
  },
});

export const webpageRecipe = defineSlotRecipe({
  className: "webpage",
  description: "Web page styles",
  slots: ["root", "list"],
  base: {
    root: {
      minWidth: "mainWidth",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",

      "& > div": {
        width: "mainWidth",
      }
    },
    list: {
      width: "100%",
    },
  },
});

export const alertAreaRecipe = defineRecipe({
  className: "alertArea",
  description: "Alert styles",
  base: {
    width: "100%",
    padding: "0.7rem 1rem",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "red.500",
    borderRadius: "8px",
    bg: "red.100",
    textAlign: "left",
    fontSize: "1.1rem",
    color: "red.600",
    "& > div:first-child": {
      fontWeight: "bold",
    }
  },
});

export const listRecipe = defineRecipe({
  className: "list",
  description: "list styles",
  base: {
  },
  variants: {
    size: {
      none: { width: "auto" },
      rem1: { minWidth: "1rem", maxWidth: "1rem" },
      rem2: { minWidth: "2rem", maxWidth: "2rem" },
      rem3: { minWidth: "3rem", maxWidth: "3rem" },
      rem4: { minWidth: "4rem", maxWidth: "4rem" },
      rem5: { minWidth: "5rem", maxWidth: "5rem" },
      rem6: { minWidth: "6rem", maxWidth: "6rem" },
      rem7: { minWidth: "7rem", maxWidth: "7rem" },
      rem8: { minWidth: "8rem", maxWidth: "8rem" },
      rem9: { minWidth: "9rem", maxWidth: "9rem" },
      rem10: { minWidth: "10rem", maxWidth: "10rem" },
      rem11: { minWidth: "11rem", maxWidth: "11rem" },
      rem12: { minWidth: "12rem", maxWidth: "12rem" },
      max: { minWidth: "100%", maxWidth: "100%" },
    },
    font: {
      number: { fontFamily: "number" },
      normal: {},
    }
  },
  defaultVariants: {
    size: "none",
    font: "normal"
  }
});

export const areaRecipe = defineRecipe({
  className: "area",
  description: "area styles",
  base: {
  },
  variants: {
    type: {
      normal: {},
      contents: {
        display: "flex",
        flexDirection: "column",
      },
      search: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: "0.3rem",

        "& > div": {
          marginRight: "1rem",
        },
        "& label": {
          fontSize: "1.2rem",
        },
        "& button": {
          "& + span": {
            ...searchError,
          },
        },
        "& div:has(button)": {
          display: "flex",
          alignItems: "flex-end",
        }
      },
      button: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: "px.10",
        marginTop: "px.5",
      },
      webbutton: {
        marginTop: "px.5",
        width: "100%",
        textAlign: "center",
        "& button": {
          marginRight: "px.10",
        }
      },
    },
  },
  defaultVariants: {
    type: "normal"
  }
});

export const etcRecipe = defineRecipe({
  className: "etc",
  description: "etc styles",
  base: {
  },
  variants: {
    type: {
      normal: {},
      require: {
        ...require,
        paddingLeft: "px.5",
      },
    },
  },
  defaultVariants: {
    type: "normal"
  }
});

export const progressRecipe = defineSlotRecipe({
  className: "progress",
  description: "progress styles",
  slots: ["root", "step", "stepno"],
  base: {
    root:{
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    step:{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      flexGrow: "1",
      flexBasis: "11rem",
      paddingTop: "px.1",
      paddingBottom: "px.1",
      paddingRight: "px.5",
      paddingLeft: "px.5",
      textAlign: "center",
      borderRadius: "15px",
      fontWeight: "bold",
      height: "3.9rem",

      "&:not(:last-child):after": {
        content: '"　"',
        position: "relative",
        top: "1.1rem",
        left: "52%",
        height: "0.2rem",
        order: "-1",
        width: "75%",
        backgroundColor: "web.yet",
      }
    },
    stepno:{
      fontSize: "1.1rem",
      borderRadius: "50%",
      borderStyle: "solid",
      borderWidth: "3px",
      width: "2rem",
      backgroundColor: "white",
    },
  },
  variants: {
    status: {
      active: {
        step:{
          color: "web.active",
          "& .progress__stepno": {
            borderColor: "web.active",
          }
        },
      },
      done: {
        step: {
          color: "web.done",
          "& .progress__stepno": {
            borderColor: "web.done",
            backgroundColor: "web.done!",
            color: "white",
          },
          _after: {
            backgroundColor: "web.done",
          },
        },
      },
      yet: {
        step: {
          color: "web.yet",
          "& .progress__stepno": {
            borderColor: "web.yet",
          }
        },
      },
    },
  },
});

export const calendarRecipe = defineSlotRecipe({
  className: "calendar",
  description: "calendar styles",
  slots: ["root", "head", "cell", "title", "date", "space", "item", "selected", "disabled"],
  base: {
    root:{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",

      "& td, th":{
        border: "1px solid black",
        borderCollapse: "collapse",
      }
    },
    head:{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flexGrow: "1",
      flexBasis: "4rem",
      paddingTop: "px.1",
      paddingBottom: "px.1",
      paddingRight: "px.5",
      paddingLeft: "px.5",
      textAlign: "center",
      borderRadius: "15px",
      fontWeight: "bold",
      height: "3.9rem",
      marginTop: "1rem",

      "& > div": {
        width: "33%"
      }
    },
    title: {
      minWidth: "calendar.cellWidth",
      maxWidth: "calendar.cellWidth",
      backgroundColor: "web.title",
    },
    date: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      minHeight: "6.2rem",

      "& > div": {
        padding: "0",
        minHeight: "2rem",
        maxHeight: "2rem",
        overflow: "hidden",
        textAlign: "center",
      }
    },
    space: {
      width: "15rem",
    },
    item: {
      cursor: "pointer",
      marginBottom: "px.1",
      border: "1px solid",
      borderColor: "#b7ccff",
      backgroundColor: "#f2f6ff",
    },
    selected: {
      cursor: "pointer",
      marginBottom: "px.1",
      border: "1px solid",
      borderColor: "#ffb7b7",
      backgroundColor: "#ffefef",
    },
    disabled: {
      cursor: "pointer",
      marginBottom: "px.1",
      border: "1px solid",
      borderColor: "#5f5f5f",
      backgroundColor: "#e9e9e9",
    },
  },
});

export const timeAreaRecipe = defineSlotRecipe({
  className: "timeArea",
  description: "time area styles",
  slots: ["root", "icon", "close", "area", "selected", "time",
          "item", "selectedItem", "disabledItem", "back"],
  base: {
    root:{
      position: "fixed",
      left: "0",
      top: "timeTop",
      width: "web.timeWidth",
      height: "webTimeAreaHeight",
      backgroundColor: "white",
      border: "1px solid black",
      textAlign: "center",
      boxShadow: "5px 5px 5px rgb(56, 56, 56)",
      animationStyle: "slide",
      zIndex: "100"
    },
    icon: {
      paddingRight: "px.10",
      fontSize: "2rem",
      cursor: "pointer",
    },
    close: {
      width: "100%",
      textAlign: "right",
    },
    area: {
      padding: "0 0.5rem",
    },
    selected: {
      backgroundColor: "web.selected.back",
      color: "white",
      borderRadius: "px.10",
      marginBottom: "px.10",
    },
    time: {
      fontSize: "2rem",
    },
    back: {
      position: "fixed",
      top: "0",
      left: "0",
      height: "100vh",
      width: "100vw",
      zIndex: "50",
      backgroundColor: "web.backdrop",
      opacity: "0.3",
    },
    item: {},
    selectedItem: {
      color: "web.selected",
    },
    disabledItem: {
      color: "web.disabled",
      backgroundColor: "web.disabled.back",
    },
  },
});