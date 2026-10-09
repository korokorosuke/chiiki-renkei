import { createSignal, For, Show, Switch, Match, Suspense } from "solid-js"
import { useQuery } from "@tanstack/solid-query"
import { initWebDept } from "../../helper/webtypes.ts"
import { getWebDepartments, insert, update, del } from "../../server/func/webDepartment.ts"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import type { WebDepartment } from "../../server/domain/webDepartment.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import batsu from "../../assets/del.svg"
import { modificationAreaStyle, selectedStyle } from "./-css.ts"
import { button, etc, table, input } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"
import { flex } from "../../styled-system/patterns/"

type Props = {
  setMessage: (status: MessageStatus)=>void
}

export function WebDepartment(props: Props){
  const [selectedIndex, setSelectedIndex] = createSignal<number>(-1);
  const [selected, setSelected] = createSignal<WebDepartment>(initWebDept());
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const deptsQuery = useQuery(() => ({
    queryKey: ["web-depts"],
    queryFn: ()=>getWebDepartments(),
  }));

  let refInput: HTMLInputElement | undefined;

  function focus(){
    if(refInput){
      refInput.focus();
    }
  }

  function handleChange(val: Partial<WebDepartment>){
    if(selected()){
      setSelected(
        {
          ...selected(),
          ...val
        });
    }
  }

  function handleSelect(index: number){
    if(!deptsQuery.data){
      return;
    }
    setSelectedIndex(index);
    setSelected({...deptsQuery.data[index]});
    setNewadd(false);
    showDialog();
    focus();
  }

  function addWebDepartment(){
    if(!deptsQuery.data){
      return;
    }
    setSelectedIndex(deptsQuery.data.length);
    setSelected(initWebDept());
    setNewadd(true);
    showDialog();
    focus();
  }

  async function register(){
    let res;
    if(newadd()){
      res = await insert({data: {department: structuredClone(selected())}});
    }else{
      res = await update({data: {department: structuredClone(selected())}});
    }
    if(res.ok){
      deptsQuery.refetch();
      setSelected(initWebDept());
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
    if(!deptsQuery.data){
      return;
    }

    const res = await del({data: {department: deptsQuery.data[index]}});
    if(res.ok){
      deptsQuery.refetch();
      setSelected(initWebDept());
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
              <th>説明</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <Suspense fallback={<div>読み込み中...</div>}>
            <For each={deptsQuery.data}>{(data, i)=>
              <tr onClick={()=>handleSelect(i())}
                  class={ css(i()===selectedIndex()? selectedStyle: {}) }>
                <td class={ css({ fontFamily: "number" }) }>{data.id}</td>
                <td class={ css({ minWidth: "8rem" }) }>{data.name}</td>
                <td class={ css({ minWidth: "8rem" }) }>{data.description}</td>
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
          onClick={addWebDepartment}>追加</button>
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
            <label>名前<span class={ etc({ type: "require" }) }>*</span></label>
          </div>
          <div>
            <input type="text" class={ input({ size: "rem20" }) }
              value={selected().name}
              onChange={(e)=>handleChange({name: e.target.value})} />
          </div>
          <div>
            <label>説明</label>
          </div>
          <div>
            <textarea class={ input({ size: "textarea" }) }
              value={selected().description}
              onChange={(e)=>handleChange({description: e.target.value})} />
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