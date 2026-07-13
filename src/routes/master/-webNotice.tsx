import { createSignal, Show, For, onMount } from "solid-js"
import { initWebNotice } from "../../helper/webtypes.ts"
import { getAllNotices, insert, update, del } from "../../server/func/webnotice.ts"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import { NOTICE_TYPES } from "../../server/domain/notice.ts"
import type { WebNotice } from "../../server/domain/webNotice.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import batsu from "../assets/del.svg"
import { modificationAreaStyle, selectedStyle } from "./-css.ts"
import { button, etc, table, input } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"
import { flex } from "../../styled-system/patterns/"

type Props = {
  setMessage: (status: MessageStatus)=>void
}

export function WebNotice(props: Props){
  const [selectedIndex, setSelectedIndex] = createSignal<number>(-1);
  const [selected, setSelected] = createSignal<WebNotice>(initWebNotice());
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const [notices, setNotices] = createSignal<WebNotice[]>([]);

  let refInput: HTMLTextAreaElement | undefined;

  function focus(){
    if(refInput){
      refInput.focus();
    }
  }

  function handleChange(val: Partial<WebNotice>){
    if(selected()){
      setSelected(
        {
          ...selected(),
          ...val,
        });
    }
  }

  function handleSelect(index: number){
    setSelectedIndex(index);
    setSelected({...notices()[index]});
    setNewadd(false);
    showDialog();
    focus();
  }

  function addWebNotices(){
    setSelectedIndex(notices().length);
    setSelected({...initWebNotice()});
    setNewadd(true);
    showDialog();
    focus();
  }

  async function register(){
    let res;
    if(newadd()){
      res = await insert({data: {notice: structuredClone(selected())}});
    }else{
      res = await update({data: {notice: structuredClone(selected())}});
    }
    if(res.ok){
      setNotices(await getAllNotices());
      setSelected(initWebNotice());
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

    const res = await del({data: {notice: notices()[index]}});
    if(res.ok){
      setNotices(await getAllNotices());
      setSelected(initWebNotice());
      setSelectedIndex(-1);
      props.setMessage("delete");
    }else{
      setErrors(res.errors!);
    }
  }

  onMount(async ()=>{
    setNotices(await getAllNotices());
  });

  return (
    <div class={ flex({ direction: "row", justifyContent: "flex-start", wrap: "wrap"}) }>
      <div>
        <table class={ table() }>
          <thead>
            <tr>
              <th>区分</th>
              <th>メッセージ</th>
              <th>開始日</th>
              <th>終了日</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <For each={notices()}>{(data, i)=>
              <tr onClick={()=>handleSelect(i())}
                  class={ css(i()===selectedIndex()? selectedStyle: {}) }>
                <td class={ css({ minWidth: "4rem" }) }>{data.type}</td>
                <td class={ css({ minWidth: "8rem" }) }>{data.message.length>10?data.message.substring(0,10):data.message}</td>
                <td class={ css({ fontFamily: "number" }) }>{data.fromDate}</td>
                <td class={ css({ fontFamily: "number" }) }>{data.toDate}</td>
                <td class={ css({ paddingTop: "px.8", paddingBottom: "0" }) } onClick={(e)=>{deleteData(e, i())}}>
                  <img src={batsu} alt="削除" width="23px" height="23px" />
                </td>
              </tr>
            }</For>
          </tbody>
        </table>
        <button type="button" class={ button({ color: "success", space: "top1" }) }
          onClick={addWebNotices}>追加</button>
      </div>

      <NormalDialog>
      <div class={ modificationAreaStyle }>
        <ErrorArea />
        <Show when={selectedIndex() >= 0}>
        <div>
          <div>{newadd()?"追加":"変更"}</div>
          <hr class={ css({ marginBottom: "0.5rem" }) } />
          <div>
            <label>区分<span class={ etc({ type: "require"}) }>*</span></label>
          </div>
          <div>
            <select value={selected().type} class={ input( { size: "id" }) }
                onChange={(e)=>handleChange({type: e.target.value})}>
              <For each={NOTICE_TYPES}>{(type)=>
                <option value={type}>{type}</option>
              }</For>
            </select>
          </div>
          <div>
            <label>メッセージ<span class={ etc({ type: "require"}) }>*</span></label>
          </div>
          <div>
            <textarea value={selected().message} ref={refInput} class={ input({ size: "textarea" }) }
              onChange={(e)=>handleChange({message: e.target.value})} />
          </div>
          <div>
            <label>開始日<span class={ etc({ type: "require"}) }>*</span></label>
          </div>
          <div>
            <input type="date" class={ input({ size: "date" }) }
              value={selected().fromDate}
              onChange={(e)=>handleChange({fromDate: e.target.value})} />
          </div>
          <div>
            <label>終了日<span class={ etc({ type: "require"}) }>*</span></label>
          </div>
          <div>
            <input type="date" class={ input({ size: "date" }) }
              value={selected().toDate}
              onChange={(e)=>handleChange({toDate: e.target.value})} />
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