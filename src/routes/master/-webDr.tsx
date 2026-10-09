import { createSignal, For, Switch, Match, Show, Suspense } from "solid-js"
import { useQuery } from "@tanstack/solid-query"
import { initWebDr } from "../../helper/webtypes.ts"
import { getWebDepartments } from "../../server/func/webDepartment.ts"
import { getAllWebDrs, insert, update, del } from "../../server/func/webDr.ts"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import type { WebDr } from "../../server/domain/webDr.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import batsu from "../../assets/del.svg"
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
  const deptsQuery = useQuery(() => ({
    queryKey: ["web-depts"],
    queryFn: ()=>getWebDepartments(),
  }));
  const drsQuery = useQuery(() => ({
    queryKey: ["web-drs"],
    queryFn: ()=>getAllWebDrs(),
  }));

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
    if(!drsQuery.data){
      return;
    }
    setSelectedIndex(index);
    setSelected({...drsQuery.data[index]});
    setNewadd(false);
    showDialog();
    focus();
  }

  function addWebDr(){
    if(!drsQuery.data || !deptsQuery.data){
      return;
    }
    setSelectedIndex(drsQuery.data.length);
    setSelected({...initWebDr(), department: deptsQuery.data[0].id});
    setNewadd(true);
    showDialog();
    focus();
  }

  function getName(id: string): string {
    if(deptsQuery.data){
      for(const dept of deptsQuery.data){
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
      drsQuery.refetch();
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
    if(!drsQuery.data){
      return;
    }

    const res = await del({data: {dr: drsQuery.data[index]}});
    if(res.ok){
      drsQuery.refetch();
      setSelected(initWebDr());
      setSelectedIndex(-1);
      props.setMessage("delete");
    }else{
      setErrors(res.errors!);
    }
  }

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
            <Suspense fallback={<div>読み込み中...</div>}>
            <For each={drsQuery.data}>{(data, i)=>
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
            </Suspense>
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
            <Suspense fallback={<div>読み込み中...</div>}>
            <select value={selected().department} class={ input() }
                onChange={(e)=>handleChange({department: e.target.value})}>
              <For each={deptsQuery.data}>{(dept)=>
                <option value={dept.id}>{dept.name}</option>
              }</For>
            </select>
            </Suspense>
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