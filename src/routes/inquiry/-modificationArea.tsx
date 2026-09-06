import { createSignal, Show, For, Index, onMount, batch, type Accessor, type Setter } from "solid-js"
import { createStore, unwrap } from "solid-js/store"
import { initInquiry, initPatient, initFac, toFac, initUser, toUser } from "../../helper/types.ts"
import batsu from "../assets/del.svg"
import { ResponseModify } from "./-responseModify.tsx"
import { Container, ContainerImage } from "../../components/Container.tsx"
import { toDateHHMMString } from "../../lib/datetime.ts"
import { insert, update, del } from "../../server/func/inquiry.ts"
import { getAllDues } from "../../server/func/due.ts"
import { getUser as getServerUser } from "../../server/func/user.ts"
import { getFacility } from "../../server/func/facility.ts"
import { getPatient } from "../../server/func/patient.ts"
import { getStaffs } from "../../server/func/staff.ts"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import type { Inquiry, Response } from "../../server/domain/inquiry.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import type { Due } from "../../server/domain/due.ts"
import type { Staff } from "../../server/domain/staff.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { css } from "../../styled-system/css/"
import { flex, grid } from "../../styled-system/patterns/"
import { button, input, area } from "../../styled-system/recipes/"

type ViewProps = {
  terminateModification: (status: MessageStatus)=>void
  newadd: Accessor<boolean>
  selected: Accessor<Inquiry>
  setSelected: Setter<Inquiry>
  auth: AuthUser
}

type ListProps = {
  changeResponse: (response: Response, index: number, done: boolean) => void
  evacuateResponse: (response: Response, index: number, done: boolean) => void
  clearResponse: ()=>void
  deleteResponse: (index: number)=>void
  selected: Accessor<Inquiry>
  setSelected: Setter<Inquiry>
  auth: AuthUser
}

function handleKeyUp(e: KeyboardEvent,
    func: (id: string)=>void, id: string){
  if(e.key === "Enter"){
    func(id);
  }
}

function ResponseList(props: ListProps){
  const [selectedRes, setSelectedRes] = createSignal<Response>(initResponse());
  const [selectedResIndex, setSelectedResIndex] = createSignal(-1);

  function initResponse(): Response{
    return {
      responder: toUser(props.auth), datetime: toDateHHMMString(new Date()), details: ""
    };
  }

  function clearResponse(){
    props.clearResponse();
    setSelectedResIndex(-1);
    setSelectedRes(initResponse());
  }

  function deleteResponse(index: number, e: MouseEvent){
    e.preventDefault();
    e.stopPropagation();

    if(props.selected().responses[index].details){
      if(!confirm("削除してよろしいですか？")){
        return;
      }
    }
    if(selectedResIndex() === index){
      setSelectedRes(initResponse());
      setSelectedResIndex(-1);
    }
    clearResponse();
    props.deleteResponse(index);
  }

  function handleSelect(index: number){
    setSelectedResIndex(index);
    setSelectedRes(props.selected().responses[index]);
  }


  return (
    <>
    <div class={ css({ display: "flex", flexDirection: "column",
        minWidth: "40rem", maxWidth: "40rem" }) }>
      <ResponseModify
        selectedResIndex={selectedResIndex}
        changeResponse={props.changeResponse}
        evacuateResponse={props.evacuateResponse}
        clearResponse={clearResponse}
        done={props.selected().done}
        selectedRes={selectedRes} focus={false} />
      <For each={props.selected().responses}>{(response, i)=>
        <div class={ css(selectedResIndex()===i() ? { backgroundColor: "table.selected" } : {})}
            onClick={()=>handleSelect(i())}>
          <ContainerImage title={"対応" + (i()+1)}
              src={batsu} alt="+"
              onClick={(e?: MouseEvent)=>{deleteResponse(i(), e!)}}>
            <div class={ css({ cursor: "pointer", marginBottom: "0.5rem", marginRight: "0.5rem",
                _hover: { bg: "table.selected", transition: "0.5s" } }) }>
              <div><span class={ css({ fontFamily: "number" }) }>{response.datetime.replace("T"," ")}</span>
                <span class={ css({ marginLeft: "1rem" }) }>{response.responder.name}</span></div>
              <div>{response.details.length > 20 ? response.details.substring(0, 20) + "..." : response.details}</div>
            </div>
          </ContainerImage>
        </div>
      }</For>
    </div>
    </>
  );
}

