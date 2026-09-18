import { For, type Accessor } from "solid-js"
import type { Log } from "../../server/domain/log.ts"
import { table, list } from "../../styled-system/recipes/"

type ViewProps = {
    logs: Accessor<Log[]>
    select: (s: Log) => void
}

export function ListArea(props: ViewProps) {
  function handleClick(log: Log){
    props.select(log);
  }

  return (
    <div>
      <table class={ table({ size: "full", padding: "small" }) }>
        <thead>
          <tr>
            <th>日時</th><th>レベル</th><th>タイトル</th><th>詳細</th><th>ユーザーID</th><th>患者ID</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.logs()}>{(log)=>
            <tr onClick={()=>handleClick(log)}>
              <td class={ list({ font: "number", size: "rem11" }) }>{log.datetime}</td>
              <td class={ list({ font: "number" }) }>{log.level}</td>
              <td class={ list({ size: "rem11" }) }>{log.title}</td>
              <td class={ list() }>{log.details.substring(0, 50)}</td>
              <td class={ list({ font: "number", size: "rem5" }) }>{log.userId}</td>
              <td class={ list({ font: "number", size: "rem5" }) }>{log.patientId}</td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  );
}