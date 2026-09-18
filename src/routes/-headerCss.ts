import { css } from "../styled-system/css/"

export const root = css({
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "header.height",
  bg: "var(--color-bg)",
  color: "var(--color)",
  "& a": {
    height: "header.height",
    width: "header.menuWidth",
    color: "var(--color)",
    textDecoration: "none",
    padding: "0",
    margin: "0",
    display: "block",
    fontSize: "1.2rem",
    paddingTop: "0.5rem",
  },
});
export const menu = css({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  fontSize: "1.5rem",
  height: "header.height",
  alignItems: "center",
});
export const item = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  justifyContent: "center",
  height: "header.height",
  position: "relative",
});
export const title = css({
  padding: "0.25rem 1rem 0 1rem",
  "& a": {
    width: "header.titleWidth",
  },
});
export const button = css({
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
});
export const image = css({
  cursor: "pointer",
  height: "header.height",
  "& img": {
    paddingTop: "0.4rem",
    marginLeft: "0.5rem",
    marginRight: "0.5rem",
    height: "2.2rem"
  },
  _hover: {
    bg: "var(--color-bg-hover)",
  },
});
export const dropMenu = css({
  textAlign: "center",
  width: "header.menuWidth",
  _hover: {
    bg: "var(--color-bg-hover)",
    "& > div + div": {
      display: "block",
    },
  },
});
export const subMenu = css({
  display: "none",
  "& ul": {
    border: "1px solid white",
    "& li": {
      listStyle: "none",
      bg: "var(--color-bg)",
      _hover: {
        bg: "var(--color-bg-hover)",
      },
    },
  },
});