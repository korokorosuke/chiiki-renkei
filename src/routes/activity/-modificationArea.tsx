import { createSignal, Show, For, onMount, type Accessor, type Setter } from "solid-js"
import { createStore, unwrap } from "solid-js/store"
import { initActivity, initFac, toFac, toUser } from "../../helper/types.ts"
import { Container, ContainerButton } from "../../components/Container.tsx"
import { NormalDialog, closeDialog, showDialog } from "../../components/NormalDialog.tsx"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import { MiniApp } from "../facility/-miniApp.tsx"
import { insert, update, del } from "../../server/func/activity.ts"
import { getPurposes } from "../../server/func/master.ts"
import { getFac } from "../../server/func/facility.ts"
import type { Activity } from "../../server/domain/activity.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import type { Facility } from "../../server/domain/facility.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { button, input, area } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type ViewProps = {
  terminateModification: (status: MessageStatus)=>void
  newadd: Accessor<boolean>
  selected: Accessor<Activity>
  setSelected: Setter<Activity>
  auth: Accessor<AuthUser>
}

export function ModificationArea(props: ViewProps){
  const [activity, setActivity] = createStore<Activity>(initActivity());
  const [purposes, setPurposes] = createSignal<string[]>([]);
  let oldFacId = "";

  function handleEnter(e: KeyboardEvent, func: ()=>void){
    if(e.key === "Enter"){
      func();
    }
  }

  function handleChange(){
    const list: string[] = [];
    const sels = document.querySelectorAll<HTMLSelectElement>(".purpose-area input:checked");
    sels.forEach((e: HTMLSelectElement)=>{
      list.push(e.value);
    });
    setActivity("purpose", list);
  }

  async function handleRegister(){
    const f = unwrap(activity.facility);
    const act: Activity = {
      ...unwrap(activity),
      facility: f,
      updatedBy: toUser(props.auth()),
    };

    let res;
    if(props.newadd()){
      res = await insert({data: act});
    }else{
      res = await update({data: act});
    }
    if(res.ok){
      props.terminateModification("register");
      props.setSelected(initActivity());
    }else{
      setErrors(res.errors!);
    }
  }

  async function handleDelete(){
    if(!confirm("削除します。よろしいですか？")){
      return;
    }

    const res = await del({data: props.selected()});
    if(res.ok){
      props.terminateModification("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  async function handleFacility(){
    if(activity.facility.id !== oldFacId){
      oldFacId = activity.facility.id;
      const res = await getFac({ data: { id: activity.facility.id } });
      if(res){
        setActivity("facility", res);
      }else{
        setActivity("facility", {...initFac(), id: activity.facility.id});
      }
    }
  }

  function selectFacility(f: Facility){
    setActivity("facility", toFac(f));
    handleFacility();
    closeDialog()
  }

  onMount(()=>{
    getPurposes().then(setPurposes);
    setActivity(structuredClone(props.selected()));
  });


  return (
    <>
    <div class={ area({ type: "contents" }) }>
      <ErrorArea />
      <Container title="訪問日時" require="*">
        <input type="datetime-local" class={ input({ size: "datetime" }) }
          value={activity.date}
          onChange={(e)=>setActivity("date", e.target.value)} />
      </Container>
      <Container title="終了日時">
        <input type="datetime-local" class={ input({ size: "datetime" }) }
          value={activity.toDate}
          onChange={(e)=>setActivity("toDate", e.target.value)} />
      </Container>
      <ContainerButton title="施設" require="*" buttonTitle="施設検索"
          onClick={showDialog} class={ button({ color: "normal", size: "tiny" }) }>
        <div><input type="text" class={ input({ size: "id" }) }
            value={activity.facility.id}
            onChange={(e)=>setActivity("facility", {...initFac(), id:e.target.value})}
            onKeyUp={(e)=>handleEnter(e, handleFacility)}
            onBlur={handleFacility} />
          <span class={ css({ marginLeft: "1rem" }) }>{activity.facility.name}</span></div>
      </ContainerButton>
      <Container title="参加者" require="*">
        <input type="text" class={ input({ size: "full" }) } list="facstaff"
          value={activity.participants} onChange={(e)=>setActivity("participants", e.target.value)} />
      </Container>
      <Container title="施設参加者" require="*">
        <input type="text" class={ input({ size: "full" }) } list="facstaff"
          value={activity.facilityParticipants} onChange={(e)=>setActivity("facilityParticipants", e.target.value)} />
      </Container>
      <Container title="目的" require="*">
        <div>
        <For each={purposes()}>{p=>
          <label class={ css({ marginRight: "0.8rem", cursor: "pointer" }) }>
            <input type="checkbox" class={ input({ size: "check1_5", type: "checkbox", height: "none" }) }
              checked={activity.purpose.includes(p)} value={p}
              onChange={(_)=>handleChange()} />
            {p}
          </label>
        }</For>
        </div>
      </Container>
      <Container title="内容" require="*">
        <textarea class={ input({ size: "textarea" }) } value={activity.details}
          onChange={(e)=>setActivity("details", e.target.value)}></textarea>
      </Container>
    </div>
    <NormalDialog>
      <MiniApp select={selectFacility} close={closeDialog} />
    </NormalDialog>

    <div class={ area({ type: "button" }) }>
      <button type="button" class={ button({ color: "primary", size: "long" }) } onClick={handleRegister}>登録</button>
      <button type="button" class={ button({ color: "cancel", size: "long" }) } onClick={()=>props.terminateModification("cancel")}>キャンセル</button>
      <Show when={!props.newadd()}>
        <button type="button" class={ button({ color: "error", size: "long" }) } onClick={handleDelete}>削除</button>
      </Show>
    </div>
  </>
  );
}