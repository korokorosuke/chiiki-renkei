import { For, type Accessor } from "solid-js"
import type { Patient } from "../../server/domain/patient.ts"
import { table, list } from "../../styled-system/recipes/"

type ViewProps = {
    patients: Accessor<Patient[]>
    select: (s: Patient) => void
}

export function ListArea(props: ViewProps) {
  function handleClick(patient: Patient){
    props.select(patient);
  }

  return (
    <div>
      <table class={ table({ size: "full" }) }>
        <thead>
          <tr>
            <th>ID</th><th>氏名</th><th>カナ</th><th>性別</th><th>生年月日</th><th>連絡先</th><th>住所</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.patients()}>{(patient)=>
            <tr onClick={()=>handleClick(patient)}>
              <td class={ list({ font: "number" }) }>{patient.id}</td>
              <td class={ list() }>{patient.lastName}　{patient.firstName}</td>
              <td class={ list() }>{patient.lastKana}　{patient.firstKana}</td>
              <td class={ list() }>{patient.sex===0?"男":"女"}</td>
              <td class={ list({ font: "number" }) }>{patient.birthday}</td>
              <td class={ list({ font: "number" }) }>{patient.tel}</td>
              <td class={ list() }>{patient.address.name+patient.address.plus}</td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  );
}