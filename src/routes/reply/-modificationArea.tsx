import { createSignal, onMount, For, Index, Show, type Setter, type Accessor } from "solid-js"
import { createStore, unwrap } from "solid-js/store"
import { initReply, initDr, toUser, initClassification } from "../../helper/types.ts"
import { getUser } from "../../server/func/user.ts"
import { getDrsForDept } from "../../server/func/dr.ts"
import { insert, update, del } from "../../server/func/reply.ts"
import { Container } from "../../components/Container.tsx"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import type { Reply } from "../../server/domain/reply.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import type { Classification } from "../../server/domain/classification.ts"
import type { Dr } from "../../server/domain/dr.ts"
import type { Department, Dept } from "../../server/domain/department.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { button, input, area } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type ViewProps = {
  reply: Accessor<Reply>
  setReply: Setter<Reply>
  terminateModification: (status: MessageStatus)=>void
  depts: Department[]
  classes: Classification[]
  newadd: Accessor<boolean>
  auth: AuthUser
}

function handleEnter(e: KeyboardEvent, func: ()=>void){
  if(e.key === "Enter"){
    func();
  }
}

export function ModificationArea(props: ViewProps){
  const [reply, setReply ] = createStore<Reply>(structuredClone(props.reply()));
  const [drs, setDrs] = createSignal<Dr[]>([]);
  let oldPerson = "";

  async function handleRegister(){
    const r = {
      ...unwrap(reply),
      updatedBy: toUser(props.auth)
    };
    let res;
    if(props.newadd()){
      res = await insert({data: {reply: r}});
    }else{
      res = await update({data: {reply: r}});
    }
    if(res.ok){
      props.setReply(r);
      props.terminateModification("register");
    }else{
      setErrors(res.errors!);
    }
  }

  async function handleDelete(){
    if(!confirm("削除します。よろしいですか？")){
      return;
    }

    const res = await del({data: {reply: props.reply()}});
    if(res.ok){
      props.setReply(initReply());
      props.terminateModification("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  function handleDr(value: string){
    for(const f of drs()){
      if(value === f.id){
        setReply("dr", {...f, id: value});
        return;
      }
    }
  }

  function getDrs(dept: Dept, dr: Dr|undefined) {
    setReply("dr", initDr());
    getDrsForDept({data: {dept: dept.id}}).then((res)=>{
      if(res.length !== 0){
        setDrs(res);
        if(dr){
          const temp = res.filter((d)=>d.id === dr.id);
          if(temp.length === 1){
            setReply("dr", temp[0]);
            return;
          }
        }
        setReply("dr", res[0]);
      }else{
        setDrs([]);
        setReply("dr", initDr());
      }
    }).catch(()=>{alert("医師の取得に失敗しました。")});
  }

  function handleDept(value: string){
    for(const dept of props.depts){
      if(dept.id === value){
        getDrs(dept, {...reply.dr});
        setReply("department", dept);
        return;
      }
    }
  }

  function handleClass(value: string){
    for(const c of props.classes){
      if(c.id === value){
        setReply("classification", c);
        return;
      }
    }
  }

  function getPerson(id: string){
    getUser({data: {id}}).then(
      (res)=>{
        if(res && res.name){
          setReply("personInCharge", res);
        }else{
          setReply("personInCharge", {id: id, name: "", department: ""});
        }
      }
    ).catch(()=>{
      setReply("personInCharge", {id: id, name: "", department: ""});
    });
  }

  function handlePerson(){
    if(reply.personInCharge.id && reply.personInCharge.id !== oldPerson){
      oldPerson = reply.personInCharge.id;
      getPerson(reply.personInCharge.id);
    }
  }

  onMount(()=>{
    if(props.reply().department.id){
      getDrs(props.reply().department, props.reply().dr);
    }else{
      setReply("department", props.depts[0]);
      getDrs(props.depts[0], props.reply().dr);
    }
    if(props.classes.length !== 0){
      if(reply.classification.id === ""){
        if(props.classes.length > 0){
          setReply("classification", props.classes[0]);
        }
      }else{
        const c = {...reply.classification};
        setReply("classification", initClassification());
        setReply("classification", c);
      }
    }
    oldPerson = props.reply().personInCharge.id;
  });

  return (
    <>
    <div class={ area({ type: "contents" }) }>
      <ErrorArea />
      <Container title="返事日" require="*">
        <input type="date" class={ input({ size: "date" }) }
          value={reply.date} onChange={(e)=>setReply("date", e.target.value)} />
      </Container>
      <Container title="返事科" require="*">
        <select class={ input({ size: "dept" }) } value={reply.department.id}
            onChange={(e)=>handleDept(e.target.value)}>
          <For each={props.depts}>{dept=>
            <option value={dept.id}>{dept.name}</option>
          }</For>
        </select>
      </Container>
      <Container title="返事医師" require="*">
        <select class={ input({ size: "text" }) } value={reply.dr.id}
            onChange={(e)=>handleDr(e.target.value)}>
          <For each={drs()}>{dr=>
            <option value={dr.id}>{dr.name}</option>
          }</For>
        </select>
      </Container>
      <Container title="区分" require="*">
        <select class={ input({ size: "id" }) } value={reply.classification.id}
            onChange={(e)=>handleClass(e.target.value)}>
          <Index each={props.classes}>{val=>
            <option value={val().id}>{val().name}</option>
          }</Index>
        </select>
      </Container>
      <Container title="担当者" require="*">
        <input type="text" class={ input({ size: "id" }) }
          value={reply.personInCharge.id}
          onChange={(e)=>setReply("personInCharge", {id:e.target.value, name:"",department:""})}
          onKeyUp={(e)=>handleEnter(e, handlePerson)}
          onBlur={handlePerson} />
        <span class={ css({ marginLeft: "1rem" }) }>{reply.personInCharge.name}</span>
      </Container>
      <Container title="備考">
        <textarea class={ input({ size: "full" }) }
          value={reply.memo} onChange={(e)=>setReply("memo", e.target.value)} />
      </Container>
      <div class={ area({ type: "button" }) }>
        <button type="button" class={ button({ color: "primary", size: "long" }) } onClick={handleRegister}>登録</button>
        <button type="button" class={ button({ color: "cancel", size: "long" }) } onClick={()=>props.terminateModification("cancel")}>キャンセル</button>
        <Show when={!props.newadd()}>
          <button type="button" class={ button({ color: "error", size: "long" }) } onClick={handleDelete}>削除</button>
        </Show>
      </div>
    </div>
    </>
  );
}