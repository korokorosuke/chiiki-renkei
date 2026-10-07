import { Switch, Match, For } from "solid-js"
import { useQuery } from "@tanstack/solid-query"
import type { Dept } from "../server/domain/department.ts"
import type { Dr } from "../server/domain/dr.ts"
import { getDrsForDept } from "../server/func/dr.ts"
import { input } from "../styled-system/recipes/"
import { initDr } from "../helper/types.ts"

type Props = {
  dept: Dept
  dr: Dr
  onChange: (dr: Dr) => void
}

export function DrSelect(props: Props){
  const drsQuery = useQuery(() => ({
    queryKey: ["drs", props.dept.id],
    queryFn:  ()=> getDrsForDept({data: { dept: props.dept.id }}),
    staleTime: 1000 * 60 * 10,
    enabled: props.dept.id !== "",
  }));

  function handleChange(value: string){
    if(drsQuery.data){
      for(const dr of drsQuery.data){
        if(value === dr.id){
          props.onChange(dr);
          return;
        }
      }
      props.onChange(initDr());
    }
  }

  return (
    <Switch>
      <Match when={!drsQuery.isLoading && !drsQuery.isSuccess}>
        <select class={ input({ size: "search" }) } value="">
          <option value=""></option>
        </select>
      </Match>
      <Match when={drsQuery.isLoading}>
        <div>読み込み中...</div>
      </Match>
      <Match when={drsQuery.isSuccess}>
        <select class={ input({ size: "search" }) } value={props.dr.id}
            onChange={(e)=>handleChange(e.target.value)}>
          <option value=""></option>
          <For each={drsQuery.data}>{(dr)=>
            <option value={dr.id}>{dr.name}</option>
          }</For>
        </select>
      </Match>
    </Switch>
  );
}