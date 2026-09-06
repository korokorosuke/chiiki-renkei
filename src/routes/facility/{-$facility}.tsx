import { createSignal, Switch, Match, onMount } from "solid-js"
import { ViewArea } from "./-viewArea.tsx"
import { ListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import Header from "../-header.tsx"
import { Message, setMessage as setStatusMessage, type MessageStatus } from "../../components/Message.tsx"
import { initFacility } from "../../helper/types.ts"
import { getFacility, getFacilities } from "../../server/func/facility.ts"
import type { Facility } from "../../server/domain/facility.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/facility/{-$facility}")({ component: App });

let refInput: HTMLInputElement | undefined

function App() {
  const [id, setId] = createSignal<string>("");
  const [selected, setSelected] = createSignal<Facility>(initFacility());
  const [facilities, setFacilities] = createSignal<Facility[]>([]);
  const [modification, setModification] = createSignal<boolean>(false);
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const [message, setMessage] = createSignal("");

  const context = Route.useRouteContext();
  const { user } = context();

  function terminateModification(status: MessageStatus): void{
    setModification(false);
    setStatusMessage(status);
  }

  function modifyData(){
    setModification(true);
    setNewadd(false);
  }

  function select(f: Facility){
    setFacilities([]);
    setSelected(f);
  }

  function handleNew(){
    setModification(false);
    setSelected(initFacility());
    setModification(true);
    setNewadd(true);
  }

  async function execute(id: string){
    setModification(false);
    setSelected(initFacility());
    if(id){
      setMessage("");
      await loadData(id);
    }else{
      setMessage("IDか検索文字を入力してください。")
    }
  }

  async function handlerChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      await execute(id());
    }
  }

  async function loadData(id: string){
    if(id){
      if(/^[0-9a-zA-Z\-]+$/.test(id)){
        setFacilities([]);
        const f = await getFacility({data: { id }});
        if(f){
          setSelected(f);
        }else{
          setMessage("データが見つかりませんでした");
          if(refInput){
            refInput.focus();
            refInput.select();
          }
        }
      }else{
        const fs = await getFacilities({data: { name: id }});
        if(fs && fs.length >= 1){
          setFacilities(fs);
        }else{
          setFacilities([]);
          setMessage("データが見つかりませんでした");
          if(refInput){
            refInput.focus();
            refInput.select();
          }
        }
      }
    }
  }

  onMount(() => {
    if(refInput){
      refInput.focus();
    }
  });

  return (
    <>
    <Header title="施設検索" visible handler={handleNew} auth={user} />
    <main>
      <div class={ area({ type: "search" }) }>
        <label>検索(IDまたは名称)<input type="text"
          class={ input({ size: "first2", space: "first" }) }
          value={id()}
          onChange={(e)=>setId(e.target.value)}
          onKeyUp={handlerChange} ref={refInput} /></label>
        <button type="button" class={ button({ color: "normal", size: "slim" }) }
          onClick={async ()=>{await execute(id())}}>検索</button>
        <span>{message()}</span>
      </div>
      <hr />
      <Switch fallback={<div></div>}>
        <Match when={modification()}>
          <ModificationArea facility={selected} setFacility={setSelected}
            auth={user}
            terminateModification={terminateModification} newadd={newadd} />
        </Match>
        <Match when={facilities().length>0}>
          <ListArea facilities={facilities()} select={select} />
        </Match>
        <Match when={selected().id}>
          <ViewArea facility={selected()} modifyData={modifyData} auth={user} />
        </Match>
      </Switch>
      <Message />
    </main>
    <footer>
    </footer>
    </>
  );
}