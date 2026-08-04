import { createSignal, createEffect, Index, onMount, batch, type Accessor } from "solid-js"
import { css } from "../styled-system/css/"
import { input } from "../styled-system/recipes/"
import { flex } from "../styled-system/patterns/"

type Props = {
  date: Accessor<string>
  change: (date: string) => void
}

export function DateInput(props: Props){
  const [year, setYear] = createSignal("");
  const [month, setMonth] = createSignal("");
  const [day, setDay] = createSignal("");
  const [years, setYears] = createSignal<string[]>([]);

  const months = Array.from({length: 12}, (_, i) => {
    if(i + 1 < 10){
      return `0${i + 1}`;
    }else{
      return (i + 1).toString();
    }
  });

  const days = ()=>{
    const day = new Date(parseInt(year()), parseInt(month()), 0).getDate();
    return Array.from({length: day}, (_, i) => {
      if(i + 1 < 10){
        return `0${i + 1}`;
      }else{
        return (i + 1).toString();
      }
    });
  };

  function createYears(): string[]{
    const year = new Date().getFullYear();

    return Array.from({length: year - 1900}, (_, i) => (year - i).toString());
  }

  function handleChange(){
    const d = new Date(parseInt(year()), parseInt(month()), 0).getDate();
    if(parseInt(day()) > d){
      setDay("01");
    }
    const date = `${year()}-${month()}-${day()}`;
    props.change(date);
  }

  createEffect(() => {
    batch(()=>{
      const ar = props.date().split("-");
      setYear(ar[0]);
      setMonth(ar[1]);
      setDay(ar[2]);
    });
  });

  onMount(()=>{
    setYears(createYears());
  });


  return (
    <div class={ flex({ direction: "row", justify: "flex-start" }) }>
      <div>
        <select value={year()} class={ input({ size: "rem5" }) }
          onChange={e=>{setYear(e.target.value);handleChange()}}>
          <Index each={years()}>{i =>
            <option value={i()}>{i()}</option>
          }</Index>
        </select>
      </div>
      <div class={ label }>年</div>
      <div>
        <select value={month()} class={ input({ size: "rem4" }) }
          onChange={e=>{setMonth(e.target.value);handleChange()}}>
          <Index each={months}>{i =>
            <option value={i()}>{i()}</option>
          }</Index>
        </select>
      </div>
      <div class={ label }>月</div>
      <div>
        <select value={day()} class={ input({ size: "rem4" }) }
          onChange={e=>{setDay(e.target.value);handleChange()}}>
          <Index each={days()}>{i =>
            <option value={i()}>{i()}</option>
          }</Index>
        </select>
      </div>
      <div class={ label }>日</div>
    </div>
  )
}

const label = css({width: "2.3rem", paddingLeft: "0.7rem"});