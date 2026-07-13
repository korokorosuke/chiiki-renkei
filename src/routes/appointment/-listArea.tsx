import { createSignal, For, Show, type Setter, type Accessor } from "solid-js"
import { AppointmentReport } from "../report/-appointment.tsx"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import type { Appointment } from "../../server/domain/appointment.ts"
import pdf from "../assets/pdf.svg"
import { button, area, table, list } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type Props = {
    appointments: Accessor<Appointment[]>
    modifyData: ()=>void
    setAppointment: Setter<Appointment>
}


export function ListArea(props: Props) {
  const [reportId, setReportId] = createSignal("");
  const [reportPrepared, setReportPrepared] = createSignal(false);

  function handlerClick(id: string){
    const app = props.appointments().filter((a) => a.id === id);
    if(app && app.length > 0){
      props.setAppointment(app[0]);
      props.modifyData();
    }
  }

  function preparedReport(){
    setReportPrepared(true);
  }

  function closeReport(e: MouseEvent){
    e.preventDefault();
    e.stopPropagation();
    setReportId("");
    closeDialog();
  }

  function openReport(id: string, e: MouseEvent){
    e.preventDefault();
    e.stopPropagation();

    setReportPrepared(false);
    setReportId(id);
    showDialog();
  }

  function createPDF(e: MouseEvent){
    const elem = document.querySelector("#report-body");
    {/* @ts-ignore */}
    html2pdf().from(elem).set({
      filename: "report.pdf"
    }).save();
    closeReport(e);
  }


  return (
    <div>
      <table class={ table({ size: "full" }) }>
        <thead>
          <tr>
            <th>日付</th><th>施設</th><th>科</th><th>医師</th><th>担当</th><th></th>
          </tr>
        </thead>
        <tbody>
          <For each={props.appointments()}>{(a)=>
            <tr onClick={()=>handlerClick(a.id)}>
              <td class={ list({ size: "rem10" }) }>{a.date}</td>
              <td><div>{a.facility.id}:{a.facility.name}</div>
                <div>{a.facility.address}</div>
              </td>
              <td>{a.department.name}</td>
              <td>{a.dr.name}</td>
              <td>{a.personInCharge.name}</td>
              <td><div title="予約票出力">
                <img src={pdf} alt="pdf" onClick={[openReport, a.id]}
                  width="25" height="25" />
              </div></td>
            </tr>
          }</For>
        </tbody>
      </table>
      <Show when={reportId()}>
      <NormalDialog>
        <div class={ css({ width: "52rem", height: "40rem", overflow: "hidden" }) }>
          <div class={ area({ type: "button" }) }>
            <Show when={reportPrepared()}>
              <button type="button" class={ button({ color: "primary", size: "long" }) }
                onClick={createPDF}>出力</button>
            </Show>
            <button type="button" class={ button({ color: "cancel", size: "long" }) }
              onClick={closeReport}>キャンセル</button>
          </div>
          <div class={ css({ maxHeight: "37rem", height: "37rem", overflow: "auto" }) }>
            <AppointmentReport id={reportId} prepared={preparedReport} />
          </div>
        </div>
      </NormalDialog>
      </Show>
    </div>
  );
}