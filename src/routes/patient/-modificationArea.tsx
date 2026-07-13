import { Show, type Accessor, type Setter } from "solid-js"
import { createStore, unwrap } from "solid-js/store"
import { Container } from "../../components/Container.tsx"
import { AddressInput } from "../../components/AddressInput.tsx"
import { insert, update, del } from "../../server/func/patient.ts"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import type { Patient } from "../../server/domain/patient.ts"
import type { MessageStatus } from "../../components/Message.tsx"
import { button, area } from "../../styled-system/recipes/"
import { input } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"
import { flex } from "../../styled-system/patterns/"

type ViewProps = {
  patient: Accessor<Patient>
  setPatient: Setter<Patient>
  terminateModification: (status: MessageStatus)=>void
  newadd: boolean
}

export function ModificationArea(props: ViewProps){
  const [patient, setPatient] = createStore<Patient>(structuredClone(props.patient()));

  async function handleRegister(){
    const p = unwrap(patient);
    let res;
    if(props.newadd){
      res = await insert({data: {patient: p}});
    }else{
      res = await update({data: {patient: p}});
    }
    if(res.ok){
      props.setPatient(p);
      props.terminateModification("register");
    }else{
      setErrors(res.errors!);
    }
  }

  async function handleDelete(){
    if(!confirm("削除します。よろしいですか？")){
      return;
    }

    const res = await del({data: {patient: props.patient()}});
    if(res.ok){
      props.terminateModification("delete");
    }else{
      setErrors(res.errors!);
    }
  }


  return (
    <>
    <div class={ area({ type: "contents" }) }>
      <ErrorArea />
      <Container title="ID" require="*">
        <Show when={!props.newadd}>
          <span>{patient.id}</span>
        </Show>
        <Show when={props.newadd}>
          <input type="text" class={ input({ size: "patient" }) }
            value={patient.id} onChange={(e)=>setPatient("id", e.target.value)} />
        </Show>
      </Container>
      <Container title="氏名" require="*">
        <div class={ flex({ flexDirection: "row", justifyContent: "flex-start"}) } >
          <div class={ labelStyle }>姓</div>
          <div><input type="text" class={ input({ size: "rem10" }) }
            value={patient.lastName} onChange={(e)=>setPatient("lastName", e.target.value)} />
          </div>
          <div class={ labelStyle }>名</div>
          <div><input type="text" class={ input({ size: "rem10" }) }
            value={patient.firstName} onChange={(e)=>setPatient("firstName", e.target.value)} />
          </div>
        </div>
      </Container>
      <Container title="カナ">
        <div class={ flex({ flexDirection: "row", justifyContent: "flex-start"}) }>
          <div class={ labelStyle }>セイ</div>
          <div><input type="text" class={ input({ size: "rem10" }) }
            value={patient.lastKana} onChange={(e)=>setPatient("lastKana", e.target.value)} />
          </div>
          <div class={ labelStyle}>メイ</div>
          <div><input type="text" class={ input({ size: "rem10" }) }
            value={patient.firstKana} onChange={(e)=>setPatient("firstKana", e.target.value)} />
          </div>
        </div>
      </Container>
      <Container title="性別">
        <select class={ input({ size: "sex" }) } value={patient.sex}
            onChange={(e)=>setPatient("sex", parseInt(e.target.value))}>
          <option value="0">男</option>
          <option value="1">女</option>
        </select>
      </Container>
      <Container title="生年月日">
        <input type="date" class={ input({ size: "date", type: "number" }) } value={patient.birthday}
          onChange={(e)=>setPatient("birthday", e.target.value)} />
      </Container>
      <Container title="連絡先１">
        <input type="text" placeholder="03-1234-5678" class={ input({ size: "tel", type: "number" }) }
          value={patient.tel} onChange={(e)=>setPatient("tel", e.target.value)} />
      </Container>
      <Container title="連絡先２">
        <input type="text" placeholder="03-1234-5678" class={ input({ size: "tel", type: "number" }) }
          value={patient.tel2} onChange={(e)=>setPatient("tel2", e.target.value)} />
      </Container>

      <Container title="住所">
        <AddressInput change={(address)=>setPatient("address", address)} address={patient.address} />
      </Container>
      <Container title="備考">
        <textarea class={ input({ size: "full" }) } value={patient.memo}
          onChange={(e)=>setPatient("memo", e.target.value)} />
      </Container>
      <div class={ area({ type: "button" }) }>
        <button type="button" class={ button({ color: "primary", size: "long" }) } onClick={handleRegister}>登録</button>
        <button type="button" class={ button({ color: "cancel", size: "long" }) } onClick={()=>props.terminateModification("cancel")}>キャンセル</button>
        <Show when={!props.newadd}>
          <button type="button" class={ button({ color: "error", size: "long" }) } onClick={handleDelete}>削除</button>
        </Show>
      </div>
    </div>
    </>
  );
}

const labelStyle = css({ width: "3.5rem", padding: "0 0.5rem 0 0", textAlign: "right" });