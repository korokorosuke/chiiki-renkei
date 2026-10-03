import { createSignal, For, Show, Suspense } from "solid-js"
import { useQuery } from "@tanstack/solid-query"
import { toLocalDateString, getWeekName } from "../lib/datetime.ts"
import { getMenuNotices } from "../server/func/notice.ts"
import { NormalDialog, showDialog } from "../components/NormalDialog.tsx"
import type { Notice } from "../server/domain/notice.ts"
import { css } from "../styled-system/css/"

export function Notice(){
  const noticesQuery = useQuery(() => ({
    queryKey: ['menu-notices'],
    queryFn: ()=>getMenuNotices(),
    staleTime: 1000 * 60 * 60
  }));
  const [notice, setNotice] = createSignal<Notice | undefined>(undefined);

  function formatDate(notice: Notice|undefined): string {
    if(notice){
      return notice.fromDate ? toLocalDateString(new Date(notice.fromDate)) +
        "(" + getWeekName(notice.fromDate) + ")" : "";
    }else{
      return "";
    }
  }


  return (
    <>
    <div class={ top }>
      <h2>お知らせ</h2>
      <Suspense fallback={<div>読み込み中...</div>}>
        <For each={noticesQuery.data}>{(notice)=>
          <div class={ notice.importance ? important : normal }
              onClick={() => {setNotice(notice); showDialog()} }>
            <div>{formatDate(notice)}</div>
            <div>{notice.message}</div>
          </div>
        }</For>
        <Show when={noticesQuery.data && noticesQuery.data.length === 0}>
          <div class={ normal }>お知らせは、ありません</div>
        </Show>
      </Suspense>
    </div>
    <NormalDialog>
      <div class={ dialog }>
        <legend>{formatDate(notice())}</legend>
        <Show when={notice()?.importance}>
          <div class={ css({ color: "red", fontSize: "1rem", fontWeight: "bold" }) }>重要</div>
        </Show>
        <div>{notice()?.message}</div>
      </div>
    </NormalDialog>
    </>
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
  minHeight: "12rem",
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