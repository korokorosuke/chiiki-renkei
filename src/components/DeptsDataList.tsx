import { Switch, Match, Index } from "solid-js"
import { useQuery } from "@tanstack/solid-query"
import { getFacDepts } from "../server/func/master.ts"

export function DeptsDataList(props: {id: string}){
  const facDeptsQuery = useQuery(() => ({
    queryKey: ["facDepts"],
    queryFn: ()=>getFacDepts(),
    staleTime: 1000 * 60 * 10,
  }));

  return (
    <datalist id={props.id}>
    <Switch>
      <Match when={facDeptsQuery.isLoading}>
        <option value=""></option>
      </Match>
      <Match when={facDeptsQuery.isSuccess}>
        <Index each={facDeptsQuery.data}>{(fdept)=>
          <option value={fdept()}>{fdept()}</option>
        }</Index>
      </Match>
    </Switch>
    </datalist>
  );
}