import { For, type Setter, type Accessor } from "solid-js"
import type { ReferralTo } from "../../server/domain/referralto.ts"
import { table, list } from "../../styled-system/recipes/"

type Props = {
    referrals: Accessor<ReferralTo[]>
    select: ()=>void
    setReferral: Setter<ReferralTo>
}

export function ListArea(props: Props) {

  function handlerClick(id: string){
    const ref = props.referrals().filter((r) => r.id === id);
    if(ref && ref.length > 0){
      props.setReferral(ref[0]);
      props.select();
    }
  }


  return (
    <div>
      <table class={ table({ size: "full" }) }>
        <thead>
          <tr>
            <th>日付</th><th>施設</th><th>科</th><th>医師</th><th>担当</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.referrals()}>{(r)=>
            <tr onClick={()=>handlerClick(r.id)}>
              <td class={ list({ size: "rem10" }) }>{r.date}</td>
              <td><div>{r.facility.id}:{r.facility.name}</div>
                <div>{r.facility.address}</div>
              </td>
              <td>{r.department.name}</td>
              <td>{r.dr.name}</td>
              <td>{r.personInCharge.name}</td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  );
}