import { createSignal, For, Show, Switch, Match, onMount } from "solid-js"
import { initDue } from "../../helper/types.ts"
import { getAllDues, insert, update, del } from "../../server/func/due.ts"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import type { Due } from "../../server/domain/due.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import batsu from "../assets/del.svg"
import { modificationAreaStyle, selectedStyle } from "./-css.ts"
import { button, table, input } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"
import { flex } from "../../styled-system/patterns/"

type Props = {
  setMessage: (status: MessageStatus)=>void
}

export function Due(props: Props){
  const [selectedIndex, setSelectedIndex] = createSignal<number>(-1);
  const [selected, setSelected] = createSignal<Due>(initDue());
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const [dues, setDues] = createSignal<Due[]>([]);

  let refInput: HTMLInputElement | undefined;

  function focus(){
    if(refInput){
      refInput.focus();
    }
  }

  function handleChange(val: Partial<Due>){
    if(selected()){
      setSelected(
        {
          ...selected(),
          ...val
        });
    }
  }

  function handleSelect(index: number){
    setSelectedIndex(index);
    setSelected({...dues()[index]});
    setNewadd(false);
    showDialog();
    focus();
  }

  function addDue(){
    setSelectedIndex(dues().length);
    setSelected(initDue());
    setNewadd(true);
    showDialog();
    focus();
  }

  async function register(){
    let res;
    if(newadd()){
      res = await insert({data: {due: structuredClone(selected())}});
    }else{
      res = await update({data: {due: structuredClone(selected())}});
    }
    if(res.ok){
      setDues(await getAllDues());
      setSelected(initDue());
      setSelectedIndex(-1);
      closeDialog();
      props.setMessage("register");
    }else{
      setErrors(res.errors!);
    }
  }

  async function deleteData(e: MouseEvent, index: number){
    e.preventDefault();
    e.stopPropagation();
    if(!confirm("削除します。よろしいですか？")){
      return;
    }

    const res = await del({data: {due: dues()[index]}});
    if(res.ok){
      setDues(await getAllDues());
      setSelected(initDue());
      setSelectedIndex(-1);
      props.setMessage("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  onMount(async ()=>{
    setDues(await getAllDues());
  });

  return (
    <div class={ flex({ direction: "row", justifyContent: "flex-start", wrap: "wrap"}) }>
      <div>
        <table class={ table() }>
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>日数</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <For each={dues()}>{(data, i)=>
              <tr onClick={()=>handleSelect(i())}
                  class={ css(i()===selectedIndex()? selectedStyle: {}) }>
                <td class={ css({ fontFamily: "number" }) }>{data.id}</td>
                <td class={ css({ minWidth: "8rem" }) }>{data.name}</td>
                <td class={ css({ minWidth: "4rem" }) }>{data.days}</td>
                <td class={ css({ paddingTop: "px.8", paddingBottom: "0" }) }
                    onClick={(e)=>{deleteData(e, i())}}>
                  <img src={batsu} alt="削除" width="23px" height="23px" />
                </td>
              </tr>
            }</For>
          </tbody>
        </table>
        <button type="button" class={ button({ color: "success", space: "top1" }) }
          onClick={addDue}>追加</button>
      </div>

      <NormalDialog>
      <div class={ modificationAreaStyle }>
        <ErrorArea />
        <Show when={selectedIndex() >= 0}>
        <div>
          <div>{newadd()?"追加":"変更"}</div>
          <hr class={ css({ marginBottom: "0.5rem" }) } />
          <div>
            <label>ＩＤ</label>
          </div>
          <div>
            <Switch>
              <Match when={newadd()}>
              <input type="number" class={ input({ size: "id" }) }
                value={selected().id} ref={refInput}
                onChange={(e)=>handleChange({id: parseInt(e.target.value)})} />
              </Match>
              <Match when={!newadd()}>
                <input type="number" class={ input({ size: "id" }) } value={selected().id} disabled />
              </Match>
            </Switch>
          </div>
          <div>
            <label>名前</label>
          </div>
          <div>
            <input type="text" class={ input({ size: "rem20" }) }
              value={selected().name}
              onChange={(e)=>handleChange({name: e.target.value})} />
          </div>
          <div>
            <label>日数</label>
          </div>
          <div>
            <input type="number" class={ input({ size: "rem5" }) }
              value={selected().days}
              onChange={(e)=>handleChange({days: parseInt(e.target.value)})} />
          </div>
          <Show when={selectedIndex() >= 0}>
            <button type="button" class={ button({ color: "primary", size: "full", space: "top1_2" }) }
              onClick={()=>register()}>登録</button>
          </Show>
        </div>
        </Show>
      </div>
      </NormalDialog>
    </div>
  );
}