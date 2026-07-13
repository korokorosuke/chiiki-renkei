import { For, Switch, Match, onMount, createSignal } from "solid-js"
import type { Answer } from "../../server/domain/answer.ts"
import { getPassword, resetPassword } from "../../server/func/answer.ts"
import { button } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type Props = {
  selected: Answer
  displayList: ()=>void;
}

export function ViewArea(props: Props){
  const [pass, setPass] = createSignal("");

  function getChoice(i: number, a: string): string{
    const q = props.selected.questionnaire.items[i];
    for(const c of q.choices!){
      if(c.id === a){
        return c.text;
      }
    }
    return "";
  }

  function getMultiple(i: number, a: string): string[]{
    const q = props.selected.questionnaire.items[i];
    const res: string[] = [];
    if(a){
      const aList = a.split(",");
      q.choices!.forEach(c=>{
        if(aList.includes(c.id)){
          res.push(c.text);
        }
      });
    }
    return res;
  }

  async function reset(){
    if(confirm("パスワードをリセットします。よろしいですか。")){
      const res = await resetPassword({data: { appId: props.selected.appointmentId }});
      if(res.ok){
        setPass(res.data!);
        alert("パスワードをリセットしました。");
      }
      alert(res.errors![0]);
    }
  }

  onMount(async ()=>{
    setPass(await getPassword({data: { appId: props.selected.appointmentId }}));
  });


  return (
    <>
      <div class={ css({ width: "100%", marginTop: "px.10" }) }>
        <div>
          <button type="button" class={ button({ color: "cancel", size: "slim" }) }
            onClick={props.displayList}>戻る</button>
        </div>
        <div class={ css({ fontWeight: "bold", fontSize: "1.5rem" })}>
          {props.selected.questionnaire.title}
        </div>
        <div>{"ID: " + props.selected.appointmentId}</div>
        <div>{"パスワード: " + pass()}<a href="javascript:void(0)"
          class={ css({ marginLeft: "1rem", color: "red", textDecoration: "underline" }) }
          onClick={reset}>パスワードリセット</a></div>
        <ul class={ ulStyle }>
          <For each={props.selected.questionnaire.items}>{(q, i)=>
            <Switch>
              <Match when={q.type === "text"}>
                <li>{q.question}</li>
                <div>{props.selected.items[i()]}</div>
              </Match>
              <Match when={q.type === "choice"}>
                <li>{q.question}</li>
                <div>{getChoice(i(), props.selected.items[i()])}</div>
              </Match>
              <Match when={q.type === "multiple"}>
                <li>{q.question}</li>
                <For each={getMultiple(i(), props.selected.items[i()])}>{(c)=>
                  <div class={ css({ marginLeft: "0.7rem!" })}>{`・${c}`}</div>
                }</For>
              </Match>
            </Switch>
          }</For>
        </ul>
      </div>
    </>
  );
}

const ulStyle = css({
  whiteSpace: "pre-wrap",
  "& > li": {
    listStyle: "square",
    marginLeft: "1.8rem",
    fontWeight: "bold",
    marginTop: "1rem",
  },
  "& div": {
    height: "1.5rem",
    overflowWrap: "anywhere",
    marginLeft: "2rem",
  }
});