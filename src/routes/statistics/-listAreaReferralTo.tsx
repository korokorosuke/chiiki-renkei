import { For, type Accessor } from "solid-js"
import type { ReferralTo } from "../../server/domain/referralto.ts"
import { table, list } from "../../styled-system/recipes/"

type ViewProps = {
    result: Accessor<ReferralTo[]>
}

export function ListAreaReferralTo(props: ViewProps) {
  function handleClick(){
  }

  return (
    <div>
      <table class={ table({ size: "full" }) }>
        <thead>
          <tr>
            <th>患者ID</th><th>患者名</th><th>紹介日</th><th>施設ID</th><th>施設名</th><th>紹介科</th><th>紹介医師</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.result()}>{(referral)=>
            <tr onClick={()=>handleClick()}>
              <td class={ list({ size: "rem3", font: "number" }) }>{referral.patient.id}</td>
              <td class={ list({ size: "rem7" }) }>{referral.patient.lastName}　{referral.patient.firstName}</td>
              <td class={ list({ size: "rem3", font: "number" }) }>{referral.date}</td>
              <td class={ list({ size: "rem3", font: "number" }) }>{referral.facility.id}</td>
              <td class={ list({ size: "rem7" }) }>{referral.facility.name}</td>
              <td class={ list({ size: "rem7" }) }>{referral.department.name}</td>
              <td class={ list({ size: "rem7" }) }>{referral.dr.name}</td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  );
}