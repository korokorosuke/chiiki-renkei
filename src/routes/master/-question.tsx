import { createSignal, For, Show } from "solid-js"
import { type Questionnaire, type Question, type Condition,
  questionTypes } from "../../server/domain/questionnaire.ts"
import { QCondition } from "./-qcondition.tsx"
import { button, input, etc } from "../../styled-system/recipes/"
import { flex } from "../../styled-system/patterns/"
import { css } from "../../styled-system/css"

type Props = {
  question: Question,
  q: Questionnaire,
  handleChange: (val: Partial<Question>)=>void,
}

export function Question(props: Props){
  const [cnt, setCnt] = createSignal<number>(
    Math.max(...props.question.choices!.map((c: { id: string }): number => parseInt(c.id)), 0)
  );

  function handleChange(val: Partial<Question>){
    props.handleChange({
      ...val
    });
  }

  function handleChangeCondition(val: Condition){
    const c = val.q && val.a ? { q: val.q, a: val.a } : undefined;
    handleChange({ condition: c });
  }


  return (
    <div class={ flex({ direction: "column", justifyContent: "flex-start", wrap: "wrap"}) }>
      <div>
        <label>質問内容<span class={ etc({ type: "require"}) }>*</span></label>
      </div>
      <div>
        <input type="text" class={ input({ size: "full" }) }
          value={props.question.question}
          onChange={(e)=>handleChange({question: e.target.value})} />
      </div>
      <div>
        <label>入力形式<span class={ etc({ type: "require"}) }>*</span></label>
      </div>
      <div>
        <For each={Object.entries(questionTypes)}>{([key, value])=>
          <label class={ css({ marginRight: "!1rem", cursor: "pointer" }) }>
            <input type="radio" name={'type'+props.question.id}
              value={key}
              checked={props.question.type === key}
              onChange={(e)=>handleChange({type: e.currentTarget.value})} />
            {value}
          </label>
        }</For>
      </div>
      <div>
        <label>必須入力</label>
      </div>
      <div>
        <input type="checkbox" class={ input({ type: "checkbox", size: "check1_5" })}
          checked={props.question.require}
          onChange={(e)=>handleChange({require: e.currentTarget.checked})} />
      </div>
      <div>
        <Show when={props.question.type === "choice" || props.question.type === "multiple"}>
          <div>
            <label>選択肢<span class={ etc({ type: "require"}) }>*</span></label>
          </div>
          <For each={props.question.choices}>{(choice, i)=>
            <div class={ flex({ direction: "row", justifyContent: "flex-start", wrap: "wrap"}) }>
              <div class={ css({ width: "5%" }) }>{i()+1}.</div>
              <div class={ css({ width: "95%" }) }>
                <input type="text" class={ input({ size: "full" }) }
                  value={choice.text}
                  onChange={(e)=>{
                    const newChoices = props.question.choices!.map(
                      c => c.id === choice.id ? {id: c.id, text: e.currentTarget.value} : c);
                    handleChange({choices: newChoices});
                  }} />
              </div>
            </div>
          }</For>
          <div>
            <button type="button" class={ button({ color: "success", size: "small", space: "top1" }) }                    onClick={()=>{
              setCnt(cnt()+1);
              const newChoice = { id: cnt().toString(), text: "" };
              const newChoices = [...(props.question.choices || []), newChoice];
              handleChange({choices: newChoices});
              }}>選択肢追加</button>
          </div>
        </Show>
        <QCondition item={props.question.condition || { q: "", a: "" }}
          q={props.q} handleChange={handleChangeCondition}
        />
      </div>
    </div>
  );
}