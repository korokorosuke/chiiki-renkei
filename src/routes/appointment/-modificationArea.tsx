import { createSignal, onMount, For, Index, Show, type Setter, type Accessor } from "solid-js"
import { createStore, unwrap } from "solid-js/store"
import { initAppointment, initFac, initDr, initDept, toUser, toDr, toFac } from "../../helper/types.ts"
import { MiniApp } from "../facility/-miniApp.tsx"
import { toHHMM } from "../../lib/datetime.ts"
import { Container, ContainerButton } from "../../components/Container.tsx"
import { insert, update, del } from "../../server/func/appointment.ts"
import { getFac } from "../../server/func/facility.ts"
import { getMeans, getFacDepts } from "../../server/func/master.ts"
import { getUser } from "../../server/func/user.ts"
import { getDrs as getFacDrs } from "../../server/func/staff.ts"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import { DrSelect } from "../../components/DrSelect.tsx"
import type { Appointment } from "../../server/domain/appointment.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import type { Department } from "../../server/domain/department.ts"
import type { Dr } from "../../server/domain/dr.ts"
import type { Facility } from "../../server/domain/facility.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { button, input, area } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type ViewProps = {
  appointment: Accessor<Appointment>
  setAppointment: Setter<Appointment>
  terminateModification: (status: MessageStatus)=>void
  depts: Department[]
  newadd: Accessor<boolean>
  auth: AuthUser
}

export const route = {
  preload: () => {
    getMeans();
    getFacDepts();
  }
};