let tempResponse: Response|undefined;
let tempIndex: number = -2;
let tempDone: boolean = false;
export function ModificationArea(props: ViewProps){
  const [inquiry, setInquiry] = createStore<Inquiry>(initInquiry());
  const [staffs, setStaffs] = createSignal<Staff[]>([]);
  const [tels, setTels] = createSignal<string[]>([]);
  const [dues, setDues] = createSignal<Due[]>([]);

  function clearResponse(){
    tempResponse = undefined;
    tempIndex = -2;
    if(props.selected()){
      tempDone = props.selected().done;
    }else{
      tempDone = false;
    }
  }

  function evacuateResponse(response: Response, index: number, done: boolean){
    tempResponse = response;
    tempIndex = index;
    tempDone = done;
  }

  function changeResponse(response: Response, index: number, done: boolean){
    const ress = inquiry.responses.slice();
    ress[index] = response;
    setInquiry("responses", ress);
    setInquiry("done", done);
    clearResponse();
  }

  function deleteResponse(index: number){
    const inq = unwrap(inquiry);
    const list = inq.responses.filter((_, i)=>i!==index);
    setInquiry("responses", list);
    props.setSelected(structuredClone(inq));
  }

  async function handleRegister(){
    const pat = unwrap(inquiry.patient);
    pat.id = pat.id.trim();
    if(pat && !/^[0-9a-z]+$/i.test(pat.id)){
      pat.lastName = pat.id;
      pat.id = "";
    }
    const f = unwrap(inquiry.facility);
    f.id = f.id.trim();
    if(f && !/^[0-9a-z]+$/i.test(f.id)){
      f.name = f.id;
      f.id = "";
    }
    let ress = unwrap(inquiry.responses);
    if(tempIndex === -1 && tempResponse && tempResponse.details){
      ress.push(tempResponse);
    }
    if(tempIndex === -1 && (tempDone || (inquiry.done && !tempDone))){
      setInquiry("done", tempDone);
    }
    ress = ress.sort((v1, v2)=>{
      if(v1.datetime > v2.datetime){
        return 1;
      }else if(v1.datetime < v2.datetime){
        return -1;
      }
      return 0;
    });
    const inq: Inquiry = {
      ...unwrap(inquiry),
      patient: pat,
      facility: f,
      responses: ress,
    };

    let res;
    if(props.newadd()){
      res = await insert({data: {inquiry: inq}});
    }else{
      res = await update({data: {inquiry: inq}});
    }
    if(res.ok){
      props.terminateModification("register");
      props.setSelected(initInquiry());
      clearResponse();
    }else{
      setErrors(res.errors!);
    }
  }

  async function handleDelete(){
    if(!confirm("削除します。よろしいですか？")){
      return;
    }

    const res = await del({data: {inquiry: unwrap(inquiry)}});
    if(res.ok){
      props.terminateModification("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  function getUser(id: string){
    getServerUser({data: {id}}).then((res)=>{
      if(res){
        setInquiry("personInCharge", res);
      }else{
        setInquiry("personInCharge", {id: id, name: "", department: ""});
      }
    }).catch(()=>{
      setInquiry("personInCharge", {id: id, name: "", department: ""});
    });
  }

  async function setFacility(id: string){
    if(/^[0-9a-z]+$/i.test(id)){
      const f = await getFacility({data: {id}});
      if(f){
        setInquiry("facility", toFac(f));
        setStaffs(await getStaffs({data: {facId: id}}));

        const tels = [];
        if(f.tel){
          tels.push(f.tel + "：代表");
          for(const c of f.contacts){
            if(c.tel){
              tels.push(`${c.tel}：${c.name}`);
            }
          }
        }
        setTels(tels);
        if(!inquiry.tel && tels.length === 1){
          setInquiry("tel", tels[0]);
        }
      }
    }else{
      setInquiry("facility", {...initFac(), id: id});
    }
  }

  async function setPatient(id: string){
    if(/^[0-9a-z]+$/i.test(id)){
      const p = await getPatient({data: {id}});
      if(p){
        setInquiry("patient", p);
      }
    }else{
      setInquiry("patient", {...initPatient(), id: id});
    }
  }

  function setDue(id: string){
    const n = parseInt(id);
    const res = dues().filter((due)=>due.id === n);
    if(res.length > 0){
      setInquiry("due", res[0]);
    }
  }

  onMount(()=>{
    setInquiry(structuredClone(props.selected()));
    const pat = inquiry.patient;
    if(!pat.id){
      batch(()=>{
        setInquiry("patient", "id", pat.lastName);
        setInquiry("patient", "lastName", "");
      });
    }
    const f = inquiry.facility;
    if(!f.id){
      batch(()=>{
        setInquiry("facility", "id", f.name);
        setInquiry("facility", "name", "");
      });
    }
    getAllDues().then((res)=>{
      setDues(res);
      if(inquiry.due.id === -1 && dues().length > 0){
        setInquiry("due", dues()[0]);
      }else{
        const dueid = inquiry.due.id;
        setInquiry("due", "id", -999);
        setInquiry("due", "id", dueid);
      }
    });
  });


  return (
    <>
    <div class={ flex({ direction: "row", wrap: "wrap" }) }>
    <div class={ css({ display: "flex", flexDirection: "column",
        minWidth: "40rem", maxWidth: "40rem", marginRight: "1rem" }) }>
      <ErrorArea />
      <Container title="問合せ日" require="*">
        <input type="datetime-local" class={ input({ size: "datetime" }) }
          value={inquiry.datetime}
          onChange={(e)=>setInquiry("datetime", e.target.value)} />
      </Container>
      <Container title="患者" require="*">
        <div class={ flex({ direction: "row", wrap: "wrap" }) }>
        <div class={ css({ flexGrow: "0!", marginRight: "1rem" }) }>
          <input type="text" class={ input({ size: "rem7" }) }
            value={inquiry.patient.id} onBlur={()=>setPatient(inquiry.patient.id)}
            onKeyUp={(e)=>handleKeyUp(e, setPatient, inquiry.patient.id)}
            onChange={(e)=>setInquiry("patient", {...initPatient(), id: e.target.value})} />
        </div>
        <div class={ grid({ placeItems: "center" }) }>{inquiry.patient.lastName}　{inquiry.patient.firstName}</div>
        </div>
      </Container>
      <Container title="問合せ施設" require="*">
        <div class={ flex({ direction: "row", wrap: "wrap" }) }>
        <div class={ css({ flexGrow: "0!", marginRight: "1rem" }) }><input type="text" class={ input({ size: "rem7" }) }
          value={inquiry.facility.id} onBlur={()=>setFacility(inquiry.facility.id)}
          onKeyUp={(e)=>handleKeyUp(e, setFacility, inquiry.facility.id)}
          onChange={(e)=>setInquiry("facility", {...initFac(), id: e.target.value})} />
        </div><div class={ grid({ placeItems: "center" }) }>
          <span>{inquiry.facility.name}</span>
        </div>
        </div>
      </Container>
      <Container title="問合せ者" require="*">
        <input type="text" class={ input({ size: "rem10" }) } list="facstaff"
          value={inquiry.facilityStaff} onChange={(e)=>setInquiry("facilityStaff", e.target.value)} />
          <datalist id="facstaff">
            <For each={staffs()}>{staff=>
              <option value={staff.name}>{staff.name}</option>
            }</For>
          </datalist>
      </Container>
      <Container title="連絡先">
        <input type="text" class={ input({ size: "full" }) } list="factel"
          value={inquiry.tel} onChange={(e)=>setInquiry("tel", e.target.value)} />
          <datalist id="factel">
            <Index each={tels()}>{tel=>
              <option value={tel()}>{tel()}</option>
            }</Index>
          </datalist>
      </Container>
      <Container title="期限" require="*">
        <select class={ input({ size: "id" }) }
            value={inquiry.due.id} onChange={(e)=>setDue(e.target.value)}>
          <For each={dues()}>{due=>
            <option value={due.id}>{due.name}</option>
          }</For>
        </select>
      </Container>
      <Container title="担当者" require="*">
        <div class={ flex({ direction: "row", wrap: "wrap" }) }>
        <div class={ css({ flexGrow: "0!", marginRight: "1rem" }) }><input type="text"
          class={ input({ size: "id" }) }
          value={inquiry.personInCharge.id}
          onBlur={()=>getUser(inquiry.personInCharge.id)}
          onKeyUp={(e)=>handleKeyUp(e, getUser, inquiry.personInCharge.id)}
          onChange={(e)=>setInquiry("personInCharge", {...initUser(), id: e.target.value})} />
        </div>
        <div class={ grid({ placeItems: "center" }) }>{inquiry.personInCharge.name}</div>
        </div>
      </Container>
      <Container title="問合せ内容" require="*">
        <textarea class={ input({ size: "textarea" }) } value={inquiry.details}
          onChange={(e)=>setInquiry("details", e.target.value)}></textarea>
      </Container>
    </div>

    <ResponseList auth={props.auth}
      clearResponse={clearResponse} deleteResponse={deleteResponse}
      changeResponse={changeResponse} evacuateResponse={evacuateResponse}
      selected={props.selected} setSelected={props.setSelected} />

    </div>
      <div class={ area({ type: "button" }) }>
        <button type="button" class={ button({ color: "primary", size: "long" }) }
          onClick={handleRegister}>登録</button>
        <button type="button" class={ button({ color: "cancel", size: "long" }) }
          onClick={()=>props.terminateModification("cancel")}>キャンセル</button>
        <Show when={!props.newadd()}>
          <button type="button" class={ button({ color: "error", size: "long" }) }
            onClick={handleDelete}>削除</button>
        </Show>
      </div>
    </>
  );
}