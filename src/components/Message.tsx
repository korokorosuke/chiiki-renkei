import { createSignal, createEffect, Show } from "solid-js"
import { css } from "../styled-system/css/"

export type MessageStatus = "cancel"|"register"|"delete"|"";

export const [message, setMessage] = createSignal<MessageStatus>("");

function handleAnimeEnd(){
  setMessage("");
}

export function Message(){
  const [disp, setDisp] = createSignal("");
  const messages: {[key in MessageStatus]: string} = {
    register: "登録しました",
    delete: "削除しました",
    cancel: "キャンセルしました",
    "": ""
  } as const;

  createEffect(()=>{
    if(message()){
      const m = messages[message()];
      if(m){
        setDisp(m);
        return;
      }
    }
    setDisp("");
  });

  return (
    <Show when={disp()}>
      <div class={ styles }
        onAnimationEnd={()=>handleAnimeEnd()}>{disp()}</div>
    </Show>
  );
}

const styles = css({
  position: "fixed",
  backgroundColor: "#383838",
  color: "white",
  textAlign: "center",
  padding: "0.625rem 1.5rem",
  margin: "auto",
  fontSize: "1.6rem",
  border: "none",
  borderRadius: "10px",
  top: "3.2rem",
  left: "calc(50vw - 5rem)",

  animationStyle: "fadeInOut",
});