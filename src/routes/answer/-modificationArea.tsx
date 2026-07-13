import { createSignal, Show, For, onMount, type Accessor, type Setter } from "solid-js"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import { update } from "../../server/func/answer.ts"
import type { Answer } from "../../server/domain/answer.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { button, input, area } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type ViewProps = {
  answer: Accessor<Answer>
  setAnswer: Setter<Answer>
  terminateModification: (status: MessageStatus)=>void
  base: string
}

export function ModificationArea(props: ViewProps){
  const [answerItems, setAnswerItems] = createSignal<string[]>([]);
  const [position, setPosition] = createSignal(0);
  const [val, setVal] = createSignal<string>("");
  const [valCheck, setValCheck] = createSignal<string[]>([]);
  const [last, setLast] = createSignal(false);

  function updateAnswer(){
    if(props.answer().questionnaire.items[position()].type === "multiple"){
      const items = answerItems();
      items[position()] = valCheck().join(",");
      setAnswerItems(items);
    }else{
      const items = answerItems();
      items[position()] = val();
      setAnswerItems(items);
    }

    setLast(!getNext(position()).ok);
  }

  async function handleRegister(){
    const a = structuredClone(props.answer());
    a.items = answerItems();
    const res = await update({data: { answer: a, base: props.base }});
    if(res.ok){
      props.setAnswer(a);
      props.terminateModification("register");
    }else{
      setErrors(res.errors!);
    }
  }

  function setValue(pos: number){
    if(props.answer().questionnaire.items[pos].type === "multiple"){
      setValCheck(answerItems()[pos] ? answerItems()[pos].split(",") : []);
    }else{
      setVal(answerItems()[pos] || "");
    }
  }

  function handleNext(){
    const res = getNext(position());
    setLast(!res.ok);
    setPosition(res.next);
    setValue(res.next);
    setLast(!getNext(res.next).ok);
  }

  function handlePrevious(){
    if(position() > 0){
      setPosition(position() - 1);
      while(!isMatch(position()) && position() > 0){
        setPosition(position() - 1);
      }
      setValue(position());
      setLast(!getNext(position()).ok);
    }
  }

  function getNext(pos: number): {ok: boolean, next: number} {
    pos += 1;
    while(pos < answerItems().length && !isMatch(pos)){
      pos += 1;
    }
    if(pos < answerItems().length){
      return {ok: true, next: pos}
    }else{
      return {ok: false, next: pos}
    }
  }

  function isMatch(pos: number): boolean{
    const cond = props.answer().questionnaire.items[pos].condition;
    if(cond){
      const index = props.answer().questionnaire.items.findIndex((item)=>item.id === cond.q);
      if(index >= 0 && index < pos){
        if(props.answer().questionnaire.items[index].type==="multiple"){
          const ar = answerItems()[index].split(",")
          return ar.includes(cond.a.toString());
        }else{
          return answerItems()[index] === cond.a;
        }
      }
    }
    return true;
  }

  function isInput(): boolean{
    if((!props.answer().questionnaire.items[position()].require) ||
        (props.answer().questionnaire.items[position()].type === "text" && val()) ||
        (props.answer().questionnaire.items[position()].type === "choice" && val()) ||
        (props.answer().questionnaire.items[position()].type === "multiple" && valCheck().length >= 1)){
      return true;
    }else{
      return false;
    }
  }

  onMount(()=>{
    if(props.answer().items.length === 0){
      const ar = new Array(props.answer().questionnaire.items.length);
      setAnswerItems(ar.fill(""));
    }else{
      setAnswerItems([...props.answer().items]);
    }
    if(props.answer().questionnaire.items[0].type === "multiple"){
      setValCheck(props.answer().items[0].split(","));
    }else{
      setVal(answerItems()[0]);
    }
  });


  return (
    <>
    <div class={ area({ type: "contents" }) }>
      <ErrorArea />
      <div>{props.answer().questionnaire.items[position()].question}</div>
      <div class={ css({ marginBottom: "0.5rem" })}>
        <Show when={props.answer().questionnaire.items[position()].type === "text"}>
          <div class={ css({marginTop: "0.5rem" })}>
          <textarea value={val()}
            class={ input({ size: "textarea" })}
            onInput={(e) => setVal(e.currentTarget.value)}
            onChange={updateAnswer}
          />
          </div>
        </Show>
        <Show when={props.answer().questionnaire.items[position()].type === "choice"}>
          <For each={props.answer().questionnaire.items[position()].choices}>
            {(choice) => (
            <div class={ css({ margin: "0.8rem"})}>
              <label class={ inputStyle }>
                <input type="radio" name={`choice-${position()}`}
                  class={ css({ marginRight: "0.5rem" })}
                  value={choice.id} checked={val() === choice.id}
                  onChange={() =>{setVal(choice.id); updateAnswer()}}
                />
                {choice.text}
              </label>
            </div>
            )}
          </For>
        </Show>
        <Show when={props.answer().questionnaire.items[position()].type === "multiple"}>
          <For each={props.answer().questionnaire.items[position()].choices}>
            {(choice) => (
            <div class={ css({ margin: "0.8rem"})}>
              <label class={ inputStyle }>
                <input type="checkbox"
                  class={ css({ marginRight: "0.5rem" })}
                  value={choice.id} checked={valCheck().includes(choice.id)}
                  onChange={() => {
                    if (valCheck().includes(choice.id)) {
                      setValCheck(valCheck().filter((id) => id !== choice.id));
                    } else {
                      setValCheck([...valCheck(), choice.id]);
                    }
                    updateAnswer();
                  }}
                />
                {choice.text}
              </label>
            </div>
            )}
          </For>
        </Show>
      </div>
      <div class={ area({ type: "button" }) }>
        <button type="button"
          class={ position() > 0 ? returnButton : disableButton }
          disabled={ position() <= 0 }
          onClick={handlePrevious}>戻る</button>
        <Show when={last()}>
          <button type="button"
            class={ isInput() ? enableButton : disableButton }
            disabled={ !isInput() }
            onClick={handleRegister}>登録</button>
        </Show>
        <Show when={!last()}>
          <button type="button"
            class={ isInput() ? enableButton : disableButton }
            disabled={ !isInput() }
            onClick={handleNext}>次へ</button>
        </Show>
      </div>
    </div>
    </>
  );
}

const enableButton = button({ color: "primary", size: "long" });
const returnButton = button({ color: "warning", size: "long" });
const disableButton = button({ color: "normal", size: "long" });

const inputStyle = css({
  padding: "0.2rem 0.5rem 0.3rem 0.5rem",
  border: "1px solid",
  borderRadius: "4px",
  borderColor: "#cecfd0",
  display: "inline-block",
  width: "100%",
  //"& > input": { display: "none" },
  "&:has(input:checked)": {
    backgroundColor: "etc.blue.back",
    color: "etc.blue",
    borderColor: "etc.blue.hover",
  },
});