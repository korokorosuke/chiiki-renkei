import { createSignal, createEffect, onMount, For, Index, Show } from "solid-js"
import { initWebReservation } from "../../helper/webtypes.ts"
import { getWebDepartments } from "../../server/func/webdepartment.ts"
import { getWebDrs } from "../../server/func/webdr.ts"
import { getWebReservations, insert, update } from "../../server/func/webreservation.ts"
import { getWebMaster } from "../../server/func/webmaster.ts"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import type { WebDepartment } from "../../server/domain/webDepartment.ts"
import type { WebDr } from "../../server/domain/webDr.ts"
import type { WebMaster } from "../../server/domain/webMaster.ts"
import type { WebReservation } from "../../server/domain/webReservation.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { button, input, area, table } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"
import { flex } from "../../styled-system/patterns/"

type Props = {
  setMessage: (status: MessageStatus)=>void
}

export function WebReservation(props: Props) {
  const [inputDeptData, setInputDeptData] = createSignal<string>("");
  const [inputDrData, setInputDrData] = createSignal<string>("");
  const [inputFromData, setInputFromData] = createSignal<string>("");
  const [inputToData, setInputToData] = createSignal<string>("");
  const [reservs, setReservs] = createSignal<WebReservation[]>([]);
  const [depts, setDepts] = createSignal<WebDepartment[]>([]);
  const [drs, setDrs] = createSignal<WebDr[]>([]);
  const [changes, setChanges] = createSignal<WebReservation[]>([]);
  const [modification, setModification] = createSignal(false);

  //const dels: WebReservation[] = [];
  const selected: WebReservation = initWebReservation();

  let refInput: HTMLInputElement | undefined;

  createEffect(()=>{
    if(inputDeptData()){
      getWebDrs({data: {dept: inputDeptData()}}).then(
        (res)=>{
          if(res && res.length > 0){
            setDrs(res);
            setInputDrData(res[0].id);
            if(check()){
              execute();
            }
          }else{
            setDrs([]);
          }
        }
      )
    }
  });

  function check(){
    return inputDeptData() && inputDrData() && inputFromData();
  }

  async function register(): Promise<void>{
    if(changes().length > 0){
      let ok = false;
      for(const c of changes()){
        const res = await update({data: {reservation: c}});
        if(res.ok){
          ok = true;
        }else{
          setErrors(res.errors!);
          ok = false;
          break;
        }
      }
      if(ok){
        props.setMessage("register");
      }
      setChanges([]);
    }
  }

  async function create(reserv: WebReservation): Promise<void>{
    const res = await insert({data: {reservation: reserv}});
    if(res.ok){
      const x = [...reservs()];
      x.push(reserv);
      setReservs(x.sort((r1,r2)=>{
        if(r1.time > r2.time){
          return 1;
        }else if(r1.time < r2.time){
          return -1;
        }else{
          return 0;
        }
      }));
    }
  }

  async function deploy(): Promise<void>{
    if(!inputToData()){
      setInputToData(inputFromData);
    }else if(inputFromData() > inputToData()){
      alert("日付が不正です。")
    }
    const weeks = new Map();
    const last = new Date(inputToData());
    let now = new Date(inputFromData());
    let data: WebMaster;
    while(true){
      if(last > now){
        alert("処理が完了しました。");
        break;
      }
      const week = now.getDay();
      if(weeks.has(week)){
        data = weeks.get(week);
      }else{
        const res = await getWebMaster({data: {dept: inputDeptData(), dr: inputDrData(), week}});
        if(res.ok && res.data){
          weeks.set(week, res.data)
          data = res.data;
        }else{
          alert("処理が失敗しました。");
          break;
        }
      }
      for(const reserv of data.reservs){
        const r = {
          dept: inputDeptData(), dr: inputDrData(),
          date: inputFromData(), time: reserv.time,
          max: reserv.max, cnt: 0
        };
        await create(r);
      }
      now = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
    }
  }

  //async function del(): Promise<void>{
  //  if(dels.length > 0){
  //    const method = "DELETE";
  //    const res = await getJson<FetchResult<string>>("/../webreservation",
  //      getParameter({method, body:dels}));
  //    if(res && res.ok){
  //      props.setMessage("delete");
  //    }else{
  //      alert("削除に失敗しました")
  //    }
  //  }
  //}

  async function execute(){
    selected.dept = inputDeptData();
    selected.dr = inputDrData();
    selected.date = inputFromData();
    await loadData(inputDeptData(), inputDrData(), inputFromData());
  }

  async function handleSearch(e: KeyboardEvent){
    if(e.key === "Enter"){
      await execute();
    }
  }

  function addWebReservation(){
    const x = {...selected};
    setReservs(r=>{r.push(x);return [...r];})
  }

  function handelDeptChange(dept: string){
    setInputDeptData(dept);
    setModification(false);
    setChanges([]);
  }

  function handleDrChange(dr: string){
    setInputDrData(dr);
    setModification(false);
    setChanges([]);
    if(check()){
      execute();
    }
  }

  function handleFromChange(date: string){
    setInputFromData(date);
    setModification(false);
    setChanges([]);
    if(check()){
      execute();
    }
  }

  function handleToChange(date: string){
    setInputToData(date);
    setModification(false);
    setChanges([]);
    if(check()){
      execute();
    }
  }

  function handleTimeChange(res: WebReservation, time: string){
    const r = changes().filter(r=>r.time === time);
    if(r.length === 0){
      res.time = time;
      setChanges([...changes(), res]);
    }
  }

  function handleMaxChange(res: WebReservation, max: string){
    const r = changes().filter(r=>r.time === res.time);
    if(r.length === 0){
      res.max = parseInt(max);
      setChanges([...changes(), res]);
    }else{
      r[0].max = parseInt(max);
    }
  }

  function handleCntChange(res: WebReservation, cnt: string){
    const r = changes().filter(r=>r.time === res.time);
    if(r.length === 0){
      res.cnt = parseInt(cnt);
      setChanges([...changes(), res]);
    }else{
      r[0].cnt = parseInt(cnt);
    }
  }

  async function loadData(dept: string, dr: string, date: string){
    if(dept && dr && date){
      const s = await getWebReservations({data: {dept, dr, date}});
      setReservs(s);
      setModification(true);
    }
  }

  function getTimeList(): string[]{
    const list = [];
    for(let i = 9; i < 18; i++){
      let hh = i.toString();
      if(i < 10){
        hh = `0${i}`;
      }
      list.push(`${hh}:00`);
      list.push(`${hh}:30`);
    }
    return list;
  }

  onMount(async ()=>{
    const res = await getWebDepartments();
    if(res){
      setDepts(res);
      setInputDeptData(res[0].id);
    }

    if(refInput){
      refInput.focus();
    }
  });

  return (
    <>
      <div class={ area({ type: "search" }) }>
        <div>
        <label><div>診療科</div><select value={inputDeptData()}
            class={ input({ size: "search"}) }
            onChange={(e)=>handelDeptChange(e.target.value)}>
          <For each={depts()}>{d=>
            <option value={d.id}>{d.name}</option>
          }</For>
        </select></label>
        </div>
        <div>
        <label><div>予約医師</div><select value={inputDrData()}
            class={ input({ size: "search"}) }
            onChange={(e)=>handleDrChange(e.target.value)}>
          <For each={drs()}>{d=>
            <option value={d.id}>{d.name}</option>
          }</For>
        </select></label>
        </div>
        <div>
        <label><div>開始日付</div><input type="date" value={inputFromData()}
          class={ input({ size: "search"}) } ref={refInput}
          onChange={(e)=>handleFromChange(e.target.value)}
          onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
        <label><div>終了日付</div><input type="date" value={inputToData()}
          class={ input({ size: "search"}) } ref={refInput}
          onChange={(e)=>handleToChange(e.target.value)}
          onKeyUp={(e)=>handleSearch(e)} /></label>
        </div>
        <div>
        <button type="button" class={ button({ color: "normal", size: "slim" }) }
          onClick={async ()=>{await execute()}}>検索</button>
        </div>
      </div>
      <hr />
      <Show when={modification()}>
      <ErrorArea />
      <div class={ flex({ direction: "row", justifyContent: "flex-start", wrap: "wrap"}) }>
        <div class={ table() }>
        <table>
          <thead>
            <tr>
              <th>時間</th>
              <th>枠数</th>
              <th>使用済</th>
            </tr>
          </thead>
          <tbody>
        <For each={reservs()}>{res=>
          <tr>
            <td>
            <input class={ input({ size: "time" }) } type="text" list="timelist"
              value={res.time} onChange={e=>handleTimeChange(res, e.target.value)} />
            </td><td>
            <input class={ input({ size: "number" }) } type="number"
              value={res.max} onChange={e=>handleMaxChange(res, e.target.value)} />
            </td><td>
            <input class={ input({ size: "number" }) } type="number"
              value={res.cnt} onChange={e=>handleCntChange(res, e.target.value)} />
            </td>
          </tr>
        }</For>
        </tbody>
        </table>
        <datalist id="timelist">
        <Index each={getTimeList()}>{hhmm=>
          <option value={hhmm()}>{hhmm()}</option>
        }</Index>
        </datalist>
        </div>
        <div class={ css({ "paddingLeft": "1rem" }) }>
          <div>
            <button type="button" class={ button({ color: "success", space: "top1" }) }
              onClick={addWebReservation}>追加</button>
          </div>
          <Show when={changes().length > 0}>
          <div>
            <button type="button" class={ button({ color: "primary", size: "master", space: "top1_2" }) }
              onClick={()=>register()}>登録</button>
          </div>
          </Show>
          <div>
            <button type="button" class={ button({ color: "second", size: "master", space: "top1_2" }) }
              onClick={()=>deploy()}>展開</button>
          </div>
        </div>
      </div>
      </Show>
    </>
  );
}