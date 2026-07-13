import { For, type Accessor } from "solid-js"
import type { Activity } from "../../server/domain/activity.ts"
import { list, table } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type ViewProps = {
    activities: Accessor<Activity[]>
    select: (act: Activity) => void
}


export function ListArea(props: ViewProps) {
  function handleClick(activity: Activity){
    props.select(activity);
  }


  return (
    <>
      <div>
        <table class={ table({ size: "full" }) }>
          <thead>
            <tr>
              <th>訪問日</th><th>施設</th><th>参加者</th><th>施設参加者</th><th>目的</th><th>内容</th>
            </tr>
          </thead>
          <tbody>
            <For each={props.activities()}>{(act: Activity)=>
              <tr onClick={[handleClick, act]}>
                <td class={ list({ size: "rem8", font: "number" }) }
                  >{act.date.replace("T"," ")}</td>
                <td class={ list({ size: "rem12" }) }>
                  <div class={ css({ fontFamily: "number" }) }>{act.facility.id}:{act.facility.name}</div>
                </td>
                <td class={ list({ size: "rem9" }) }>{act.participants}</td>
                <td class={ list({ size: "rem9" }) }>{act.facilityParticipants}</td>
                <td class={ list({ size: "rem10" }) }>{act.purpose.join(",")}</td>
                <td class={ list() }>{act.details.length > 50 ?
                  act.details.substring(0, 50) + "..." : act.details}</td>
              </tr>
            }</For>
          </tbody>
        </table>
      </div>
    </>
  );
}