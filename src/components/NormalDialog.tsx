import { children, type JSXElement } from "solid-js"
import { css } from "../styled-system/css/"

type Props = {
  children: JSXElement
}

let dialog: HTMLDialogElement | undefined;
export function showDialog(){
  if(dialog){
    dialog.showModal();
  }
}

export function closeDialog(e?: MouseEvent){
  if(e){
    e.preventDefault();
    e.stopPropagation();
  }
  if(dialog){
    dialog.close();
  }
}

export function NormalDialog(props: Props){
  const c = children(()=>props.children);

  return (
    <dialog ref={dialog} class={ styles }>
      <span class={ closeStyle } onClick={closeDialog}>×</span>
      {c()}
    </dialog>
  );
}

export const styles = css({
  border: "#5c5c5c solid 1px",
  borderRadius: "5px",
  padding: "1rem",
  inset: 0,
  margin: "auto",

  _backdrop: {
    backgroundColor: "#333333",
    opacity: "0.5",
  }
});

const closeStyle = css({
  position: "absolute",
  top: "0.5rem",
  right: "0.5rem",
  cursor: "pointer",
  fontWeight: "bold",
});