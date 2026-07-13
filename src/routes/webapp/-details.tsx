import { createSignal, Show, type Accessor } from "solid-js"
import { reconcile, type SetStoreFunction } from "solid-js/store"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import { ViewArea } from "./-viewArea.tsx"
import { initWebAppointment, isUser, isMaster } from "../../helper/webtypes.ts"
import { WebAppointmentReport } from "../report/-webAppointment.tsx"
import { PatIdInput } from "./-patIdInput.tsx"
import type { WebAppointment } from "../../server/domain/webAppointment.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import { button } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type Props = {
  register: ()=>Promise<boolean>
  delete: ()=>Promise<boolean>
  update: ()=>void
  deferment: number
  next: ()=>void
  changeStatus: (status: number)=>void
  user: Accessor<AuthUser>
  selected: WebAppointment
  setSelected: SetStoreFunction<WebAppointment>
}

export function Details(props: Props){
  const [reportPrepared, setReportPrepared] = createSignal(false);
  const today = new Date();
  const limit = new Date(today.getFullYear(), today.getMonth(), today.getDate() + props.deferment);
  const admin_limit = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  function handleReturn(){
    props.setSelected(reconcile(initWebAppointment()));
    props.next();
  }

  function handleUpdate(){
    props.update();
  }

  async function handleCancel(){
    if(confirm("予約をキャンセルしますか？")){
      props.setSelected("cancel", true);
      if(await props.register()){
        props.next();
      }
    }
  }

  async function handleDelete(){
    if(confirm("削除しますか？")){
      if(await props.delete()){
        props.next();
      }
    }
  }

  function preparedReport(){
    setReportPrepared(true);
  }

  function handlePrint(){
    const elem = document.querySelector("#report-body");
    {/* @ts-ignore */}
    html2pdf().from(elem).set({
      filename: "report.pdf"
    }).save();
  }


  return (
    <>
      <ViewArea selected={props.selected}/>
      <div class={ css({ display: "flex", flexDirection: "row", justifyContent: "center",
          marginTop: "1rem", "& button": { margin: "0 0.2rem" } }) }>
        <button type="button" class={ button({ color: "cancel", size: "normal" }) }
          onClick={handleReturn}>戻る</button>

        <Show when={!props.selected.cancel &&
          ((isUser(props.user()) && props.selected.date && new Date(props.selected.date) > limit) ||
          !props.selected.date ||
          (isMaster(props.user()) && props.selected.date && new Date(props.selected.date) >= admin_limit))}>
          <button type="button" class={ button({ color: "success", size: "normal" }) }
            onClick={handleUpdate}>変更</button>
          <button type="button" class={ button({ color: "error", size: "normal" }) }
            onClick={handleCancel}>キャンセル</button>
        </Show>
        <Show when={!props.selected.cancel && props.selected.time && isUser(props.user()) && reportPrepared()}>
          <button type="button" class={ button({ color: "primary", size: "normal" }) }
            onClick={handlePrint}>予約票</button>
        </Show>
        <Show when={isMaster(props.user())}>
          <Show when={!props.selected.time}>
            <button type="button" class={ button({ color: "primary", size: "normal" }) }
              onClick={()=>props.changeStatus(2)}>予約調整</button>
          </Show>
          <Show when={!props.selected.patient.id}>
            <button type="button" class={ button({ color: "primary", size: "normal" }) }
              onClick={()=>showDialog()}>ID登録</button>
          </Show>
          <button type="button" class={ button({ color: "fatal", size: "normal" }) }
            onClick={handleDelete}>削除</button>
        </Show>
      </div>

      <Show when={isMaster(props.user())}>
        <NormalDialog>
          <PatIdInput close={(e?: MouseEvent)=>closeDialog(e)}
            user={props.user} selected={props.selected} setSelected={props.setSelected} />
        </NormalDialog>
      </Show>

      <Show when={!props.selected.cancel}>
      <div class={ css({ position: "fixed", top: "0", left: "-2000px" }) }>
        <WebAppointmentReport id={props.selected.id} prepared={preparedReport}/>
      </div>
      </Show>
    </>
  )
}