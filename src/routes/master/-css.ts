import { css } from "../../styled-system/css/"

export const modificationAreaStyle = css({
  "& fieldset": {
    display: "flex",
    flexDirection: "column",

    "& label": {
      margin: "0",
      padding: "0",
    }
  },

  "& input": {
    margin: "px.5",
  },

  "& textarea": {
    margin: "px.5",
    width: "30rem",
    height: "7rem",
  },

  "& input[type=checkbox]": {
    marginLeft: "px.15",
    marginTop: "px.15",
    cursor: "pointer",
  }
});

export const selectedStyle = {
  backgroundColor: "table.selected",
};