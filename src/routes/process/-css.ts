import { css } from "../../styled-system/css/"

export const procStyles = css({
  display: "flex",
  flexDirection: "row",
  cursor: "pointer",

  "& span": {
      display: "block",
      marginRight: "1rem",
  },

  "& p": {
      display: "inline-block",
      margin: "0",
      padding: "0",
  },

  _hover: {
      backgroundColor: "table.selected",
      transition: "0.5s",
  }
});

export const titleStyles = css({
  width: "100%",
  backgroundColor: "table.title",
  borderBottom: "1px solid",
  borderBottomColor: "table.border",
});