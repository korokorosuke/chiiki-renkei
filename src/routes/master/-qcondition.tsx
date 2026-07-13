import { createSignal, For, onMount } from "solid-js"
import type { Questionnaire, Question, Condition } from "../../server/domain/questionnaire.ts"
import { css } from "../../styled-system/css/"
import { input } from "../../styled-system/recipes/"

type Props = {
  item: Condition,
  q: Questionnaire,
  handleChange: (val: Condition)=>void,
}

export function QCondition(props: Props){
  const [cond, setCond] = createSignal<Condition>({ q: "", a: "" });
  const [choices, setChoices] = createSignal<{id: string, text: string}[]>([]);

  function handleSelect(qId: string){
    const c = { q: qId, a: "" };
    setCond(c);
    const q = props.q.items.find((item) => item.id === qId);
    setChoices(q?.choices?.map((a)=>a) || []);
  }

  function handleChange(aId: string){
    setCond({
      q: cond().q,
      a: aId
    });
    props.handleChange(cond());
  }

  onMount(()=>{
    const q = props.q.items.find((item) => item.id === props.item.q);
    setChoices(q?.choices?.map((a)=>a) || []);
    setCond({...props.item});
  });


  return (
    <fieldset class={fieldsetStyle}>
      <legend>表示条件</legend>
      <div>
        <span>質問：</span>
        <select value={cond().q} class={ input( { size: "full" }) }
            onChange={(e)=>handleSelect(e.target.value)}>
          <option value="">なし</option>
          <For each={props.q.items.filter((q) => q.type === "choice" || q.type === "multiple")}>
          {(q: Question) =>
            <option value={q.id}>{q.question}</option>
          }</For>
        </select>
      </div>
      <div>
        <span>回答：</span>
        <select value={cond().a} class={ input( { size: "full" }) }
            onChange={(e)=>handleChange(e.target.value)}>
          <option value="">なし</option>
          <For each={choices()}>{(c) =>
            <option value={c.id}>{c.text}</option>
          }</For>
      </select>
      </div>
    </fieldset>
  );
}

const fieldsetStyle = css({
  border: "1px solid #ccc",
  padding: "0.2rem 1rem 1rem 1rem",
  marginTop: "1rem",
  borderRadius: "10px",
  backgroundColor: "etc.red.back",
  color: "etc.red",
});