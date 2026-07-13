import { For } from "solid-js"
import type { Facility } from "../../server/domain/facility.ts"
import { table, list } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type ViewProps = {
    facilities: Facility[]
    select: (f: Facility) => void
}

export function ListArea(props: ViewProps) {
  function handlerClick(fac: Facility){
    props.select(fac);
  }

  return (
    <div>
      <table class={ table({ size: "full" }) }>
        <thead>
          <tr>
            <th>ID</th><th>施設名</th><th>住所</th><th>TEL</th><th>FAX</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.facilities}>{(f)=>
            <tr onClick={()=>handlerClick(f)}>
              <td class={ list({ size: "rem5" }) }>{f.id}</td>
              <td class={ list({ size: "rem10" }) }>
                <div class={ css({ fontSize: "1.1rem" }) }>{f.kana}</div><div>{f.name}</div>
              </td>
              <td class={ list({ size: "rem12" }) }>{f.address.name}{f.address.plus}</td>
              <td class={ list({ size: "rem8", font: "number" }) }>{f.tel}</td>
              <td class={ list({ size: "rem8", font: "number" }) }>{f.fax}</td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  );
}