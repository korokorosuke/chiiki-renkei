import { createSignal, Index, onMount } from "solid-js"
import type { SetStoreFunction } from "solid-js/store"
import { initWebDr } from "../../helper/webtypes.ts"
import { toYM } from "../../lib/datetime.ts"
import { Container } from "../../components/Container.tsx"
import { getWebDrs } from "../../server/func/webdr.ts"
import { getWebReservations } from "../../server/func/webreservation.ts"
import type { WebAppointment } from "../../server/domain/webAppointment.ts"
import type { WebDr } from "../../server/domain/webDr.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type Props = {
  department: string
  close: ()=>void
  next: ()=>void
  setForce: (force: boolean)=>void
  selected: WebAppointment
  setSelected: SetStoreFunction<WebAppointment>
}

export function DecisionInput(props: Props){
  const [dr, setDr] = createSignal("");
  const [date, setDate] = createSignal("");
  const [time, setTime] = createSignal("");
  const [resNames, setResNames] = createSignal<Map<string, WebDr>>(new Map());
  const [resTimes, setResTimes] = createSignal<Set<string>>(new Set());
  const [drs, setDrs] = createSignal<Map<string, WebDr>>(new Map());

  const loadedMonth = new Map();
  let refInput: HTMLInputElement|undefined;

  function handleCancel(){
    props.close();
  }

  function handleOK(){
    props.setSelected("dr", {id: "", name: dr(), displayName: dr(), department: props.department});
    props.setSelected("date", date());
    props.setSelected("time", time());
    props.setForce(true);
    props.close();
    props.next();
  }

  async function handleDateChange(d: string){
    setDate(d);
    await getReservation(props.department, d.substring(0, 7));
  }

  async function getDrs(){
    const res = await getWebDrs({data: {dept: props.selected.department.id}});
    if(res.length !== 0){
      const m = new Map();
      for(const dr of res){
        m.set(dr.id, dr);
      }
      setDrs(m);
    }else{
      alert("予約枠の取得に失敗しました。");
    }
  }

  function getDr(id: string): WebDr{
    const dr = drs().get(id);
    if(dr){
      return dr;
    }else{
      return {...initWebDr(), displayName: "XXXX"};
    }
  }

  async function getReservation(dept: string, ym: string){
    if(loadedMonth.has(ym)){
      setResTimes(loadedMonth.get(ym).time);
      setResNames(loadedMonth.get(ym).name);
      return;
    }
    const res = await getWebReservations({data: {dept, date: ym}});
    if(res){
      const rnames = new Map<string, WebDr>();
      const rtimes = new Set<string>();
      for(const r of res){
        const dr = getDr(r.dr);
        const key = dr.displayName;
        rnames.set(key, dr);
        rtimes.add(r.time);
      }
      loadedMonth.set(ym, {time: rtimes, name: rnames});
      setResTimes(rtimes);
      setResNames(rnames);
    }
  }

  onMount(async ()=>{
    if(refInput){
      refInput.focus();
    }
    setDate("");
    setTime("");
    setDr("");
    await getDrs();
    await getReservation(props.department, toYM(new Date()));
  })


  return (
    <>
      <div class={ css({ width: "100%" }) }>
      予約を決定してください。
      <div class={ css({ marginBottom: "1rem" }) }>
        <Container title="予約日" require="[必須]">
          <input type="date" placeholder="2024-01-01" class={ input({ size: "date" }) } ref={refInput}
            value={date()} onChange={(e)=>handleDateChange(e.target.value)} />
        </Container>
        <Container title="予約時間" require="[必須]">
          <input type="text" placeholder="09:00" class={ input({ size: "time" }) } list="time-list"
            value={time()} onChange={(e)=>setTime(e.target.value)} />
          <datalist id="time-list">
            <Index each={Array.from(resTimes().values())}>{t=>
              <option value={t()}>{t()}</option>
            }</Index>
          </datalist>
        </Container>
        <Container title="医師名" require="[必須]">
          <input type="text" class={ input({ size: "name" }) } list="dr-list"
            value={dr()} onChange={(e)=>setDr(e.target.value)} />
          <datalist id="dr-list">
            <Index each={Array.from(resNames().keys())}>{name=>
              <option value={name()}>{name()}</option>
            }</Index>
          </datalist>
        </Container>
      </div>
      </div>
      <div class={ area({ type: "button" }) }>
        <button type="button" class={ button({color: "cancel", size: "long"}) }
          onClick={handleCancel}>戻る</button>
        <button disabled={!date() && !time() && !dr()} type="button"
          class={ button({color: "primary", size: "long"}) }
          onClick={handleOK}>次へ</button>
      </div>
    </>
  );
}