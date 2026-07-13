import { onMount, Index, createSignal, createMemo, Show, For, type Accessor } from "solid-js"
import { unwrap, type SetStoreFunction } from "solid-js/store"
import { addDays, toYM, toDateString } from "../../lib/datetime.ts"
import { initWebDr, isMaster, isUser } from "../../helper/webtypes.ts"
import { styles } from "../../components/NormalDialog.tsx"
import { ConsultationInput } from "./-consultation.tsx"
import { DecisionInput } from "./-decision.tsx"
import { getWebReservations } from "../../server/func/webreservation.ts"
import { getWebDrs } from "../../server/func/webdr.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import type { WebReservation } from "../../server/domain/webReservation.ts"
import type { WebDr } from "../../server/domain/webDr.ts"
import type { WebAppointment } from "../../server/domain/webAppointment.ts"
import { button, calendar, timeArea } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type Props = {
  next: ()=>void
  setForce: (force: boolean)=>void
  deferment: number
  user: Accessor<AuthUser>
  selected: WebAppointment
  setSelected: SetStoreFunction<WebAppointment>
}

let consult_dialog: HTMLDialogElement | undefined;
let decide_dialog: HTMLDialogElement | undefined;
function showDialog(d: HTMLDialogElement){
  if(d){
    d.showModal();
  }
}

function closeDialog(d: HTMLDialogElement){
  return (e?: MouseEvent) => {
    if(e){
      e.preventDefault();
      e.stopPropagation();
    }
    if(d){
      d.close();
    }
  }
}

