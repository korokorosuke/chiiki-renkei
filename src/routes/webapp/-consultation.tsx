import { createSignal, onMount } from "solid-js"
import type { SetStoreFunction } from "solid-js/store"
import { initWebDr } from "../../helper/webtypes.ts"
import { ContainerWeb } from "../../components/Container.tsx"
import type { WebAppointment } from "../../server/domain/webAppointment.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type Props = {
  close: ()=>void
  next: ()=>void
  selected: WebAppointment
  setSelected: SetStoreFunction<WebAppointment>
}

export function ConsultationInput(props: Props){
  const [inputFirst, setInputFirst] = createSignal("");
  const [inputSecond, setInputSecond] = createSignal("");
  const [inputEtc, setInputEtc] = createSignal("");

  let refInput: HTMLInputElement|undefined;

  function handleOK(){
    props.setSelected("consultation", {
      first: inputFirst(),
      second: inputSecond(),
      etc: inputEtc()
    });
    props.setSelected("dr", initWebDr());
    props.setSelected("date", "");
    props.setSelected("time", "");

    props.close();
    props.next();
  }

  function handleCancel(){
    props.close();
  }

  onMount(()=>{
    if(props.selected.consultation){
      setInputFirst(props.selected.consultation.first);
      setInputSecond(props.selected.consultation.second);
      setInputEtc(props.selected.consultation.etc);
    }else{
      setInputFirst("");
      setInputSecond("");
      setInputEtc("");
    }
    if(refInput){
      refInput.focus();
    }
  });


  return (
    <div class={ css({ width: "100%" }) }>
      <div>ご希望の予約内容を入力してください。</div>
      <div class={ css({ marginBottom: "1rem" }) }>
        <ContainerWeb title="第一希望">
          <input type="date" class={ input({ size: "date" }) } ref={refInput}
            value={inputFirst()} onInput={(e)=>setInputFirst(e.target.value)} />
        </ContainerWeb>
        <ContainerWeb title="第二希望">
          <input type="date" class={ input({ size: "date" }) } value={inputSecond()}
            onInput={(e)=>setInputSecond(e.target.value)} />
        </ContainerWeb>
        <ContainerWeb title="その他の希望（医師指名等）">
          <textarea class={ input({ size: "textarea" }) } value={inputEtc()}
            onInput={(e)=>setInputEtc(e.target.value)} />
        </ContainerWeb>
      </div>
      <div class={ area({ type: "button" }) }>
        <button type="button" class={ button({ color: "cancel", size: "long" }) }
          onClick={handleCancel}>戻る</button>
        <button disabled={!inputFirst() && !inputSecond() && !inputEtc()} type="button"
          class={ button( {color: "primary", size: "long" }) }
          onClick={handleOK}>次へ</button>
      </div>
    </div>
  );
}