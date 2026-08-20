import { For, type Accessor, type Setter } from "solid-js"
import type { AppointmentPrint } from "../../server/func/report.ts"
import { table, list } from "../../styled-system/recipes/"

type ViewProps = {
    result: Accessor<AppointmentPrint[]>
    setResult: Setter<AppointmentPrint[]>
}

export function ListArea(props: ViewProps) {
  function handleChange(index: number) {
    const updatedResult = props.result().map((appointment, i) =>
      i === index ? { ...appointment, notPrint: !appointment.notPrint } : appointment
    )
    props.setResult(updatedResult);
  }

  return (
    <div>
      <table class={ table({ size: "full" }) }>
        <thead>
          <tr>
            <th></th><th>患者ID</th><th>患者名</th><th>紹介日</th><th>施設ID</th><th>施設名</th><th>紹介受け科</th><th>紹介受け医師</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.result()}>{(appointment, index)=>
            <tr>
              <td class={ list({ size: "rem2" }) }>
                <input type="checkbox" checked={appointment.notPrint} onChange={()=>handleChange(index())} />
              </td>
              <td class={ list({ size: "rem3", font: "number" }) }>{appointment.patient.id}</td>
              <td class={ list({ size: "rem7" }) }>{appointment.patient.lastName}　{appointment.patient.firstName}</td>
              <td class={ list({ size: "rem3", font: "number" }) }>{appointment.date}</td>
              <td class={ list({ size: "rem3", font: "number" }) }>{appointment.facility.id}</td>
              <td class={ list({ size: "rem7" }) }>{appointment.facility.name}</td>
              <td class={ list({ size: "rem7" }) }>{appointment.department.name}</td>
              <td class={ list({ size: "rem7" }) }>{appointment.dr.name}</td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  );
}