export function AppSelect(props: Props){
  const [dr, setDr] = createSignal("");
  const [date, setDate] = createSignal("");
  const [resNames, setResNames] = createSignal<Map<string, string[]>>(new Map());
  const [resTimes, setResTimes] = createSignal<Map<string, WebReservation[]>>(new Map());
  const [baseDate, setBaseDate] = createSignal(new Date());
  const [drs, setDrs] = createSignal<Map<string, WebDr>>(new Map());

  const loadedMonth = new Map();
  const thisMonth = toYM(new Date());
  const today = new Date();
  const limit = new Date(today.getFullYear(), today.getMonth(), today.getDate() + props.deferment);
  const limitMonth = toYM(new Date(today.getFullYear(), today.getMonth() + 2, 1))

  function handleClick(date: Date, dr: string, e: MouseEvent){
    e.preventDefault();
    e.stopPropagation();

    setDr(dr);
    setDate(toDateString(date));
  }

  function handleTimeClick(time: string, force: boolean){
    if(force && !confirm("強制入力になりますが、よろしいですか？")){
      return;
    }
    const d = {...getDr(dr())};
    props.setSelected("dr", d);
    props.setSelected("date", date());
    props.setSelected("time", time);
    clear();
    props.setForce(force);
    props.next();
  }

  function clear(){
    setDr("");
    setDate("");
  }

  async function getReservation(dept: string, ym: string, admin: boolean){
    if(loadedMonth.has(ym)){
      return;
    }
    const t = new Date();
    const today = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    const res = await getWebReservations({data: {dept, date: ym}});
    if(res){
      const rnames = new Map(resNames());
      const rtimes = new Map(resTimes());
      for(const r of res){
        if(new Date(r.date) <= limit || (admin && new Date(r.date) < today)){
          continue;
        }
        if(r.max - r.cnt > 0 || admin){
          const key = r.date;
          const timeKey = `${r.date}_${r.dr}`;
          if(rtimes.has(timeKey)){
            rtimes.get(timeKey)?.push(r);
          }else{
            rtimes.set(timeKey, [r]);
          }
          if(rnames.has(key)){
            const ns = rnames.get(key);
            if(ns && ns.filter(n=>n===r.dr).length === 0){
              ns.push(r.dr);
            }
          }else{
            rnames.set(key, [r.dr]);
          }
        }
      }
      loadedMonth.set(ym, true);
      setResTimes(rtimes);
      setResNames(rnames);
    }
  }

  function getDrs(){
    getWebDrs({data: {dept: props.selected.department.id}}).then((res)=>{
      if(res){
        const m = new Map();
        for(const dr of res){
          m.set(dr.id, dr);
        }
        setDrs(m);
      }
    }).catch(()=>{alert("予約枠の取得に失敗しました。")});
  }

  function getDr(id: string): WebDr{
    const dr = drs().get(id);
    if(dr){
      return dr;
    }else{
      return {...initWebDr(), displayName: "XXXX"};
    }
  }

  function prevMonth(){
    const prev = new Date(baseDate().getFullYear(), baseDate().getMonth()-1,1);
    setBaseDate(prev);
    getReservation(unwrap(props.selected.department.id), toYM(prev), props.user().authWeb >= 2);
  }

  function nextMonth(){
    const next = new Date(baseDate().getFullYear(), baseDate().getMonth()+1,1);
    setBaseDate(next);
    getReservation(unwrap(props.selected.department.id), toYM(next), props.user().authWeb >= 2);
  }

  const weeks = createMemo<Date[][]>(() => {
    const list = [];
    let start = new Date(baseDate().getFullYear(), baseDate().getMonth(), 1);
    const firstweek = start.getDay();
    const last = new Date(baseDate().getFullYear(), baseDate().getMonth()+1, 0);
    if(firstweek > 0){
      start = addDays(start, -1 * firstweek);
    }
    let cnt = 0;
    let week = [];
    for(let i = 0; i <= 60; i++){
      week.push(addDays(start, i));
      cnt++;
      if(cnt === 7){
        list.push(week);
        if(week[6] >= last){
          break;
        }
        week = [];
        cnt = 0;
      }
    }
    return list;
  });

  function enabled(date: Date, drid: string): boolean{
    const ar = resTimes().get(`${toDateString(date)}_${drid}`);
    if(ar){
      return ar.filter(a=>a.max-a.cnt>0).length > 0;
    }
    return false;
  }

  function getCalendarStatus(selected: WebAppointment, drid: string, day: Date,
      cal: { item: string, selected: string, disabled: string }): string {
    if(selected.date === toDateString(day) && selected.dr.id === drid){
      return cal.selected;
    }else if(enabled(day, drid)){
      return cal.item;
    }else{
      return cal.disabled;
    }
  }

  function getStatus(selected: WebAppointment, r: WebReservation,
    t: { item: string, selectedItem: string, disabledItem: string },
  ): string {
    if(selected.date === r.date && selected.time === r.time){
      return t.selectedItem;
    }else if((r.max - r.cnt) <= 0){
      return t.disabledItem;
    }else{
      return t.item;
    }
  }


  onMount(async ()=>{
    loadedMonth.clear();
    setBaseDate(new Date());
    getDrs();
    const dept = unwrap(props.selected.department.id);
    await getReservation(dept, toYM(new Date()), props.user().authWeb >= 2);
    getReservation(dept, toYM(new Date()), props.user().authWeb >= 2).then(()=>{});
    getReservation(dept, toYM(new Date()), props.user().authWeb >= 2).then(()=>{});
  });


  const cal = calendar();
  const time = timeArea();
  return (<>
  <div class={ cal.root }>
    <div class={ cal.head }>
      <div>
      </div>
      <div><button type="button" class={ button({ color: "primary", size: "small", space: "right1" }) }
        disabled={thisMonth === toYM(baseDate())}
        onClick={prevMonth}>前月</button>
        {toYM(baseDate())}
        <button type="button" class={ button({ color: "primary", size: "small", space: "left1" }) }
          disabled={limitMonth === toYM(baseDate())}
          onClick={nextMonth}>翌月</button>
      </div>
      <div class={ css({ textAlign: "right" }) }>
      <Show when={isUser(props.user())}>
        <button type="button" onClick={()=>showDialog(consult_dialog!)}
          class={ button( { color: "success", size: "long" }) }>その他の予約希望</button>
      </Show>
      <Show when={isMaster(props.user())}>
        <button type="button" onClick={()=>showDialog(decide_dialog!)}
          class={ button( { color: "success", size: "long" }) }>枠外の予約設定</button>
      </Show>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th class={ cal.title }>日</th>
          <th class={ cal.title }>月</th>
          <th class={ cal.title }>火</th>
          <th class={ cal.title }>水</th>
          <th class={ cal.title }>木</th>
          <th class={ cal.title }>金</th>
          <th class={ cal.title }>土</th>
        </tr>
      </thead>
      <tbody>
      <Index each={weeks()}>{week=>
        <tr>
        <Index each={week()}>{day=>
          <td><div class={ cal.date }>
            <div>{day().getDate()}</div>
            <Show when={resNames().get(toDateString(day()))}>
              <For each={resNames().get(toDateString(day()))}>{drid=>
                <div class={ getCalendarStatus(props.selected, drid, day(), cal) }
                  onClick={e=>handleClick(day(), drid, e)}>{getDr(drid).displayName}</div>
              }</For>
            </Show>
          </div></td>
        }</Index>
        </tr>
      }</Index>
      </tbody>
    </table>
  </div>
  <Show when={date() && dr()}>
    <div class={ time.root } onclick={(e)=>{e.stopPropagation()}}>
      <div class={ time.close }><span class={ time.icon } onclick={clear}>×</span></div>
      <div class={ time.area }>
        <div class={ time.selected }>
          <div>{getDr(dr()).displayName}</div>
          <div>{date()}</div>
        </div>
        <For each={resTimes().get(`${date()}_${dr()}`)}>{r=>
        <div class={ time.time }>
          <a href="javascript:void(0)"
            class={ getStatus(props.selected, r, time) }
            onClick={()=>handleTimeClick(r.time, (r.max - r.cnt) <= 0)}>{r.time}</a>
        </div>
        }</For>
      </div>
    </div>
    <div class={ time.back } onclick={clear}></div>
  </Show>
  <dialog id="consultation-dialog" ref={consult_dialog} class={ styles }>
    <ConsultationInput close={closeDialog(consult_dialog!)} next={props.next}
      selected={props.selected} setSelected={props.setSelected} />
  </dialog>
  <Show when={isMaster(props.user())}>
    <dialog id="app-dialog" ref={decide_dialog} class={ styles }>
      <DecisionInput department={props.selected.department.id} close={closeDialog(decide_dialog!)}
        next={props.next} setForce={props.setForce}
        selected={props.selected} setSelected={props.setSelected} />
    </dialog>
  </Show>
  </>);
}