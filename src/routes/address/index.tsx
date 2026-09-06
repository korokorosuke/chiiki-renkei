import { createSignal, Switch, Match, onMount } from "solid-js"
import { ListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import { initAddress } from "../../helper/types.ts"
import { getAddress } from "../../server/func/address.ts"
import Header from "../-header.tsx"
import { Message, setMessage as setStatusMessage, type MessageStatus } from "../../components/Message.tsx"
import type { Address } from "../../server/domain/address.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/address/")({ component: App });

function App() {
  const [inputData, setInputData] = createSignal<string>("");
  const [selected, setSelected] = createSignal<Address>(initAddress());
  const [addresses, setAddresses] = createSignal<Address[]>([]);
  const [modification, setModification] = createSignal<boolean>(false);
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const [message, setMessage] = createSignal("");

  const context = Route.useRouteContext();
  const { user } = context();

  let refInput: HTMLInputElement | undefined;

  function terminateModification(status: MessageStatus): void{
    setModification(false);
    setStatusMessage(status);
    if(status === "register"){
      setAddresses([selected()]);
    }
    setSelected(initAddress());
  }

  function select(u: Address){
    setSelected(u);
    setModification(true);
    setNewadd(false);
  }

  function handleNew(){
    setModification(false);
    setSelected(initAddress());
    setModification(true);
    setNewadd(true);
  }

  async function execute(){
    setModification(false);
    setMessage("");
    setNewadd(false);
    await loadData(inputData());
  }

  async function handleChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      await execute();
    }
  }

  async function loadData(address: string){
    if(address != ""){
      if(/^[0-9]{3}-?[0-9]{4}$/i.test(address)){
        address = address.replace("-", "");
      }else{
        setMessage("入力データが不正です");
        setAddresses([]);
        return;
      }
      const res = await getAddress({data: {postalCode: address}});
      if(res){
        setSelected(res);
        setAddresses([]);
        setModification(true);
      }else{
        setMessage("対象データが存在しません");
        setAddresses([]);
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
    <Header title="住所登録" visible handler={handleNew} auth={user} />
    <main>
      <div class={ area({ type: "search" }) }>
        <label>郵便番号<input type="text" class={ input({ size: "first", space: "first" }) }
          value={inputData()}
          onChange={(e)=>setInputData(e.target.value)}
          onKeyUp={handleChange} ref={refInput} /></label>
        <button type="button" class={ button({ color: "normal", size: "slim" }) }
          onClick={async ()=>{await execute()}}>検索</button>
        <span>{message()}</span>
      </div>
      <hr />
      <Switch>
        <Match when={modification()}>
          <ModificationArea address={selected} setAddress={setSelected}
            terminateModification={terminateModification} newadd={newadd} />
        </Match>
        <Match when={addresses().length > 0}>
          <ListArea addresses={addresses} select={select} />
        </Match>
      </Switch>
      <Message />
    </main>
    <footer>

    </footer>
    </>
  );
}