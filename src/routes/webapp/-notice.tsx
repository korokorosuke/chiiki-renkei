import { createSignal, createEffect, For, Show, onMount } from "solid-js"
import { toLocalDateString } from "../../lib/datetime.ts"
import { getNotices } from "../../server/func/webnotice.ts"
import type { WebNotice } from "../../server/domain/webNotice.ts"
import { css } from "../../styled-system/css/"

export function Notice(){
  const [importants, setImportants] = createSignal<WebNotice[]>([]);
  const [normals, setNormals] = createSignal<WebNotice[]>([]);
  const [notices, setNotices] = createSignal<WebNotice[]>([]);

  const WEEKS = ["日","月","火","水","木","金","土"];

  function getWeekName(date: string): string{
    return WEEKS[new Date(date).getDay()];
  }

  createEffect(()=>{
    if(notices() && notices().length > 0){
      const imp = [];
      const normal = [];
      for(const a of notices()){
        if(a.type === "重要"){
          imp.push(a);
        }else{
          normal.push(a);
        }
      }
      setImportants(imp);
      setNormals(normal);
    }
  });

  onMount(()=>{
    getNotices().then(setNotices);
  });


  return (
    <div>
      <Show when={importants().length > 0}>
        <div class={ important }>
          <div>重要なお知らせ</div>
          <For each={importants()}>{(notice, i)=>
            <div>
              <Show when={i()>=1}>
                <div class={ css({ marginTop: "1.2rem" }) }></div>
              </Show>
              <div>{toLocalDateString(new Date(notice.fromDate))}（{getWeekName(notice.fromDate)}）</div>
              <div>{notice.message}</div>
            </div>
          }</For>
        </div>
      </Show>
      <Show when={normals().length > 0}>
        <div class={ normal }>
          <div>お知らせ</div>
          <For each={normals()}>{(notice, i)=>
            <div>
              <Show when={i()>=1}>
                <div class={ css({ marginTop: "1.2rem" }) }></div>
              </Show>
              <div>{toLocalDateString(new Date(notice.fromDate))}（{getWeekName(notice.fromDate)}）</div>
              <div>{notice.message}</div>
            </div>
          }</For>
        </div>
      </Show>
    </div>
  );
}

const important = css({
  backgroundColor: "#ffebeb",
  border: "1px solid #c83030",
  color: "#c83030",
  padding: "1rem",
  borderRadius: "10px",
  marginBottom: "1rem",
});

const normal = css({
  border: "1px solid #5f5f5f",
  borderRadius: "10px",
  padding: "1rem",
});