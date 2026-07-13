import { createSignal, For, Show, onMount } from "solid-js"
import { createStore, unwrap } from "solid-js/store"
import { initQuestionnaire } from "../../helper/types.ts"
import { getQuestionnaires, insert, update, del } from "../../server/func/questionnaire.ts"
import { getDepartments } from "../../server/func/department.ts"
import { setErrors, ErrorArea } from "../../components/ErrorArea.tsx"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import { Question as QuestionComp } from "./-question.tsx"
import type { Questionnaire, Question } from "../../server/domain/questionnaire.ts"
import type { Department } from "../../server/domain/department.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { modificationAreaStyle, selectedStyle } from "./-css.ts"
import { button, input, etc, table } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"
import { flex } from "../../styled-system/patterns/"

type Props = {
  setMessage: (status: MessageStatus)=>void
}

export function Questionnaire(props: Props){
  const [selectedIndex, setSelectedIndex] = createSignal<number>(-1);
  const [selected, setSelected] = createStore<Questionnaire>(initQuestionnaire());
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const [qs, setQs] = createSignal<Questionnaire[]>([]);
  const [depts, setDepts] = createSignal<Department[]>([]);

  function handleSelect(index: number){
    setSelectedIndex(index);
    const q = {...qs()[index]};
    setSelected(q);
    setNewadd(false);
    showDialog();
    focus();
  }

  function addQuestionnaire(){
    setSelectedIndex(qs().length);
    setSelected(initQuestionnaire());
    setNewadd(true);
    addQuestion();
    showDialog();
    focus();
  }

  function addQuestion(){
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      question: "",
      type: "text",
      require: true,
      choices: [],
    }
    setSelected("items", [...selected.items, newQuestion]);
  }

  async function register(){
    let res;
    if(newadd()){
      res = await insert({data: {q: unwrap(selected)}});
    }else{
      res = await update({data: {q: unwrap(selected)}});
    }
    if(res.ok){
      setQs(await getQuestionnaires());
      setSelected(initQuestionnaire());
      setSelectedIndex(-1);
      closeDialog();
      props.setMessage("register");
    }else{
      setErrors(res.errors!);
    }
  }

  async function deleteData(index: number){
    if(!confirm("削除します。よろしいですか？")){
      return;
    }

    const res = await del({data: {q: qs()[index]}});
    if(res.ok){
      setQs(await getQuestionnaires());
      setSelected(initQuestionnaire());
      setSelectedIndex(-1);
      props.setMessage("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  function handleChangeQuestion(val: Partial<Question>, id: string){
    const newItems = selected.items.map(temp => temp.id === id ? {...temp, ...val} : temp);
    setSelected("items", newItems);
  }

  onMount(()=>{
    getQuestionnaires().then(setQs);
    getDepartments().then(setDepts);
  });

  return (
    <div class={ flex({ direction: "row", justifyContent: "flex-start", wrap: "wrap"}) }>
      <div>
        <table class={ table() }>
          <thead>
            <tr>
              <th>設問</th>
              <th>説明</th>
            </tr>
          </thead>
          <tbody>
            <For each={qs()}>{(data, i)=>
              <tr onClick={()=>handleSelect(i())}
                  class={ css(i()===selectedIndex()? selectedStyle: {}) }>
                <td class={ css({ fontFamily: "number" }) }>{data.title}</td>
                <td class={ css({ minWidth: "8rem" }) }>{data.description}</td>
              </tr>
            }</For>
          </tbody>
        </table>
        <button type="button" class={ button({ color: "success", space: "top1" }) }
          onClick={addQuestionnaire}>追加</button>
      </div>


      <NormalDialog >
      <div class={ modificationAreaStyle }>
        <ErrorArea />
        <div>
          <label>タイトル<span class={ etc({ type: "require"}) }>*</span></label>
        </div>
        <div>
          <input type="text" class={ input({ size: "full" }) }
            value={selected.title}
            onChange={(e)=>setSelected("title", e.target.value)} />
        </div>
        <div>
          <label>説明</label>
        </div>
        <div>
          <textarea class={ input({ size: "textarea" }) }
            value={selected.description}
            onChange={(e)=>setSelected("description", e.target.value)} />
        </div>
        <div>
          <label>対象科</label>
        </div>
        <div class={ css({ maxWidth: "30rem" }) }>
          <For each={depts()}>{(dept)=>
            <div class={ css({ display: "inline-block" })}>
            <label class={ css({ marginRight: "0.5rem" }) }>
              <input type="checkbox"
                value={dept.id}
                checked={selected.depts.includes(dept.id)}
                onChange={(e)=>{
                  const checked = e.currentTarget.checked;
                  const value = e.currentTarget.value;
                  if(checked){
                    setSelected("depts", [...selected.depts, value]);
                  }else{
                    setSelected("depts", selected.depts?.filter(id => id !== value));
                  }
                }} />
              {dept.name}
            </label>
            </div>
          }</For>
        </div>

        <For each={selected.items}>{(item, i)=>
          <fieldset
            class={ css({ border: "1px solid #ccc", borderRadius: "10px",
            padding: "0.2rem 1rem 1rem 1rem", marginTop: "1em" }) }>
          <legend>問診.{i()+1}</legend>
          <QuestionComp question={unwrap(item)} q={selected}
            handleChange={(val) => handleChangeQuestion(val, item.id)} />
          </fieldset>
        }</For>
        <div>
          <button type="button" class={ button({ color: "success", size: "full", space: "top1" }) }
            onClick={addQuestion}>新しい設問を追加</button>
        </div>
        <Show when={selectedIndex() >= 0}>
          <div>
            <button type="button" class={ button({ color: "primary", size: "full", space: "top1_2" }) }
              onClick={register}>登録</button>
          </div>
        </Show>
        <div>
          <button type="button" class={ button({ color: "warning", size: "full", space: "top1_2" }) }
            onClick={closeDialog}>閉じる</button>
        </div>
        <Show when={selectedIndex() >= 0}>
          <div>
            <button type="button" class={ button({ color: "fatal", size: "full", space: "top1_2" }) }
              onClick={() => deleteData(selectedIndex())}>削除</button>
          </div>
        </Show>
      </div>
      </NormalDialog>
    </div>
  );
}