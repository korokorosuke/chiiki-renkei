import { For, type Accessor } from "solid-js"
import type { Address } from "../../server/domain/address.ts"
import { table, list } from "../../styled-system/recipes/"

type ViewProps = {
    addresses: Accessor<Address[]>
    select: (s: Address) => void
}

export function ListArea(props: ViewProps) {
  function handleClick(address: Address){
    props.select(address);
  }


  return (
    <div>
      <table class={ table({ size: "full" }) }>
        <thead>
          <tr>
            <th>郵便番号</th><th>住所</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.addresses()}>{(address)=>
            <tr onClick={()=>handleClick(address)}>
              <td class={ list({ size: "rem3", font: "number" }) }>{address.postalCode}</td>
              <td class={ list({ size: "rem10" }) }>{address.name}</td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  );
}