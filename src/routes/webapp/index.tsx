import { createSignal, Switch, Match, Show, onMount } from "solid-js"
import { createStore, unwrap, reconcile } from "solid-js/store"
import { ListArea } from "./-listArea.tsx"
import { DeptSelect } from "./-deptSelect.tsx"
import { AppSelect } from "./-appSelect.tsx"
import { PatientInput } from "./-patInput.tsx"
import { ViewArea } from "./-viewArea.tsx"
import { Details } from "./-details.tsx"
import { Notice } from "./-notice.tsx"
import { Completed } from "./-completed.tsx"
import { initWebAppointment, isUser } from "../../helper/webtypes.ts"
import { toUser } from "../../helper/types.ts"
import { Header } from "./-header.tsx"
import { getWebDepartments } from "../../server/func/webdepartment.ts"
import { getUserFac } from "../../server/func/facility.ts"
import { insert, update as updateData, del as deleteData } from "../../server/func/webappointment.ts"
import type { Fac } from "../../server/domain/facility.ts"
import type { WebAppointment } from "../../server/domain/webAppointment.ts"
import type { WebDepartment } from "../../server/domain/webDepartment.ts"
import { button, area, progress } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/webapp/")({
  component: App,
  head: () => ({
    scripts: [ { src: "/html2pdf.js" }, ],
  }),
});

enum Status {
  DETAIL = -2,
  LIST = -1,
  READY = 0,
  DEPT_SELECT = 1,
  APP_SELECT = 2,
  PATIENT_INPUT = 3,
  CONFIRM = 4,
  COMPLETE = 5,
}

