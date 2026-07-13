import { Show } from "solid-js"
import { WebAppointmentReport } from "../report/-webAppointment.tsx"
import type { WebAppointment } from "../../server/domain/webAppointment.ts"
import { button, area } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type Props = {
  selected: WebAppointment
}

export function Completed(props: Props){
  function handlePrint(){
    const elem = document.querySelector("#report-body");
    {/* @ts-ignore */}
    html2pdf().from(elem).set({
      filename: "report.pdf"
    }).save();
  }

  return (
    <>
    <div class={ css({ textAlign: "center" }) }>
      <p>登録が完了しました。</p>
      <Show when={props.selected.date}>
      <p>予約票を印刷して、患者様にお渡しください。</p>
      </Show>
      <Show when={!props.selected.date}>
      <p>予約を調整しますので、しばらくお待ちください。</p>
      </Show>
    </div>
    <Show when={props.selected.date}>
    <div class={ area({ type: "button" }) }>
      <button type="button" class={ button( { color: "primary" } ) }
        onClick={handlePrint}>予約票印刷</button>
    </div>

    <div class={ css({ position: "fixed", top: "0", left: "-2000px" }) }>
      <WebAppointmentReport id={props.selected.id} />
    </div>
    </Show>
    </>
  )
}