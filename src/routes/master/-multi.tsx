import { createEffect, createSignal, Index, Show } from "solid-js"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import { getMaster, update } from "../../server/func/master.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import del from "../assets/del.svg"
import { selectedStyle } from "./-css.ts"
import { button, area, input } from "../../styled-system/recipes/"
import { flex } from "../../styled-system/patterns/"
import { css } from "../../styled-system/css/"

type Props = {
  id: string
  setMessage: (status: MessageStatus)=>void
}

export function Multi(props: Props){
  const [values, setValues] = createSignal<string[]>([]);
  const [selectedIndex, setSelectedIndex] = createSignal<number>(-1);
  const [selected, setSelected] = createSignal<string>("");
  const [value, setValue] = createSignal<string>("");

  let refInput: HTMLInputElement | undefined;

  createEffect(()=>{
    loadData(props.id).then( ()=>{ } )
    .catch(e=>{
        setValues([]);
        alert(e);
      })
    .finally(
      ()=>{
        setSelectedIndex(-1);
        setSelected("");
      });
  },[props.id]);

  async function loadData(id: string){
    setValues(await getMaster({data: {id}}));
  }

  function handleClick(index: number){
    setSelectedIndex(index);
    setSelected(values()[index]);
    setValue(values()[index]);
    showDialog();
    focus();
  }

  function focus(){
    if(refInput){
      refInput.focus();
    }
  }

  function handleButtonClick(){
    setSelectedIndex(values().length);
    setSelected("新規追加");
    showDialog();
    focus();
  }

  async function deleteData(e: MouseEvent, index: number){
    e.preventDefault();
    e.stopPropagation();
    if(!confirm("削除します。よろしいですか？")){
      return;
    }

    const vs = values().filter((_,i)=>i !== index);

    const res = await update({data: {master: { id: props.id, value: vs }}});
    if(res.ok){
      setValues(vs);
      setValue("");
      setSelectedIndex(-1);
      setSelected("");
      props.setMessage("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  async function register(){
    const vs = values().slice();
    if(selectedIndex() >= vs.length){
      vs.push(value());
    }else{
      vs[selectedIndex()] = value();
    }

    const res = await update({data: {master: { id: props.id, value: vs }}});
    if(res.ok){
      setValues(vs);
      setValue("");
      setSelectedIndex(-1);
      setSelected("");
      closeDialog();
      props.setMessage("register");
    }else{
      setErrors(res.errors!);
    }
  }

  return (
    <div class={ flex({ direction: "row", content: "flex-start", wrap: "wrap" }) }>
      <div>
        <ul class={ css({ paddingInlineStart: "0" }) }>
          <Index each={values()}>{(val, i)=>
              <li onClick={()=>handleClick(i)}
                  class={ css(styles, i===selectedIndex() ? selectedStyle : {}) }>
                <span>{val()}</span>
                <img src={del} alt="削除" width="23px" height="23px"
                  onClick={(e)=>deleteData(e, i)} />
              </li>
          }</Index>
        </ul>
        <button type="button" class={ button({ color: "success", space: "top1" }) }
          onClick={handleButtonClick}>追加</button>
      </div>

      <NormalDialog>
        <ErrorArea />
        <Show when={selectedIndex() >= 0}>
          <div>
            <div>{selected()}</div>
            <hr class={ css({ marginBottom: "1rem" }) } />
            <input type="text" class={ input({ size: "rem20" }) }
              value={value()} ref={refInput}
              onChange={(e)=>setValue(e.target.value)} />
          </div>
        </Show>
        <Show when={selectedIndex() >= 0}>
          <div class={ area({ type: "button" }) }>
            <button type="button" class={ button({ color: "primary", size: "full", space: "top1_2" }) }
              onClick={()=>register()}>登録</button>
          </div>
        </Show>
      </NormalDialog>
    </div>
  );
}

const styles = {
  width: "15rem",
  listStyle: "none",
  border: "solid 1px rgb(150, 150, 150)",
  borderRadius: "10px",
  margin: "px.2",
  paddingTop: "px.2",
  paddingBottom: "px.2",
  paddingRight: "px.5",
  paddingLeft: "px.5",
  cursor: "pointer",

  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",

  "& img": {
      marginTop: "px.4",
  },

  _hover: {
      backgroundColor: "table.selected",
      transition: "0.5s",
  }
};