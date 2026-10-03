import { createSignal, createEffect, For, Show } from "solid-js"
import { useQuery } from "@tanstack/solid-query"
import { toLocalDateString, getWeekName } from "../../lib/datetime.ts"
import { getNotices } from "../../server/func/webNotice.ts"
import type { WebNotice } from "../../server/domain/webNotice.ts"
import { css } from "../../styled-system/css/"

export function Notice(){
  const [importants, setImportants] = createSignal<WebNotice[]>([]);
  const [normals, setNormals] = createSignal<WebNotice[]>([]);
  const noticesQuery = useQuery(() => ({
    queryKey: ['menu-notices'],
    queryFn: ()=>getNotices(),
  }));

  createEffect(()=>{
    if(noticesQuery.data && noticesQuery.data.length > 0){
      const imp = [];
      const normal = [];
      for(const a of noticesQuery.data){
        if(a.importance){
          imp.push(a);
        }else{
          normal.push(a);
        }
      }
      setImportants(imp);
      setNormals(normal);
    }
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