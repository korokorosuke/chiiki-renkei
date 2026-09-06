import { createSignal, createMemo, For, Switch, Match, onMount, type Accessor } from "solid-js"
import { ListAreaReferral } from "./-listAreaReferral.tsx"
import { ListAreaReferralTo } from "./-listAreaReferralTo.tsx"
import { ListAreaReply } from "./-listAreaReply.tsx"
import Header from "../-header.tsx"
import { addDays, toDateString } from "../../lib/datetime.ts"
import { getDepartments } from "../../server/func/department.ts"
import { getDrs } from "../../server/func/dr.ts"
import { getReferrals, getReferralTos, getReplies } from "../../server/func/statistics.ts"
import type { Referral } from "../../server/domain/referral.ts"
import type { ReferralTo } from "../../server/domain/referralto.ts"
import type { Department } from "../../server/domain/department.ts"
import type { Dr } from "../../server/domain/dr.ts"
import { button, input, area, etc } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/statistics/{-$id}")({ component: App });

function App() {
  const [inputFromData, setInputFromData] = createSignal<string>("");
  const [inputToData, setInputToData] = createSignal<string>("");
  const [inputFacData, setInputFacData] = createSignal<string>("");
  const [inputDeptData, setInputDeptData] = createSignal<string>("");
  const [inputDrData, setInputDrData] = createSignal<string>("");
  const [result, setResult] = createSignal<Referral[]|ReferralTo[]>([]);
  const [resultRep, setResultRep] = createSignal<Referral[]>([]);
  const [depts, setDepts] = createSignal<Department[]>([]);
  const [drs, setDrs] = createSignal<Dr[]>([]);
  const [id, setId] = createSignal("");

  const context = Route.useRouteContext();
  const { user } = context();

  let refInput: HTMLInputElement | undefined;

  const params = Route.useParams();
  const paramid = params().id;
  if(paramid){
    setId(paramid);
  }else{
    setId("referral");
  }

  const title = createMemo(()=>{
    if(id() === "referral"){
      return "統計（紹介）";
    }else if(id() === "referralto"){
      return "統計（逆紹介）";
    }else if(id() === "reply"){
      return "統計（返事）";
    }else{
      return "統計";
    }
  });

  async function execute(){
    await loadData(inputFromData(), inputToData(), inputFacData(), inputDeptData(), inputDrData());
  }

  async function handleSearch(e: KeyboardEvent){
    if(e.key === "Enter"){
      await execute();
    }
  }

  async function loadData(fromdate: string, todate: string, facid: string, dept: string, dr: string){
    if(!fromdate && !todate && !facid && !dept && !dr){
      const today = new Date();
      const start = addDays(today, -14);
      fromdate = toDateString(start);
      todate = toDateString(today);
      setInputFromData(fromdate);
      setInputToData(todate);
    }
    if(fromdate || todate || facid || dept || dr){
      const params = {dept: dept, dr: dr, facility: facid, fromDate: fromdate, toDate: todate};
      if(id()==="reply"){
        const res = await getReplies({data: {id: id(), condition: params}});
        if(res){
          setResultRep(res);
        }else{
          setResultRep([]);
        }
      }else if(id()==="referral"){
        const res = await getReferrals({data: {id: id(), condition: params}});
        if(res){
          setResult(res);
        }else{
          setResult([]);
        }
      }else if(id()==="referralto"){
        const res = await getReferralTos({data: {id: id(), condition: params}});
        if(res){
          setResult(res);
        }else{
          setResult([]);
        }
      }
    }
  }

  async function changeDept(val: string){
    setInputDeptData(val);
    setDrs(await getDrs({data: {dept: val}}));
  }

  onMount(() => {
    getDepartments().then(setDepts);
    if(refInput){
      refInput.focus();
    }
  });


  return (
    <>
    <Header title={title()} visible={false} handler={()=>{}} auth={user} />
    <main>
      <div class={ area({ type: "search" }) }>
        <div>
          <label><div>日付開始<span class={ etc( { type: "require" }) }>*</span></div><input type="date" value={inputFromData()}
            class={ input({ size: "search" }) } ref={refInput}
            onChange={(e)=>setInputFromData(e.target.value)}
            onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
          <label><div>日付終了</div><input type="date" value={inputToData()}
            class={ input({ size: "search" }) }
            onChange={(e)=>setInputToData(e.target.value)}
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
            onChange={(e)=>{changeDept(e.target.value)}}>
            <option value=""></option>
            <For each={depts()}>{dept=>
              <option value={dept.id}>{dept.name}</option>
            }</For>
            </select>
          </label>
        </div>
        <div>
          <label><div>医師</div><select value={inputDrData()}
            class={ input({ size: "search" }) }
            onChange={(e)=>setInputDrData(e.target.value)}>
            <option value=""></option>
            <For each={drs()}>{dr=>
              <option value={dr.id}>{dr.name}</option>
            }</For>
            </select>
          </label>
        </div>
        <div>
          <button type="button" class={ button({ color: "normal", size: "slim" }) }
            onClick={async ()=>{await execute()}}>検索</button>
        </div>
      </div>
      <hr />
      <Switch>
        <Match when={id()==="referral"&&result().length > 0}>
          <ListAreaReferral result={result as Accessor<Referral[]>} />
        </Match>
        <Match when={id()==="referralto"&&result().length > 0}>
          <ListAreaReferralTo result={result as Accessor<ReferralTo[]>} />
        </Match>
        <Match when={id()==="reply"&&resultRep().length > 0}>
          <ListAreaReply result={resultRep} />
        </Match>
      </Switch>
    </main>
    <footer>

    </footer>
    </>
  );
}