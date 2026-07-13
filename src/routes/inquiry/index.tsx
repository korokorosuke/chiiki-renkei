import { createSignal, Switch, Match } from "solid-js"
import { ListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import { getInquiries, update, del } from "../../server/func/inquiry.ts"
import Header from "../-header.tsx"
import { Authenticator, authenticatedUser as user } from "../../components/Authenticator.tsx"
import { Message, setMessage as setStatusMessage, type MessageStatus } from "../../components/Message.tsx"
import { toDateHHMMString, toDateString, addDays } from "../../lib/datetime.ts"
import { toUser, initInquiry } from "../../helper/types.ts"
import type { Inquiry } from "../../server/domain/inquiry.ts"
import { button, area, input } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/inquiry/")({ component: App });

export const [selected, setSelected] = createSignal<Inquiry>(initInquiry());

function App() {
  const [inputFacData, setInputFacData] = createSignal<string>("");
  const [inputPatData, setInputPatData] = createSignal<string>("");
  const [inputFromData, setInputFromData] = createSignal<string>("");
  const [inputToData, setInputToData] = createSignal<string>("");
  const [inquiries, setInquiries] = createSignal<Inquiry[]>([]);
  const [modification, setModification] = createSignal<boolean>(false);
  const [newadd, setNewadd] = createSignal<boolean>(false);

  let refInput: HTMLInputElement | undefined;

  async function terminateModification(status: MessageStatus): Promise<void>{
    setModification(false);
    setStatusMessage(status);

    await loadData(inputPatData(), inputFacData(), inputFromData(), inputToData());
  }

  function select(inq: Inquiry){
    setInquiries([]);
    setSelected(inq);
    setNewadd(false);
    setModification(true);
  }

  function handleNew(){
    setModification(false);
    setSelected({
      ...initInquiry(),
      personInCharge: toUser(user()),
      datetime: toDateHHMMString(new Date()),
    });
    setModification(true);
    setNewadd(true);
  }

  function changeInquiries(inq: Inquiry){
    for(let i=0; i < inquiries.length; i++){
      if(inquiries()[i].id === inq.id){
        inquiries()[i] = inq;
        setInquiries(inquiries);
      }
    }
  }

  async function registerResponse(inq: Inquiry): Promise<void>{
    if(inq){
      const res = await update({data: {inquiry: inq}});
      if(res.ok){
        terminateModification("register");
        changeInquiries(inq);
      }else{
        alert("登録に失敗しました");
      }
    }
  }

  async function deleteResponse(inq: Inquiry): Promise<void>{
    if(inq){
      const res = await del({data: {inquiry: inq}});
      if(res.ok){
        terminateModification("delete");
        changeInquiries(inq);
      }else{
        alert("削除に失敗しました")
      }
    }
  }

  async function execute(){
    setModification(false);
    await loadData(inputPatData(), inputFacData(), inputFromData(), inputToData());
  }

  async function handleSearch(e: KeyboardEvent){
    if(e.key === "Enter"){
      await execute();
    }
  }

  async function loadData(patid: string, facid: string, fromdate: string, todate: string){
    if(!patid && !facid && !fromdate && !todate){
      const today = new Date();
      const start = addDays(today, -14);
      fromdate = toDateString(start);
      todate = toDateString(today);
    }
    if(patid || facid || fromdate || todate){
      const s = await getInquiries(
        {data: {patientId: patid, facilityId: facid, fromDate: fromdate, toDate: todate}});
      if(s){
        setInquiries(s);
      }else{
        setInquiries([]);
      }
    }
  }

  function initialize(){
    loadData("", "", "", "").then();
    if(refInput){
      refInput.focus();
    }
  }

  return (
    <>
    <Authenticator initializer={initialize} />
    <Header title="問い合わせ登録" visible handler={handleNew} auth={user} />
    <main>
      <div class={ area({ type: "search" }) }>
        <div>
        <label><div>患者ID</div><input type="text" class={ input({ size: "search" }) }
          value={inputPatData()}
          onChange={(e)=>setInputPatData(e.target.value)}
          onKeyUp={(e)=>handleSearch(e)} ref={refInput} /></label>
        </div>
        <div>
        <label><div>施設ID</div><input type="text" class={ input({ size: "search" }) }
          value={inputFacData()}
          onChange={(e)=>setInputFacData(e.target.value)}
          onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
        <label><div>日付from</div><input type="date" class={ input({ size: "search" }) }
          value={inputFromData()}
          onChange={(e)=>setInputFromData(e.target.value)}
          onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
        <label><div>日付to</div><input type="date" class={ input({ size: "search" }) }
          value={inputToData()}
          onChange={(e)=>setInputToData(e.target.value)}
          onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
        <button type="button" class={ button({ color: "normal", size: "slim" }) }
          onClick={async ()=>{await execute()}}>検索</button>
        </div>
      </div>
      <hr />
      <Switch>
        <Match when={modification()}>
          <ModificationArea auth={user}
            terminateModification={terminateModification} newadd={newadd}
            selected={selected} setSelected={setSelected} />
        </Match>
        <Match when={inquiries().length > 0}>
          <ListArea inquiries={inquiries} select={select} auth={user}
            registerResponse={registerResponse}
            deleteResponse={deleteResponse}
            selected={selected} setSelected={setSelected} />
        </Match>
      </Switch>
      <Message />
    </main>
    <footer>

    </footer>
    </>
  );
}