export function ModificationArea(props: ViewProps){
  const [appointment, setAppointment] = createStore<Appointment>(structuredClone(props.appointment()));
  const [facDrs, setFacDrs] = createSignal<Dr[]>([]);
  const [times, setTimes] = createSignal<string[]>([]);
  const [means, setMeans] = createSignal<string[]>([]);
  const [facDepts, setFacDepts] = createSignal<string[]>([]);
  let oldFacId = "";
  let oldPerson = "";

  function handleEnter(e: KeyboardEvent, func: ()=>void){
    if(e.key === "Enter"){
      func();
    }
  }

  async function handleRegister(){
    const a = {
      ...unwrap(appointment),
      updatedBy: toUser(props.auth),
    }
    a.time = toHHMM(a.time);

    let res;
    if(props.newadd()){
      res = await insert({data: {appointment: a}});
    }else{
      res = await update({data: {appointment: a}});
    }
    if(res.ok){
      props.setAppointment(a);
      props.terminateModification("register");
    }else{
      setErrors(res.errors!);
    }
  }

  async function handleDelete(){
    if(!confirm("削除します。よろしいですか？")){
      return;
    }
    const res = await del({data: {appointment: props.appointment()}});
    if(res.ok){
      props.setAppointment(initAppointment());
      props.terminateModification("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  async function handleFacility(){
    if(appointment.facility.id !== oldFacId){
      oldFacId = appointment.facility.id;
      const res = await getFac({data: {id: appointment.facility.id}});
      if(res){
        setAppointment("facility", res);
        const drs = (await getFacDrs({data: {facId: appointment.facility.id}})).map((staff)=>toDr(staff));
        setFacDrs(drs);
        if(drs.length === 1){
          setAppointment("facilityDr", drs[0].name);
          return;
        }
      }else{
        setFacDrs([]);
        setAppointment("facility", {...initFac(), id: appointment.facility.id});
      }
      setAppointment("facilityDr", "");
    }
  }

  function handleDr(value: Dr){
    setAppointment("dr", value);
    setAppointment("appDisplay", value.name);
  }

  function handleDept(value: string){
    for(const dept of props.depts){
      if(dept.id === value){
        setAppointment("appDisplay", "");
        setAppointment("dr", initDr());
        setAppointment("department", dept);
        return;
      }
    }
    setAppointment("appDisplay", "");
    setAppointment("dr", initDr());
    setAppointment("department", initDept());
  }

  function getPerson(id: string){
    getUser({data: {id}}).then((res)=>{
      if(res && res.name){
        setAppointment("personInCharge", res);
      }else{
        setAppointment("personInCharge", {id: id, name: "", department: ""});
      }
    }).catch(()=>{
      setAppointment("personInCharge", {id: id, name: "", department: ""});
    });
  }

  function handlePerson(){
    if(appointment.personInCharge.id && appointment.personInCharge.id !== oldPerson){
      oldPerson = appointment.personInCharge.id;
      getPerson(appointment.personInCharge.id);
    }
  }

  function getTimes(): string[]{
    const ts = [];
    for(let i = 9; i < 12; i++){
      for(let j = 0; j < 2; j++){
        ts.push(toHHMM(`${i}:${j===0?0:30}`));
      }
    }
    for(let i = 13; i < 18; i++){
      for(let j = 0; j < 2; j++){
        ts.push(toHHMM(`${i}:${j===0?0:30}`));
      }
    }
    return ts;
  }

  function selectFacility(f: Facility){
    setAppointment("facility", toFac(f));
    handleFacility();
    closeDialog()
  }

  onMount(()=>{
    getFacDepts().then(setFacDepts);
    if(!props.appointment().department.id){
      setAppointment("department", props.depts[0]);
    }
    if(props.appointment().facility.id){
      getFacDrs({data: {facId: props.appointment().facility.id}}).then(
        (res)=>{
          const drs = res.map((staff)=>toDr(staff));
          setFacDrs(drs);
          if(!props.appointment().facilityDr){
            if(drs.length === 1){
              setAppointment("facilityDr", drs[0].name);
            }
          }
        }
      );
    }
    setTimes(getTimes());
    oldFacId = props.appointment().facility.id;
    oldPerson = props.appointment().personInCharge.id;
    getMeans().then((res)=>{
      setMeans(res);
      if(means().length === 0) return;

      if(!appointment.means && means().length > 0){
        setAppointment("means", means()[0]);
      }else{
        const m = appointment.means;
        setAppointment("means", "");
        setAppointment("means", m);
      }
    }).catch(()=>{alert("予約方法の取得に失敗しました。")});
  });


  return (
    <>
    <div class={ area({ type: "contents" }) }>
      <ErrorArea />
      <ContainerButton title="施設" require="*" buttonTitle="施設検索"
          onClick={showDialog} class={ button({ color: "normal", size: "tiny" }) }>
        <div><input type="text" class={ input({ size: "id" }) } value={appointment.facility.id}
            onChange={(e)=>setAppointment("facility", {...initFac(), id:e.target.value})}
            onKeyUp={(e)=>handleEnter(e, handleFacility)}
            onBlur={handleFacility} />
          <span class={ css({ marginLeft: "1rem" }) }>{appointment.facility.name}</span></div>
      </ContainerButton>
      <Container title="施設医師" require="*">
        <input type="text" class={ input({ size: "text" }) } list="facdr"
          value={appointment.facilityDr}
          onChange={(e)=>setAppointment("facilityDr", e.target.value)} />
          <datalist id="facdr">
          <For each={facDrs()}>{(fdr)=>
            <option value={fdr.name}>{fdr.name}</option>
          }</For>
          </datalist>
      </Container>
      <Container title="施設診療科">
        <input type="text" class={ input({ size: "text" }) } list="facdept" value={appointment.facilityDept}
            onChange={(e)=>setAppointment("facilityDept", e.target.value)} />
        <datalist id="facdept">
          <Index each={facDepts()}>{(fdept)=>
            <option value={fdept()}>{fdept()}</option>
          }</Index>
        </datalist>
      </Container>
      <Container title="予約(紹介)日" require="*">
        <input type="date" class={ input({ size: "date" }) }
          value={appointment.date} onChange={(e)=>setAppointment("date", e.target.value)} />
      </Container>
      <Container title="予約時間">
        <input type="text" class={ input({ size: "time" }) } list="times"
          value={appointment.time} onChange={(e)=>setAppointment("time", e.target.value)} />
        <datalist id="times">
          <Index each={times()}>{time=>
            <option value={time()}>{time()}</option>
          }</Index>
        </datalist>
      </Container>
      <Container title="予約科" require="*">
        <select class={ input({ size: "dept" }) } value={appointment.department.id}
            onChange={(e)=>handleDept(e.target.value)}>
          <For each={props.depts}>{(dept)=>
            <option value={dept.id}>{dept.name}</option>
          }</For>
        </select>
      </Container>
      <Container title="予約医師" require="*">
        <DrSelect dept={appointment.department} dr={appointment.dr}
          onChange={handleDr} />
      </Container>
      <Container title="予約票表示" require="*">
        <input type="text" class={ input({ size: "text" }) } list="appname"
          value={appointment.appDisplay}
          onChange={(e)=>setAppointment("appDisplay", e.target.value)} />
      </Container>
      <Container title="予約方法" require="*">
        <select class={ input({ size: "id" }) }
          value={appointment.means}
          onChange={(e)=>setAppointment("means", e.target.value)}>
          <Index each={means()}>{m=>
            <option value={m()}>{m()}</option>
          }</Index>
        </select>
      </Container>
      <Container title="担当者" require="*">
        <input type="text" class={ input({ size: "id" }) }
          value={appointment.personInCharge.id}
          onChange={(e)=>setAppointment("personInCharge",{id:e.target.value, name:"", department:""})}
          onKeyUp={(e)=>handleEnter(e, handlePerson)}
          onBlur={handlePerson} />
        <span class={ css({ marginLeft: "1rem" }) }>{appointment.personInCharge.name}</span>
      </Container>
      <Container title="備考">
        <textarea class={ input({ size: "full" }) }
          value={appointment.memo} onChange={(e)=>setAppointment("memo", e.target.value)} />
      </Container>
      <div class={ area({ type: "button" }) }>
        <button type="button" class={ button({ color: "primary", size: "long" }) } onClick={handleRegister}>登録</button>
        <button type="button" class={ button({ color: "cancel", size: "long" }) } onClick={()=>props.terminateModification("cancel")}>キャンセル</button>
        <Show when={!props.newadd()}>
          <button type="button" class={ button({ color: "error", size: "long" }) } onClick={handleDelete}>削除</button>
        </Show>
      </div>
    </div>
    <NormalDialog>
      <MiniApp select={selectFacility} close={closeDialog} />
    </NormalDialog>
    </>
  );
}