import { createSignal, onMount } from "solid-js"
import { unwrap, type SetStoreFunction } from "solid-js/store"
import { initPatient, toUser } from "../../helper/types.ts"
import { getPatientForId } from "../../server/func/webpatient.ts"
import { update } from "../../server/func/webappointment.ts"
import type { Patient } from "../../server/domain/patient.ts"
import type { WebAppointment } from "../../server/domain/webAppointment.ts"
import type { AuthUser } from "../../server/domain/user.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { css } from "../../styled-system/css/"

type Props = {
  close: (e?: MouseEvent)=>void
  selected: WebAppointment
  setSelected: SetStoreFunction<WebAppointment>
  user: AuthUser
}

export function PatIdInput(props: Props){
  const [id, setId] = createSignal("");
  const [patient, setPatient] = createSignal<Patient>(initPatient());

  let refInput: HTMLInputElement|undefined;

  async function handleOK(e: MouseEvent){
    const app = unwrap(props.selected);
    app.patient.id = id();
    app.updatedBy = toUser(props.user);
    const res = await update({data: {appointment: app}});
    if(res.ok){
      props.setSelected("updatedBy", app.updatedBy);
      props.setSelected("patient", "id", id());
      props.close(e);
    }else{
      alert("登録に失敗しました")
    }
  }

  function handleCancel(e: MouseEvent){
    props.close(e);
  }

  async function handleKey(e: KeyboardEvent){
    if(e.key === "Enter"){
      await getPatient(id());
    }
  }

  async function handleClick(){
    await getPatient(id());
  }

  async function getPatient(id: string){
    const res = await getPatientForId({data: {id}});
    if(res.ok){
      const p = res.data!;
      setPatient({
        ...p,
        address: {
          ...p.address
        },
        memo: ""
      });
    }else{
      alert("患者IDが存在しません");
      setPatient({...initPatient(), id: id});
    }
  }

  onMount(()=>{
    if(refInput){
      refInput.focus();
    }
  })


  return (
    <div>
      <div class={ css({ marginBottom: "1rem" }) }>
        <div>患者IDを入力して、患者を確定してください。</div>
        <table class={ styles }>
          <tbody>
          <tr>
            <th>患者ID</th>
            <td colspan="2">
              <input type="text" class={ input({ size: "patient" }) } ref={refInput}
                value={props.selected.patient.id} onChange={(e)=>setId(e.target.value)}
                onKeyUp={handleKey} />
              <span class={ css({ marginLeft: "1rem" }) }>
              <button type="button" class={ button({ color: "normal", size: "slim" }) }
                onClick={handleClick}>検索</button>
              </span>
            </td>
          </tr>
          <tr>
            <th>氏名</th>
            <td>
              {props.selected.patient.lastName}　{props.selected.patient.firstName}
            </td>
            <td>
              {patient().lastName}　{patient().firstName}
            </td>
          </tr>
          <tr>
            <th>カナ</th>
            <td>
              {props.selected.patient.lastKana}　{props.selected.patient.firstKana}
            </td>
            <td>
              {patient().lastKana}　{patient().firstKana}
            </td>
          </tr>
          <tr>
            <th>生年月日</th>
            <td>{props.selected.patient.birthday}</td>
            <td>{patient().birthday}</td>
          </tr>
          <tr>
            <th>性別</th>
            <td>{props.selected.patient.sex===0?"男":"女"}</td>
            <td>{!patient().lastName?"":patient().sex===0?"男":"女"}</td>
          </tr>
          <tr>
            <th>連絡先</th>
            <td>{props.selected.patient.tel}</td>
            <td>{patient().tel}</td>
          </tr>
          <tr>
            <th>郵便番号</th>
            <td>{props.selected.patient.address.postalCode}</td>
            <td>{patient().address.postalCode}</td>
          </tr>
          <tr>
            <th>住所</th>
            <td>{props.selected.patient.address.name}{props.selected.patient.address.plus}</td>
            <td>{patient().address.name}{patient().address.plus}</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class={ area({ type: "button" }) }>
        <button type="button" class={ button({color: "cancel", size: "long"}) }
          onClick={handleCancel}>戻る</button>
        <button disabled={!id()} type="button" class={ button({color: "primary", size: "long"}) }
          onClick={handleOK}>登録</button>
      </div>
    </div>
  );
}

const styles = css({
  width: "100%",
  border: "1px solid",
  borderColor: "container.border",
  borderCollapse: "collapse",
  paddingTop: "px.5",
  paddingBottom: "px.5",
  paddingRight: "px.10",
  paddingLeft: "px.10",

  "& th, td": {
    textAlign: "left",
    paddingTop: "px.5",
    paddingBottom: "px.5",
    paddingRight: "px.10",
    paddingLeft: "px.10",
    border: "1px solid",
    borderColor: "container.border",
  },

  "& th": {
    width: "8rem",
    padding: "0.7rem",
    backgroundColor: "web.title",
    fontWeight: "normal",
  },

  "& td": {
    width: "25rem",
    whiteSpace: "pre-wrap",
  }
});