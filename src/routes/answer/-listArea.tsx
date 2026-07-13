import { For, type Accessor } from "solid-js"
import type { Answer } from "../../server/domain/answer.ts"
import { table, list } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type ViewProps = {
    answers: Accessor<Answer[]>
    select: (s: Answer) => void
}

export function ListArea(props: ViewProps) {
  function handleClick(answer: Answer){
    props.select(answer);
  }


  return (
    <div>
      <table class={ table({ size: "full" }) }>
        <thead>
          <tr>
            <th class={ css({ width: "10rem" }) }>入力状況</th>
            <th class={ css({ width: "10rem" }) }>予約日</th>
            <th>タイトル</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.answers()}>{(answer)=>
            <tr onClick={()=>handleClick(answer)}>
              <td class={ list() }>{answer.inputDate?"済":"未"}</td>
              <td class={ list({ font: "number" }) }>{answer.appointmentDate}</td>
              <td class={ list() }>{answer.questionnaire.title}</td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  );
}

export function MobileListArea(props: ViewProps) {
  function handleClick(answer: Answer){
    props.select(answer);
  }


  return (
    <div>
      <table class={ table({ size: "full" }) }>
        <tbody>
          <For each={props.answers()}>{(answer)=>
            <tr onClick={()=>handleClick(answer)}>
              <td class={ list() }>
                <div>
                  <span class={ answer.inputDate ? doneStyle : yetStyle }>
                    {answer.inputDate?"入力済":"未入力"}
                  </span>
                  <span class={ css({ marginLeft: "1rem" })}>予約日：{answer.appointmentDate}</span>
                </div>
                <div>
                  {answer.questionnaire.title}
                </div>
              </td>
            </tr>
          }</For>
        </tbody>
      </table>
    </div>
  );
}

const doneStyle = css({
  color: "inherit",
});
const yetStyle = css({
  color: "red",
});