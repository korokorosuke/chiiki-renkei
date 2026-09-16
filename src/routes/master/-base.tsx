import { createSignal, For, onMount } from "solid-js"
import { initBase } from "../../helper/types.ts"
import { setErrors, ErrorArea } from "../../components/ErrorArea.tsx"
import { type Base, BASE_COLORS } from "../../server/domain/base.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { modificationAreaStyle } from "./-css.ts"
import { button, input, etc } from "../../styled-system/recipes/"
import { css, cx } from "../../styled-system/css/"
import { flex } from "../../styled-system/patterns/"
import { getBase, update } from "../../server/func/base.ts"

type Props = {
  setMessage: (status: MessageStatus)=>void
  base: Base
}

export function Base(props: Props){
  const [selected, setSelected] = createSignal<Base>(initBase());

  let refInput: HTMLInputElement | undefined;

  function handleChange(val: Partial<Base>){
    if(selected()){
      setSelected(
        {
          ...selected(),
          ...val
        });
    }
  }

  async function register(){
    const res = await update({data: {base: structuredClone(selected())}});
    if(res.ok){
      props.setMessage("register");
    }else{
      setErrors(res.errors!);
    }
  }

  onMount(async ()=>{
    const base = await getBase({data: {id: props.base.id}});
    if(base){
      setSelected(base);
    }
    if(refInput){
      refInput.focus();
    }
  });

  return (
    <div class={ flex({ direction: "row", justifyContent: "flex-start", wrap: "wrap"}) }>
      <div class={ modificationAreaStyle }>
        <ErrorArea />
        <div>
          <div>
            <label>ＩＤ<span class={ etc({ type: "require"}) }>*</span></label>
          </div>
          <div>
            <input type="text" class={ input({ size: "id" }) } value={selected().id} disabled />
          </div>
          <div>
            <label>名称<span class={ etc({ type: "require"}) }>*</span></label>
          </div>
          <div>
            <input type="text" class={ input({ size: "rem20" }) }
              value={selected().name}
              onChange={(e)=>handleChange({name: e.target.value})} />
          </div>
          <div>
            <label>色<span class={ etc({ type: "require"}) }>*</span></label>
          </div>
          <div>
            <select value={selected().color} class={ cx(input({ size: "id" }), css({ bg: selected().color })) }
                onChange={(e)=>handleChange({color: e.target.value})}>
              <For each={BASE_COLORS}>{(color)=>
                <option class={ css({ bg: color }) } value={color}></option>
              }</For>
            </select>
          </div>
          <button type="button" class={ button({ color: "primary", size: "full", space: "top1_2" }) }
            onClick={()=>register()}>登録</button>
        </div>
      </div>
    </div>
  );
}
