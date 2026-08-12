import { createSignal, onMount, For, Index, Show, type Setter, type Accessor } from "solid-js"
import { createStore, unwrap } from "solid-js/store"
import { initReferralTo, initFac, initDr, toUser, toDr, toFac } from "../../helper/types.ts"
import { getFac } from "../../server/func/facility.ts"
import { getDrs as getFacDrs } from "../../server/func/staff.ts"
import { getUser } from "../../server/func/user.ts"
import { getDrsForDept } from "../../server/func/dr.ts"
import { getFacDepts } from "../../server/func/master.ts"
import { insert, update, del } from "../../server/func/referralto.ts"
import { MiniApp } from "../facility/-miniApp.tsx"
import { Container, ContainerButton } from "../../components/Container.tsx"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import type { ReferralTo } from "../../server/domain/referralto.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import type { Department, Dept } from "../../server/domain/department.ts"
import type { Dr } from "../../server/domain/dr.ts"
import type { Facility } from "../../server/domain/facility.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { button, input, area } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type ViewProps = {
  referral: Accessor<ReferralTo>
  setReferral: Setter<ReferralTo>
  terminateModification: (status: MessageStatus)=>void
  depts: Department[]
  newadd: Accessor<boolean>
  auth: Accessor<AuthUser>
}

function handleEnter(e: KeyboardEvent, func: ()=>void){
  if(e.key === "Enter"){
    func();
  }
}

