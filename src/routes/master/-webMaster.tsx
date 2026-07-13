import { createSignal, createEffect, onMount, For, Index } from "solid-js"
import { initWebMaster, initReserv } from "../../helper/webtypes.ts"
import { toHHMM } from "../../lib/datetime.ts"
import { getWebDepartments } from "../../server/func/webdepartment.ts"
import { getWebDrs } from "../../server/func/webdr.ts"
import { getWebMaster, update } from "../../server/func/webmaster.ts"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import type { WebDr } from "../../server/domain/webDr.ts"
import type { WebDepartment } from "../../server/domain/webDepartment.ts"
import type { WebMaster } from "../../server/domain/webMaster.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { button, input, area } from "../../styled-system/recipes/"
import { flex } from "../../styled-system/patterns/"
import { css } from "../../styled-system/css/"

type Props = {
  setMessage: (status: MessageStatus)=>void
}

export function WebMaster(props: Props) {
  const [inputDeptData, setInputDeptData] = createSignal("");
  const [inputDrData, setInputDrData] = createSignal("");
  const [inputWeekData, setInputWeekData] = createSignal(1);
  const [reserv, setReserv] = createSignal<WebMaster>(initWebMaster());
  const [drs, setDrs] = createSignal<WebDr[]>([]);
  const [depts, setDepts] = createSignal<WebDepartment[]>([]);

  let refInput: HTMLInputElement | undefined;

  createEffect(()=>{
    if(inputDeptData()){
      getWebDrs({data: {dept: inputDeptData()}}).then(
        (res)=>{
          if(res && res.length > 0){
            setDrs(res);
            setInputDrData(res[0].id);
            execute().then(()=>{});
          }else{
            setDrs([]);
          }
        });
      }
  });

  async function register(): Promise<void>{
    const temp = reserv();
    temp.dept = inputDeptData();
    temp.dr = inputDrData();
    temp.week = inputWeekData();
    temp.reservs = temp.reservs.filter(res=>res.time.trim())
    .map(r=>{
      return {time: toHHMM(r.time), max: r.max};
    })
    .sort((r1,r2)=>{
      if(r1.time > r2.time){
        return 1;
      }else if(r1.time < r2.time){
        return -1;
      }else{
        return 0;
      }
    });
    setReserv({...temp});
    const res = await update({data: {master: temp}});
    if(res.ok){
      props.setMessage("register");
    }else{
      setErrors(res.errors!);
    }
  }

  async function execute(){
    await loadData(inputDeptData(), inputDrData(), inputWeekData());
  }

  function addTime(){
    const temp = {...reserv()};
    if(temp.reservs.length > 0){
      const a = temp.reservs[temp.reservs.length-1];
      temp.reservs.push({...a, time: ""});
    }else{
      temp.reservs.push(initReserv());
    }
    setReserv(temp);
  }

  function handelDeptChange(dept: string){
    setInputDeptData(dept);
  }

  async function handleDrChange(dr: string){
    setInputDrData(dr);
    await execute();
  }

  async function handleWeekChange(week: number){
    setInputWeekData(week);
    await execute();
  }

  function handleTimeChange(index: number, time: string){
    const temp = {...reserv()};
    temp.reservs[index].time = time;
    setReserv(temp);
  }

  function handleMaxChange(index: number, max: string){
    const temp = {...reserv()};
    temp.reservs[index].max = parseInt(max);
    setReserv(temp);
  }

  async function loadData(dept: string, dr: string, week: number){
    if(dept && dr){
      const s = await getWebMaster({data: {dept, dr, week}});
      if(s.ok && s.data){
        setReserv(s.data);
      }else{
        const temp = initWebMaster();
        temp.dept = inputDeptData();
        temp.dr = inputDrData();
        setReserv(temp);
      }
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

  createEffect(()=>{
    if(depts().length > 0 && !inputDeptData()){
      setInputDeptData(depts()[0].id);
    }
  });

  onMount(()=>{
    getWebDepartments().then(setDepts);
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
          <label><div>曜日</div><select value={inputWeekData()}
              class={ input({ size: "search"}) }
              onChange={(e)=>handleWeekChange(parseInt(e.target.value))}>
            <option value={0}>日曜</option>
            <option value={1}>月曜</option>
            <option value={2}>火曜</option>
            <option value={3}>水曜</option>
            <option value={4}>木曜</option>
            <option value={5}>金曜</option>
            <option value={6}>土曜</option>
          </select></label>
        </div>
        <div>
          <button type="button" class={ button({ color: "normal", size: "slim" }) }
            onClick={async ()=>{await execute()}}>検索</button>
        </div>
      </div>
      <hr />
      <ErrorArea />
      <For each={reserv().reservs}>{(res, i)=>
        <div class={ flex({ direction: "row", justifyContent: "flex-start" }) }>
          <div class= { css({ marginRight: "0.5rem", marginBottom: "0.5rem" }) }>
            <input type="text" class={ input({ size: "time" }) }
              list="timelist" value={res.time} onChange={e=>handleTimeChange(i(), e.target.value)} />
          </div>
          <datalist id="timelist">
          <Index each={getTimeList()}>{hhmm=>
            <option value={hhmm()}>{hhmm()}</option>
          }</Index>
          </datalist>
          <div><input type="number" class={ input({ size: "number" }) }
            value={res.max} onChange={e=>handleMaxChange(i(), e.target.value)} />
          </div>
        </div>
      }</For>
      <div>
        <button type="button" class={ button({ color: "success", space: "top1" }) }
          onClick={addTime}>追加</button>
      </div>
      <div>
        <button type="button" class={ button({ color: "primary", size: "master", space: "top1_2" }) }
          onClick={()=>register()}>登録</button>
      </div>
    </>
  );
}