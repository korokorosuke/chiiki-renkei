import { createSignal, For, Show, onMount } from "solid-js"
import { toLocalDateString, getWeekName } from "../lib/datetime.ts"
import { getMenuNotices } from "../server/func/notice.ts"
import { NormalDialog, showDialog } from "../components/NormalDialog.tsx"
import type { Notice } from "../server/domain/notice.ts"
import { css } from "../styled-system/css/"

export function Notice(){
  const [notices, setNotices] = createSignal<Notice[]>([]);
  const [notice, setNotice] = createSignal<Notice | undefined>(undefined);

  function getFormatDate(notice: Notice|undefined): string {
    if(notice){
      return notice.fromDate ? toLocalDateString(new Date(notice.fromDate)) +
        "(" + getWeekName(notice.fromDate) + ")" : "";
    }else{
      return "";
    }
  }

  onMount(()=>{
    getMenuNotices().then(setNotices);
  });


  return (
    <Show when={notices().length > 0}>
      <div class={ top }>
        <h2>お知らせ</h2>
        <For each={notices()}>{(notice)=>
          <div class={ notice.importance ? important : normal }
              onClick={() => {setNotice(notice); showDialog()} }>
            <div>{getFormatDate(notice)}</div>
            <div>{notice.message}</div>
          </div>
        }</For>
      </div>
      <NormalDialog>
        <div class={ dialog }>
          <legend>{getFormatDate(notice())}</legend>
          <Show when={notice()?.importance}>
            <div class={ css({ color: "red", fontSize: "1rem", fontWeight: "bold" }) }>重要</div>
          </Show>
          <div>{notice()?.message}</div>
        </div>
      </NormalDialog>
    </Show>
  );
}

const dialog = css({
  whiteSpace: "pre-wrap",
  maxWidth: "90vw",
  maxHeight: "90vh",
  overflow: "auto",

  "& legend": {
    borderBottom: "1px solid #545454",
  }
});

const top = css({
  border: "1px solid #545454",
  borderRadius: "10px",
  padding: "0.6rem 1rem",
  maxHeight: "12rem",
  overflowY: "auto",
  overflowX: "hidden",

  "& > div": {
    cursor: "pointer",
    padding: "0.5rem",
    fontSize: "1rem",
  },
});

const important = css({
  backgroundColor: "#ffebeb",
  color: "#c83030",
  borderRadius: "10px"
});

const normal = css({
  color: "#545454",
});