export function ModificationArea(props: ViewProps){
  const [referral, setReferral] = createStore<ReferralTo>(structuredClone(props.referral()));
  const [facDrs, setFacDrs] = createSignal<Dr[]>([]);
  const [drs, setDrs] = createSignal<Dr[]>([]);
  const [facDepts, setFacDepts] = createSignal<string[]>([]);
  let oldFacId = "";
  let oldPerson = "";

  async function handleRegister(){
    const r = {
      ...unwrap(referral),
      updatedBy: toUser(props.auth()),
    }
    let res;
    if(props.newadd()){
      res = await insert({data: {referral: r}});
    }else{
      res = await update({data: {referral: r}});
    }
    if(res.ok){
      props.setReferral(r);
      props.terminateModification("register");
    }else{
      setErrors(res.errors!);
    }
  }

  async function handleDelete(){
    if(!confirm("削除します。よろしいですか？")){
      return;
    }

    const res = await del({data: {referral: props.referral()}});
    if(res.ok){
      props.setReferral(initReferralTo());
      props.terminateModification("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  async function handleFacility(){
    if(referral.facility.id !== oldFacId){
      oldFacId = referral.facility.id;
      const res = await getFac({data: {id: referral.facility.id}});
      if(res){
        setReferral("facility", res);
        const drs = (await getFacDrs({data: {facId: referral.facility.id}})).map((staff)=>toDr(staff));
        setFacDrs(drs);
        if(drs.length === 1){
          setReferral("facilityDr", drs[0].name);
          return;
        }
      }else{
        setFacDrs([]);
        setReferral("facility", {...initFac(),id:referral.facility.id});
      }
      setReferral("facilityDr", "");
    }
  }

  function handleDr(value: string){
    for(const f of drs()){
      if(value === f.id){
        setReferral("dr", {...f, id: value});
        return;
      }
    }
  }

  function getDrs(dept: Dept, dr: Dr|undefined) {
    setReferral("dr", initDr());
    getDrsForDept({data: {dept: dept.id}}).then((res)=>{
      if(res.length !== 0){
        setDrs(res);
        if(dr){
          const temp = res.filter((d)=>d.id === dr.id);
          if(temp.length === 1){
            setReferral("dr", temp[0]);
            return;
          }
        }
        setReferral("dr", res[0]);
      }else{
        setDrs([]);
        setReferral("dr", initDr());
      }
    }).catch(()=>{alert("医師の取得に失敗しました。")});
  }

  function handleDept(value: string){
    for(const dept of props.depts){
      if(dept.id === value){
        getDrs(dept, {...referral.dr});
        setReferral("department", dept);
        return;
      }
    }
  }

  function getPerson(id: string){
    getUser({data: {id}}).then(
      (res)=>{
        if(res && res.name){
          setReferral("personInCharge", res);
        }else{
          setReferral("personInCharge", {id: id, name: "", department: ""});
        }
      }
    ).catch(()=>{
      setReferral("personInCharge", {id: id, name: "", department: ""});
    });
  }

  function handlePerson(){
    if(referral.personInCharge.id && referral.personInCharge.id !== oldPerson){
      oldPerson = referral.personInCharge.id;
      getPerson(referral.personInCharge.id);
    }
  }

  function selectFacility(f: Facility){
    setReferral("facility", toFac(f));
    handleFacility();
    closeDialog()
  }

  onMount(()=>{
    getFacDepts().then(setFacDepts);
    if(props.referral().department.id){
      getDrs(props.referral().department, props.referral().dr);
    }else{
      setReferral("department", props.depts[0]);
      getDrs(props.depts[0], props.referral().dr);
    }
    if(props.referral().facility.id){
      getFacDrs({data: {facId: props.referral().facility.id}}).then(
        (res)=>{
          const drs = res.map((staff)=>toDr(staff));
          setFacDrs(drs);
          if(!props.referral().facilityDr){
            if(drs.length === 1){
              setReferral("facilityDr", drs[0].name);
            }
          }
        }
      );
    }
    oldPerson = props.referral().personInCharge.id;
  });

  return (
    <>
    <div class={ area({ type: "contents" }) }>
      <ErrorArea />
      <ContainerButton title="施設" require="*" buttonTitle="施設検索"
          onClick={showDialog} class={ button({ color: "normal", size: "tiny" }) }>
        <div><input type="text" class={ input({ size: "id" }) } value={referral.facility.id}
            onChange={(e)=>setReferral("facility", {...initFac(), id:e.target.value})}
            onKeyUp={(e)=>handleEnter(e, handleFacility)}
            onBlur={handleFacility} />
          <span class={ css({ marginLeft: "1rem" }) }>{referral.facility.name}</span></div>
      </ContainerButton>
      <Container title="施設医師" require="*">
        <input type="text" class={ input({ size: "text" }) } list="facdr"
          value={referral.facilityDr}
          onChange={(e)=>setReferral("facilityDr", e.target.value)} />
        <datalist id="facdr">
          <For each={facDrs()}>{(fdr)=>
            <option value={fdr.name}>{fdr.name}</option>
          }</For>
        </datalist>
      </Container>
      <Container title="施設診療科">
        <input type="text" class={ input({ size: "text" }) } list="facdept" value={referral.facilityDept}
          onChange={(e)=>setReferral("facilityDept", e.target.value)} />
        <datalist id="facdept">
          <Index each={facDepts()}>{(fdept)=>
            <option value={fdept()}>{fdept()}</option>
          }</Index>
        </datalist>
      </Container>
      <Container title="紹介日" require="*">
        <input type="date" class={ input({ size: "date" }) }
          value={referral.date} onChange={(e)=>setReferral("date", e.target.value)} />
      </Container>
      <Container title="紹介科" require="*">
        <select class={ input({ size: "dept" }) } value={referral.department.id}
            onChange={(e)=>handleDept(e.target.value)}>
          <For each={props.depts}>{(dept)=>
            <option value={dept.id}>{dept.name}</option>
          }</For>
        </select>
      </Container>
      <Container title="紹介医師" require="*">
        <select class={ input({ size: "text" }) } value={referral.dr.id}
            onChange={(e)=>handleDr(e.target.value)}>
          <For each={drs()}>{(dr)=>
            <option value={dr.id}>{dr.name}</option>
          }</For>
        </select>
      </Container>
      <Container title="担当者" require="*">
        <div><input type="text" class={ input({ size: "id" }) }
          value={referral.personInCharge.id}
          onChange={(e)=>setReferral("personInCharge",{id:e.target.value, name:"", department:""})}
          onKeyUp={(e)=>handleEnter(e, handlePerson)}
          onBlur={handlePerson} />
        <span class={ css({ marginLeft: "1rem" }) }>{referral.personInCharge.name}</span></div>
      </Container>
      <Container title="備考">
        <textarea class={ input({ size: "full" }) }
          value={referral.memo} onChange={(e)=>setReferral("memo", e.target.value)} />
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