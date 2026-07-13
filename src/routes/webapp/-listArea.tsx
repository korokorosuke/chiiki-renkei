import { createSignal, onMount, For, Show, type Accessor } from "solid-js"
import { reconcile, type SetStoreFunction } from "solid-js/store"
import { toDateString, toDateHHMMString, addDays } from "../../lib/datetime.ts"
import { isUser, isMaster } from "../../helper/webtypes.ts"
import { getNoID, getConsultation, getWebAppointments } from "../../server/func/webappointment.ts"
import type { WebAppointment } from "../../server/domain/webAppointment.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { table } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type Props = {
  previous: ()=>void
  user: Accessor<AuthUser>
  setSelected: SetStoreFunction<WebAppointment>
}

const [inputPatData, setInputPatData] = createSignal("");
const [inputFacData, setInputFacData] = createSignal("");
const [inputFromData, setInputFromData] = createSignal("");
const [inputToData, setInputToData] = createSignal("");

export function ListArea(props: Props) {
  const [apps, setApps] = createSignal<WebAppointment[]>([]);

  let refInput: HTMLInputElement | undefined

  function handleClick(app: WebAppointment){
    props.setSelected(reconcile(app));
    props.previous();
  }

  async function execute(){
    await loadData(inputPatData(), inputFacData(), inputFromData(), inputToData());
  }

  async function handleSearch(e: KeyboardEvent){
    if(e.key === "Enter"){
      await execute();
    }
  }

  async function loadNoID(){
    const res = await getNoID();
    if(res){
      setApps(res);
    }
  }

  async function loadConsultation(){
    let res;
    if(isUser(props.user())){
      res = await getConsultation({data: {facid: props.user().facilityId!}});
    }else{
      res = await getConsultation({data: {}});
    }
    if(res){
      setApps(res);
    }
  }

  async function loadData(patid: string, facid: string, fromdate: string, todate: string){
    if(isUser(props.user())){
      facid = props.user().facilityId!;
    }
    if(!patid && !facid && !fromdate && !todate){
      const today = new Date();
      fromdate = toDateString(today);
      todate = toDateString(addDays(today, 200));
    }
    const res = await getWebAppointments({data: {cond: {patid, facid, from: fromdate, to: todate}}});
    if(res){
      setApps(res.sort((v1,v2)=>{
        if(v1.updatedAt > v2.updatedAt){
          return -1;
        }else if(v1.updatedAt < v2.updatedAt){
          return 1;
        }else{
          return 0;
        }
      }));
    }
  }

  async function getApps(){
    let res;
    if(isMaster(props.user())){
      res = await getWebAppointments({data: {cond: {from: toDateString(new Date())}}});
    }else{
      res = await getWebAppointments({data: {cond: {facid: props.user().facilityId}}});
    }
    if(res){
      setApps(ar=>ar.concat(res.sort((v1,v2)=>{
        if(v1.updatedAt > v2.updatedAt){
          return -1;
        }else if(v1.updatedAt < v2.updatedAt){
          return 1;
        }else{
          return 0;
        }
      })));
    }
  }

  onMount(async ()=>{
    if(inputPatData() || inputFacData() || inputFromData() || inputToData()){
      await execute();
    }else{
      getApps();
    }

    if(refInput){
      refInput.focus();
    }
  });


  return (
    <div>
      <div class={ area({ type: "search" }) }>
        <Show when={isMaster(props.user())}>
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
        </Show>
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
        <div>
        <button type="button" class={ button({ color: "normal", size: "slim" }) }
          onClick={async ()=>{await loadConsultation()}}>未確定</button>
        </div>
        <Show when={isMaster(props.user())}>
        <div>
        <button type="button" class={ button({ color: "normal", size: "slim" }) }
          onClick={async ()=>{await loadNoID()}}>ID無し</button>
        </div>
        </Show>
      </div>
      <hr />
      <table class={ table({ color: "web", size: "full" }) }>
        <thead>
          <tr>
            <th>状態</th>
            <Show when={isMaster(props.user())}>
            <th>ID</th>
            </Show>
            <th>氏名</th><th>予約日時</th><th>予約医師</th>
            <Show when={isMaster(props.user())}>
            <th>施設</th>
            </Show>
            <th>更新日時</th><th>更新者</th>
          </tr>
        </thead>
        <tbody>
          <For each={apps()}>{app=>
            <tr onClick={()=>handleClick(app)}>
              <td class={ css({ color: (app.cancel||(!app.date&&app.consultation)?"red":"black") }) }>
                {app.cancel?"キャンセル":(!app.date&&app.consultation?"調整中":"")}</td>
              <Show when={isMaster(props.user())}>
              <td class={ css({ fontFamily: "number" }) }>{app.patient.id}</td>
              </Show>
              <td>{app.patient.lastName}　{app.patient.firstName}</td>
              <td class={ css({ fontFamily: "number" }) }>{app.date} {app.time}</td>
              <Show when={isUser(props.user())}>
              <td>{app.dr.displayName}</td>
              </Show>
              <Show when={isMaster(props.user())}>
              <td>{app.dr.name}</td>
              <td>
                <span class={ css({ fontFamily: "number" }) }>{app.facility?.id}:</span>{app.facility?.name}
              </td>
              </Show>
              <td class={ css({ fontFamily: "number" }) }>
                {toDateHHMMString(new Date(app.updatedAt)).replace("T", " ")}
              </td>
              <td>{app.updatedBy.name}</td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  );
}