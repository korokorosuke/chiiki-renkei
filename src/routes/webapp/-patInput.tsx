import { createSignal, onMount } from "solid-js"
import { unwrap, type SetStoreFunction } from "solid-js/store"
import { getPatient } from "../../server/func/webpatient.ts"
import { DateInput } from "../../components/DateInput.tsx"
import { AddressInput } from "../../components/AddressInput.tsx"
import { ContainerWeb } from "../../components/Container.tsx"
import { initAddress } from "../../helper/types.ts"
import { toDateString } from "../../lib/datetime.ts"
import { ErrorArea, setErrors } from "../../components/ErrorArea.tsx"
import type { WebAppointment } from "../../server/domain/webAppointment.ts"
import type { Address } from "../../server/domain/address.ts"
import { button, input } from "../../styled-system/recipes/"
import { flex } from "../../styled-system/patterns/"
import { css } from "../../styled-system/css/"

type Props = {
  selected: WebAppointment
  setSelected: SetStoreFunction<WebAppointment>
}

export function PatientInput(props: Props){
  const [address, setAddress] = createSignal<Address>(initAddress());
  const [birthday, setBirthday] = createSignal<string>("");

  let refInput: HTMLInputElement|undefined;
  let complaint: HTMLTextAreaElement|undefined;

  async function handleClick(){
    const id = props.selected.facPatientId;
    const res = await getPatient({data: {facPatId: id}});
    if(res.ok){
      const patient = res.data!;
      props.setSelected("patient", "id", patient.id);
      props.setSelected("patient", "birthday", patient.birthday);
      props.setSelected("patient", "lastName", patient.lastName);
      props.setSelected("patient", "firstName", patient.firstName);
      props.setSelected("patient", "lastKana", patient.lastKana);
      props.setSelected("patient", "firstKana", patient.firstKana);
      props.setSelected("patient", "tel", patient.tel);
      props.setSelected("patient", "tel2", patient.tel2);
      props.setSelected("patient", "sex", patient.sex);
      props.setSelected("patient", "address", "postalCode", patient.address.postalCode);
      props.setSelected("patient", "address", "name", patient.address.name);
      props.setSelected("patient", "address", "plus", patient.address.plus);
      setAddress(patient.address);
      setBirthday(patient.birthday);
      if(complaint){
        complaint.focus();
      }
    }else{
      setErrors(res.errors!);
    }
  }

  function handleChangeBirthday(date: string){
    props.setSelected("patient", "birthday", date);
    setBirthday(date);
  }

  function changeAddress(address: Address){
    props.setSelected("patient", "address", address);
  }


  onMount(()=>{
    if(refInput){
      refInput.focus();
    }
    setBirthday(props.selected.patient.birthday);
    setAddress(unwrap(props.selected.patient.address));
    if(!props.selected.patient.birthday){
      const today = new Date();
      handleChangeBirthday(toDateString(new Date(today.getFullYear(), 0, 1)));
    }
  })


  return (
    <>
      <div class={ css({ width: "100%", marginTop: "1rem" }) }>
      <div class={ css({ marginBottom: "1rem" }) }>
        <ErrorArea />
        <ContainerWeb title="貴院患者ID">
          <input type="text" class={ input({ size: "tel" }) } ref={refInput}
            value={props.selected.facPatientId} onChange={(e)=>props.setSelected("facPatientId", e.target.value)} />
          <button type="button" class={ button({ color: "primary", size: "small", space: "small" }) }
            onClick={handleClick}>患者情報取得</button>
          <span class={ css({ color: "red", fontSize: "1rem", marginLeft: "0.5rem" }) }>※前回登録した患者情報を自動で設定できます</span>
        </ContainerWeb>
        <ContainerWeb title="氏名" require="[必須]">
          <div class={ flex({ flexDirection: "row", justifyContent: "flex-start"}) }>
            <div class={ labelStyle}>姓</div>
            <div><input type="text" class={ input({ size: "name" }) }
              value={props.selected.patient.lastName} onChange={(e)=>props.setSelected("patient", "lastName", e.target.value)} />
            </div>
            <div class={ labelStyle }>名</div>
            <div><input type="text" class={ input({ size: "name" }) }
              value={props.selected.patient.firstName} onChange={(e)=>props.setSelected("patient", "firstName", e.target.value)} />
            </div>
          </div>
        </ContainerWeb>
        <ContainerWeb title="カナ" require="[必須]">
          <div class={ flex({ flexDirection: "row", justifyContent: "flex-start"}) }>
            <div class={ labelStyle }>セイ</div>
            <div><input type="text" class={ input({ size: "name" }) }
              value={props.selected.patient.lastKana} onChange={(e)=>props.setSelected("patient", "lastKana", e.target.value)} />
            </div>
            <div class={ labelStyle }>メイ</div>
            <div><input type="text" class={ input({ size: "name" }) }
              value={props.selected.patient.firstKana} onChange={(e)=>props.setSelected("patient", "firstKana", e.target.value)} />
            </div>
          </div>
        </ContainerWeb>
        <ContainerWeb title="生年月日" require="[必須]">
          <div class={ flex({ flexDirection: "row", justifyContent: "flex-start" }) }>
            <DateInput date={birthday} change={handleChangeBirthday} />
          </div>
        </ContainerWeb>
        <ContainerWeb title="性別">
          <div><select class={ input({ size: "sex" }) } value={props.selected.patient.sex}
              onChange={(e)=>props.setSelected("patient", "sex", parseInt(e.target.value))}>
            <option value="0">男</option>
            <option value="1">女</option>
          </select></div>
        </ContainerWeb>
        <ContainerWeb title="連絡先">
          <div><input type="text" placeholder="03-1234-5678" class={ input({ size: "tel" }) }
            value={props.selected.patient.tel} onChange={(e)=>props.setSelected("patient", "tel", e.target.value)} /></div>
        </ContainerWeb>
        <ContainerWeb title="住所">
          <AddressInput change={changeAddress} address={address()} />
        </ContainerWeb>
        <ContainerWeb title="当院患者ID">
          <div><input type="text" class={ input({ size: "tel" }) }
            value={props.selected.patient.id} onChange={(e)=>props.setSelected("patient", "id", e.target.value)} /></div>
        </ContainerWeb>
        <ContainerWeb title="紹介目的" require="[必須]">
          <textarea class={ input({ size: "disease" }) } value={props.selected.mainComplaint}
            ref={complaint}
            onInput={(e)=>props.setSelected("mainComplaint", e.target.value)} />
        </ContainerWeb>
      </div>
      </div>
    </>
  );
}

const labelStyle = css({ width: "4rem", padding: "0 0.5rem", textAlign: "right" });