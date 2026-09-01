import { createSignal, For, Show, type Setter, type Accessor } from "solid-js"
import { AppointmentReport } from "../report/-appointment.tsx"
import { DoneReport } from "../report/-done.tsx"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import type { Appointment } from "../../server/domain/appointment.ts"
import { initAppointment } from "../../helper/types.ts"
import pdf from "../assets/pdf.svg"
import { button, area, table, list } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type Props = {
    appointments: Accessor<Appointment[]>
    select: ()=>void
    setAppointment: Setter<Appointment>
}

type REPORT_KIND = "appointment" | "done";


export function ListArea(props: Props) {
  const [reportId, setReportId] = createSignal("");
  const [app, setApp] = createSignal<Appointment>(initAppointment());
  const [reportPrepared, setReportPrepared] = createSignal(false);
  const [reportKind, setReportKind] = createSignal<REPORT_KIND>("appointment");

  function handlerClick(id: string){
    const app = props.appointments().filter((a) => a.id === id);
    if(app && app.length > 0){
      props.setAppointment(app[0]);
      props.select();
    }
  }

  function preparedReport(){
    setReportPrepared(true);
  }

  function closeReport(e: MouseEvent){
    e.preventDefault();
    e.stopPropagation();

    setReportPrepared(false);
    setReportId("");
    setApp(initAppointment());
    closeDialog();
  }

  function openReport(app: Appointment, kind: REPORT_KIND, e: MouseEvent){
    e.preventDefault();
    e.stopPropagation();

    setReportKind(kind);
    setReportPrepared(false);
    setReportId(app.id);
    setApp(app);
    showDialog();
  }

  function createPDF(e: MouseEvent){
    let filename = "report.pdf";
    if(reportKind()==="done"){
      filename = `houkoku_${app().date}_${app().patient.id}_${app().facility.id}.pdf`;
    }else if(reportKind()==="appointment"){
      filename = `appointment_${app().date}_${app().patient.id}_${app().facility.id}.pdf`;
    }
    const elem = document.querySelector("#report-body");
    {/* @ts-ignore */}
    html2pdf().from(elem).set({
      filename: filename
    }).save();

    setReportPrepared(false);
    setReportId("");
    setApp(initAppointment());
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
              <td class={ css({ display: "flex", alignItems: "left", flexDirection: "column" }) }>
                <div title="予約票出力">
                  <a class={ style }
                    onClick={(e)=>openReport(a, "appointment", e)}>
                    <img src={pdf} alt="pdf"
                      width="25" height="25" />
                    予約票
                  </a>
                </div>
                <div title="受診報告出力">
                  <a class={ style }
                    onClick={(e)=>openReport(a, "done", e)}>
                    <img src={pdf} alt="pdf"
                      width="25" height="25" />
                    受診報告
                  </a>
                </div>
              </td>
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
          <Show when={reportKind() === "appointment"}>
            <div class={ css({ maxHeight: "37rem", height: "37rem", overflow: "auto" }) }>
              <AppointmentReport id={reportId} prepared={preparedReport} />
            </div>
          </Show>
          <Show when={reportKind() === "done"}>
            <div class={ css({ maxHeight: "37rem", height: "37rem", overflow: "auto" }) }>
              <DoneReport id={reportId} prepared={preparedReport} />
            </div>
          </Show>
        </div>
      </NormalDialog>
      </Show>
    </div>
  );
}

const style = css({
  color: "#1994ff",
  textDecoration: "underline",

  "& img": {
    marginRight: "5px",
    display: "inline"
  }
});