import { createSignal, Switch, Match, onMount } from "solid-js"
import { ListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import { initPatient } from "../../helper/types.ts"
import { getPatient, getPatients } from "../../server/func/patient.ts"
import Header from "../-header.tsx"
import { Message, setMessage as setStatusMessage, type MessageStatus } from "../../components/Message.tsx"
import type { Patient } from "../../server/domain/patient.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/patient/")({ component: App });

function App() {
  const [inputData, setInputData] = createSignal<string>("");
  const [selected, setSelected] = createSignal<Patient>(initPatient());
  const [patients, setPatients] = createSignal<Patient[]>([]);
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
      setPatients([selected()]);
    }
    setSelected(initPatient());
  }

  function select(p: Patient){
    setSelected(p);
    setModification(true);
    setNewadd(false);
  }

  function handleNew(){
    setModification(false);
    setSelected(initPatient());
    setModification(true);
    setNewadd(true);
  }

  async function execute(){
    setModification(false);
    setMessage("");
    await loadData(inputData());
  }

  async function handleChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      await execute();
    }
  }

  async function loadData(pat: string){
    if(pat != ""){
      if(/^[0-9a-z]+$/i.test(pat)){
        const res = await getPatient({data: {id: pat}});
        if(res){
          setSelected(res);
          setPatients([]);
          setNewadd(false);
          setModification(true);
        }else{
          setPatients([]);
        }
      }else{
        const res = await getPatients({data: {name: pat}});
        setPatients(res);
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
    <Header title="患者登録" visible handler={handleNew} auth={user} />
    <main>
      <div class={ area({ type: "search" })}>
        <label>患者<input type="text" class={ input({ size: "first", space: "first" }) }
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
          <ModificationArea patient={selected} setPatient={setSelected}
            terminateModification={terminateModification} newadd={newadd()} />
        </Match>
        <Match when={patients().length > 0}>
          <ListArea patients={patients} select={select} />
        </Match>
      </Switch>
      <Message />
    </main>
    <footer>

    </footer>
    </>
  );
}