function App() {
  const [selected, setSelected] = createStore<WebAppointment>(initWebAppointment());
  const [newadd, setNewadd] = createSignal(false);
  const [status, setStatus] = createSignal<Status>(Status.READY);
  const [modified, setModified] = createSignal(false);
  const [force, setForce] = createSignal(false);
  const [depts, setDepts] = createSignal<WebDepartment[]>([]);

  const context = Route.useRouteContext();
  const { user } = context();

  const deferment = 1;
  let facility: Fac;

  async function register(): Promise<boolean>{
    if(isUser(user)){
      if(user && facility){
        setSelected("facility", facility);
      }else{
        alert("ユーザーの施設情報が登録されていません。");
        return false;
      }
    }
    if(force()){
      setSelected("force", force());
    }
    setSelected("updatedBy", toUser(user));
    const app = unwrap(selected);
    let res;
    if(newadd()){
      setSelected("createdBy", toUser(user));
      res = await insert({data: {appointment: app}});
    }else{
      res = await updateData({data: {appointment: app}});
    }
    if(res.ok){
      if(newadd() && res.data){
        setSelected("id", res.data.id);
      }
      setModified(false);
      return true;
    }else{
      alert("登録に失敗しました")
      return false;
    }
  }

  async function del(): Promise<boolean>{
    const res = await deleteData({data: {appointment: unwrap(selected)}});
    if(res.ok){
      setSelected(reconcile(initWebAppointment()));
      return true;
    }else{
      alert("削除に失敗しました")
      return false;
    }
  }

  function create(){
    if(!modified() || leave()){
      setNewadd(true);
      setStatus(Status.DEPT_SELECT);
      setModified(false);
      setSelected(reconcile(initWebAppointment()));
    }
  }

  function update(){
      setNewadd(false);
      setStatus(Status.DEPT_SELECT);
      setModified(false);
  }

  function history(){
    if(!modified() || leave()){
      setNewadd(false);
      setStatus(Status.LIST);
      setModified(false);
      setSelected(reconcile(initWebAppointment()));
    }
  }

  function toHome(){
    if(!modified() || leave()){
      setNewadd(false);
      setStatus(Status.READY);
      setModified(false);
      setSelected(reconcile(initWebAppointment()));
    }
  }

  function changeStatus(status: number){
    setModified(true);
    setNewadd(false);
    setStatus(status);
  }

  async function next(){
    if(status()>Status.DEPT_SELECT){
      setModified(true);
    }
    if(status()===Status.CONFIRM){
      if(await register()){
        setModified(false);
        setNewadd(false);
      }else{
        return;
      }
    }
    setStatus((val)=>val+1);
  }

  function previous(){
    setStatus((val)=>val-1);
  }

  function leave(): boolean{
    return confirm("処理中ですが移動しますか？");
  }

  function getDisabled(): boolean{
    return (status()===Status.DEPT_SELECT && !selected.department.id) ||
      (status()===Status.APP_SELECT && !selected.time && !selected.consultation?.etc &&
        !selected.consultation?.first && !selected.consultation?.second) ||
      (status()===Status.PATIENT_INPUT && (!selected.patient.birthday ||
        !selected.patient.lastName || !selected.patient.firstName ||
        !selected.mainComplaint));
  }

  function getStatus(base: number, active: Progress, done: Progress, yet: Progress): Progress {
     return (status()===base ? active : (status() > base ? done : yet));
  }


  onMount(() => {
    getWebDepartments().then(setDepts);
    if(isUser(user)){
      if(user.facilityId){
        getUserFac({data: {id: user.facilityId!}}).then(res=>{
          if(res && res.name){
            facility = res;
          }else{
            alert("施設情報が不正です。");
          }
        }).catch(()=>{
          alert("施設情報の取得に失敗しました。")
          location.href = `/login/${user.base}?src=${location.href}`;
        });
      }else{
        alert("ユーザーの施設情報が登録されていません。");
        location.href = `/login/${user.base}?src=${location.href}`;
      }
    }
  });

  interface Progress {
    step: string;
  }

  const prog = progress();
  const progactive = progress({ status: "active" });
  const progdone = progress({ status: "done" });
  const progyet = progress({ status: "yet" });
  return (
    <>
    <Header create={create} history={history} home={toHome} user={user} />
    <main class={status()===Status.LIST?"main-list-area":"main-area"}>
      <div>
      <Show when={status()>Status.READY}>
        <div class={ prog.root }>
          <div class={ getStatus(Status.DEPT_SELECT, progactive, progdone, progyet).step }>
            <div class={ prog.stepno }>{status()>Status.DEPT_SELECT?"✔":"1"}</div>
            <div>
              {status()<=Status.DEPT_SELECT?"診療科選択":selected.department.name}
            </div>
          </div>
          <div class={ getStatus(Status.APP_SELECT, progactive, progdone, progyet).step }>
            <div class={ prog.stepno }>{status()>Status.APP_SELECT?"✔":"2"}</div>
            {status()<=Status.APP_SELECT?<div>予約日時選択</div>:
              <div class={ css({ fontFamily: "number" }) }>{
              (!selected.time && (selected.consultation?.etc || selected.consultation?.first ||
                selected.consultation?.second))?"調整依頼":`${selected.date} ${selected.time}`}
              </div>}
          </div>
          <div class={ getStatus(Status.PATIENT_INPUT, progactive, progdone, progyet).step }>
            <div class={ prog.stepno }>{status()>Status.PATIENT_INPUT?"✔":"3"}</div>
            <div>
              {status()<=Status.PATIENT_INPUT?"患者情報入力":
              selected.patient.birthday&&selected.patient.lastName&&selected.patient.firstName&&selected.mainComplaint?"患者入力済":"　"}
            </div>
          </div>
          <div class={ getStatus(Status.CONFIRM, progactive, progdone, progyet).step }>
            <div class={ prog.stepno }>4</div>
            <div>
              {status()<=Status.CONFIRM?"内容確認":status()===Status.COMPLETE?"内容確認済":"　"}
            </div>
          </div>
        </div>
      </Show>
      <div class={ css({ marginBottom: "1rem" }) }>
      <Switch>
        <Match when={status()===Status.READY}>
          <Notice />
          <Show when={isUser(user)}>
            <div class={ css({ marginTop: "1rem" })}>
              <button type="button" class={ button({ color: "primary", size: "full" }) } onClick={create}>新規予約</button>
            </div>
            <div class={ css({ marginTop: "1rem", textAlign: "center" }) }>
              <a class={ css({ cursor: "pointer", color: "#1e6bff", textDecoration: "underline" }) }
                onClick={history}>予約履歴</a>
            </div>
          </Show>
        </Match>
        <Match when={status()===Status.DEPT_SELECT}>
          <DeptSelect depts={depts()} next={next} selected={selected} setSelected={setSelected} />
        </Match>
        <Match when={status()===Status.APP_SELECT}>
          <AppSelect next={next} deferment={deferment} setForce={setForce} user={user}
            selected={selected} setSelected={setSelected} />
        </Match>
        <Match when={status()===Status.PATIENT_INPUT}>
          <PatientInput selected={selected} setSelected={setSelected} />
        </Match>
        <Match when={status()===Status.CONFIRM}>
          <ViewArea selected={selected} />
        </Match>
        <Match when={status()===Status.COMPLETE}>
          <Completed selected={selected} />
        </Match>
        <Match when={status()===Status.LIST}>
          <ListArea previous={previous} user={user} setSelected={setSelected} />
        </Match>
        <Match when={status()===Status.DETAIL}>
          <Details register={register} delete={del} update={update} next={next}
            deferment={deferment} changeStatus={changeStatus} user={user}
            selected={selected} setSelected={setSelected} />
        </Match>
      </Switch>
      </div>
      <Show when={status()>=Status.DEPT_SELECT && status() < Status.COMPLETE}>
        <div class={ area({ type: "webbutton" }) }>
          <button disabled={status()===Status.DEPT_SELECT} type="button"
            class={ button({ color: "cancel", size: "long" }) }
            onClick={previous}>戻る</button>
          <button disabled={getDisabled()} type="button"
            class={ button({ color: "primary", size: "long" }) }
            onClick={next}>{status()===Status.CONFIRM?"登録":"次へ"}</button>
        </div>
      </Show>
      </div>
    </main>
    <footer>

    </footer>
    </>
  );
}