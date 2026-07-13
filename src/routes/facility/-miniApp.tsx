import { createSignal, onMount, Show } from "solid-js"
import { ListArea } from "./-listArea.tsx"
import { getFacilities } from "../../server/func/facility.ts"
import type { Facility } from "../../server/domain/facility.ts"
import { button, input } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

let refInput: HTMLInputElement | undefined

type Props = {
  select: (f: Facility)=>void
  close: (e: MouseEvent)=>void
}

export function MiniApp(props: Props) {
  const [id, setId] = createSignal<string>("");
  const [facilities, setFacilities] = createSignal<Facility[]>([]);
  const [message, setMessage] = createSignal("");

  async function execute(){
    setMessage("");
    await loadData(id());
  }

  async function handlerChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      await execute();
    }
  }

  async function loadData(keyword: string){
    if(keyword != ""){
      const fs = await getFacilities({data: { name: keyword }});
      if(fs && fs.length >= 1){
        setFacilities(fs);
      }else{
        setFacilities([]);
        setMessage("データが見つかりませんでした");
      }
    }
  }

  onMount(()=>{
    if(refInput){
      refInput.focus();
    }
  });

  return (
    <div class={ css({ width: "50rem", height: "20rem" }) }>
      <div class={ css({ marginBottom: "0.3rem" }) }>
        <label>検索<input type="text" class={ input({ size: "first2", space: "first" }) }
          value={id()}
          onChange={(e)=>setId(e.target.value)}
          onKeyUp={(e)=>handlerChange(e)} ref={refInput} /></label>
        <button type="button" class={ button({ color: "normal", size: "slim" }) }
          onClick={async ()=>{await execute()}}>検索</button>
        <span>{message()}</span>
      </div>
      <hr />
      <Show when={facilities().length>0}>
        <ListArea facilities={facilities()} select={props.select} />
      </Show>
    </div>
  );
}