import { createSignal, Show, Switch, Match, onMount } from "solid-js"
import { ListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import { initStaff, initFac } from "../../helper/types.ts"
import { getFac } from "../../server/func/facility.ts"
import { getStaffs } from "../../server/func/staff.ts"
import Header from "../-header.tsx"
import { Message, setMessage as setStatusMessage, type MessageStatus } from "../../components/Message.tsx"
import type { Fac } from "../../server/domain/facility.ts"
import type { Staff } from "../../server/domain/staff.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"
import { flex } from "../../styled-system/patterns/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/staff/")({ component: App });

function App() {
  const [id, setId] = createSignal<string>("");
  const [fac, setFac] = createSignal<Fac>(initFac());
  const [staff, setStaff] = createSignal<Staff>(initStaff());
  const [staffs, setStaffs] = createSignal<Staff[]>([]);
  const [modification, setModification] = createSignal<boolean>(false);
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const [message, setMessage] = createSignal("");
  const [visible, setVisible] = createSignal(false);

  const context = Route.useRouteContext();
  const { user } = context();

  let refInput: HTMLInputElement | undefined;

  async function terminateModification(status: MessageStatus): Promise<void>{
    setModification(false);
    setStatusMessage(status);
    if(fac().id){
      await loadData(fac().id);
    }
  }

  function select(s: Staff){
    setStaffs([]);
    setStaff(s);
    setModification(true);
    setNewadd(false);
  }

  function handleNew(){
    if(fac().id){
      setModification(false);
      setStaff(
        {
          ...initStaff(), facilityId: fac().id,
        }
      );
      setModification(true);
      setNewadd(true);
    }
  }

  async function execute(id: string){
    setModification(false);
    if(id){
      setMessage("");
      await loadData(id);
    }else{
      setMessage("施設IDを入力してください。")
    }
  }

  async function handleChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      await execute(id());
    }
  }

  async function loadData(facid: string){
    if(facid){
      const f = await getFac({data: {id: facid}});
      if(f && f.name){
        setFac(f);
        setId("");
        setVisible(true);
        const s = await getStaffs({data: {facId: facid}});
        setStaffs(s);
      }else{
        setMessage("施設が見つかりませんでした");
        setVisible(false);
        setFac(initFac());
        setStaffs([]);
        if(refInput){
          refInput.select();
          refInput.focus();
        }
      }
    }else{
      setFac(initFac());
      setVisible(false);
    }
  }

  onMount(() => {
    if(refInput){
      refInput.focus();
    }
  });

  return (
    <>
    <Header title="施設医師登録" visible={visible()} handler={handleNew} auth={user} />
    <main>
      <div class={ area({ type: "search" })}>
        <label>施設ID<input type="text" class={ input({ size: "first", space: "first" }) }
          value={id()}
          onChange={(e)=>setId(e.target.value)}
          onKeyUp={handleChange} ref={refInput} /></label>
        <button type="button" class={ button({ color: "normal", size: "slim" }) }
          onClick={async ()=>{await execute(id())}}>検索</button>
        <span>{message()}</span>
      </div>
      <hr />
      <Show when={fac().id}>
        <div class={ css({ paddingBottom: "px.5", backgroundColor: "subinfo" }) }>
          <div class={ flex({ direction: "row", alignItems: "flex-end" }) }>
            <div class={ css({ minWidth: "5rem", fontFamily: "number" }) }>{fac().id}</div>
            <div class={ css({ marginLeft: "1rem" }) }>{fac().name}</div>
          </div>
          <div>
            <div>{fac().address}</div>
          </div>
        </div>
      </Show>
      <Switch>
        <Match when={modification()}>
          <ModificationArea staff={staff} setStaff={setStaff} auth={user}
            terminateModification={terminateModification} newadd={newadd()} />
        </Match>
        <Match when={staffs().length > 0}>
          <ListArea staffs={staffs} select={select} />
        </Match>
      </Switch>
      <Message />
    </main>
    <footer>

    </footer>
    </>
  );
}