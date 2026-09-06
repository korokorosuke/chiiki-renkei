import { createSignal, onMount, For, Show, type Accessor, type Setter } from "solid-js"
import { ResponseModify } from "./-responseModify.tsx"
import { toDateHHMMString, getToday } from "../../lib/datetime.ts"
import { toUser } from "../../helper/types.ts"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import type { Inquiry, Response } from "../../server/domain/inquiry.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import plus from "../assets/plus.svg"
import listg from "../assets/listg.svg"
import { button, area, table, list } from "../../styled-system/recipes/"
import { css, cx } from "../../styled-system/css/"

type ViewProps = {
    inquiries: Accessor<Inquiry[]>
    select: (s: Inquiry) => void
    registerResponse: (inq: Inquiry)=>Promise<void>
    deleteResponse: (inq: Inquiry)=>Promise<void>
    selected: Accessor<Inquiry>
    setSelected: Setter<Inquiry>
    auth: AuthUser
}


export function ListArea(props: ViewProps) {
  const [selectedRes, setSelectedRes] = createSignal<Response>({
    responder: toUser(props.auth), datetime: toDateHHMMString(new Date()), details: ""
  });
  const [selectedResIndex, setSelectedResIndex] = createSignal(-1);
  const [newadd, setNewadd] = createSignal(false);
  const [isDisplayRes, setIsDisplayRes] = createSignal(false);
  const [checks, setChecks] = createSignal(new Map());

  const today = getToday().getTime();

  function editInquiry(id: string){
    const inquiry = props.inquiries().filter((s) => s.id === id);
    if(inquiry && inquiry.length > 0){
      props.select(inquiry[0]);
    }
  }

  function editResponse(e: MouseEvent, inq: Inquiry, res: Response, i: number){
    e.preventDefault();
    e.stopPropagation();

    setNewadd(false);
    props.setSelected(structuredClone(inq));
    setSelectedResIndex(i);
    setSelectedRes(res);

    showDialog();
  }

  function addResponse(inq: Inquiry, e: MouseEvent){
    e.preventDefault();
    e.stopPropagation();

    setNewadd(true);
    props.setSelected(structuredClone(inq));
    setSelectedResIndex(-1);
    setSelectedRes({
      responder:toUser(props.auth), datetime: toDateHHMMString(new Date()), details:""
    });

    showDialog();
  }

  function changeCheckAll(){
    setIsDisplayRes(!isDisplayRes());
    const map = new Map(checks());
    if(isDisplayRes()){
      props.inquiries().forEach((val)=>{
        map.set(val.id, true);
      });
    }else{
      props.inquiries().forEach((val)=>{
        map.set(val.id, false);
      });
    }
    setChecks(map);
  }

  onMount(()=>{
    const map = new Map();
    props.inquiries().forEach((val)=>{
      map.set(val.id, false);
    });
    setChecks(map);
  });

  function changeCheck(id: string, e: MouseEvent){
    e.preventDefault();
    e.stopPropagation();

    checks().set(id, !checks().get(id));
    setChecks(new Map(checks()));
    if(isDisplayRes()){
      setIsDisplayRes(false);
    }
  }


  type ResListProps = {
    inquiry: Inquiry
  }

  function ResponseList(resprops: ResListProps){
    const inq: Inquiry = resprops.inquiry;
    return (
      <For each={inq.responses}>{(res, i)=>
        <tr class={ css({ backgroundColor: "#e9ffdf" }) }
            onClick={(e)=>editResponse(e, inq, res, i())}>
          <td>→</td>
          <td class={ list({ size: "rem7", font: "number" }) }>{res.datetime.replace("T"," ")}</td>
          <td class={ list({ size: "rem9" }) }>{res.responder.name}</td>
          <td colspan={5}>{res.details.length > 60 ?
            res.details.substring(0, 60) + "..." : res.details}</td>
        </tr>
      }</For>
    );
  }

  function update(res: Response, i: number, done: boolean){
    props.selected().done = done;
    if(i === -1){
      props.selected().responses.push(res);
      setSelectedResIndex(props.selected().responses.length - 1);
      setSelectedRes(structuredClone(selectedRes()));
    }else{
      props.selected().responses[i] = res;
    }
  }

  async function handleRegister(e: MouseEvent){
    props.selected().responses = props.selected().responses.sort((v1, v2)=>{
      if(v1.datetime > v2.datetime){
        return 1;
      }else if(v1.datetime < v2.datetime){
        return -1;
      }
      return 0;
    });
    await props.registerResponse(props.selected());
    closeDialog(e);
  }

  async function handleDelete(e: MouseEvent){
    if(selectedResIndex() >= 0){
      props.selected().responses =
        props.selected().responses.filter((_,i)=>selectedResIndex()!==i);
      await props.registerResponse(props.selected());
    }
    closeDialog(e);
  }

  function getState(inq: Inquiry): string{
    if(inq.done){
      return css( { backgroundColor: "done" });
    }else{
      const days = inq.due.days;
      const d = new Date(inq.datetime);
      const d1 = new Date(d.getFullYear(), d.getMonth(), d.getDate() + days).getTime();
      if(today == d1){
        return css( { backgroundColor: "today" } );
      }else if(today > d1){
        return css( { backgroundColor: "yet" } );
      }else if(today < d1){
        return css( { backgroundColor: "active" } );
      }
      return "";
    }
  }

  return (
    <>
      <div>
        <table class={ table({ size: "full" }) }>
          <thead>
            <tr>
              <th>
                <input type="checkbox" checked={isDisplayRes()} id="disp-check"
                  onClick={()=>changeCheckAll()} />
              </th><th>受け日</th><th>患者</th><th>連絡元</th><th>対応者</th><th>期限</th><th>内容</th><th></th>
            </tr>
          </thead>
          <tbody>
            <For each={props.inquiries()}>{(inq)=>
                <>
                <tr onClick={[editInquiry, inq.id]}>
                  <td class={ cx( css({ maxWidth: "1rem", minWidth: "1rem" }), getState(inq) ) }>
                    {inq.done?"済":(inq.responses.length>0?"進":"未")}
                  </td>
                  <td class={ list({ size: "rem7", font: "number" }) }>{inq.datetime.replace("T"," ")}</td>
                  <td class={ list({ size: "rem9" }) }>
                    <div class={ css({ fontFamily: "number" }) }>{inq.patient.id ?? ""}</div>
                    <div>{inq.patient.lastName}{inq.patient.id?"　"+inq.patient.firstName:""}</div>
                  </td>
                  <td class={ list({ size: "rem12" }) }>
                    <div class={ css({ fontFamily: "number" }) }>{inq.facility.id ?? ""}</div>
                    <div>{inq.facility.name}</div>
                  </td>
                  <td class={ list({ size: "rem9" }) }>{inq.facilityStaff}</td>
                  <td class={ list({ size: "rem4" }) }>{inq.due.name}</td>
                  <td class={ list() }>{inq.details.length > 50 ?
                    inq.details.substring(0, 50) + "..." : inq.details}</td>
                  <td><div>
                    <img class={ css({ marginTop: "0.5rem", marginBottom: "0.2rem" }) }
                      src={listg} alt="展開" onClick={[changeCheck, inq.id]}
                      width="25" height="25" />
                  </div><div>
                    <img src={plus} alt="対応追加" onClick={[addResponse, inq]}
                      width="25" height="25" />
                  </div></td>
                </tr>
                <Show when={checks().get(inq.id)}>
                  <ResponseList inquiry={inq} />
                </Show>
                </>
              }</For>
          </tbody>
        </table>
      </div>

      <NormalDialog>
        <ResponseModify selectedRes={selectedRes} selectedResIndex={selectedResIndex}
          clearResponse={()=>{}} evacuateResponse={update}
          changeResponse={update} focus done={props.selected()?props.selected().done:false} />
        <div class={ area({ type: "button" }) }>
          <button type="button" class={ button({ color: "primary", size: "long" }) }
            onClick={handleRegister}>登録</button>
          <button type="button" class={ button({ color: "cancel", size: "long" }) }
            onClick={closeDialog}>キャンセル</button>
          <button type="button" class={ button({ color: "error", size: "long" }) }
            onClick={handleDelete} disabled={newadd()}>削除</button>
        </div>
      </NormalDialog>
    </>
  );
}