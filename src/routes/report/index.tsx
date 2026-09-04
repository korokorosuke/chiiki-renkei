import { createSignal, For, Switch, Match, Show } from "solid-js"
import { ListArea } from "./-listArea.tsx"
import Header from "../-header.tsx"
import { Authenticator, authenticatedUser as user } from "../../components/Authenticator.tsx"
import { DoneBase } from "../report/-doneBase.tsx"
import { toDateString } from "../../lib/datetime.ts"
import { getDepartments } from "../../server/func/department.ts"
import { initAppointment } from "../../helper/types.ts"
import { type AppointmentPrint, getAppointments } from "../../server/func/report.ts"
import type { Appointment } from "../../server/domain/appointment.ts"
import type { Department } from "../../server/domain/department.ts"
import { button, input, area, etc } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/report/")({
  component: App,
  head: ()=>({
    scripts: [ { src: "/html2pdf.js" }, ],
  }),
});

function App() {
  const [inputData, setInputData] = createSignal<string>(toDateString(new Date()));
  const [inputFacData, setInputFacData] = createSignal<string>("");
  const [inputDeptData, setInputDeptData] = createSignal<string>("");
  const [result, setResult] = createSignal<AppointmentPrint[]>([]);
  const [depts, setDepts] = createSignal<Department[]>([]);
  const [appointment, setAppointment] = createSignal<Appointment>(initAppointment());

  let refInput: HTMLInputElement | undefined;

  async function createPDF(){
    const elem = document.querySelector("#report-body");
    if(appointment().id){
      {/* @ts-ignore */}
      await html2pdf().from(elem).set({
        filename: `houkoku_${appointment().date}_${appointment().patient.id}_${appointment().facility.id}_${appointment().department.id}.pdf`
      }).save();
    }
  }

  async function execute(){
    for(const app of result()){
      if(!app.notPrint){
        setAppointment(app as Appointment);
        await createPDF();
      }
    }
  }

  async function search(){
    await loadData(inputData(), inputFacData(), inputDeptData());
  }

  async function handleSearch(e: KeyboardEvent){
    if(e.key === "Enter"){
      await search();
    }
  }

  async function loadData(date: string, facid: string, dept: string){
    if(!date){
      const today = new Date();
      date = toDateString(today);
      setInputData(date);
    }
    if(date || facid || dept){
      const params = {deptId: dept, facilityId: facid, date: date};
      const res = await getAppointments({data: {condition: params}});
      if(res){
        setResult(res);
      }else{
        setResult([]);
      }
    }
  }

  function initialize(){
    getDepartments().then(setDepts);
    if(refInput){
      refInput.focus();
    }
  }


  return (
    <>
    <Authenticator initializer={initialize} />
    <Header title="受診報告一覧" visible={false} handler={()=>{}} auth={user} />
    <main>
      <div class={ area({ type: "search" }) }>
        <div>
          <label><div>対象日付<span class={ etc( { type: "require" }) }>*</span></div>
            <input type="date" value={inputData()}
              class={ input({ size: "search" }) } ref={refInput}
              onChange={(e)=>setInputData(e.target.value)}
              onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
          <label><div>施設ID</div><input type="text" value={inputFacData()}
            class={ input({ size: "search" }) }
            onChange={(e)=>setInputFacData(e.target.value)}
            onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
          <label><div>診療科</div><select value={inputDeptData()}
            class={ input({ size: "search" }) }
            onChange={(e)=>{setInputDeptData(e.target.value)}}>
            <option value=""></option>
            <For each={depts()}>{dept=>
              <option value={dept.id}>{dept.name}</option>
            }</For>
            </select>
          </label>
        </div>
        <div>
          <button type="button" class={ button({ color: "normal", size: "slim" }) }
            onClick={async ()=>{await search()}}>検索</button>
        </div>
        <Show when={result().length > 0}>
          <div>
            <button type="button" class={ button({ color: "primary", size: "slim" }) }
              onClick={async ()=>{await execute()}}>出力</button>
          </div>
        </Show>
      </div>
      <hr />
      <Switch>
        <Match when={result().length > 0}>
          <ListArea result={result} setResult={setResult} />
        </Match>
      </Switch>
      <Show when={appointment().id}>
        <div class={ css({ position: "fixed", left: "100rem"}) }>
          <DoneBase appointment={appointment()} />
        </div>
      </Show>
    </main>
    <footer>

    </footer>
    </>
  );
}