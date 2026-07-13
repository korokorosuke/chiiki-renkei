import { createSignal, Switch, Match } from "solid-js"
import Header from "../-header.tsx"
import { ListArea } from "./-listArea.tsx"
import { ModificationArea } from "./-modificationArea.tsx"
import { PatientArea } from "../../components/PatientArea.tsx"
import { Authenticator, authenticatedUser as user } from "../../components/Authenticator.tsx"
import { initPatient, initReferralTo, toUser } from "../../helper/types.ts"
import { getReferralTo as getServerRef, getReferralTos as getServerRefs } from "../../server/func/referralto.ts"
import { getDepartments } from "../../server/func/department.ts"
import { getPatient } from "../../server/func/patient.ts"
import { Message, setMessage as setStatusMessage , type MessageStatus} from "../../components/Message.tsx"
import type { ReferralTo } from "../../server/domain/referralto.ts"
import type { Patient } from "../../server/domain/patient.ts"
import type { Department } from "../../server/domain/department.ts"
import { button, input, area } from "../../styled-system/recipes/"
import { createFileRoute } from "@tanstack/solid-router"

export const Route = createFileRoute("/referralto/{-$id}")({ component: App });

let refInput: HTMLInputElement | undefined;

function App() {
  const [id, setId] = createSignal<string>("");
  const [selected, setSelected] = createSignal<ReferralTo>(initReferralTo());
  const [referrals, setReferrals] = createSignal<ReferralTo[]>([]);
  const [modification, setModification] = createSignal<boolean>(false);
  const [visible, setVisible] = createSignal<boolean>(false);
  const [newadd, setNewadd] = createSignal<boolean>(false);
  const [message, setMessage] = createSignal<string>("");
  const [patient, setPatient] = createSignal<Patient>(initPatient());
  const [depts, setDepts] = createSignal<Department[]>([]);

  const params = Route.useParams();
  const paramId = params().id;

  async function terminateModification(status: MessageStatus): Promise<void>{
    setModification(false);
    setVisible(true);
    setStatusMessage(status);
    if(patient().id){
      await getReferrals(patient(), false);
    }
  }

  function modifyData(){
    setSelected(s=>{s.patient=patient();return s});
    setModification(true);
    setNewadd(false);
  }

  async function move(id: string){
    if(id){
      await loadData(id);
    }else{
      setMessage("患者を入力してください");
    }
  }

  async function handleChange(e: KeyboardEvent){
    if(e.key === "Enter"){
      await move(id());
    }
  }

  function handleNew(pat: Patient|undefined){
    setModification(false);
    setSelected({
      ...initReferralTo(),
      patient: (pat ?? patient()),
      personInCharge: toUser(user()),
    });
    setNewadd(true);
    setModification(true);
  }

  async function loadData(id: string){
    setModification(false);
    if(id != ""){
      const pat = await getPatient({data: {id}});
      if(pat){
        setId("");
        setPatient(pat);
        setMessage("");
        await getReferrals(pat, true);
      }else{
        setPatient(initPatient());
        setMessage("患者がみつかりませんでした");
        setVisible(false);
        setReferrals([]);
        if(refInput){
          refInput.select();
          refInput.focus();
        }
      }
    }
  }

  async function getReferrals(pat: Patient, noDataModify: boolean){
    const res = await getServerRefs({data: {patientId: pat.id}});
    setVisible(true);
    const list = res.sort((v1,v2)=>{
      if(v1.date > v2.date){
        return -1;
      }else if(v1.date < v2.date){
        return 1;
      }else{
        return 0;
      }
    });
    setReferrals(list);
    if(list.length === 0 && noDataModify){
      handleNew(pat);
    }
  }

  async function getReferral(id: string){
    const res = await getServerRef({data: {id}});
    if(res){
      setPatient(res.patient);
      setSelected(res);
      setModification(true);
      setNewadd(false);
      setVisible(true);
    }
  }

  async function initialize(){
    getDepartments().then(setDepts);
    if(refInput){
      refInput.focus();
    }
    if(paramId && paramId.length > 10){
      await getReferral(paramId);
    }else if(paramId && paramId.length <= 10){
      await loadData(paramId);
    }
  }


  return (
    <>
    <Authenticator initializer={initialize} />
    <Header title="逆紹介登録" visible={visible()} handler={()=>handleNew(patient())} auth={user} />
    <main>
      <div class={ area({ type: "search" })}>
        <label>患者ID<input type="text" class={ input({ size: "first", space: "first" }) }
          value={id()}
          onChange={(e)=>setId(e.target.value)}
          onKeyUp={(e)=>handleChange(e)} ref={refInput} /></label>
        <button type="button" class={ button({ color: "normal", size: "slim" }) }
          onClick={()=>{move(id())}}>検索</button>
        <span>{message()}</span>
      </div>
      <hr />
      <PatientArea patient={patient()} />
      <Switch fallback={<div></div>}>
        <Match when={modification()}>
          <ModificationArea auth={user}
            referral={selected} setReferral={setSelected} newadd={newadd}
            depts={depts()} terminateModification={terminateModification} />
        </Match>
        <Match when={referrals().length > 0}>
          <ListArea referrals={referrals} modifyData={modifyData}
            setReferral={setSelected} />
        </Match>
      </Switch>
      <Message />
    </main>
    <footer>

    </footer>
    </>
  );
}