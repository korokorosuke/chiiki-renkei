import { For, type Accessor } from "solid-js"
import type { Staff } from "../../server/domain/staff.ts"
import { table, list } from "../../styled-system/recipes/"

type ViewProps = {
    staffs: Accessor<Staff[]>
    select: (s: Staff) => void
}

export function ListArea(props: ViewProps) {
  function handleClick(staff: Staff){
    props.select(staff);
  }

  return (
    <div>
      <table class={ table({ size: "full" }) }>
        <thead>
          <tr>
            <th>職員名</th><th>カナ</th><th>部署</th><th>医師</th><th>役職</th><th>並び順</th><th>非表示</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.staffs()}>{(staff)=>
            <tr onClick={()=>handleClick(staff)}>
              <td class={ list({ size: "rem10" }) }>{staff.name}</td>
              <td class={ list({ size: "rem10" }) }>{staff.kana}</td>
              <td class={ list({ size: "rem10" }) }>{staff.department}</td>
              <td class={ list({ size: "rem3" }) }>{staff.dr?"医師":""}</td>
              <td class={ list({ size: "rem3" }) }>{staff.post}</td>
              <td class={ list({ size: "rem3" }) }>{staff.sort}</td>
              <td class={ list({ size: "rem3" }) }>{staff.hidden?"非表示":""}</td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  );
}