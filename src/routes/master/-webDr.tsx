import { createSignal, For, Switch, Match, Show, onMount } from "solid-js"
import { initWebDr } from "../../helper/webtypes.ts"
import { getWebDepartments } from "../../server/func/webdepartment.ts"
import { getAllWebDrs, insert, update, del } from "../../server/func/webdr.ts"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import type { WebDr } from "../../server/domain/webDr.ts"
import type { WebDepartment } from "../../server/domain/webDepartment.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import batsu from "../assets/del.svg"
import { modificationAreaStyle, selectedStyle } from "./-css.ts"
import { button, etc, table, input } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"
import { flex } from "../../styled-system/patterns/"

type Props = {
  setMessage: (status: MessageStatus)=>void
}

export function WebDr(props: Props){
  const [selectedIndex, setSelectedIndex] = createSignal<number>(-1);
  const [selected, setSelected] = createSignal<WebDr>(initWebDr());
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const [webDrs, setWebDrs] = createSignal<WebDr[]>([]);
  const [webDepts, setWebDepts] = createSignal<WebDepartment[]>([]);

  let refInput: HTMLInputElement | undefined;

  function focus(){
    if(refInput){
      refInput.focus();
    }
  }
  function handleChange(val: Partial<WebDr>){
    if(selected()){
      setSelected(
        {
          ...selected(),
          ...val
        });
    }
  }

  function handleNameChange(val: string){
    if(selected()){
      setSelected(
        {
          ...selected(),
          name: val,
          displayName: selected().displayName ?? val
        });
    }
  }

  function handleSelect(index: number){
    setSelectedIndex(index);
    setSelected({...webDrs()[index]});
    setNewadd(false);
    showDialog();
    focus();
  }

  function addWebDr(){
    setSelectedIndex(webDrs().length);
    setSelected({...initWebDr(), department: webDepts()[0].id});
    setNewadd(true);
    showDialog();
    focus();
  }

  function getName(id: string): string {
    if(webDepts){
      for(const dept of webDepts()){
        if(dept.id === id){
          return dept.name;
        }
      }
    }
    return "";
  }

  async function register(){
    let res;
    if(newadd()){
      res = await insert({data: {dr: structuredClone(selected())}});
    }else{
      res = await update({data: {dr: structuredClone(selected())}});
    }
    if(res.ok){
      setWebDrs(await getAllWebDrs());
      setSelected(initWebDr());
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

    const res = await del({data: {dr: webDrs()[index]}});
    if(res.ok){
      setWebDrs(await getAllWebDrs());
      setSelected(initWebDr());
      setSelectedIndex(-1);
      props.setMessage("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  onMount(()=>{
    getAllWebDrs().then(setWebDrs);
    getWebDepartments().then(setWebDepts);
  });

  return (
    <div class={ flex({ direction: "row", justifyContent: "flex-start", wrap: "wrap"}) }>
      <div>
        <table class={ table() }>
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>表示名称</th>
              <th>所属</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <For each={webDrs()}>{(data, i)=>
              <tr onClick={()=>handleSelect(i())}
                  class={ css(i()===selectedIndex()? selectedStyle: {}) }>
                <td class={ css({ fontFamily: "number" }) }>{data.id}</td>
                <td class={ css({ minWidth: "8rem" }) }>{data.name}</td>
                <td class={ css({ minWidth: "8rem" }) }>{data.displayName}</td>
                <td class={ css({ minWidth: "8rem" }) }>{getName(data.department)}</td>
                <td class={ css({ paddingTop: "px.8", paddingBottom: "0" }) }
                    onClick={(e)=>{deleteData(e, i())}}>
                  <img src={batsu} alt="削除" width="23px" height="23px" />
                </td>
              </tr>
            }</For>
          </tbody>
        </table>
        <button type="button" class={ button({ color: "success", space: "top1" }) }
          onClick={addWebDr}>追加</button>
      </div>

      <NormalDialog>
      <div class={ modificationAreaStyle }>
        <ErrorArea />
        <Show when={selectedIndex() >= 0}>
        <div>
          <div>{newadd()?"追加":"変更"}</div>
          <hr class={ css({ marginBottom: "0.5rem" }) } />
          <div>
            <label>ＩＤ<span class={ etc({ type: "require" }) }>*</span></label>
          </div>
          <div>
            <Switch>
              <Match when={newadd()}>
                <input type="text" class={ input({ size: "id" }) }
                  value={selected().id} ref={refInput}
                  onChange={(e)=>handleChange({id: e.target.value})} />
              </Match>
              <Match when={!newadd()}>
                <input type="text" class={ input({ size: "id" }) } value={selected().id} disabled />
              </Match>
            </Switch>
          </div>
          <div>
            <label>名称<span class={ etc({ type: "require" }) }>*</span></label>
          </div>
          <div>
            <input type="text" class={ input({ size: "rem20" }) }
              value={selected().name}
              onChange={(e)=>handleNameChange(e.target.value)} />
          </div>
          <div>
            <label>表示名称<span class={ etc({ type: "require" }) }>*</span></label>
          </div>
          <div>
            <input type="text" class={ input({ size: "rem20" }) }
              value={selected().displayName}
              onChange={(e)=>handleChange({displayName: e.target.value})} />
          </div>
          <div>
            <label>部署<span class={ etc({ type: "require" }) }>*</span></label>
          </div>
          <div>
            <select value={selected().department} class={ input() }
                onChange={(e)=>handleChange({department: e.target.value})}>
              <For each={webDepts()}>{(dept)=>
                <option value={dept.id}>{dept.name}</option>
              }</For>
            </select>
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