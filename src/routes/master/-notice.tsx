import { createSignal, Show, For, onMount } from "solid-js"
import { getTodayString } from "../../lib/datetime.ts"
import { ErrorArea } from "../../components/ErrorArea.tsx"
import { getAllNotices, insert, update, del } from "../../server/func/notice.ts"
import { NormalDialog, showDialog, closeDialog } from "../../components/NormalDialog.tsx"
import { type Notice, NOTICE_PAGES } from "../../server/domain/notice.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import del_icon from "../assets/del.svg"
import { modificationAreaStyle, selectedStyle } from "./-css.ts"
import { button, etc, table, input } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"
import { flex } from "../../styled-system/patterns/"

type Props = {
  setMessage: (status: MessageStatus)=>void
}

export function Notice(props: Props){
  const [selectedIndex, setSelectedIndex] = createSignal<number>(-1);
  const [selected, setSelected] = createSignal<Notice>(initNotice());
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const [errors, setErrors] = createSignal<string[]>([]);
  const [notices, setNotices] = createSignal<Notice[]>([]);

  let refInput: HTMLTextAreaElement | undefined;

  function initNotice(): Notice{
      return {
          id: "",
          page: NOTICE_PAGES[0],
          message: "",
          fromDate: getTodayString(),
          toDate: getTodayString(),
          importance: false
      }
  }

  function focus(){
    if(refInput){
      refInput.focus();
    }
  }

  function handleChange(val: Partial<Notice>){
    if(selected()){
      setSelected(
        {
          ...selected(),
          ...val
        });
    }
  }

  function clear(sel: Notice, idx: number = -1, newadd: boolean = false){
    setSelected(sel);
    setSelectedIndex(idx);
    setNewadd(newadd);
    setErrors([]);
  }

  function handleSelect(index: number){
    clear({...notices()[index]}, index, false);
    showDialog();
    focus();
  }

  function addNotices(){
    clear(initNotice(), notices().length, true);
    showDialog();
    focus();
  }

  async function register(){
    const body = structuredClone(selected());
    let res;
    if(newadd()){
      res = await insert({data: {notice: body}});
    }else{
      res = await update({data: {notice: body}});
    }
    if(res.ok){
      setNotices(await getAllNotices());
      clear(initNotice());
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
    const body = notices()[index];
    const res = await del({data: {notice: body}});
    if(res.ok){
      setNotices(await getAllNotices());
      clear(initNotice());
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
              <th>重要</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <For each={notices()}>{(data, i)=>
              <tr onClick={()=>handleSelect(i())}
                  class={ css(i()===selectedIndex()? selectedStyle: {}) }>
                <td class={ css({ minWidth: "4rem" }) }>{data.page}</td>
                <td class={ css({ minWidth: "8rem" }) }>{data.message.length>10?data.message.substring(0,10):data.message}</td>
                <td class={ css({ fontFamily: "number" }) }>{data.fromDate}</td>
                <td class={ css({ fontFamily: "number" }) }>{data.toDate}</td>
                <td>{data.importance ? "重要" : "一般" }</td>
                <td class={ css({ paddingTop: "px.8", paddingBottom: "0" }) }
                    onClick={(e)=>{deleteData(e, i())}}>
                  <img src={del_icon} alt="削除" width="23px" height="23px" />
                </td>
              </tr>
            }</For>
          </tbody>
        </table>
        <button type="button" class={ button({ color: "success", space: "top1" }) }
          onClick={addNotices}>追加</button>
      </div>

      <NormalDialog>
      <div class={ modificationAreaStyle }>
        <ErrorArea errors={errors()} />
        <Show when={selectedIndex() >= 0}>
        <div>
          <div>{newadd()?"追加":"変更"}</div>
          <hr class={ css({ marginBottom: "0.5rem" }) } />
          <div>
            <label>区分<span class={ etc({ type: "require" }) }>*</span></label>
          </div>
          <div>
            <select value={selected().page} class={ input({ size: "id" }) }
                onChange={(e)=>handleChange({page: e.target.value})}>
              <For each={NOTICE_PAGES}>{(page)=>
                <option value={page}>{page}</option>
              }</For>
            </select>
          </div>
          <div>
            <label>メッセージ<span class={ etc({ type: "require" }) }>*</span></label>
          </div>
          <div>
            <textarea value={selected().message} ref={refInput} class={ input({ size: "textarea" }) }
              onChange={(e)=>handleChange({message: e.target.value})} />
          </div>
          <div>
            <label>開始日<span class={ etc({ type: "require" }) }>*</span></label>
          </div>
          <div>
            <input type="date" class={ input({ size: "date" }) }
              value={selected().fromDate}
              onChange={(e)=>handleChange({fromDate: e.target.value})} />
          </div>
          <div>
            <label>終了日<span class={ etc({ type: "require" }) }>*</span></label>
          </div>
          <div>
            <input type="date" class={ input({ size: "date" }) }
              value={selected().toDate}
              onChange={(e)=>handleChange({toDate: e.target.value})} />
          </div>
          <div>
            <label>重要</label>
          </div>
          <div>
            <input type="checkbox" class={ input({ size: "check2", type: "checkbox" }) }
              checked={selected().importance}
              onChange={(e)=>handleChange({importance: e.target.checked})} />
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